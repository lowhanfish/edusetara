"""Master Sarpras Sumber Dana endpoints (e-office pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.auth.user import User
from app.models.master.sarpras import MasterSarprasSumberDana
from app.services.crud_service import CRUDBase

from .schema import (
    SumberDanaCreate,
    SumberDanaResponse,
    SumberDanaResponseList,
    SumberDanaUpdate,
)

router = APIRouter()
crud_sumber_dana = CRUDBase(MasterSarprasSumberDana)


@router.get("/option", response_model=list[SumberDanaResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    """Mengambil daftar opsi sumber dana untuk dropdown."""
    query = select(MasterSarprasSumberDana)
    if search:
        query = query.where(MasterSarprasSumberDana.uraian.ilike(f"%{search}%"))

    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=SumberDanaResponseList)
@router.get("/", response_model=SumberDanaResponseList)
@router.get("/read", response_model=SumberDanaResponseList)
async def read_sumber_dana(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    """Membaca daftar sumber dana sarpras dengan pagination."""
    query = select(MasterSarprasSumberDana)
    if search:
        query = query.where(MasterSarprasSumberDana.uraian.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(MasterSarprasSumberDana.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=SumberDanaResponse)
async def get_sumber_dana(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    """Mengambil 1 data sumber dana sarpras berdasarkan ID."""
    item = await crud_sumber_dana.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=SumberDanaResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=SumberDanaResponse, status_code=status.HTTP_201_CREATED)
async def create_sumber_dana(
    payload: SumberDanaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Menambah data master sumber dana sarpras baru."""
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_sumber_dana.create(db, obj_in=create_data)


@router.put("/{id}", response_model=SumberDanaResponse)
@router.put("/update/{id}", response_model=SumberDanaResponse)
async def update_sumber_dana(
    id: str,
    payload: SumberDanaUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Mengubah data master sumber dana sarpras."""
    updated = await crud_sumber_dana.update(
        db, id=id, obj_in=payload.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_sumber_dana(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    """Menghapus data master sumber dana sarpras."""
    success = await crud_sumber_dana.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}}
