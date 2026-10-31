"""Seed and synchronize master_sekolah_meta from simpeg.unit_kerja."""

import asyncio
import re
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.connections.edusetara import edusetara_session_factory

KECAMATAN_LIST = [
    "ANDOOLO BARAT",
    "ANDOOLO",
    "ANGATA",
    "BAITO",
    "BASALA",
    "BENUA",
    "BUKE",
    "KOLONO TIMUR",
    "KOLONO",
    "KONDA",
    "LAEYA",
    "LAINEA",
    "LALEMBUU",
    "LANDONO",
    "LAONTI",
    "MORAMO UTARA",
    "MORAMO",
    "MOWILA",
    "PALANGGA SELATAN",
    "PALANGGA",
    "RANOMEETO BARAT",
    "RANOMEETO",
    "SABULAKOA",
    "TINANGGEA",
    "WOLASI",
]


def classify_school(name: str) -> tuple[str | None, str]:
    """
    Classify a unit_kerja string into (jenjang, status_sekolah).
    Returns (None, '') if it is a structural office (Dinas/Korwil).
    """
    clean = re.sub(r"[\u200c\u200b\s]+", " ", name).strip().upper()

    # 1. Non-school (Skip)
    if clean.startswith("KORWIL") or clean.startswith("DINAS"):
        return None, "STRUKTURAL"

    # 2. SKB / Nonformal / PKBM
    if clean.startswith("SKB"):
        return "PKBM", "NEGERI"

    # 3. SATAP (Satu Atap)
    if "SATAP" in clean or "SD-SMP" in clean or "SD - SMP" in clean or "SDN-SMPN" in clean:
        if clean.startswith("SDN") or clean.startswith("SD "):
            return "SD", "NEGERI"
        elif clean.startswith("SMPN") or clean.startswith("SMP "):
            return "SMP", "NEGERI"
        elif clean.startswith("TKN") or clean.startswith("TK "):
            return "TK", "NEGERI"
        else:
            return "SATAP", "NEGERI"

    # 4. SMP
    if clean.startswith("SMPN") or clean.startswith("SMP "):
        status = "SWASTA" if "SWASTA" in clean else "NEGERI"
        return "SMP", status

    # 5. SD
    if clean.startswith("SDN") or clean.startswith("SD "):
        status = "SWASTA" if "SWASTA" in clean else "NEGERI"
        return "SD", status

    # 6. TK / PAUD
    if (
        clean.startswith("TK")
        or clean.startswith("TKN")
        or clean.startswith("PAUD")
        or clean.startswith("KB")
    ):
        jenjang = "PAUD" if clean.startswith("PAUD") or clean.startswith("KB") else "TK"
        status = "NEGERI" if clean.startswith("TKN") or "NEGERI" in clean else "SWASTA"
        return jenjang, status

    # 7. Known edge cases (TK binaan/yayasan)
    if clean in ["MEKAR JAYA", "DHARMA WANITA", "TUNAS HARAPAN"]:
        return "TK", "SWASTA"

    return "LAINNYA", "NEGERI"


def extract_kecamatan(name: str, alamat: str | None) -> str | None:
    """Extract kecamatan from school name and address text."""
    combined = f"{name} {alamat or ''}".upper()
    for kec in KECAMATAN_LIST:
        if re.search(r"\b" + re.escape(kec) + r"\b", combined):
            return kec.title()
    return None


def resolve_wilayah(
    name: str,
    alamat: str | None,
    kec_data: list[tuple[int, str]],  # (kecamatan_id, nama_kecamatan)
    des_by_kec: dict[int, list[tuple[int, str]]],  # kec_id -> [(des_kel_id, nama_des_kel)]
) -> tuple[int | None, str | None, int | None, str | None]:
    """Resolve kecamatan and desa/kelurahan from egov regional master data."""
    combined = f"{name} {alamat or ''}".upper()

    found_kec_id: int | None = None
    found_kec_name: str | None = None

    for k_id, k_name in kec_data:
        if re.search(r"\b" + re.escape(k_name) + r"\b", combined):
            found_kec_id = k_id
            found_kec_name = k_name.title()
            break

    found_des_id: int | None = None
    found_des_name: str | None = None

    if found_kec_id and found_kec_id in des_by_kec:
        for d_id, d_name in des_by_kec[found_kec_id]:
            # Avoid single common letters / words that might false match
            if len(d_name) > 3 and re.search(r"\b" + re.escape(d_name) + r"\b", combined):
                found_des_id = d_id
                found_des_name = d_name.title()
                break

    return found_kec_id, found_kec_name, found_des_id, found_des_name


