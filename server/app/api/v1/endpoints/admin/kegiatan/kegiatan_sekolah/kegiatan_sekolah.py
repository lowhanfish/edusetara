"""Kegiatan Sekolah endpoints (matching master pattern)."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.kegiatan import KegiatanSekolah
from app.services.crud_service import CRUDBase

from .schema import (
    KegiatanSekolahCreate,
    KegiatanSekolahResponse,
    KegiatanSekolahResponseList,
    KegiatanSekolahUpdate,
)

router = APIRouter()
crud_kegiatan_sekolah = CRUDBase(KegiatanSekolah)


@router.get("/option", response_model=list[KegiatanSekolahResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(KegiatanSekolah)
    if search:
        query = query.where(
            or_(
                KegiatanSekolah.judul.ilike(f"%{search}%"),
                KegiatanSekolah.unit_kerja.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=KegiatanSekolahResponseList)
@router.get("/", response_model=KegiatanSekolahResponseList)
@router.get("/read", response_model=KegiatanSekolahResponseList)
async def read_kegiatan_sekolah(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(KegiatanSekolah)
    if search:
        query = query.where(
            or_(
                KegiatanSekolah.judul.ilike(f"%{search}%"),
                KegiatanSekolah.unit_kerja.ilike(f"%{search}%"),
                KegiatanSekolah.deskripsi.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(KegiatanSekolah.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=KegiatanSekolahResponse)
async def get_kegiatan_sekolah(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_kegiatan_sekolah.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=KegiatanSekolahResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=KegiatanSekolahResponse, status_code=status.HTTP_201_CREATED)
async def create_kegiatan_sekolah(
    payload: KegiatanSekolahCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_kegiatan_sekolah.create(db, obj_in=create_data)


@router.put("/{id}", response_model=KegiatanSekolahResponse)
@router.put("/update/{id}", response_model=KegiatanSekolahResponse)
async def update_kegiatan_sekolah(
    id: str,
    payload: KegiatanSekolahUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_kegiatan_sekolah.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_kegiatan_sekolah(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_kegiatan_sekolah.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
