"""Impor data rujukan Master Aset dari SIMDA BMD (SQL Server) ke database aplikasi.

Hanya MEMBACA dari SQL Server (koneksi read-only, satu SELECT per tabel) dan menulis ke MySQL
aplikasi. Aman dijalankan berulang: data dicocokkan per kunci bisnis, yang baru ditambah dan
yang berubah diperbarui; tidak ada yang dihapus.

Unit, sub unit dan UPB hanya diambil untuk Dinas Pendidikan (Kd_Bidang 8, Kd_Unit 1). UPB sekolah
dicocokkan otomatis ke master_sekolah lewat nama barunya; hasilnya berstatus "otomatis" dan harus
ditinjau di halaman Master Unit & Sekolah. Baris yang sudah diverifikasi manual tidak disentuh.

Kredensial dibaca dari server/.env: SQL_SERVER_HOST, SQL_SERVER_PORT, SQL_SERVER_DB_NAME,
SQL_SERVER_USERNAME, SQL_SERVER_PASSWORD. Disarankan memakai akun SQL Server hak SELECT saja.

    pip install -e ".[simda]"
    python scripts/import_simda_master_aset.py --dry-run   # hitung saja
    python scripts/import_simda_master_aset.py
"""

import argparse
import asyncio
import re
import sys
from collections import Counter
from collections.abc import Callable, Iterable
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import dotenv_values  # noqa: E402
from sqlalchemy import select  # noqa: E402

from app.api.v1.endpoints.admin.master.master_aset.specs import derive_unit  # noqa: E402
from app.db.match_simpeg_sekolah import normalize_school_name  # noqa: E402
from app.db.session import get_db  # noqa: E402
from app.models.master.aset import (  # noqa: E402
    MasterAsetAlasanPenghapusan,
    MasterAsetKapitalisasiMasaManfaat,
    MasterAsetKodeBarang,
    MasterAsetKondisiBarang,
    MasterAsetMasaManfaat,
    MasterAsetMetodePenyusutan,
    MasterAsetNilaiMinimumKapitalisasi,
    MasterAsetStatusPemilik,
    MasterAsetUnit,
)
from app.models.master.sekolah import MasterSekolah  # noqa: E402

ENV_FILE = Path(__file__).resolve().parent.parent / ".env"
IMPORTER = "import-simda"
# Lingkup unit: hanya Dinas Pendidikan Kabupaten Konawe Selatan (nama lama maupun baru).
PEMDA = {"Kd_Prov": 21, "Kd_Kab_Kota": 7}
DINAS_PENDIDIKAN = {**PEMDA, "Kd_Bidang": 8, "Kd_Unit": 1}
JENIS_SEKOLAH = {"SD", "SMP", "SATAP", "TK", "SMA", "SMK", "SKB"}
HIERARCHY = [f"Ref_Rek{level}_108" for level in range(6)]


def connect():
    import pymssql

    cfg = dotenv_values(ENV_FILE)
    keys = ["HOST", "PORT", "DB_NAME", "USERNAME", "PASSWORD"]
    missing = [f"SQL_SERVER_{k}" for k in keys if not cfg.get(f"SQL_SERVER_{k}")]
    if missing:
        sys.exit("Belum diisi di .env: " + ", ".join(missing))
    return pymssql.connect(
        server=cfg["SQL_SERVER_HOST"],
        port=int(cfg["SQL_SERVER_PORT"]),
        user=cfg["SQL_SERVER_USERNAME"],
        password=cfg["SQL_SERVER_PASSWORD"],
        database=cfg["SQL_SERVER_DB_NAME"],
        login_timeout=15,
        timeout=120,
        read_only=True,
    )


def fetch(cur, table: str, where: dict[str, int] | None = None) -> list[dict[str, Any]]:
    # nama tabel dan kolom tetap (bukan input pengguna); nilai saringan dikirim sebagai parameter
    sql = f"SELECT * FROM {table}"
    if where:
        sql += " WHERE " + " AND ".join(f"{column} = %s" for column in where)
    cur.execute(sql, tuple((where or {}).values()))
    names = [d[0] for d in cur.description]
    return [dict(zip(names, row, strict=True)) for row in cur.fetchall()]