async def sync_master_sekolah(session: AsyncSession) -> dict[str, Any]:
    """
    Sync schools from simpeg.unit_kerja into edusetara.master_sekolah_meta.
    Only inserts or updates without duplicating school identity.
    """
    # 1. Load regional master from egov
    res_kec = await session.execute(text("""
        SELECT kecamatan_id, UPPER(nama_kecamatan)
        FROM egov.master_kecamatan
        WHERE kabupaten_id = 7405
        ORDER BY LENGTH(nama_kecamatan) DESC
    """))
    kec_data = [(r[0], r[1]) for r in res_kec.fetchall()]

    res_des = await session.execute(text("""
        SELECT d.des_kel_id, d.kecamatan_id, UPPER(d.nama_des_kel)
        FROM egov.master_des_kel d
        JOIN egov.master_kecamatan k ON d.kecamatan_id = k.kecamatan_id
        WHERE k.kabupaten_id = 7405
        ORDER BY LENGTH(d.nama_des_kel) DESC
    """))
    des_by_kec: dict[int, list[tuple[int, str]]] = {}
    for d_id, k_id, d_name in res_des.fetchall():
        des_by_kec.setdefault(k_id, []).append((d_id, d_name))

    # 2. Query schools from SIMPEG
    query_simpeg = text("""
        SELECT id, unit_kerja, alamat, status
        FROM simpeg.unit_kerja
        WHERE instansi = 'nCxELyiYZBPCeF85N' AND status = 1
    """)
    result = await session.execute(query_simpeg)
    rows = result.fetchall()

    stats = {
        "total_source": len(rows),
        "skipped_structural": 0,
        "processed_schools": 0,
        "jenjang_breakdown": {},
    }

    upsert_stmt = text("""
        INSERT INTO edusetara.master_sekolah_meta (
            unit_kerja_id, jenjang, status_sekolah,
            kecamatan_id, kecamatan, desa_kelurahan_id, desa_kelurahan,
            is_active, created_by
        ) VALUES (
            :unit_kerja_id, :jenjang, :status_sekolah,
            :kecamatan_id, :kecamatan, :desa_kelurahan_id, :desa_kelurahan,
            :is_active, 'system_sync'
        )
        ON DUPLICATE KEY UPDATE
            jenjang = VALUES(jenjang),
            status_sekolah = VALUES(status_sekolah),
            kecamatan_id = COALESCE(master_sekolah_meta.kecamatan_id, VALUES(kecamatan_id)),
            kecamatan = COALESCE(master_sekolah_meta.kecamatan, VALUES(kecamatan)),
            desa_kelurahan_id = COALESCE(master_sekolah_meta.desa_kelurahan_id, VALUES(desa_kelurahan_id)),
            desa_kelurahan = COALESCE(master_sekolah_meta.desa_kelurahan, VALUES(desa_kelurahan)),
            updated_at = NOW()
    """)

    for r in rows:
        unit_id = r[0]
        name = r[1] or ""
        alamat = r[2]

        jenjang, status_sekolah = classify_school(name)
        if jenjang is None:
            stats["skipped_structural"] += 1
            continue

        kec_id, kec_name, des_id, des_name = resolve_wilayah(
            name, alamat, kec_data, des_by_kec
        )

        await session.execute(
            upsert_stmt,
            {
                "unit_kerja_id": unit_id,
                "jenjang": jenjang,
                "status_sekolah": status_sekolah,
                "kecamatan_id": kec_id,
                "kecamatan": kec_name,
                "desa_kelurahan_id": des_id,
                "desa_kelurahan": des_name,
                "is_active": True,
            },
        )

        stats["processed_schools"] += 1
        stats["jenjang_breakdown"][jenjang] = stats["jenjang_breakdown"].get(jenjang, 0) + 1

    await session.commit()
    return stats


async def main() -> None:
    """Run synchronization CLI."""
    print("Synchronizing master_sekolah_meta from simpeg.unit_kerja...")
    async with edusetara_session_factory() as session:
        stats = await sync_master_sekolah(session)
        print(f"Total SIMPEG units found: {stats['total_source']}")
        print(f"Skipped structural offices (Korwil/Dinas): {stats['skipped_structural']}")
        print(f"Successfully synced schools: {stats['processed_schools']}")
        print("Jenjang Breakdown:")
        for k, v in sorted(stats["jenjang_breakdown"].items()):
            print(f"  - {k}: {v} unit")


if __name__ == "__main__":
    asyncio.run(main())
