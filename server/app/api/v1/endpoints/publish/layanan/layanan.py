"""Public Layanan Publik endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.operational.berita import LayananPublik
from app.services.crud_service import CRUDBase

from .schema import (
    LayananPublikResponse,
    LayananPublikResponseList,
)

router = APIRouter()
crud_layanan = CRUDBase(LayananPublik)


@router.get("", response_model=LayananPublikResponseList)
@router.get("/", response_model=LayananPublikResponseList)
@router.get("/read", response_model=LayananPublikResponseList)
async def read_public_layanan(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    kategori: str | None = None,
):
    query = select(LayananPublik).where(
        or_(
            LayananPublik.status == "Aktif",
            LayananPublik.status.is_(None),
        )
    )

    if kategori:
        query = query.where(LayananPublik.kategori.ilike(f"%{kategori}%"))

    if search:
        query = query.where(
            or_(
                LayananPublik.nama_layanan.ilike(f"%{search}%"),
                LayananPublik.deskripsi.ilike(f"%{search}%"),
                LayananPublik.syarat.ilike(f"%{search}%"),
                LayananPublik.prosedur.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(LayananPublik.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=LayananPublikResponse)
async def get_public_layanan_by_id(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_layanan.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")
    return item
