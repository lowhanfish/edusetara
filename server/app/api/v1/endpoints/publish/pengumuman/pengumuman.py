"""Public Pengumuman endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.operational.berita import PengumumanPublish
from app.services.crud_service import CRUDBase

from .schema import (
    PengumumanPublishResponse,
    PengumumanPublishResponseList,
)

router = APIRouter()
crud_pengumuman = CRUDBase(PengumumanPublish)


@router.get("", response_model=PengumumanPublishResponseList)
@router.get("/", response_model=PengumumanPublishResponseList)
@router.get("/read", response_model=PengumumanPublishResponseList)
async def read_public_pengumuman(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    kategori: str | None = None,
    is_important: bool | None = None,
):
    query = select(PengumumanPublish).where(
        or_(
            PengumumanPublish.status == "Aktif",
            PengumumanPublish.status == "Terbit",
            PengumumanPublish.status.is_(None),
        )
    )

    if kategori:
        query = query.where(PengumumanPublish.kategori.ilike(f"%{kategori}%"))

    if is_important is not None:
        query = query.where(PengumumanPublish.is_important == is_important)

    if search:
        query = query.where(
            or_(
                PengumumanPublish.judul.ilike(f"%{search}%"),
                PengumumanPublish.nomor.ilike(f"%{search}%"),
                PengumumanPublish.ringkasan.ilike(f"%{search}%"),
                PengumumanPublish.isi.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(PengumumanPublish.is_important.desc(), PengumumanPublish.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/slug/{slug}", response_model=PengumumanPublishResponse)
async def get_public_pengumuman_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    query = select(PengumumanPublish).where(
        or_(
            PengumumanPublish.slug == slug,
            PengumumanPublish.id == slug,
        )
    )
    result = await db.execute(query)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Pengumuman tidak ditemukan")
    return item


@router.get("/{id}", response_model=PengumumanPublishResponse)
async def get_public_pengumuman_by_id(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_pengumuman.get(db, id=id)
    if not item:
        query = select(PengumumanPublish).where(PengumumanPublish.slug == id)
        res = await db.execute(query)
        item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Pengumuman tidak ditemukan")
    return item
