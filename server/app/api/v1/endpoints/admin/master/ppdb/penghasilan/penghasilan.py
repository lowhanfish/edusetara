"""Master PPDB Penghasilan endpoints (e-office pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.auth.user import User
from app.models.master.ppdb import MasterPpdbPenghasilan
from app.services.crud_service import CRUDBase

from .schema import (
    PenghasilanCreate,
    PenghasilanResponse,
    PenghasilanResponseList,
    PenghasilanUpdate,
)

router = APIRouter()
crud_penghasilan = CRUDBase(MasterPpdbPenghasilan)


@router.get("/option", response_model=list[PenghasilanResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(MasterPpdbPenghasilan)
    if search:
        query = query.where(MasterPpdbPenghasilan.uraian.ilike(f"%{search}%"))

    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=PenghasilanResponseList)
@router.get("/", response_model=PenghasilanResponseList)
@router.get("/read", response_model=PenghasilanResponseList)
async def read_penghasilan(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(MasterPpdbPenghasilan)
    if search:
        query = query.where(MasterPpdbPenghasilan.uraian.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(MasterPpdbPenghasilan.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=PenghasilanResponse)
async def get_penghasilan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_penghasilan.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=PenghasilanResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=PenghasilanResponse, status_code=status.HTTP_201_CREATED)
async def create_penghasilan(
    payload: PenghasilanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_penghasilan.create(db, obj_in=create_data)


@router.put("/{id}", response_model=PenghasilanResponse)
@router.put("/update/{id}", response_model=PenghasilanResponse)
async def update_penghasilan(
    id: str,
    payload: PenghasilanUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_penghasilan.update(
        db, id=id, obj_in=payload.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_penghasilan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_penghasilan.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}}
