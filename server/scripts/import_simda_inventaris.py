"""Impor barang inventaris (KIB A–E) dari SIMDA BMD ke inventaris aset aplikasi.

Hanya MEMBACA dari SQL Server dan menulis ke MySQL aplikasi. Lingkupnya barang milik UPB yang
sudah ada di Referensi Unit & UPB SIMDA (Dinas Pendidikan: Kd_Bidang 8, Kd_Unit 1). Jalankan
scripts/import_simda_master_aset.py lebih dahulu agar kode barang, kondisi dan UPB tersedia.

Aman dijalankan berulang: barang dikenali lewat IDPemda sumbernya. Barang baru ditambah bersama
riwayat kondisi awalnya; barang impor yang belum pernah diubah di aplikasi (versi 1) diperbarui
mengikuti SIMDA; barang yang sudah dikoreksi atau diperiksa kondisinya di aplikasi tidak disentuh.
Tidak ada yang dihapus. Baris yang tidak dapat dipetakan ditolak dan dilaporkan.

    python scripts/import_simda_inventaris.py --dry-run                      # hitung saja
    python scripts/import_simda_inventaris.py --dry-run --upb 08.01.002.002  # pratinjau satu UPB
    python scripts/import_simda_inventaris.py --rejects penolakan.csv        # impor
"""

import argparse
import asyncio
import csv
import sys
import uuid
from collections import Counter, defaultdict
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import insert, select, update  # noqa: E402

from app.db.connections.edusetara import edusetara_engine, edusetara_session_factory  # noqa: E402
from app.models.master.aset import (  # noqa: E402
    MasterAsetKodeBarang,
    MasterAsetKondisiBarang,
    MasterAsetUnit,
)
from app.models.operational.inventaris_aset import InventarisAset, RiwayatKondisiAset  # noqa: E402
from scripts.import_simda_master_aset import DINAS_PENDIDIKAN, clean, connect  # noqa: E402

IMPORTER = "import-simda"
LOKASI_KOSONG = "Belum dicatat"
KONDISI_TANAH = 1  # KIB A tidak mempunyai kolom kondisi di SIMDA
BATCH = 1000
KODE_108 = [
    "Kd_Aset8",
    "Kd_Aset80",
    "Kd_Aset81",
    "Kd_Aset82",
    "Kd_Aset83",
    "Kd_Aset84",
    "Kd_Aset85",
]
COMMON = [
    "IDPemda", "Kd_Sub", "Kd_UPB", *KODE_108, "No_Reg8", "Tgl_Perolehan", "Harga", "Asal_usul",
    "Keterangan", "Kd_Hapus",
]  # fmt: skip
# Kolom khas tiap KIB: (kondisi, lokasi, nama khusus, merk, tipe, nomor seri)
EXTRA = {
    "A": (None, "Alamat", None, None, None, None),
    "B": ("Kondisi", None, None, "Merk", "Type", "Nomor_Pabrik"),
    "C": ("Kondisi", "Lokasi", None, None, None, None),
    "D": ("Kondisi", "Lokasi", None, None, None, None),
    "E": ("Kondisi", None, "Judul", None, None, None),
}
ROLES = ("kondisi", "lokasi", "judul", "merk", "tipe", "seri")
# Kolom yang mengikuti SIMDA selama barang belum diubah di aplikasi
SYNCED = [
    "upb_id", "kode_barang", "nomor_register", "nama", "merk", "nomor_seri", "tahun_perolehan",
    "tanggal_perolehan", "nilai_perolehan", "lokasi", "kondisi_kode", "keterangan",
]  # fmt: skip


def read_kib(cur, kib: str, upb: tuple[int, int] | None = None) -> list[dict[str, Any]]:
    """Satu SELECT per tabel KIB; nama kolom tetap, nilai saringan dikirim sebagai parameter."""
    extra = [
        f"{column} AS {role}" for column, role in zip(EXTRA[kib], ROLES, strict=True) if column
    ]
    where = dict(DINAS_PENDIDIKAN)
    if upb:
        where.update({"Kd_Sub": upb[0], "Kd_UPB": upb[1]})
    sql = (
        f"SELECT {', '.join(COMMON + extra)} FROM Ta_KIB_{kib} WHERE "
        + " AND ".join(f"{column} = %s" for column in where)
        + " ORDER BY IDPemda"
    )
    cur.execute(sql, tuple(where.values()))
    names = [d[0] for d in cur.description]
    return [dict(zip(names, row, strict=True)) for row in cur.fetchall()]


