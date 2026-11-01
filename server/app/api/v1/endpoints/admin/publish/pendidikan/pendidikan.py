"""Pendidikan Program endpoints."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.berita import PendidikanProgram
from app.services.crud_service import CRUDBase

from .schema import (
    PendidikanProgramCreate,
    PendidikanProgramResponse,
    PendidikanProgramResponseList,
    PendidikanProgramUpdate,
)

router = APIRouter()
crud_pendidikan = CRUDBase(PendidikanProgram)


@router.get("/option", response_model=list[PendidikanProgramResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(PendidikanProgram)
    if search:
        query = query.where(
            or_(
                PendidikanProgram.name.ilike(f"%{search}%"),
                PendidikanProgram.category.ilike(f"%{search}%"),
                PendidikanProgram.scope.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=PendidikanProgramResponseList)
@router.get("/", response_model=PendidikanProgramResponseList)
@router.get("/read", response_model=PendidikanProgramResponseList)
async def read_pendidikan(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(PendidikanProgram)
    if search:
        query = query.where(
            or_(
                PendidikanProgram.name.ilike(f"%{search}%"),
                PendidikanProgram.category.ilike(f"%{search}%"),
                PendidikanProgram.scope.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(PendidikanProgram.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=PendidikanProgramResponse)
async def get_pendidikan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_pendidikan.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=PendidikanProgramResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=PendidikanProgramResponse, status_code=status.HTTP_201_CREATED)
async def create_pendidikan(
    payload: PendidikanProgramCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_pendidikan.create(db, obj_in=create_data)


@router.put("/{id}", response_model=PendidikanProgramResponse)
@router.put("/update/{id}", response_model=PendidikanProgramResponse)
async def update_pendidikan(
    id: str,
    payload: PendidikanProgramUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_pendidikan.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_pendidikan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_pendidikan.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