def kode_from(row: dict[str, Any], columns: Iterable[str]) -> str | None:
    """Gabungkan kolom Kd_* menjadi kode bertitik; None bila ada segmen kosong."""
    parts = [row.get(c) for c in columns]
    if any(p is None for p in parts):
        return None
    return ".".join(f"{int(p):02d}" for p in parts)


def kode_prefix(row: dict[str, Any], columns: Iterable[str]) -> str | None:
    """Seperti kode_from tetapi berhenti pada segmen kosong pertama."""
    parts: list[int] = []
    for c in columns:
        if row.get(c) is None:
            break
        parts.append(int(row[c]))
    return ".".join(f"{p:02d}" for p in parts) or None


def clean(text: Any, limit: int = 255) -> str:
    return " ".join(str(text or "").split())[:limit]


# --- membaca dan menyusun baris tiap master ---------------------------------------------------


def read_kode_barang(cur) -> dict[str, dict[str, Any]]:
    rows: dict[str, dict[str, Any]] = {"01": {"kode": "01", "uraian": "ASET"}}
    for table in HIERARCHY:
        for row in fetch(cur, table):
            kd_cols = sorted(c for c in row if c.startswith("Kd_Aset"))
            # Kd_Aset, Kd_Aset0, Kd_Aset1, ... urut menurut sufiks angka (kosong = paling awal)
            kd_cols.sort(key=lambda c: -1 if c == "Kd_Aset" else int(c.removeprefix("Kd_Aset")))
            nama_col = next(c for c in row if c.startswith("Nm_Aset"))
            kode = kode_from(row, kd_cols)
            if kode and row[nama_col]:
                rows[kode] = {"kode": kode, "uraian": clean(row[nama_col])}
    return rows


def read_metode(cur) -> dict[int, dict[str, Any]]:
    return {
        int(r["Kd_Metode"]): {"kode": int(r["Kd_Metode"]), "nama": clean(r["Ur_Metode"], 100)}
        for r in fetch(cur, "Ref_Metode")
    }


def read_masa_manfaat(cur, kode_barang: set[str], metode: set[int]):
    cols = ["Kd_Aset8", "Kd_Aset80", "Kd_Aset81", "Kd_Aset82", "Kd_Aset83", "Kd_Aset84"]
    result: dict[tuple, dict[str, Any]] = {}
    skipped = {"tanpa_kode_108": 0, "kode_tidak_ada": 0, "metode_tidak_ada": 0}
    for r in fetch(cur, "Ref_Penyusutan"):
        kode = kode_from(r, cols)
        if kode is None:
            skipped["tanpa_kode_108"] += 1
        elif kode not in kode_barang:
            skipped["kode_tidak_ada"] += 1
        elif int(r["Metode"]) not in metode:
            skipped["metode_tidak_ada"] += 1
        else:
            key = (int(r["Tahun"]), kode, int(r["Metode"]))
            result[key] = {
                "tahun_berlaku": key[0],
                "kode_barang": kode,
                "metode_id": key[2],
                "umur_tahun": int(r["Umur"]),
            }
    return result, skipped


def read_kapitalisasi(cur, kode_barang: set[str]):
    cols = ["Kd_Aset8", "Kd_Aset80", "Kd_Aset81", "Kd_Aset82", "Kd_Aset83"]
    result: dict[tuple, dict[str, Any]] = {}
    skipped = {"tanpa_kode_108": 0, "kode_tidak_ada": 0, "nilai_kosong": 0, "rentang_terbalik": 0}
    for r in fetch(cur, "Ref_Kap_Umur"):
        kode = kode_prefix(r, cols)
        if kode is None or kode.count(".") < 2:
            skipped["tanpa_kode_108"] += 1
        elif kode not in kode_barang:
            skipped["kode_tidak_ada"] += 1
        elif any(r[c] is None for c in ("Bts_Bawah", "Bts_Atas", "Masa_Manfaat", "Jn_Kap")):
            skipped["nilai_kosong"] += 1
        elif r["Bts_Atas"] < r["Bts_Bawah"]:
            skipped["rentang_terbalik"] += 1
        else:
            key = (kode, int(r["Jn_Kap"]), int(r["Bts_Bawah"]), int(r["Bts_Atas"]))
            result[key] = {
                "kode_barang": kode,
                "jenis_kapitalisasi": key[1],
                "batas_bawah_persen": key[2],
                "batas_atas_persen": key[3],
                "tambahan_umur_tahun": int(r["Masa_Manfaat"]),
            }
    return result, skipped