def map_row(kib: str, row: dict[str, Any], units: dict, codes: dict, conditions: set):
    """Baris SIMDA -> (data inventaris, None) atau (None, alasan penolakan)."""
    if row["Kd_Hapus"]:
        return None, "ditandai hapus di SIMDA"
    parts = [row[column] for column in KODE_108]
    if any(part is None for part in parts):
        return None, "kode barang Permendagri 108 kosong"
    kode = ".".join(f"{int(part):02d}" for part in parts)
    if kode not in codes:
        return None, "kode barang tidak ada di Master Aset"
    if kode[:8] != f"01.03.0{'ABCDEF'.index(kib) + 1}":
        return None, "kode barang tidak sesuai kelompok KIB"
    upb_id = units.get((int(row["Kd_Sub"]), int(row["Kd_UPB"])))
    if upb_id is None:
        return None, "UPB tidak ada di Referensi Unit & UPB SIMDA"
    if row["No_Reg8"] is None:
        return None, "nomor register kosong"
    if row["Tgl_Perolehan"] is None:
        return None, "tanggal perolehan kosong"
    kondisi = KONDISI_TANAH if "kondisi" not in row else str(row["kondisi"] or "").strip()
    if not str(kondisi).isdigit() or int(kondisi) not in conditions:
        return None, "kondisi tidak dikenal"
    harga = Decimal(str(row["Harga"])).quantize(Decimal("0.01"), ROUND_HALF_UP)
    if harga < 0:
        return None, "nilai perolehan negatif"
    merk = " ".join(filter(None, (clean(row.get("merk"), 100), clean(row.get("tipe"), 49))))
    asal = clean(row["Asal_usul"])
    keterangan = " · ".join(
        filter(None, (clean(row["Keterangan"], 3000), f"Asal-usul: {asal}" if asal else ""))
    )
    tanggal = row["Tgl_Perolehan"].date()
    return {
        "simda_id": row["IDPemda"],
        "kib": kib,
        "upb_id": upb_id,
        "kode_barang": kode,
        "nomor_register": f"{int(row['No_Reg8']):06d}",
        "nama": clean(row.get("judul")) or codes[kode],
        "merk": merk or None,
        "nomor_seri": clean(row.get("seri"), 150) or None,
        "tahun_perolehan": tanggal.year,
        "tanggal_perolehan": tanggal,
        "nilai_perolehan": harga,
        "lokasi": clean(row.get("lokasi")) or LOKASI_KOSONG,
        "kondisi_kode": int(kondisi),
        "keterangan": keterangan or None,
    }, None


def register_key(item: dict[str, Any]) -> tuple:
    return (
        item["upb_id"], item["kode_barang"], item["tahun_perolehan"], item["nomor_register"]
    )  # fmt: skip


def map_all(source: dict[str, list[dict]], units: dict, codes: dict, conditions: set):
    """Petakan semua baris; register ganda di satu UPB diterima sekali (IDPemda terkecil)."""
    items, rejects, seen = [], [], set()
    for kib, rows in source.items():
        for row in rows:
            item, reason = map_row(kib, row, units, codes, conditions)
            if item and register_key(item) in seen:
                item, reason = None, "register ganda pada UPB, kode barang dan tahun yang sama"
            if item is None:
                rejects.append({"kib": kib, "IDPemda": row["IDPemda"], "kd_sub": row["Kd_Sub"],
                                "kd_upb": row["Kd_UPB"], "alasan": reason})  # fmt: skip
            else:
                seen.add(register_key(item))
                items.append(item)
    return items, rejects


async def load_references(db):
    units = {
        (kd_sub, kd_upb): (uid, kode)
        for uid, kode, kd_sub, kd_upb in (
            await db.execute(
                select(
                    MasterAsetUnit.id,
                    MasterAsetUnit.kode,
                    MasterAsetUnit.kd_sub,
                    MasterAsetUnit.kd_upb,
                ).where(MasterAsetUnit.tingkat == "upb")
            )  # fmt: skip
        ).all()
    }
    codes = dict(
        (
            await db.execute(
                select(MasterAsetKodeBarang.kode, MasterAsetKodeBarang.uraian).where(
                    MasterAsetKodeBarang.level == 7
                )
            )
        ).all()
    )
    conditions = dict(
        (
            await db.execute(select(MasterAsetKondisiBarang.kode, MasterAsetKondisiBarang.uraian))
        ).all()
    )
    return units, codes, conditions


async def plan(db, items: list[dict], rejects: list[dict]):
    """Bandingkan dengan isi inventaris: baris baru, berubah, sama, atau dikunci perubahan lokal."""
    existing = {}
    manual_keys = set()
    columns = [getattr(InventarisAset, name) for name in ("id", "version", "simda_id", *SYNCED)]
    for row in (await db.execute(select(InventarisAset.kib, *columns))).mappings():
        if row["simda_id"]:
            existing[(row["kib"], row["simda_id"])] = row
        else:
            manual_keys.add(register_key(row))
    new, changed, counts = [], [], Counter()
    for item in items:
        current = existing.get((item["kib"], item["simda_id"]))
        if current is None:
            if register_key(item) in manual_keys:
                rejects.append(
                    {
                        "kib": item["kib"],
                        "IDPemda": item["simda_id"],
                        "kd_sub": "",
                        "kd_upb": "",
                        "alasan": "register sudah dicatat manual",
                    }
                )
            else:
                new.append(item)
        elif all(current[name] == item[name] for name in SYNCED):
            counts["sama"] += 1
        elif current["version"] != 1:
            counts["dikunci perubahan lokal"] += 1
        else:
            changed.append((current["id"], item))
    return new, changed, counts


