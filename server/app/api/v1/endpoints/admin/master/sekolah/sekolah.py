"""Master Sekolah endpoints combining simpeg.unit_kerja and edusetara.master_sekolah_meta."""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.db.seed_sekolah_meta import sync_master_sekolah
from app.models.auth.user import User

from .schema import (
    SekolahLookupItem,
    SekolahResponse,
    SekolahResponseList,
    SekolahUpdate,
)

router = APIRouter(tags=["Admin Master Sekolah"])


def map_row_to_response(r: Any) -> dict[str, Any]:
    """Map raw tuple from cross-database query to SekolahResponse structure."""
    unit_id = r[0]
    raw_name = (r[1] or "").replace("\u200c", "").replace("\u200b", "").strip()
    alamat = r[2]
    jenjang = r[3]
    status_sekolah = r[4]
    npsn = r[5]
    akreditasi = r[6]
    kecamatan = r[7]
    desa_kelurahan = r[8]
    is_active = bool(r[9])
    created_at = r[10]
    updated_at = r[11]

    url = f"https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/{npsn}" if npsn else None

    return {
        "id": unit_id,
        "unit_kerja_id": unit_id,
        "nama_sekolah": raw_name,
        "name": raw_name,
        "alamat": alamat,
        "address": alamat,
        "jenjang": jenjang,
        "level": jenjang,
        "status_sekolah": status_sekolah,
        "status": status_sekolah,
        "npsn": npsn,
        "akreditasi": akreditasi,
        "kecamatan": kecamatan,
        "district": kecamatan or "-",
        "desa_kelurahan": desa_kelurahan,
        "village": desa_kelurahan or "-",
        "is_active": is_active,
        "url": url,
        "created_at": created_at,
        "updated_at": updated_at,
    }


@router.get("/lookup", response_model=list[SekolahLookupItem])
@router.get("/option", response_model=list[SekolahLookupItem])
async def option_sekolah(
    jenjang: str | None = Query(None, description="Filter jenjang (SD, SMP, TK, PAUD, PKBM)"),
    search: str | None = Query(None, description="Cari nama sekolah"),
    db: AsyncSession = Depends(get_db),
):
    """Dropdown lookup endpoint for school selection across modules."""
    where_clauses = ["u.instansi = 'nCxELyiYZBPCeF85N'", "u.status = 1", "m.is_active = 1"]
    params: dict[str, Any] = {}

    if jenjang:
        j_upper = jenjang.upper()
        if j_upper in ["SD", "SMP"]:
            where_clauses.append("m.jenjang IN (:jenjang, 'SATAP')")
        else:
            where_clauses.append("m.jenjang = :jenjang")
        params["jenjang"] = j_upper

    if search:
        where_clauses.append("u.unit_kerja LIKE :search")
        params["search"] = f"%{search}%"

    where_sql = " AND ".join(where_clauses)
    sql = text(f"""
        SELECT
            u.id,
            u.unit_kerja,
            m.jenjang,
            m.status_sekolah,
            m.kecamatan
        FROM simpeg.unit_kerja u
        INNER JOIN edusetara.master_sekolah_meta m ON u.id = m.unit_kerja_id
        WHERE {where_sql}
        ORDER BY u.unit_kerja ASC
        LIMIT 100
    """)

    result = await db.execute(sql, params)
    rows = result.fetchall()
    return [
        {
            "id": r[0],
            "unit_kerja_id": r[0],
            "nama": (r[1] or "").replace("\u200c", "").strip(),
            "jenjang": r[2],
            "status": r[3],
            "kecamatan": r[4],
        }
        for r in rows
    ]


