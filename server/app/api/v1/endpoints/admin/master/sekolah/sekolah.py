"""Master Sekolah endpoints powered by sovereign edusetara.master_sekolah dataset."""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.db.seed_master_sekolah import import_schools_from_excel
from app.models.auth.user import User

from .schema import (
    SekolahLookupItem,
    SekolahResponse,
    SekolahResponseList,
    SekolahUpdate,
)

router = APIRouter(tags=["Admin Master Sekolah"])


def map_row_to_response(r: Any) -> dict[str, Any]:
    """Map row from master_sekolah table to SekolahResponse structure."""
    sid = r[0]
    npsn = r[1]
    nama_sekolah = (r[2] or "").replace("\u200c", "").replace("\u200b", "").strip()
    bentuk_pendidikan = r[3]
    status_sekolah = r[4]
    akreditasi = r[5]
    kecamatan_id = r[6]
    kecamatan = r[7]
    desa_kelurahan_id = r[8]
    desa_kelurahan = r[9]
    alamat_jalan = r[10]
    dusun = r[11]
    kode_pos = r[12]
    latitude = r[13]
    longitude = r[14]
    simpeg_unit_kerja_id = r[15]
    is_active = bool(r[16])
    created_at = r[17]
    updated_at = r[18]
    simpeg_unit_kerja_nama = r[19] if len(r) > 19 else None

    url = f"https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/{npsn}" if npsn else None

    return {
        "id": sid,
        "npsn": npsn,
        "nama_sekolah": nama_sekolah,
        "name": nama_sekolah,
        "bentuk_pendidikan": bentuk_pendidikan,
        "jenjang": bentuk_pendidikan,
        "level": bentuk_pendidikan,
        "status_sekolah": status_sekolah,
        "status": status_sekolah,
        "akreditasi": akreditasi,
        "kecamatan_id": kecamatan_id,
        "kecamatan": kecamatan,
        "district": kecamatan or "-",
        "desa_kelurahan_id": desa_kelurahan_id,
        "desa_kelurahan": desa_kelurahan,
        "village": desa_kelurahan or "-",
        "alamat_jalan": alamat_jalan,
        "alamat": alamat_jalan,
        "address": alamat_jalan,
        "dusun": dusun,
        "kode_pos": kode_pos,
        "latitude": latitude,
        "longitude": longitude,
        "simpeg_unit_kerja_id": simpeg_unit_kerja_id,
        "simpeg_unit_kerja_nama": simpeg_unit_kerja_nama,
        "unit_kerja_id": simpeg_unit_kerja_id or sid,
        "is_active": is_active,
        "url": url,
        "created_at": created_at,
        "updated_at": updated_at,
    }


