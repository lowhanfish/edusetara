"""Public Profil Section endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.operational.berita import ProfilSection
from app.services.crud_service import CRUDBase

from .schema import (
    ProfilSectionResponse,
    ProfilSectionResponseList,
)

router = APIRouter()
crud_profil = CRUDBase(ProfilSection)


@router.get("", response_model=ProfilSectionResponseList)
@router.get("/", response_model=ProfilSectionResponseList)
@router.get("/read", response_model=ProfilSectionResponseList)
async def read_public_profil(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    kategori: str | None = None,
):
    query = select(ProfilSection).where(
        or_(
            ProfilSection.status == "Aktif",
            ProfilSection.status.is_(None),
        )
    )

    if kategori:
        query = query.where(
            or_(
                ProfilSection.kategori.ilike(f"%{kategori}%"),
                ProfilSection.category.ilike(f"%{kategori}%"),
            )
        )

    if search:
        query = query.where(
            or_(
                ProfilSection.judul.ilike(f"%{search}%"),
                ProfilSection.title.ilike(f"%{search}%"),
                ProfilSection.konten.ilike(f"%{search}%"),
                ProfilSection.content.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(ProfilSection.urutan.asc(), ProfilSection.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=ProfilSectionResponse)
async def get_public_profil_by_id(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_profil.get(db, id=id)
    if not item:
        # Also try by category
        query = select(ProfilSection).where(
            or_(
                ProfilSection.kategori.ilike(id),
                ProfilSection.category.ilike(id),
            )
        )
        res = await db.execute(query)
        item = res.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Profil tidak ditemukan")
    return item
