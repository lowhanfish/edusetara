"""Public Banner Slide endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.operational.berita import BannerSlide
from app.services.crud_service import CRUDBase

from .schema import (
    BannerSlideResponse,
    BannerSlideResponseList,
)

router = APIRouter()
crud_banner = CRUDBase(BannerSlide)


@router.get("", response_model=BannerSlideResponseList)
@router.get("/", response_model=BannerSlideResponseList)
@router.get("/read", response_model=BannerSlideResponseList)
async def read_public_banner(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(BannerSlide).where(
        or_(
            BannerSlide.status == "Aktif",
            BannerSlide.status.is_(None),
        )
    )
    if search:
        query = query.where(
            or_(
                BannerSlide.title.ilike(f"%{search}%"),
                BannerSlide.subtitle.ilike(f"%{search}%"),
                BannerSlide.badge_text.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(BannerSlide.order_num.asc(), BannerSlide.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=BannerSlideResponse)
async def get_public_banner(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_banner.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data banner tidak ditemukan")
    return item
