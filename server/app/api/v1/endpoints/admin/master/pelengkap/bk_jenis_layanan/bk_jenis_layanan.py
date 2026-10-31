"""Master BK Jenis Layanan endpoints (e-office pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.auth.user import User
from app.models.master.pelengkap import MasterBkJenisLayanan
from app.services.crud_service import CRUDBase

from .schema import (
    BkJenisLayananCreate,
    BkJenisLayananResponse,
    BkJenisLayananResponseList,
    BkJenisLayananUpdate,
)

router = APIRouter()
crud_bk_jenis_layanan = CRUDBase(MasterBkJenisLayanan)


@router.get("/option", response_model=list[BkJenisLayananResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(MasterBkJenisLayanan)
    if search:
        query = query.where(MasterBkJenisLayanan.uraian.ilike(f"%{search}%"))

    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=BkJenisLayananResponseList)
@router.get("/", response_model=BkJenisLayananResponseList)
@router.get("/read", response_model=BkJenisLayananResponseList)
async def read_bk_jenis_layanan(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(MasterBkJenisLayanan)
    if search:
        query = query.where(MasterBkJenisLayanan.uraian.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(MasterBkJenisLayanan.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=BkJenisLayananResponse)
async def get_bk_jenis_layanan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_bk_jenis_layanan.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=BkJenisLayananResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=BkJenisLayananResponse, status_code=status.HTTP_201_CREATED)
async def create_bk_jenis_layanan(
    payload: BkJenisLayananCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_bk_jenis_layanan.create(db, obj_in=create_data)


@router.put("/{id}", response_model=BkJenisLayananResponse)
@router.put("/update/{id}", response_model=BkJenisLayananResponse)
async def update_bk_jenis_layanan(
    id: str,
    payload: BkJenisLayananUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_bk_jenis_layanan.update(
        db, id=id, obj_in=payload.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_bk_jenis_layanan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_bk_jenis_layanan.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}}
