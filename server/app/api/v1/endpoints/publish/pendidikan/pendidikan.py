"""Public Pendidikan Program & Artikel endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.operational.berita import PendidikanProgram
from app.services.crud_service import CRUDBase

from .schema import (
    PendidikanProgramResponse,
    PendidikanProgramResponseList,
)

router = APIRouter()
crud_pendidikan = CRUDBase(PendidikanProgram)


@router.get("", response_model=PendidikanProgramResponseList)
@router.get("/", response_model=PendidikanProgramResponseList)
@router.get("/read", response_model=PendidikanProgramResponseList)
async def read_public_pendidikan(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    kategori: str | None = None,
):
    query = select(PendidikanProgram).where(
        or_(
            PendidikanProgram.status == "Terbit",
            PendidikanProgram.status == "Aktif",
            PendidikanProgram.status.is_(None),
        )
    )

    if kategori:
        query = query.where(
            or_(
                PendidikanProgram.kategori.ilike(f"%{kategori}%"),
                PendidikanProgram.category.ilike(f"%{kategori}%"),
            )
        )

    if search:
        query = query.where(
            or_(
                PendidikanProgram.judul.ilike(f"%{search}%"),
                PendidikanProgram.name.ilike(f"%{search}%"),
                PendidikanProgram.penulis.ilike(f"%{search}%"),
                PendidikanProgram.konten.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(PendidikanProgram.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=PendidikanProgramResponse)
async def get_public_pendidikan_by_id(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_pendidikan.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data pendidikan tidak ditemukan")
    return item
