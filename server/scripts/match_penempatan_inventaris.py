"""Isi sekolah penempatan barang yang dibukukan pada UPB Dinas/UPT dari teks keterangannya.

SIMDA membukukan hampir semua barang sekolah pada UPB Dinas; nama sekolah hanya muncul sebagai
teks bebas di keterangan. Skrip ini mencocokkan teks itu dengan nama sekarang dan nama lama UPB
sekolah (serta nama sekolah yang terhubung) lalu mengisi `upb_penempatan_id` berstatus
"otomatis". UPB pembukuan tidak diubah.

Hanya barang yang penempatannya masih kosong yang diisi, dan hanya bila keterangannya menunjuk
tepat satu UPB. Nama yang dipakai lebih dari satu UPB (akibat perubahan nama sekolah) dan nama
yang tidak ada di referensi dibiarkan kosong untuk ditetapkan manual. Aman dijalankan berulang.

    python scripts/match_penempatan_inventaris.py --dry-run
    python scripts/match_penempatan_inventaris.py
"""

import argparse
import asyncio
import sys
from collections import Counter, defaultdict
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select, update  # noqa: E402
from sqlalchemy.orm import aliased  # noqa: E402

from app.db.connections.edusetara import edusetara_engine, edusetara_session_factory  # noqa: E402
from app.db.match_simpeg_sekolah import normalize_school_name  # noqa: E402
from app.models.master.aset import MasterAsetUnit  # noqa: E402
from app.models.master.sekolah import MasterSekolah  # noqa: E402
from app.models.operational.inventaris_aset import InventarisAset  # noqa: E402

JENJANG = {"SD", "SMP", "SMA", "SMK", "TK", "SKB"}
BUKAN_SEKOLAH = ("DINAS", "UPT")
BATCH = 1000
LABELS = {
    "cocok": "cocok ke satu UPB sekolah",
    "ambigu": "nama dipakai lebih dari satu UPB",
    "tak_dikenal": "menyebut sekolah di luar referensi",
    "tanpa_sekolah": "tidak menyebut sekolah",
}


def build_index(names: list[tuple[str, str]]) -> dict[tuple[str, ...], set[str]]:
    """(upb_id, nama) -> indeks urutan kata nama yang dinormalkan ke kumpulan UPB pemakainya."""
    index: dict[tuple[str, ...], set[str]] = defaultdict(set)
    for upb_id, name in names:
        tokens = tuple(normalize_school_name(name or "").split())
        if len(tokens) >= 3:  # jenjang + minimal dua kata; nama lebih pendek terlalu umum
            index[tokens].add(upb_id)
    return dict(index)


def match_text(text: str | None, index: dict[tuple[str, ...], set[str]]) -> tuple[str, str | None]:
    """Cari nama sekolah di keterangan; nama terpanjang yang cocok pada tiap posisi dipakai."""
    body = (text or "").split(" · Asal-usul:")[0]
    tokens = normalize_school_name(body).split()
    by_first: dict[str, list[tuple[str, ...]]] = defaultdict(list)
    for name in index:
        by_first[name[0]].append(name)
    found, position = [], 0
    while position < len(tokens):
        candidates = sorted(by_first.get(tokens[position], ()), key=len, reverse=True)
        hit = next(
            (c for c in candidates if tuple(tokens[position : position + len(c)]) == c), None
        )
        if hit:
            found.append(hit)
            position += len(hit)
        else:
            position += 1
    if not found:
        mentions = any(token in JENJANG for token in tokens)
        return ("tak_dikenal" if mentions else "tanpa_sekolah"), None
    # nama lama dan nama baru UPB yang sama boleh muncul bersama: pakai irisannya
    common = set.intersection(*(index[name] for name in found))
    if len(common) == 1:
        return "cocok", next(iter(common))
    return "ambigu", None


async def load(db):
    first, second = aliased(MasterSekolah), aliased(MasterSekolah)
    rows = (
        await db.execute(
            select(
                MasterAsetUnit.id,
                MasterAsetUnit.nama,
                MasterAsetUnit.nama_lama,
                first.nama_sekolah,
                second.nama_sekolah,
            )
            .outerjoin(first, first.id == MasterAsetUnit.sekolah_id)
            .outerjoin(second, second.id == MasterAsetUnit.sekolah_kedua_id)
            .where(MasterAsetUnit.tingkat == "upb", MasterAsetUnit.jenis.notin_(BUKAN_SEKOLAH))
        )
    ).all()
    names = [(row[0], name) for row in rows for name in row[1:] if name]
    assets = (
        await db.execute(
            select(InventarisAset.id, InventarisAset.keterangan, InventarisAset.nilai_perolehan)
            .join(MasterAsetUnit, MasterAsetUnit.id == InventarisAset.upb_id)
            .where(
                MasterAsetUnit.jenis.in_(BUKAN_SEKOLAH),
                InventarisAset.upb_penempatan_id.is_(None),
            )
        )
    ).all()
    return build_index(names), assets


async def run(dry_run: bool) -> None:
    async with edusetara_session_factory() as db:
        index, assets = await load(db)
        cache: dict[str | None, tuple[str, str | None]] = {}
        counts, values = Counter(), defaultdict(Decimal)
        targets: dict[str, list[str]] = defaultdict(list)
        for asset_id, keterangan, nilai in assets:
            if keterangan not in cache:
                cache[keterangan] = match_text(keterangan, index)
            result, upb_id = cache[keterangan]
            counts[result] += 1
            values[result] += nilai
            if upb_id:
                targets[upb_id].append(asset_id)
        print(f"Barang di UPB Dinas/UPT tanpa penempatan: {len(assets)}")
        for key, label in LABELS.items():
            print(f"  {label:36} {counts[key]:>8}  Rp {values[key]:>22,.2f}")
        print(f"  UPB sekolah tujuan: {len(targets)}")
        if dry_run:
            print("Dry-run: tidak ada yang ditulis.")
        else:
            for upb_id, ids in targets.items():
                for start in range(0, len(ids), BATCH):
                    await db.execute(
                        update(InventarisAset)
                        .where(
                            InventarisAset.id.in_(ids[start : start + BATCH]),
                            InventarisAset.upb_penempatan_id.is_(None),
                        )
                        .values(upb_penempatan_id=upb_id, status_penempatan="otomatis")
                    )
            await db.commit()
            print(f"Penempatan otomatis diisi untuk {counts['cocok']} barang.")
    await edusetara_engine.dispose()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--dry-run", action="store_true", help="hanya menghitung")
    asyncio.run(run(parser.parse_args().dry_run))


if __name__ == "__main__":
    main()
