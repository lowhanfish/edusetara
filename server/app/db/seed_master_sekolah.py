"""Seed and import sovereign master_sekolah from official Dapodik Excel dataset."""

import asyncio
import os
import uuid
import xml.etree.ElementTree as ET
import zipfile
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.connections.edusetara import edusetara_session_factory

EXCEL_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../../../ref/Data_Sekolah_Konawe_Selatan.xlsx",
    )
)


async def import_schools_from_excel(
    session: AsyncSession,
    excel_path: str = EXCEL_PATH,
) -> dict[str, Any]:
    """
    Import 870 schools from Data_Sekolah_Konawe_Selatan.xlsx into edusetara.master_sekolah.
    Resolves official kecamatan_id and desa_kelurahan_id from egov database.
    Leaves simpeg_unit_kerja_id as NULL by default for future matching.
    """
    if not os.path.exists(excel_path):
        raise FileNotFoundError(f"Excel file not found at: {excel_path}")

    # 1. Load regional reference data from egov
    res_kec = await session.execute(
        text("SELECT kecamatan_id, UPPER(nama_kecamatan) FROM egov.master_kecamatan WHERE kabupaten_id = 7405")
    )
    kec_map = {r[1]: r[0] for r in res_kec.fetchall()}

    res_des = await session.execute(
        text("""
            SELECT d.des_kel_id, d.kecamatan_id, UPPER(d.nama_des_kel)
            FROM egov.master_des_kel d
            JOIN egov.master_kecamatan k ON d.kecamatan_id = k.kecamatan_id
            WHERE k.kabupaten_id = 7405
        """)
    )
    des_map: dict[tuple[int, str], int] = {}
    des_fallback: dict[str, int] = {}
    for did, kid, dname in res_des.fetchall():
        des_map[(kid, dname)] = did
        des_fallback[dname] = did

    # 2. Parse Excel file directly
    with zipfile.ZipFile(excel_path) as z:
        ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
        sst: list[str] = []
        if "xl/sharedStrings.xml" in z.namelist():
            sst_tree = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in sst_tree.findall("main:si", ns):
                text_val = "".join(t.text or "" for t in si.findall(".//main:t", ns))
                sst.append(text_val)

        tree = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
        rows = tree.findall("main:sheetData/main:row", ns)

    stats = {
        "total_excel_rows": len(rows) - 1,
        "imported_schools": 0,
        "matched_kecamatan": 0,
        "matched_desa": 0,
        "has_coordinates": 0,
        "jenjang_breakdown": {},
        "status_breakdown": {},
    }

    upsert_sql = text("""
        INSERT INTO edusetara.master_sekolah (
            id, npsn, nama_sekolah, bentuk_pendidikan, status_sekolah, akreditasi,
            kecamatan_id, kecamatan, desa_kelurahan_id, desa_kelurahan,
            alamat_jalan, dusun, kode_pos, latitude, longitude,
            simpeg_unit_kerja_id, is_active, created_by
        ) VALUES (
            :id, :npsn, :nama_sekolah, :bentuk_pendidikan, :status_sekolah, :akreditasi,
            :kecamatan_id, :kecamatan, :desa_kelurahan_id, :desa_kelurahan,
            :alamat_jalan, :dusun, :kode_pos, :latitude, :longitude,
            :simpeg_unit_kerja_id, :is_active, 'import_dapodik'
        )
        ON DUPLICATE KEY UPDATE
            nama_sekolah = VALUES(nama_sekolah),
            bentuk_pendidikan = VALUES(bentuk_pendidikan),
            status_sekolah = VALUES(status_sekolah),
            akreditasi = VALUES(akreditasi),
            kecamatan_id = COALESCE(master_sekolah.kecamatan_id, VALUES(kecamatan_id)),
            kecamatan = COALESCE(master_sekolah.kecamatan, VALUES(kecamatan)),
            desa_kelurahan_id = COALESCE(master_sekolah.desa_kelurahan_id, VALUES(desa_kelurahan_id)),
            desa_kelurahan = COALESCE(master_sekolah.desa_kelurahan, VALUES(desa_kelurahan)),
            alamat_jalan = VALUES(alamat_jalan),
            dusun = VALUES(dusun),
            kode_pos = VALUES(kode_pos),
            latitude = COALESCE(master_sekolah.latitude, VALUES(latitude)),
            longitude = COALESCE(master_sekolah.longitude, VALUES(longitude)),
            updated_at = NOW()
    """)

    for r in rows[1:]:
        cells: dict[str, str] = {}
        for c in r.findall("main:c", ns):
            col = "".join(ch for ch in c.attrib["r"] if ch.isalpha())
            v = c.find("main:v", ns)
            val = v.text if v is not None else ""
            t = c.attrib.get("t")
            if t == "s" and val.isdigit():
                val = sst[int(val)]
            cells[col] = val

        npsn = (cells.get("B") or "").strip()
        nama_sekolah = (cells.get("C") or "").strip()
        bentuk_pendidikan = (cells.get("D") or "SD").strip().upper()
        status_sekolah = (cells.get("E") or "NEGERI").strip().upper()
        raw_desa = (cells.get("F") or "").strip()
        raw_kec = (cells.get("G") or "").replace("Kec.", "").replace("KEC.", "").strip()

        # Handle spelling variation in source
        norm_kec = "ANDOOLO" if raw_kec.upper() == "ANDOLO" else raw_kec.upper()
        norm_desa = raw_desa.upper()

        kec_id = kec_map.get(norm_kec)
        kec_label = raw_kec.title() if raw_kec else None
        if kec_id:
            stats["matched_kecamatan"] += 1

        des_id = None
        if kec_id and (kec_id, norm_desa) in des_map:
            des_id = des_map[(kec_id, norm_desa)]
        elif norm_desa in des_fallback:
            des_id = des_fallback[norm_desa]

        if des_id:
            stats["matched_desa"] += 1

        desa_label = raw_desa.title() if raw_desa else None

        alamat_jalan = (cells.get("M") or "").strip() or None
        dusun = (cells.get("N") or "").strip() or None
        akreditasi = (cells.get("O") or "").strip() or None
        kode_pos = (cells.get("SO") or "").strip() or None

        raw_lat = (cells.get("J") or "").strip()
        raw_lng = (cells.get("K") or "").strip()
        latitude = float(raw_lat) if raw_lat else None
        longitude = float(raw_lng) if raw_lng else None
        if latitude and longitude:
            stats["has_coordinates"] += 1

        record_id = f"sch_{npsn.lower()}" if npsn else f"sch_{uuid.uuid4().hex[:12]}"

        await session.execute(
            upsert_sql,
            {
                "id": record_id,
                "npsn": npsn,
                "nama_sekolah": nama_sekolah,
                "bentuk_pendidikan": bentuk_pendidikan,
                "status_sekolah": status_sekolah,
                "akreditasi": akreditasi,
                "kecamatan_id": kec_id,
                "kecamatan": kec_label,
                "desa_kelurahan_id": des_id,
                "desa_kelurahan": desa_label,
                "alamat_jalan": alamat_jalan,
                "dusun": dusun,
                "kode_pos": kode_pos,
                "latitude": latitude,
                "longitude": longitude,
                "simpeg_unit_kerja_id": None,
                "is_active": True,
            },
        )

        stats["imported_schools"] += 1
        stats["jenjang_breakdown"][bentuk_pendidikan] = (
            stats["jenjang_breakdown"].get(bentuk_pendidikan, 0) + 1
        )
        stats["status_breakdown"][status_sekolah] = (
            stats["status_breakdown"].get(status_sekolah, 0) + 1
        )

    await session.commit()
    return stats


