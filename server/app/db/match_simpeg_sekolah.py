"""
Script to reconcile and match simpeg.unit_kerja with edusetara.master_sekolah.
Populates simpeg_unit_kerja_id in master_sekolah.
"""

import asyncio
import re
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.connections.edusetara import edusetara_session_factory
from app.utils.school_classifier import classify_school, extract_kecamatan


def normalize_school_name(s: str) -> str:
    """Normalize school string for resilient comparison."""
    s = re.sub(r"[\u200c\u200b\s]+", " ", s).strip().upper()
    s = re.sub(r"\(SWASTA\)|\(NEGERI\)", "", s).strip()
    s = re.sub(r"\bSATU ATAP\b", "SATAP", s)
    s = re.sub(r"\bSDN\b", "SD NEGERI", s)
    s = re.sub(r"\bSMPN\b", "SMP NEGERI", s)
    s = re.sub(r"\bSMAN\b", "SMA NEGERI", s)
    s = re.sub(r"\bSMKN\b", "SMK NEGERI", s)
    s = re.sub(r"\bTKN\b", "TK NEGERI", s)
    s = re.sub(r"\bKONSEL\b", "KONAWE SELATAN", s)
    s = re.sub(r"\bKAB\.\s*KONAWE SELATAN\b", "KONAWE SELATAN", s)
    s = re.sub(r"\bKABUPATEN\s*KONAWE SELATAN\b", "KONAWE SELATAN", s)
    s = re.sub(r"[^A-Z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


MANUAL_MAPPINGS = {
    "2bm7ule1lrgdlapk9omp": "sch_40405781",  # TKN KUNCUP DHARMA PERTIWI -> TK KUNCUP DHARMA PERTIWI (Andolo)
    "2bm7ule1pzh2lapm1v2x": "sch_69912275",  # TK Tunas Bangsa Palangga -> TK Tunas Bangsa (Palangga)
    "2bm7ule1pzh2laqvroqa": "sch_69928449",  # TK MELATI KOLONO -> TK MELATI (Kolono)
    "2bm7ule1pzh2laqw7nhn": "sch_40405772",  # TKN MELATI MEKAR PUNG. -> TKN MELATI MEKAR (Laeya - Punggaluku)
    "2bm7ule3q3lb0cnydf": "sch_40405076",    # TKN WETULANGGARU -> TK NEGERI WETULANGGALARU (Benua)
    "2bm7ulegxiblas9n2ej": "sch_69913031",   # TK Melati Mekar Sukamukti -> TK Melati Mekar (Lalembuu)
    "2bm7ulexfv2lakikn2p": "sch_40404795",   # TKN PUTRA MANDIRI -> TK Putra Mandiri (Ranomeeto Barat)
}


async def run_matching(session: AsyncSession) -> dict[str, Any]:
    """Execute high-precision matching between simpeg.unit_kerja and master_sekolah."""
    # 1. Fetch SIMPEG unit_kerja under Dikbud
    res_simpeg = await session.execute(
        text("""
            SELECT id, unit_kerja, alamat 
            FROM simpeg.unit_kerja 
            WHERE instansi = 'nCxELyiYZBPCeF85N'
        """)
    )
    simpeg_rows = res_simpeg.fetchall()

    # 2. Fetch all sovereign schools from master_sekolah
    res_edu = await session.execute(
        text("""
            SELECT id, npsn, nama_sekolah, bentuk_pendidikan, status_sekolah, kecamatan, desa_kelurahan, alamat_jalan
            FROM master_sekolah
        """)
    )
    edu_rows = res_edu.fetchall()

    # Build lookup indices for master_sekolah
    edu_by_id = {r[0]: r for r in edu_rows}
    edu_by_norm: dict[str, list[Any]] = {}
    satap_edu: dict[int, list[Any]] = {}

    for r in edu_rows:
        norm = normalize_school_name(r[2])
        edu_by_norm.setdefault(norm, []).append(r)
        m = re.search(r"SATAP\s+(\d+)", norm)
        if m:
            satap_edu.setdefault(int(m.group(1)), []).append(r)

    matched_pairs: list[dict[str, str]] = []
    skipped_structural: list[tuple[str, str]] = []
    unmatched_simpeg: list[tuple[str, str]] = []

    for s_id, s_name, s_alamat in simpeg_rows:
        jenjang, status = classify_school(s_name)
        if status == "STRUKTURAL":
            skipped_structural.append((s_id, s_name))
            continue

        # Check manual exception mappings first
        if s_id in MANUAL_MAPPINGS:
            target_edu_id = MANUAL_MAPPINGS[s_id]
            if target_edu_id in edu_by_id:
                cand = edu_by_id[target_edu_id]
                matched_pairs.append({
                    "simpeg_id": s_id,
                    "simpeg_name": s_name,
                    "edu_id": cand[0],
                    "edu_npsn": cand[1],
                    "edu_name": cand[2],
                    "method": "Verified Exception Mapping",
                })
                continue

        norm_s = normalize_school_name(s_name)

        # Pass 1: Direct exact normalized match
        if norm_s in edu_by_norm and len(edu_by_norm[norm_s]) == 1:
            cand = edu_by_norm[norm_s][0]
            matched_pairs.append({
                "simpeg_id": s_id,
                "simpeg_name": s_name,
                "edu_id": cand[0],
                "edu_npsn": cand[1],
                "edu_name": cand[2],
                "method": "Direct Exact Match",
            })
            continue

        # Pass 2: SATAP match (SD-SMPN SATAP X -> links to SD SATAP X & SMP SATAP X)
        m_satap = re.search(r"SATAP\s+(\d+)", norm_s)
        if m_satap:
            num = int(m_satap.group(1))
            if num in satap_edu:
                for cand in satap_edu[num]:
                    matched_pairs.append({
                        "simpeg_id": s_id,
                        "simpeg_name": s_name,
                        "edu_id": cand[0],
                        "edu_npsn": cand[1],
                        "edu_name": cand[2],
                        "method": f"SATAP {num} Integrated Link",
                    })
                continue

        # Pass 3: TKN PEMBINA X vs TK NEGERI PEMBINA X
        if "PEMBINA" in norm_s:
            norm_pembina = norm_s.replace("TK PEMBINA", "TK NEGERI PEMBINA")
            if norm_pembina in edu_by_norm:
                for cand in edu_by_norm[norm_pembina]:
                    matched_pairs.append({
                        "simpeg_id": s_id,
                        "simpeg_name": s_name,
                        "edu_id": cand[0],
                        "edu_npsn": cand[1],
                        "edu_name": cand[2],
                        "method": "Pembina Normalization Match",
                    })
                continue

        # Pass 4: Dot variations (e.g. SP2 vs SP.2)
        norm_dot = norm_s.replace("SP2", "SP 2")
        if norm_dot in edu_by_norm:
            for cand in edu_by_norm[norm_dot]:
                matched_pairs.append({
                    "simpeg_id": s_id,
                    "simpeg_name": s_name,
                    "edu_id": cand[0],
                    "edu_npsn": cand[1],
                    "edu_name": cand[2],
                    "method": "Dot Variation Match",
                })
            continue

        # Pass 5: Bare names without TK prefix (e.g. WONUA SANGIA, DHARMA MULYA)
        if norm_s.startswith("TK ") and norm_s[3:] in edu_by_norm:
            cands = edu_by_norm[norm_s[3:]]
            if len(cands) == 1:
                cand = cands[0]
                matched_pairs.append({
                    "simpeg_id": s_id,
                    "simpeg_name": s_name,
                    "edu_id": cand[0],
                    "edu_npsn": cand[1],
                    "edu_name": cand[2],
                    "method": "Bare Name Match",
                })
                continue

        # Pass 6: Ambiguous candidate resolved by subdistrict / address
        if norm_s in edu_by_norm:
            kec = extract_kecamatan(s_name, s_alamat)
            if kec:
                cands = [c for c in edu_by_norm[norm_s] if (c[5] or "").upper() == kec.upper()]
                if len(cands) == 1:
                    cand = cands[0]
                    matched_pairs.append({
                        "simpeg_id": s_id,
                        "simpeg_name": s_name,
                        "edu_id": cand[0],
                        "edu_npsn": cand[1],
                        "edu_name": cand[2],
                        "method": "Kecamatan Resolved Match",
                    })
                    continue

        unmatched_simpeg.append((s_id, s_name))

    # 3. Perform bulk update into edusetara.master_sekolah
    print(f"Applying {len(matched_pairs)} matched school links to edusetara.master_sekolah...")
    for pair in matched_pairs:
        await session.execute(
            text("""
                UPDATE master_sekolah
                SET simpeg_unit_kerja_id = :simpeg_id, updated_at = NOW()
                WHERE id = :edu_id
            """),
            {"simpeg_id": pair["simpeg_id"], "edu_id": pair["edu_id"]},
        )

    await session.commit()

    unique_simpeg_matched = len(set(p["simpeg_id"] for p in matched_pairs))
    unique_edu_matched = len(set(p["edu_id"] for p in matched_pairs))

    stats = {
        "total_simpeg_rows": len(simpeg_rows),
        "skipped_structural": len(skipped_structural),
        "total_simpeg_schools": len(simpeg_rows) - len(skipped_structural),
        "unique_simpeg_matched": unique_simpeg_matched,
        "unique_edu_matched": unique_edu_matched,
        "unmatched_simpeg_count": len(unmatched_simpeg),
        "unmatched_simpeg": unmatched_simpeg,
        "match_percentage": (unique_simpeg_matched / (len(simpeg_rows) - len(skipped_structural))) * 100,
    }
    return stats


async def main() -> None:
    print("=" * 65)
    print("REKONSILIASI & MATCHING DATA: SIMPEG -> MASTER SEKOLAH (EDUSETERA)")
    print("=" * 65)
    async with edusetara_session_factory() as session:
        stats = await run_matching(session)

    print("\n--- RINGKASAN HASIL EKSEKUSI ---")
    print(f"Total Baris SIMPEG: {stats['total_simpeg_rows']}")
    print(f"Unit Struktural Diabaikan: {stats['skipped_structural']}")
    print(f"Total Target Sekolah SIMPEG: {stats['total_simpeg_schools']}")
    print(f"Berhasil Dicocokkan (SIMPEG): {stats['unique_simpeg_matched']} unit kerja ({stats['match_percentage']:.2f}%)")
    print(f"Total Sekolah Master (EduSetara) Terhubung: {stats['unique_edu_matched']} sekolah")
    print(f"Sisa SIMPEG Belum Cocok: {stats['unmatched_simpeg_count']} unit kerja")

    if stats["unmatched_simpeg"]:
        print("\nDaftar Unit Kerja SIMPEG yang belum cocok:")
        for s_id, s_name in stats["unmatched_simpeg"]:
            print(f" - [{s_id}] {s_name}")
    else:
        print("\n🎉 SEMPURNA: Seluruh (100%) unit kerja sekolah SIMPEG berhasil dipetakan!")


if __name__ == "__main__":
    asyncio.run(main())
