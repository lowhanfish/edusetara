"""Public Statistik Item endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.operational.berita import StatistikItem
from app.services.crud_service import CRUDBase

from .schema import (
    StatistikItemResponse,
    StatistikItemResponseList,
)

router = APIRouter()
crud_statistik = CRUDBase(StatistikItem)


@router.get("", response_model=StatistikItemResponseList)
@router.get("/", response_model=StatistikItemResponseList)
@router.get("/read", response_model=StatistikItemResponseList)
async def read_public_statistik(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    kategori: str | None = None,
):
    query = select(StatistikItem)

    if kategori:
        query = query.where(
            or_(
                StatistikItem.kategori.ilike(f"%{kategori}%"),
                StatistikItem.category.ilike(f"%{kategori}%"),
            )
        )

    if search:
        query = query.where(
            or_(
                StatistikItem.indikator.ilike(f"%{search}%"),
                StatistikItem.indicator.ilike(f"%{search}%"),
                StatistikItem.keterangan.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(StatistikItem.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=StatistikItemResponse)
async def get_public_statistik_by_id(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_statistik.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data statistik tidak ditemukan")
    return item