def read_kondisi(cur) -> dict[int, dict[str, Any]]:
    return {
        int(r["Kd_Kondisi"]): {"kode": int(r["Kd_Kondisi"]), "uraian": clean(r["Uraian"])}
        for r in fetch(cur, "Ref_Kondisi")
    }


def read_pemilik(cur) -> dict[int, dict[str, Any]]:
    return {
        int(r["Kd_Pemilik"]): {"kode": int(r["Kd_Pemilik"]), "nama": clean(r["Nm_Pemilik"])}
        for r in fetch(cur, "Ref_Pemilik")
    }


def read_alasan(cur) -> dict[int, dict[str, Any]]:
    return {
        int(r["Kd_Alasan"]): {"kode": int(r["Kd_Alasan"]), "uraian": clean(r["Ur_Alasan"])}
        for r in fetch(cur, "Ref_Alasan")
    }


def read_nilai_minimum(cur, kode_barang: set[str]):
    """Ta_KA: nilai minimum kapitalisasi per tahun dan rincian objek (5 segmen kode 108)."""
    cols = ["Kd_Aset8", "Kd_Aset80", "Kd_Aset81", "Kd_Aset82", "Kd_Aset83"]
    result: dict[tuple, dict[str, Any]] = {}
    skipped = {"tanpa_kode_108": 0, "kode_tidak_ada": 0, "nilai_kosong": 0}
    for r in fetch(cur, "Ta_KA", PEMDA):
        kode = kode_from(r, cols)
        if kode is None:
            skipped["tanpa_kode_108"] += 1
        elif kode not in kode_barang:
            skipped["kode_tidak_ada"] += 1
        elif r["MinSatuan"] is None:
            skipped["nilai_kosong"] += 1
        else:
            key = (int(r["Tahun"]), kode)
            result[key] = {
                "tahun_berlaku": key[0],
                "kode_barang": kode,
                "nilai_minimum_satuan": int(r["MinSatuan"]),
                "nilai_minimum_total": int(r["MinTotal"] or 0),
            }
    return result, skipped


def jenis_unit(nama: str) -> str:
    n = nama.upper()
    if n.startswith("DINAS"):
        return "DINAS"
    if n.startswith("UPT"):
        return "UPT"
    if n.startswith(("SD", "SMP")) and re.search(r"SATAP|SATU ATAP", n.split("(")[0]):
        return "SATAP"
    for prefix, jenis in (("SMP", "SMP"), ("SMA", "SMA"), ("SMK", "SMK"), ("SKB", "SKB"),
                          ("SD", "SD"), ("TK", "TK")):
        if n.startswith(prefix):
            return jenis
    return "LAINNYA"


def split_nama(nama_simda: str) -> tuple[str, str | None]:
    """'SDN 1 TINANGGEA (SDN RORAYA)' -> nama baru dan nama lama (dalam kurung).

    Isi kurung hanya dianggap nama lama bila berupa nama sekolah ('SDN RORAYA'); pada TK isinya
    sering lokasi ('MORAMO', 'KEL. AMONDO') sehingga diabaikan. Kurung tutup boleh hilang.
    """
    m = re.match(r"^(.+?)\s*\(\s*(.*?)[\s.)]*$", nama_simda)
    if not m:
        return nama_simda, None
    lama = m.group(2)
    is_sekolah = re.match(r"^(SD|SMP|SMA|SMK|TK|SKB)\S*\s+.*[A-Z0-9]", lama.upper())
    return m.group(1), (lama if is_sekolah else None)