@router.get("", response_model=SekolahResponseList)
@router.get("/", response_model=SekolahResponseList)
@router.get("/read", response_model=SekolahResponseList)
async def read_sekolah(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    search: str | None = Query(None),
    jenjang: str | None = Query(None, description="Jenjang (SD, SMP, TK, PAUD, SATAP, PKBM)"),
    status_sekolah: str | None = Query(None, description="Status (NEGERI, SWASTA)"),
    kecamatan: str | None = Query(None, description="Kecamatan"),
    include_satap: bool = Query(True, description="Sertakan SATAP jika filter SD atau SMP"),
    db: AsyncSession = Depends(get_db),
):
    """
    Paginated list of schools from simpeg.unit_kerja joined with edusetara.master_sekolah_meta.
    """
    where_clauses = ["u.instansi = 'nCxELyiYZBPCeF85N'", "u.status = 1"]
    params: dict[str, Any] = {"skip": skip, "limit": limit}

    if jenjang:
        j_upper = jenjang.upper()
        if include_satap and j_upper in ["SD", "SMP"]:
            where_clauses.append("m.jenjang IN (:jenjang, 'SATAP')")
        else:
            where_clauses.append("m.jenjang = :jenjang")
        params["jenjang"] = j_upper

    if status_sekolah and status_sekolah.upper() != "SEMUA":
        where_clauses.append("m.status_sekolah = :status_sekolah")
        params["status_sekolah"] = status_sekolah.upper()

    if kecamatan and kecamatan.upper() != "SEMUA":
        where_clauses.append("m.kecamatan = :kecamatan")
        params["kecamatan"] = kecamatan

    if search:
        where_clauses.append(
            "("
            "u.unit_kerja LIKE :search OR "
            "m.npsn LIKE :search OR "
            "m.kecamatan LIKE :search OR "
            "u.alamat LIKE :search"
            ")"
        )
        params["search"] = f"%{search}%"

    where_sql = " AND ".join(where_clauses)

    count_sql = text(f"""
        SELECT COUNT(*)
        FROM simpeg.unit_kerja u
        INNER JOIN edusetara.master_sekolah_meta m ON u.id = m.unit_kerja_id
        WHERE {where_sql}
    """)
    total_result = await db.execute(count_sql, params)
    total = total_result.scalar_one_or_none() or 0

    data_sql = text(f"""
        SELECT
            u.id,
            u.unit_kerja,
            u.alamat,
            m.jenjang,
            m.status_sekolah,
            m.npsn,
            m.akreditasi,
            m.kecamatan,
            m.desa_kelurahan,
            m.is_active,
            m.created_at,
            m.updated_at
        FROM simpeg.unit_kerja u
        INNER JOIN edusetara.master_sekolah_meta m ON u.id = m.unit_kerja_id
        WHERE {where_sql}
        ORDER BY u.unit_kerja ASC
        LIMIT :limit OFFSET :skip
    """)
    result = await db.execute(data_sql, params)
    rows = result.fetchall()

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": [map_row_to_response(r) for r in rows],
    }


@router.get("/{unit_kerja_id}", response_model=SekolahResponse)
async def get_sekolah_detail(
    unit_kerja_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve single school detail with merged SIMPEG identity and EduSetara metadata."""
    sql = text("""
        SELECT
            u.id,
            u.unit_kerja,
            u.alamat,
            m.jenjang,
            m.status_sekolah,
            m.npsn,
            m.akreditasi,
            m.kecamatan,
            m.desa_kelurahan,
            m.is_active,
            m.created_at,
            m.updated_at
        FROM simpeg.unit_kerja u
        INNER JOIN edusetara.master_sekolah_meta m ON u.id = m.unit_kerja_id
        WHERE u.id = :id
    """)
    result = await db.execute(sql, {"id": unit_kerja_id})
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Data sekolah tidak ditemukan")
    return map_row_to_response(row)


@router.put("/{unit_kerja_id}", response_model=SekolahResponse)
@router.put("/update/{unit_kerja_id}", response_model=SekolahResponse)
async def update_sekolah_meta(
    unit_kerja_id: str,
    payload: SekolahUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update metadata attributes of a school in master_sekolah_meta.
    Does NOT modify simpeg.unit_kerja.
    """
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return await get_sekolah_detail(unit_kerja_id, db)

    set_clauses = ["updated_at = NOW()"]
    params: dict[str, Any] = {"id": unit_kerja_id}

    for key, val in update_data.items():
        set_clauses.append(f"{key} = :{key}")
        params[key] = val

    set_sql = ", ".join(set_clauses)
    sql = text(f"""
        UPDATE edusetara.master_sekolah_meta
        SET {set_sql}
        WHERE unit_kerja_id = :id
    """)
    await db.execute(sql, params)
    await db.commit()

    return await get_sekolah_detail(unit_kerja_id, db)


@router.post("/sync", status_code=status.HTTP_200_OK)
async def sync_sekolah_from_simpeg(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Manually trigger synchronization of schools from simpeg.unit_kerja."""
    stats = await sync_master_sekolah(db)
    return {
        "success": True,
        "message": f"Berhasil mensinkronkan {stats['processed_schools']} sekolah dari SIMPEG",
        "data": stats,
    }
