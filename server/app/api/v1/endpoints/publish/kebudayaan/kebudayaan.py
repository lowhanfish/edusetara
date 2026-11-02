"""Public Kebudayaan endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.operational.berita import KebudayaanItem
from app.services.crud_service import CRUDBase

from .schema import (
    KebudayaanItemResponse,
    KebudayaanItemResponseList,
)

router = APIRouter()
crud_kebudayaan = CRUDBase(KebudayaanItem)


@router.get("", response_model=KebudayaanItemResponseList)
@router.get("/", response_model=KebudayaanItemResponseList)
@router.get("/read", response_model=KebudayaanItemResponseList)
async def read_public_kebudayaan(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    kategori: str | None = None,
):
    query = select(KebudayaanItem).where(
        or_(
            KebudayaanItem.status == "Terverifikasi",
            KebudayaanItem.status == "Aktif",
            KebudayaanItem.status.is_(None),
        )
    )

    if kategori:
        query = query.where(
            or_(
                KebudayaanItem.kategori.ilike(f"%{kategori}%"),
                KebudayaanItem.type.ilike(f"%{kategori}%"),
            )
        )

    if search:
        query = query.where(
            or_(
                KebudayaanItem.nama.ilike(f"%{search}%"),
                KebudayaanItem.name.ilike(f"%{search}%"),
                KebudayaanItem.lokasi.ilike(f"%{search}%"),
                KebudayaanItem.location.ilike(f"%{search}%"),
                KebudayaanItem.deskripsi.ilike(f"%{search}%"),
                KebudayaanItem.description.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(KebudayaanItem.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=KebudayaanItemResponse)
async def get_public_kebudayaan_by_id(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_kebudayaan.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data kebudayaan tidak ditemukan")
    return item
