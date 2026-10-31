"""Master Sarpras Jenis Bantuan endpoints (e-office pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.auth.user import User
from app.models.master.sarpras import MasterSarprasJenisBantuan
from app.services.crud_service import CRUDBase

from .schema import (
    JenisBantuanCreate,
    JenisBantuanResponse,
    JenisBantuanResponseList,
    JenisBantuanUpdate,
)

router = APIRouter()
crud_jenis_bantuan = CRUDBase(MasterSarprasJenisBantuan)


@router.get("/option", response_model=list[JenisBantuanResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    """Mengambil daftar opsi jenis bantuan untuk dropdown."""
    query = select(MasterSarprasJenisBantuan)
    if search:
        query = query.where(MasterSarprasJenisBantuan.uraian.ilike(f"%{search}%"))

    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=JenisBantuanResponseList)
@router.get("/", response_model=JenisBantuanResponseList)
@router.get("/read", response_model=JenisBantuanResponseList)
async def read_jenis_bantuan(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    """Membaca daftar jenis bantuan sarpras dengan pagination."""
    query = select(MasterSarprasJenisBantuan)
    if search:
        query = query.where(MasterSarprasJenisBantuan.uraian.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(MasterSarprasJenisBantuan.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=JenisBantuanResponse)
async def get_jenis_bantuan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    """Mengambil 1 data jenis bantuan sarpras berdasarkan ID."""
    item = await crud_jenis_bantuan.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=JenisBantuanResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=JenisBantuanResponse, status_code=status.HTTP_201_CREATED)
async def create_jenis_bantuan(
    payload: JenisBantuanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Menambah data master jenis bantuan sarpras baru."""
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_jenis_bantuan.create(db, obj_in=create_data)


@router.put("/{id}", response_model=JenisBantuanResponse)
@router.put("/update/{id}", response_model=JenisBantuanResponse)
async def update_jenis_bantuan(
    id: str,
    payload: JenisBantuanUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Mengubah data master jenis bantuan sarpras."""
    updated = await crud_jenis_bantuan.update(
        db, id=id, obj_in=payload.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_jenis_bantuan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    """Menghapus data master jenis bantuan sarpras."""
    success = await crud_jenis_bantuan.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}}
