"""Komunitas Belajar endpoints (matching master pattern)."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.kegiatan import KomunitasBelajar
from app.services.crud_service import CRUDBase

from .schema import (
    KomunitasBelajarCreate,
    KomunitasBelajarResponse,
    KomunitasBelajarResponseList,
    KomunitasBelajarUpdate,
)

router = APIRouter()
crud_komunitas_belajar = CRUDBase(KomunitasBelajar)


@router.get("/option", response_model=list[KomunitasBelajarResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(KomunitasBelajar)
    if search:
        query = query.where(
            or_(
                KomunitasBelajar.uraian.ilike(f"%{search}%"),
                KomunitasBelajar.unit_kerja.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=KomunitasBelajarResponseList)
@router.get("/", response_model=KomunitasBelajarResponseList)
@router.get("/read", response_model=KomunitasBelajarResponseList)
async def read_komunitas_belajar(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(KomunitasBelajar)
    if search:
        query = query.where(
            or_(
                KomunitasBelajar.uraian.ilike(f"%{search}%"),
                KomunitasBelajar.unit_kerja.ilike(f"%{search}%"),
                KomunitasBelajar.deskripsi.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(KomunitasBelajar.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=KomunitasBelajarResponse)
async def get_komunitas_belajar(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_komunitas_belajar.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=KomunitasBelajarResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=KomunitasBelajarResponse, status_code=status.HTTP_201_CREATED)
async def create_komunitas_belajar(
    payload: KomunitasBelajarCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_komunitas_belajar.create(db, obj_in=create_data)


@router.put("/{id}", response_model=KomunitasBelajarResponse)
@router.put("/update/{id}", response_model=KomunitasBelajarResponse)
async def update_komunitas_belajar(
    id: str,
    payload: KomunitasBelajarUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_komunitas_belajar.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_komunitas_belajar(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_komunitas_belajar.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
