"""Master Usulan Kelas Penerima endpoints (e-office pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.auth.user import User
from app.models.master.usulan import MasterUsulanKelasPenerima
from app.services.crud_service import CRUDBase

from .schema import (
    KelasPenerimaCreate,
    KelasPenerimaResponse,
    KelasPenerimaResponseList,
    KelasPenerimaUpdate,
)

router = APIRouter()
crud_kelas_penerima = CRUDBase(MasterUsulanKelasPenerima)


@router.get("/option", response_model=list[KelasPenerimaResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(MasterUsulanKelasPenerima)
    if search:
        query = query.where(MasterUsulanKelasPenerima.uraian.ilike(f"%{search}%"))

    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=KelasPenerimaResponseList)
@router.get("/", response_model=KelasPenerimaResponseList)
@router.get("/read", response_model=KelasPenerimaResponseList)
async def read_kelas_penerima(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(MasterUsulanKelasPenerima)
    if search:
        query = query.where(MasterUsulanKelasPenerima.uraian.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(MasterUsulanKelasPenerima.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=KelasPenerimaResponse)
async def get_kelas_penerima(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_kelas_penerima.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=KelasPenerimaResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=KelasPenerimaResponse, status_code=status.HTTP_201_CREATED)
async def create_kelas_penerima(
    payload: KelasPenerimaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_kelas_penerima.create(db, obj_in=create_data)


@router.put("/{id}", response_model=KelasPenerimaResponse)
@router.put("/update/{id}", response_model=KelasPenerimaResponse)
async def update_kelas_penerima(
    id: str,
    payload: KelasPenerimaUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_kelas_penerima.update(
        db, id=id, obj_in=payload.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_kelas_penerima(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_kelas_penerima.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}}
