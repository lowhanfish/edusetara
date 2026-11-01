"""Layanan Publik endpoints."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.berita import LayananPublik
from app.services.crud_service import CRUDBase

from .schema import (
    LayananPublikCreate,
    LayananPublikResponse,
    LayananPublikResponseList,
    LayananPublikUpdate,
)

router = APIRouter()
crud_layanan = CRUDBase(LayananPublik)


@router.get("/option", response_model=list[LayananPublikResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(LayananPublik)
    if search:
        query = query.where(
            or_(
                LayananPublik.nama_layanan.ilike(f"%{search}%"),
                LayananPublik.kategori.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=LayananPublikResponseList)
@router.get("/", response_model=LayananPublikResponseList)
@router.get("/read", response_model=LayananPublikResponseList)
async def read_layanan(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(LayananPublik)
    if search:
        query = query.where(
            or_(
                LayananPublik.nama_layanan.ilike(f"%{search}%"),
                LayananPublik.deskripsi.ilike(f"%{search}%"),
                LayananPublik.kategori.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(LayananPublik.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=LayananPublikResponse)
async def get_layanan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_layanan.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=LayananPublikResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=LayananPublikResponse, status_code=status.HTTP_201_CREATED)
async def create_layanan(
    payload: LayananPublikCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_layanan.create(db, obj_in=create_data)


@router.put("/{id}", response_model=LayananPublikResponse)
@router.put("/update/{id}", response_model=LayananPublikResponse)
async def update_layanan(
    id: str,
    payload: LayananPublikUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_layanan.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_layanan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_layanan.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
