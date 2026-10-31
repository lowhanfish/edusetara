"""Master Wilayah endpoints reading official regional data from egov database."""

from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db

from .schema import DesaKelurahanItem, KecamatanItem

router = APIRouter(tags=["Admin Master Wilayah"])


@router.get("/kecamatan", response_model=list[KecamatanItem])
async def get_kecamatan_list(
    db: AsyncSession = Depends(get_db),
) -> list[dict[str, Any]]:
    """
    Get all subdistricts (kecamatan) in Kabupaten Konawe Selatan (kabupaten_id = 7405).
    """
    sql = text("""
        SELECT kecamatan_id, kode_kecamatan, nama_kecamatan
        FROM egov.master_kecamatan
        WHERE kabupaten_id = 7405
        ORDER BY nama_kecamatan ASC
    """)
    result = await db.execute(sql)
    rows = result.fetchall()

    return [
        {
            "id": r[0],
            "kode": r[1],
            "nama": r[2],
            "label": (r[2] or "").title(),
        }
        for r in rows
    ]


@router.get("/desa-kelurahan", response_model=list[DesaKelurahanItem])
async def get_desa_kelurahan_list(
    kecamatan_id: int | None = Query(None, description="Filter desa/kelurahan berdasarkan ID Kecamatan"),
    db: AsyncSession = Depends(get_db),
) -> list[dict[str, Any]]:
    """
    Get all villages/wards (desa & kelurahan) in Kabupaten Konawe Selatan,
    optionally filtered by kecamatan_id.
    """
    where_clauses = ["k.kabupaten_id = 7405"]
    params: dict[str, Any] = {}

    if kecamatan_id is not None:
        where_clauses.append("d.kecamatan_id = :kecamatan_id")
        params["kecamatan_id"] = kecamatan_id

    where_sql = " AND ".join(where_clauses)
    sql = text(f"""
        SELECT d.des_kel_id, d.kecamatan_id, d.kode_des_kel, d.nama_des_kel
        FROM egov.master_des_kel d
        JOIN egov.master_kecamatan k ON d.kecamatan_id = k.kecamatan_id
        WHERE {where_sql}
        ORDER BY d.nama_des_kel ASC
    """)
    result = await db.execute(sql, params)
    rows = result.fetchall()

    return [
        {
            "id": r[0],
            "kecamatan_id": r[1],
            "kode": r[2],
            "nama": r[3],
            "label": (r[3] or "").title(),
        }
        for r in rows
    ]