def read_units(cur):
    """Unit, sub unit dan UPB Dinas Pendidikan. Baris tanpa nama (kosong, '.', "'") dilewati."""
    skipped = Counter()
    units = fetch(cur, "Ref_Unit", DINAS_PENDIDIKAN)
    if len(units) != 1:
        sys.exit("Ref_Unit untuk Dinas Pendidikan (bidang 8, unit 1) tidak ditemukan.")
    nama_dinas = clean(units[0]["Nm_Unit"])
    rows: dict[str, dict[str, Any]] = {}

    def add(kd_sub: int | None, kd_upb: int | None, nama_simda: str) -> None:
        keys = {"kd_bidang": 8, "kd_unit": 1, "kd_sub": kd_sub, "kd_upb": kd_upb}
        derived = derive_unit(keys)
        jenis = jenis_unit(nama_simda)
        nama, nama_lama = split_nama(nama_simda)
        if jenis == "DINAS" and nama_simda != nama_dinas:
            # SIMDA masih menyimpan nama sebelum perubahan nomenklatur pada sub unit/UPB dinas
            nama, nama_lama = nama_dinas, nama_simda
        rows[derived["kode"]] = {
            **keys, **derived, "jenis": jenis, "nama": nama, "nama_lama": nama_lama,
            "nama_simda": nama_simda,
        }

    add(None, None, nama_dinas)
    kode_dinas = next(iter(rows))
    for r in sorted(fetch(cur, "Ref_Sub_Unit", DINAS_PENDIDIKAN), key=lambda r: r["Kd_Sub"]):
        nama = clean(r["Nm_Sub_Unit"])
        if not re.search(r"[A-Za-z0-9]", nama):
            skipped["sub_unit_tanpa_nama"] += 1
        else:
            add(int(r["Kd_Sub"]), None, nama)
    upbs = fetch(cur, "Ref_UPB", DINAS_PENDIDIKAN)
    for r in sorted(upbs, key=lambda r: (r["Kd_Sub"], r["Kd_UPB"])):
        nama = clean(r["Nm_UPB"])
        induk = derive_unit({"kd_bidang": 8, "kd_unit": 1, "kd_sub": int(r["Kd_Sub"])})["kode"]
        if not re.search(r"[A-Za-z0-9]", nama):
            skipped["upb_tanpa_nama"] += 1
        elif induk not in rows:
            skipped["upb_induk_dilewati"] += 1
        else:
            add(int(r["Kd_Sub"]), int(r["Kd_UPB"]), nama)
    # nama lama dinas tersimpan di sub unit pertamanya, bukan di Ref_Unit
    lama = {r["nama_lama"] for r in rows.values() if r["jenis"] == "DINAS" and r["nama_lama"]}
    if len(lama) == 1:
        rows[kode_dinas]["nama_lama"] = lama.pop()
    return rows, dict(skipped)


# --- pencocokan UPB sekolah ke master_sekolah -------------------------------------------------


def norm_sekolah(nama: str | None) -> str:
    """normalize_school_name ditambah ejaan SIMDA: 'SMA N 1', 'SDN10', 'SMKN1'."""
    s = re.sub(r"\b(SD|SMP|SMA|SMK|TK)\s*N\s*(?=\d)", r"\1 NEGERI ", (nama or "").upper())
    s = re.sub(r"(?<=\d)(?=[A-Z])", " ", s)  # 'SDN 14BUKE'
    return normalize_school_name(s)


async def match_units(db, rows: dict[str, dict[str, Any]]) -> Counter:
    """Isi sekolah_id/status_pencocokan tiap baris. Hanya kecocokan nama yang tunggal diterima."""
    sekolah = (await db.execute(select(MasterSekolah))).scalars().all()
    by_name: dict[str, set[str]] = {}
    info = {s.id: s for s in sekolah}
    for s in sekolah:
        for nama in (s.nama_sekolah, s.simpeg_unit_kerja_nama):
            if nama:
                by_name.setdefault(norm_sekolah(nama), set()).add(s.id)

    bentuk = {"SATAP": {"SD", "SMP"}}
    for row in rows.values():
        row.update(sekolah_id=None, sekolah_kedua_id=None, catatan_pencocokan=None)
        if row["tingkat"] != "upb" or row["jenis"] not in JENIS_SEKOLAH:
            row["status_pencocokan"] = "bukan_sekolah"
            continue
        row["status_pencocokan"] = "belum"
        allowed = bentuk.get(row["jenis"], {row["jenis"]})
        found = sorted(
            i for i in by_name.get(norm_sekolah(row["nama"]), ())
            if info[i].bentuk_pendidikan in allowed
        )
        if row["jenis"] == "SATAP":
            sd = [i for i in found if info[i].bentuk_pendidikan == "SD"]
            smp = [i for i in found if info[i].bentuk_pendidikan == "SMP"]
            if len(sd) == 1 and len(smp) == 1:
                row.update(sekolah_id=sd[0], sekolah_kedua_id=smp[0])
            elif len(found) == 1:
                row.update(sekolah_id=found[0])
        elif len(found) == 1:
            row.update(sekolah_id=found[0])
        if row["sekolah_id"]:
            catatan = "Nama baru sama persis"
            if row["jenis"] == "SATAP" and not row["sekolah_kedua_id"]:
                catatan += "; hanya satu dari SD/SMP satu atap yang ditemukan"
            row.update(status_pencocokan="otomatis", catatan_pencocokan=catatan)
        elif found:
            row["catatan_pencocokan"] = f"{len(found)} kandidat bernama sama; pilih manual"
        else:
            row["catatan_pencocokan"] = "Nama baru tidak ditemukan di Master Sekolah"

    # satu sekolah hanya boleh dipadankan dengan satu UPB
    pakai = Counter(i for r in rows.values() for i in (r["sekolah_id"], r["sekolah_kedua_id"]) if i)
    for row in rows.values():
        if any(pakai[i] > 1 for i in (row["sekolah_id"], row["sekolah_kedua_id"]) if i):
            row.update(sekolah_id=None, sekolah_kedua_id=None, status_pencocokan="belum",
                       catatan_pencocokan="Sekolah yang sama cocok dengan lebih dari satu UPB")
    return Counter(r["status_pencocokan"] for r in rows.values())


