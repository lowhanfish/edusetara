"""Master Model Pembelajaran endpoints (e-office pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.auth.user import User
from app.models.master.pelengkap import MasterModelPembelajaran
from app.services.crud_service import CRUDBase

from .schema import (
    ModelPembelajaranCreate,
    ModelPembelajaranResponse,
    ModelPembelajaranResponseList,
    ModelPembelajaranUpdate,
)

router = APIRouter()
crud_model_pembelajaran = CRUDBase(MasterModelPembelajaran)


@router.get("/option", response_model=list[ModelPembelajaranResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(MasterModelPembelajaran)
    if search:
        query = query.where(MasterModelPembelajaran.uraian.ilike(f"%{search}%"))

    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=ModelPembelajaranResponseList)
@router.get("/", response_model=ModelPembelajaranResponseList)
@router.get("/read", response_model=ModelPembelajaranResponseList)
async def read_model_pembelajaran(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(MasterModelPembelajaran)
    if search:
        query = query.where(MasterModelPembelajaran.uraian.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(MasterModelPembelajaran.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=ModelPembelajaranResponse)
async def get_model_pembelajaran(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_model_pembelajaran.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=ModelPembelajaranResponse, status_code=status.HTTP_201_CREATED)
@router.post(
    "/create", response_model=ModelPembelajaranResponse, status_code=status.HTTP_201_CREATED
)
async def create_model_pembelajaran(
    payload: ModelPembelajaranCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_model_pembelajaran.create(db, obj_in=create_data)


@router.put("/{id}", response_model=ModelPembelajaranResponse)
@router.put("/update/{id}", response_model=ModelPembelajaranResponse)
async def update_model_pembelajaran(
    id: str,
    payload: ModelPembelajaranUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_model_pembelajaran.update(
        db, id=id, obj_in=payload.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_model_pembelajaran(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_model_pembelajaran.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}}