@router.get("/lookup", response_model=list[SekolahLookupItem])
@router.get("/option", response_model=list[SekolahLookupItem])
async def option_sekolah(
    jenjang: str | None = Query(None, description="Filter jenjang (SD, SMP, TK, PAUD, PKBM, dll)"),
    search: str | None = Query(None, description="Cari nama sekolah atau NPSN"),
    db: AsyncSession = Depends(get_db),
):
    """Dropdown lookup endpoint for school selection across modules."""
    where_clauses = ["is_active = 1"]
    params: dict[str, Any] = {}

    if jenjang:
        j_upper = jenjang.upper()
        if j_upper in ["SD", "SMP"]:
            where_clauses.append("bentuk_pendidikan IN (:jenjang, 'SATAP')")
        elif j_upper in ["TK", "PAUD"]:
            where_clauses.append("bentuk_pendidikan IN ('TK', 'KB', 'PAUD', 'RA', 'SPS')")
        elif j_upper in ["PKBM", "SKB"]:
            where_clauses.append("bentuk_pendidikan IN ('PKBM', 'SKB', 'KURSUS')")
        else:
            where_clauses.append("bentuk_pendidikan = :jenjang")
        params["jenjang"] = j_upper

    if search:
        where_clauses.append("(nama_sekolah LIKE :search OR npsn LIKE :search)")
        params["search"] = f"%{search}%"

    where_sql = " AND ".join(where_clauses)
    sql = text(f"""
        SELECT
            id,
            npsn,
            nama_sekolah,
            bentuk_pendidikan,
            status_sekolah,
            kecamatan,
            simpeg_unit_kerja_id,
            simpeg_unit_kerja_nama
        FROM master_sekolah
        WHERE {where_sql}
        ORDER BY nama_sekolah ASC
        LIMIT 100
    """)

    result = await db.execute(sql, params)
    rows = result.fetchall()
    return [
        {
            "id": r[0],
            "npsn": r[1],
            "nama": (r[2] or "").replace("\u200c", "").strip(),
            "bentuk_pendidikan": r[3],
            "jenjang": r[3],
            "status": r[4],
            "kecamatan": r[5],
            "simpeg_unit_kerja_id": r[6],
            "simpeg_unit_kerja_nama": r[7] if len(r) > 7 else None,
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
    jenjang: str | None = Query(None, description="Jenjang (SD, SMP, TK, PAUD, SATAP, PKBM, dll)"),
    status_sekolah: str | None = Query(None, description="Status (NEGERI, SWASTA)"),
    kecamatan: str | None = Query(None, description="Nama Kecamatan"),
    kecamatan_id: int | None = Query(None, description="ID Kecamatan"),
    db: AsyncSession = Depends(get_db),
):
    """
    Paginated list of schools from sovereign master_sekolah database.
    """
    where_clauses = ["is_active = 1"]
    params: dict[str, Any] = {"skip": skip, "limit": limit}

    if jenjang and jenjang.upper() != "SEMUA":
        j_upper = jenjang.upper()
        if j_upper in ["SD"]:
            where_clauses.append("bentuk_pendidikan IN ('SD', 'MI', 'SATAP')")
        elif j_upper in ["SMP"]:
            where_clauses.append("bentuk_pendidikan IN ('SMP', 'MTS', 'SATAP')")
        elif j_upper in ["TK", "PAUD"]:
            where_clauses.append("bentuk_pendidikan IN ('TK', 'KB', 'RA', 'SPS')")
        elif j_upper in ["PKBM"]:
            where_clauses.append("bentuk_pendidikan IN ('PKBM', 'SKB', 'KURSUS')")
        else:
            where_clauses.append("bentuk_pendidikan = :jenjang")
        params["jenjang"] = j_upper

    if status_sekolah and status_sekolah.upper() != "SEMUA":
        where_clauses.append("status_sekolah = :status_sekolah")
        params["status_sekolah"] = status_sekolah.upper()

    if kecamatan_id:
        where_clauses.append("kecamatan_id = :kecamatan_id")
        params["kecamatan_id"] = kecamatan_id
    elif kecamatan and kecamatan.upper() != "SEMUA":
        where_clauses.append("kecamatan = :kecamatan")
        params["kecamatan"] = kecamatan

    if search:
        where_clauses.append(
            "("
            "nama_sekolah LIKE :search OR "
            "npsn LIKE :search OR "
            "kecamatan LIKE :search OR "
            "desa_kelurahan LIKE :search OR "
            "alamat_jalan LIKE :search"
            ")"
        )
        params["search"] = f"%{search}%"

    where_sql = " AND ".join(where_clauses)

    count_sql = text(f"""
        SELECT COUNT(*)
        FROM master_sekolah
        WHERE {where_sql}
    """)
    total_result = await db.execute(count_sql, params)
    total = total_result.scalar_one_or_none() or 0

    data_sql = text(f"""
        SELECT
            id,
            npsn,
            nama_sekolah,
            bentuk_pendidikan,
            status_sekolah,
            akreditasi,
            kecamatan_id,
            kecamatan,
            desa_kelurahan_id,
            desa_kelurahan,
            alamat_jalan,
            dusun,
            kode_pos,
            latitude,
            longitude,
            simpeg_unit_kerja_id,
            is_active,
            created_at,
            updated_at,
            simpeg_unit_kerja_nama
        FROM master_sekolah
        WHERE {where_sql}
        ORDER BY nama_sekolah ASC
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


@router.get("/{sekolah_id}", response_model=SekolahResponse)
async def get_sekolah_detail(
    sekolah_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve single school detail by ID or NPSN."""
    sql = text("""
        SELECT
            id,
            npsn,
            nama_sekolah,
            bentuk_pendidikan,
            status_sekolah,
            akreditasi,
            kecamatan_id,
            kecamatan,
            desa_kelurahan_id,
            desa_kelurahan,
            alamat_jalan,
            dusun,
            kode_pos,
            latitude,
            longitude,
            simpeg_unit_kerja_id,
            is_active,
            created_at,
            updated_at,
            simpeg_unit_kerja_nama
        FROM master_sekolah
        WHERE id = :id OR npsn = :id
    """)
    result = await db.execute(sql, {"id": sekolah_id})
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Data sekolah tidak ditemukan")
    return map_row_to_response(row)


@router.put("/{sekolah_id}", response_model=SekolahResponse)
@router.put("/update/{sekolah_id}", response_model=SekolahResponse)
async def update_sekolah(
    sekolah_id: str,
    payload: SekolahUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update attributes of a school in master_sekolah.
    Supports updating simpeg_unit_kerja_id, simpeg_unit_kerja_nama, wilayah, or spatial coordinates.
    """
    update_data = payload.model_dump(exclude_unset=True)
    if "jenjang" in update_data and not update_data.get("bentuk_pendidikan"):
        update_data["bentuk_pendidikan"] = update_data.pop("jenjang")
    elif "jenjang" in update_data:
        update_data.pop("jenjang")

    # If simpeg_unit_kerja_id is updated without explicit simpeg_unit_kerja_nama, auto-resolve name from SIMPEG
    if "simpeg_unit_kerja_id" in update_data and not update_data.get("simpeg_unit_kerja_nama"):
        simpeg_id = update_data["simpeg_unit_kerja_id"]
        if simpeg_id:
            try:
                res_u = await db.execute(
                    text("SELECT unit_kerja FROM simpeg.unit_kerja WHERE id = :uid"),
                    {"uid": simpeg_id},
                )
                u_row = res_u.fetchone()
                if u_row and u_row[0]:
                    clean_u = (u_row[0] or "").replace("\u200c", "").replace("\u200b", "").strip()
                    update_data["simpeg_unit_kerja_nama"] = clean_u
            except Exception:
                pass
        else:
            update_data["simpeg_unit_kerja_nama"] = None

    if not update_data:
        return await get_sekolah_detail(sekolah_id, db)

    set_clauses = ["updated_at = NOW()"]
    params: dict[str, Any] = {"id": sekolah_id}

    for key, val in update_data.items():
        set_clauses.append(f"{key} = :{key}")
        params[key] = val

    set_sql = ", ".join(set_clauses)
    sql = text(f"""
        UPDATE master_sekolah
        SET {set_sql}
        WHERE id = :id OR npsn = :id
    """)
    await db.execute(sql, params)
    await db.commit()

    return await get_sekolah_detail(sekolah_id, db)


@router.post("/sync", status_code=status.HTTP_200_OK)
async def sync_sekolah_from_excel(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Trigger re-synchronization of schools from official Dapodik Excel dataset."""
    stats = await import_schools_from_excel(db)
    return {
        "success": True,
        "message": f"Berhasil mengimpor {stats['imported_schools']} sekolah resmi Dapodik",
        "data": stats,
    }