IMPORT_OWNED = ["tingkat", "kode_induk", "kd_bidang", "kd_unit", "kd_sub", "kd_upb", "nama_simda"]
MATCH_FIELDS = ["sekolah_id", "sekolah_kedua_id", "status_pencocokan", "catatan_pencocokan"]


async def upsert_units(db, rows: dict[str, dict[str, Any]]):
    """Seperti upsert, tetapi suntingan admin dipertahankan.

    Nama/jenis hanya diperbarui bila teks SIMDA berubah; padanan sekolah hanya ditulis ulang bila
    statusnya masih "belum" atau "otomatis"; hasil tinjauan ("manual"/"bukan_sekolah") dibiarkan.
    """
    objs = (await db.execute(select(MasterAsetUnit))).scalars().all()
    existing = {o.kode: o for o in objs}
    terverifikasi = {
        i for o in objs if o.status_pencocokan == "manual"
        for i in (o.sekolah_id, o.sekolah_kedua_id) if i
    }
    added = changed = same = 0
    for kode, values in rows.items():
        obj = existing.get(kode)
        if obj is None:
            if terverifikasi & {values["sekolah_id"], values["sekolah_kedua_id"]}:
                values = {**values, "sekolah_id": None, "sekolah_kedua_id": None,
                          "status_pencocokan": "belum",
                          "catatan_pencocokan": "Sekolah sudah dipadankan manual dengan UPB lain"}
            db.add(MasterAsetUnit(created_by=IMPORTER, **values))
            added += 1
            continue
        fields = list(IMPORT_OWNED)
        if obj.nama_simda != values["nama_simda"]:
            fields += ["nama", "nama_lama", "jenis"]
        ditandai_bukan = obj.status_pencocokan == "bukan_sekolah"
        tinjauan = obj.status_pencocokan == "manual" or (
            ditandai_bukan and values["status_pencocokan"] != "bukan_sekolah"
        )
        if not tinjauan and not terverifikasi & {values["sekolah_id"], values["sekolah_kedua_id"]}:
            fields += MATCH_FIELDS
        if any(getattr(obj, f) != values[f] for f in fields):
            for f in fields:
                setattr(obj, f, values[f])
            changed += 1
        else:
            same += 1
    await db.flush()
    return added, changed, same


# --- menulis ke database aplikasi -------------------------------------------------------------


def with_hierarchy(row: dict[str, Any]) -> dict[str, Any]:
    level = row["kode"].count(".") + 1
    kode_induk = row["kode"].rsplit(".", 1)[0] if level > 1 else None
    return {**row, "level": level, "kode_induk": kode_induk}


async def upsert(db, model, wanted: dict, key_of: Callable[[Any], Any], fields: list[str]):
    """Tambah baris baru dan perbarui yang berubah. Mengembalikan (tambah, ubah, sama)."""
    existing = {key_of(o): o for o in (await db.execute(select(model))).scalars().all()}
    added = changed = same = 0
    for key, values in wanted.items():
        obj = existing.get(key)
        if obj is None:
            db.add(model(created_by=IMPORTER, **values))
            added += 1
        elif any(getattr(obj, f) != values[f] for f in fields):
            for f in fields:
                setattr(obj, f, values[f])
            changed += 1
        else:
            same += 1
    await db.flush()
    return added, changed, same


