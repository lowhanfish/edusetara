"""Profile Visi dan Misi endpoints (matching master pattern)."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.profile import ProfileVisiMisi
from app.services.crud_service import CRUDBase

from .schema import (
    VisiMisiCreate,
    VisiMisiResponse,
    VisiMisiResponseList,
    VisiMisiUpdate,
)

router = APIRouter()
crud_visi_misi = CRUDBase(ProfileVisiMisi)


@router.get("/option", response_model=list[VisiMisiResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    """Mengambil daftar opsi Visi dan Misi untuk kebutuhan select dropdown."""
    query = select(ProfileVisiMisi)
    if search:
        query = query.where(ProfileVisiMisi.isi.ilike(f"%{search}%"))
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=VisiMisiResponseList)
@router.get("/", response_model=VisiMisiResponseList)
@router.get("/read", response_model=VisiMisiResponseList)
async def read_visi_misi(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    """Mengambil daftar data Visi dan Misi dengan pagination dan filter pencarian."""
    query = select(ProfileVisiMisi)
    if search:
        query = query.where(ProfileVisiMisi.isi.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(ProfileVisiMisi.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=VisiMisiResponse)
async def get_visi_misi(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    """Membaca 1 data Visi dan Misi berdasarkan ID."""
    item = await crud_visi_misi.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=VisiMisiResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=VisiMisiResponse, status_code=status.HTTP_201_CREATED)
async def create_visi_misi(
    payload: VisiMisiCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """Menambah data Visi dan Misi baru ke dalam sistem."""
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_visi_misi.create(db, obj_in=create_data)


@router.put("/{id}", response_model=VisiMisiResponse)
@router.put("/update/{id}", response_model=VisiMisiResponse)
async def update_visi_misi(
    id: str,
    payload: VisiMisiUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Mengubah data Visi dan Misi yang sudah ada."""
    updated = await crud_visi_misi.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_visi_misi(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    """Menghapus data Visi dan Misi dari sistem."""
    success = await crud_visi_misi.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
