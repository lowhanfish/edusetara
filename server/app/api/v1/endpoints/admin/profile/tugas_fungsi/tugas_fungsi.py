"""Profile Tugas dan Fungsi endpoints (matching master pattern)."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.profile import ProfileTugasFungsi
from app.services.crud_service import CRUDBase

from .schema import (
    TugasFungsiCreate,
    TugasFungsiResponse,
    TugasFungsiResponseList,
    TugasFungsiUpdate,
)

router = APIRouter()
crud_tugas_fungsi = CRUDBase(ProfileTugasFungsi)


@router.get("/option", response_model=list[TugasFungsiResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    """Mengambil daftar opsi Tugas dan Fungsi untuk kebutuhan select dropdown."""
    query = select(ProfileTugasFungsi)
    if search:
        query = query.where(ProfileTugasFungsi.isi.ilike(f"%{search}%"))
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=TugasFungsiResponseList)
@router.get("/", response_model=TugasFungsiResponseList)
@router.get("/read", response_model=TugasFungsiResponseList)
async def read_tugas_fungsi(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    """Mengambil daftar data Tugas dan Fungsi dengan pagination dan filter pencarian."""
    query = select(ProfileTugasFungsi)
    if search:
        query = query.where(ProfileTugasFungsi.isi.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(ProfileTugasFungsi.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=TugasFungsiResponse)
async def get_tugas_fungsi(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    """Membaca 1 data Tugas dan Fungsi berdasarkan ID."""
    item = await crud_tugas_fungsi.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=TugasFungsiResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=TugasFungsiResponse, status_code=status.HTTP_201_CREATED)
async def create_tugas_fungsi(
    payload: TugasFungsiCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """Menambah data Tugas dan Fungsi baru ke dalam sistem."""
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_tugas_fungsi.create(db, obj_in=create_data)


@router.put("/{id}", response_model=TugasFungsiResponse)
@router.put("/update/{id}", response_model=TugasFungsiResponse)
async def update_tugas_fungsi(
    id: str,
    payload: TugasFungsiUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Mengubah data Tugas dan Fungsi yang sudah ada."""
    updated = await crud_tugas_fungsi.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_tugas_fungsi(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    """Menghapus data Tugas dan Fungsi dari sistem."""
    success = await crud_tugas_fungsi.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