async def plan_units(units: dict[str, dict[str, Any]]) -> Counter:
    """Cocokkan UPB ke master_sekolah (hanya membaca database aplikasi)."""
    async for db in get_db():
        return await match_units(db, units)
    return Counter()


async def write(data: dict[str, Any]) -> None:
    async for db in get_db():
        report = []
        kode_rows = {k: with_hierarchy(v) for k, v in data["kode_barang"].items()}
        report.append(("kode-barang", await upsert(
            db, MasterAsetKodeBarang, kode_rows, lambda o: o.kode,
            ["uraian", "level", "kode_induk"])))
        report.append(("metode-penyusutan", await upsert(
            db, MasterAsetMetodePenyusutan, data["metode"], lambda o: o.kode, ["nama"])))
        report.append(("masa-manfaat", await upsert(
            db, MasterAsetMasaManfaat, data["masa_manfaat"],
            lambda o: (o.tahun_berlaku, o.kode_barang, o.metode_id), ["umur_tahun"])))
        report.append(("kapitalisasi-masa-manfaat", await upsert(
            db, MasterAsetKapitalisasiMasaManfaat, data["kapitalisasi"],
            lambda o: (
                o.kode_barang, o.jenis_kapitalisasi, o.batas_bawah_persen, o.batas_atas_persen),
            ["tambahan_umur_tahun"])))
        report.append(("kondisi-barang", await upsert(
            db, MasterAsetKondisiBarang, data["kondisi"], lambda o: o.kode, ["uraian"])))
        report.append(("status-pemilik", await upsert(
            db, MasterAsetStatusPemilik, data["pemilik"], lambda o: o.kode, ["nama"])))
        report.append(("alasan-penghapusan", await upsert(
            db, MasterAsetAlasanPenghapusan, data["alasan"], lambda o: o.kode, ["uraian"])))
        report.append(("nilai-minimum-kapitalisasi", await upsert(
            db, MasterAsetNilaiMinimumKapitalisasi, data["nilai_minimum"],
            lambda o: (o.tahun_berlaku, o.kode_barang),
            ["nilai_minimum_satuan", "nilai_minimum_total"])))
        await match_units(db, data["unit"])
        report.append(("unit-sekolah", await upsert_units(db, data["unit"])))
        await db.commit()
        print("\nHasil penulisan (tambah / ubah / sama):")
        for slug, (added, changed, same) in report:
            print(f"  {slug:28} {added:>7} / {changed:>5} / {same:>7}")
        break


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--dry-run", action="store_true", help="hanya membaca dan menghitung")
    args = parser.parse_args()

    conn = connect()
    try:
        cur = conn.cursor()
        kode_barang = read_kode_barang(cur)
        metode = read_metode(cur)
        masa_manfaat, skip_mm = read_masa_manfaat(cur, set(kode_barang), set(metode))
        kapitalisasi, skip_kap = read_kapitalisasi(cur, set(kode_barang))
        nilai_minimum, skip_min = read_nilai_minimum(cur, set(kode_barang))
        unit, skip_unit = read_units(cur)
        data = {
            "kode_barang": kode_barang,
            "metode": metode,
            "masa_manfaat": masa_manfaat,
            "kapitalisasi": kapitalisasi,
            "kondisi": read_kondisi(cur),
            "pemilik": read_pemilik(cur),
            "alasan": read_alasan(cur),
            "nilai_minimum": nilai_minimum,
            "unit": unit,
        }
    finally:
        conn.close()

    print("Dibaca dari SIMDA:")
    for name, rows in data.items():
        print(f"  {name:14} {len(rows):>7}")
    print(f"  dilewati masa_manfaat: {skip_mm}")
    print(f"  dilewati kapitalisasi: {skip_kap}")
    print(f"  dilewati nilai_minimum: {skip_min}")
    print(f"  dilewati unit: {skip_unit}")
    print(f"  unit per tingkat: {dict(Counter(u['tingkat'] for u in unit.values()))}")
    print(f"  unit per jenis: {dict(Counter(u['jenis'] for u in unit.values()))}")

    if args.dry_run:
        status = asyncio.run(plan_units(unit))
        print(f"  pencocokan sekolah (bila semua baris baru): {dict(status)}")
        print("\n--dry-run: tidak ada yang ditulis.")
        return
    asyncio.run(write(data))


if __name__ == "__main__":
    main()
