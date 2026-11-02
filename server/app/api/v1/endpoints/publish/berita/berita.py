"""Public Berita endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.operational.berita import Berita
from app.services.crud_service import CRUDBase

from .schema import (
    BeritaResponse,
    BeritaResponseList,
)

router = APIRouter()
crud_berita = CRUDBase(Berita)


@router.get("", response_model=BeritaResponseList)
@router.get("/", response_model=BeritaResponseList)
@router.get("/read", response_model=BeritaResponseList)
async def read_public_berita(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    kategori: str | None = None,
    featured: bool | None = None,
):
    query = select(Berita).where(
        or_(
            Berita.status == "Terbit",
            Berita.status == "Aktif",
            Berita.status.is_(None),
        )
    )

    if kategori:
        query = query.where(Berita.kategori.ilike(f"%{kategori}%"))

    if featured is not None:
        query = query.where(Berita.featured == featured)

    if search:
        query = query.where(
            or_(
                Berita.judul.ilike(f"%{search}%"),
                Berita.deskripsi.ilike(f"%{search}%"),
                Berita.isi.ilike(f"%{search}%"),
                Berita.sumber.ilike(f"%{search}%"),
                Berita.kategori.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(Berita.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/featured", response_model=list[BeritaResponse])
async def get_featured_berita(
    db: AsyncSession = Depends(get_db),
    limit: int = 5,
):
    query = (
        select(Berita)
        .where(
            Berita.featured == True,
            or_(
                Berita.status == "Terbit",
                Berita.status == "Aktif",
                Berita.status.is_(None),
            ),
        )
        .order_by(Berita.created_at.desc())
        .limit(limit)
    )
    result = await db.execute(query)
    items = list(result.scalars().all())
    if not items:
        # Fallback to latest items if none marked as featured
        fallback_query = select(Berita).order_by(Berita.created_at.desc()).limit(limit)
        fallback_res = await db.execute(fallback_query)
        items = list(fallback_res.scalars().all())
    return items


@router.get("/slug/{slug}", response_model=BeritaResponse)
async def get_public_berita_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    query = select(Berita).where(
        or_(
            Berita.slug == slug,
            Berita.id == slug,
        )
    )
    result = await db.execute(query)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return item


@router.get("/{id}", response_model=BeritaResponse)
async def get_public_berita_by_id(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_berita.get(db, id=id)
    if not item:
        # Also try by slug if not found by UUID
        query = select(Berita).where(Berita.slug == id)
        res = await db.execute(query)
        item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return item
