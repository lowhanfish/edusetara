"""Public directory backed by the same active master schools as the admin."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db

router = APIRouter()

@router.get("")
async def read_public_schools(
    skip: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
):
    total = (await db.execute(text("SELECT COUNT(*) FROM master_sekolah WHERE is_active = 1"))).scalar_one()
    rows = (await db.execute(text("""
        SELECT id, npsn, nama_sekolah, bentuk_pendidikan, status_sekolah,
               kecamatan, desa_kelurahan, alamat_jalan
        FROM master_sekolah WHERE is_active = 1
        ORDER BY nama_sekolah, id LIMIT :limit OFFSET :skip
    """), {"limit": limit, "skip": skip})).mappings().all()
    return {"total": total, "skip": skip, "limit": limit, "data": [dict(row) for row in rows]}