async def write(db, new: list[dict], changed: list, conditions: dict) -> None:
    for start in range(0, len(new), BATCH):
        chunk = [{**item, "id": str(uuid.uuid4())} for item in new[start : start + BATCH]]
        await db.execute(
            insert(InventarisAset),
            [{**item, "version": 1, "created_by": IMPORTER} for item in chunk],
        )
        await db.execute(
            insert(RiwayatKondisiAset),
            [
                {
                    "id": str(uuid.uuid4()),
                    "aset_id": item["id"],
                    "kondisi_lama": None,
                    "kondisi_baru": {
                        "kode": item["kondisi_kode"],
                        "nama": conditions[item["kondisi_kode"]],
                    },  # fmt: skip
                    "catatan": "Impor dari SIMDA BMD",
                    "version": 1,
                    "created_by": IMPORTER,
                }
                for item in chunk
            ],
        )
        print(f"\r  ditulis {min(start + BATCH, len(new)):>7} / {len(new)}", end="", flush=True)
    if new:
        print()
    for asset_id, item in changed:
        values = {name: item[name] for name in SYNCED}
        await db.execute(
            update(InventarisAset)
            .where(InventarisAset.id == asset_id, InventarisAset.version == 1)
            .values(**values)
        )
    await db.commit()


def summarize(items: list[dict], kode_upb: dict) -> None:
    per_kib = defaultdict(lambda: [0, Decimal(0)])
    for item in items:
        per_kib[item["kib"]][0] += 1
        per_kib[item["kib"]][1] += item["nilai_perolehan"]
    print("Dapat dipetakan (jumlah / nilai perolehan):")
    for kib in sorted(per_kib):
        print(f"  KIB {kib} {per_kib[kib][0]:>8} / Rp {per_kib[kib][1]:>22,.2f}")
    total = sum((value for _, value in per_kib.values()), Decimal(0))
    print(f"  Total {len(items):>8} / Rp {total:>22,.2f}")
    print(f"  UPB berisi barang: {len({item['upb_id'] for item in items})} dari {len(kode_upb)}")


async def run(args, source: dict[str, list[dict]]) -> None:
    async with edusetara_session_factory() as db:
        unit_rows, codes, conditions = await load_references(db)
        units = {key: uid for key, (uid, _) in unit_rows.items()}
        items, rejects = map_all(source, units, codes, set(conditions))
        new, changed, counts = await plan(db, items, rejects)
        summarize(items, units)
        print(f"Ditolak: {len(rejects)} {dict(Counter(r['alasan'] for r in rejects))}")
        print(
            f"Rencana: tambah {len(new)}, perbarui {len(changed)}, sama {counts['sama']}, "
            f"dikunci perubahan lokal {counts['dikunci perubahan lokal']}"
        )
        if args.rejects and rejects:
            with open(args.rejects, "w", newline="", encoding="utf-8") as handle:
                writer = csv.DictWriter(handle, fieldnames=list(rejects[0]))
                writer.writeheader()
                writer.writerows(rejects)
            print(f"Daftar penolakan: {args.rejects}")
        if args.upb:
            print("Contoh hasil pemetaan:")
            for item in items[:5]:
                print("  ", {k: str(v) for k, v in item.items() if v is not None and k != "upb_id"})
        if args.dry_run:
            print("Dry-run: tidak ada yang ditulis.")
        else:
            await write(db, new, changed, conditions)
            print("Selesai ditulis ke inventaris aset.")
    await edusetara_engine.dispose()


async def find_upb(kode: str) -> tuple[int, int]:
    async with edusetara_session_factory() as db:
        row = (
            await db.execute(
                select(MasterAsetUnit.kd_sub, MasterAsetUnit.kd_upb).where(
                    MasterAsetUnit.kode == kode, MasterAsetUnit.tingkat == "upb"
                )
            )
        ).one_or_none()
    if row is None:
        sys.exit(f"UPB {kode} tidak ada di Referensi Unit & UPB SIMDA.")
    return int(row[0]), int(row[1])


async def main_async(args) -> None:
    upb = await find_upb(args.upb) if args.upb else None
    conn = connect()
    try:
        cur = conn.cursor()
        source = {kib: read_kib(cur, kib, upb) for kib in EXTRA}
    finally:
        conn.close()
    print("Dibaca dari SIMDA:", {f"KIB {kib}": len(rows) for kib, rows in source.items()})
    await run(args, source)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--dry-run", action="store_true", help="hanya membaca dan menghitung")
    parser.add_argument("--upb", help="batasi ke satu UPB, mis. 08.01.002.002")
    parser.add_argument("--rejects", help="simpan daftar baris yang ditolak ke berkas CSV")
    asyncio.run(main_async(parser.parse_args()))


if __name__ == "__main__":
    main()
