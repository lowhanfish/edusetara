"""Gallery Sekolah Penggerak endpoints (matching master pattern)."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.gallery import GallerySekolahPenggerak
from app.services.crud_service import CRUDBase

from .schema import (
    SekolahPenggerakCreate,
    SekolahPenggerakResponse,
    SekolahPenggerakResponseList,
    SekolahPenggerakUpdate,
)

router = APIRouter()
crud_sekolah_penggerak = CRUDBase(GallerySekolahPenggerak)


@router.get("/option", response_model=list[SekolahPenggerakResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(GallerySekolahPenggerak)
    if search:
        query = query.where(
            or_(
                GallerySekolahPenggerak.judul.ilike(f"%{search}%"),
                GallerySekolahPenggerak.kategori.ilike(f"%{search}%"),
                GallerySekolahPenggerak.unit_kerja.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=SekolahPenggerakResponseList)
@router.get("/", response_model=SekolahPenggerakResponseList)
@router.get("/read", response_model=SekolahPenggerakResponseList)
async def read_sekolah_penggerak(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(GallerySekolahPenggerak)
    if search:
        query = query.where(
            or_(
                GallerySekolahPenggerak.judul.ilike(f"%{search}%"),
                GallerySekolahPenggerak.kategori.ilike(f"%{search}%"),
                GallerySekolahPenggerak.unit_kerja.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(GallerySekolahPenggerak.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=SekolahPenggerakResponse)
async def get_sekolah_penggerak(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_sekolah_penggerak.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=SekolahPenggerakResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=SekolahPenggerakResponse, status_code=status.HTTP_201_CREATED)
async def create_sekolah_penggerak(
    payload: SekolahPenggerakCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_sekolah_penggerak.create(db, obj_in=create_data)


@router.put("/{id}", response_model=SekolahPenggerakResponse)
@router.put("/update/{id}", response_model=SekolahPenggerakResponse)
async def update_sekolah_penggerak(
    id: str,
    payload: SekolahPenggerakUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_sekolah_penggerak.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_sekolah_penggerak(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_sekolah_penggerak.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
