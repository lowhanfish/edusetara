"""Impor data rujukan Master Aset dari SIMDA BMD (SQL Server) ke database aplikasi.

Hanya MEMBACA dari SQL Server (koneksi read-only, satu SELECT per tabel) dan menulis ke MySQL
aplikasi. Aman dijalankan berulang: data dicocokkan per kunci bisnis, yang baru ditambah dan
yang berubah diperbarui; tidak ada yang dihapus.

Kredensial dibaca dari server/.env: SQL_SERVER_HOST, SQL_SERVER_PORT, SQL_SERVER_DB_NAME,
SQL_SERVER_USERNAME, SQL_SERVER_PASSWORD. Disarankan memakai akun SQL Server hak SELECT saja.

    pip install -e ".[simda]"
    python scripts/import_simda_master_aset.py --dry-run   # hitung saja
    python scripts/import_simda_master_aset.py
"""

import argparse
import asyncio
import sys
from collections.abc import Callable, Iterable
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import dotenv_values  # noqa: E402
from sqlalchemy import select  # noqa: E402

from app.db.session import get_db  # noqa: E402
from app.models.master.aset import (  # noqa: E402
    MasterAsetKapitalisasiMasaManfaat,
    MasterAsetKodeBarang,
    MasterAsetKondisiBarang,
    MasterAsetMasaManfaat,
    MasterAsetMetodePenyusutan,
    MasterAsetStatusPemilik,
)

ENV_FILE = Path(__file__).resolve().parent.parent / ".env"
IMPORTER = "import-simda"
HIERARCHY = ["Ref_Rek0_108", "Ref_Rek1_108", "Ref_Rek2_108", "Ref_Rek3_108", "Ref_Rek4_108", "Ref_Rek5_108"]


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


def fetch(cur, table: str) -> list[dict[str, Any]]:
    cur.execute(f"SELECT * FROM {table}")  # nama tabel tetap, bukan input pengguna
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
            lambda o: (o.kode_barang, o.jenis_kapitalisasi, o.batas_bawah_persen, o.batas_atas_persen),
            ["tambahan_umur_tahun"])))
        report.append(("kondisi-barang", await upsert(
            db, MasterAsetKondisiBarang, data["kondisi"], lambda o: o.kode, ["uraian"])))
        report.append(("status-pemilik", await upsert(
            db, MasterAsetStatusPemilik, data["pemilik"], lambda o: o.kode, ["nama"])))
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
        data = {
            "kode_barang": kode_barang,
            "metode": metode,
            "masa_manfaat": masa_manfaat,
            "kapitalisasi": kapitalisasi,
            "kondisi": read_kondisi(cur),
            "pemilik": read_pemilik(cur),
        }
    finally:
        conn.close()

    print("Dibaca dari SIMDA:")
    for name, rows in data.items():
        print(f"  {name:14} {len(rows):>7}")
    print(f"  dilewati masa_manfaat: {skip_mm}")
    print(f"  dilewati kapitalisasi: {skip_kap}")

    if args.dry_run:
        print("\n--dry-run: tidak ada yang ditulis.")
        return
    asyncio.run(write(data))


if __name__ == "__main__":
    main()