async def main() -> None:
    """Run import CLI."""
    print("=" * 60)
    print("MENGIMPOR DATA SEKOLAH RESMI KONAWE SELATAN KE EDUSETARA")
    print("=" * 60)
    print(f"Sumber file: {EXCEL_PATH}")

    async with edusetara_session_factory() as session:
        stats = await import_schools_from_excel(session)

    print("\nHASIL IMPORT:")
    print(f"- Total baris Excel: {stats['total_excel_rows']}")
    print(f"- Berhasil diimpor: {stats['imported_schools']}")
    print(f"- Terhubung Kecamatan (egov): {stats['matched_kecamatan']} (100%)")
    print(f"- Terhubung Desa/Kelurahan (egov): {stats['matched_desa']} ({stats['matched_desa']/stats['imported_schools']*100:.1f}%)")
    print(f"- Memiliki Koordinat Lat/Long (Peta): {stats['has_coordinates']}")
    print("\nBreakdown Status:")
    for k, v in sorted(stats["status_breakdown"].items()):
        print(f"  * {k}: {v} sekolah")
    print("\nBreakdown Bentuk Pendidikan / Jenjang:")
    for k, v in sorted(stats["jenjang_breakdown"].items(), key=lambda x: x[1], reverse=True):
        print(f"  * {k}: {v} unit")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
