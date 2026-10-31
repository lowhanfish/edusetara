"""Master Jurnal Mata Pelajaran endpoints (e-office pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.api.deps import get_current_user, get_db
from app.models.auth.user import User
from app.models.master.jurnal import MasterJurnalMataPelajaran
from app.services.crud_service import CRUDBase

from .schema import (
    MataPelajaranCreate,
    MataPelajaranResponse,
    MataPelajaranResponseList,
    MataPelajaranUpdate,
)

router = APIRouter()
crud_mata_pelajaran = CRUDBase(MasterJurnalMataPelajaran)


@router.get("/option", response_model=list[MataPelajaranResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    kelas_id: str | None = None,
    search: str | None = None,
):
    query = select(MasterJurnalMataPelajaran).options(joinedload(MasterJurnalMataPelajaran.kelas))
    if kelas_id:
        query = query.where(MasterJurnalMataPelajaran.kelas_id == kelas_id)
    if search:
        query = query.where(MasterJurnalMataPelajaran.uraian.ilike(f"%{search}%"))

    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=MataPelajaranResponseList)
@router.get("/", response_model=MataPelajaranResponseList)
@router.get("/read", response_model=MataPelajaranResponseList)
async def read_mata_pelajaran(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    kelas_id: str | None = None,
    search: str | None = None,
):
    query = select(MasterJurnalMataPelajaran).options(joinedload(MasterJurnalMataPelajaran.kelas))
    if kelas_id:
        query = query.where(MasterJurnalMataPelajaran.kelas_id == kelas_id)
    if search:
        query = query.where(MasterJurnalMataPelajaran.uraian.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(MasterJurnalMataPelajaran.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=MataPelajaranResponse)
async def get_mata_pelajaran(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(MasterJurnalMataPelajaran)
        .options(joinedload(MasterJurnalMataPelajaran.kelas))
        .where(MasterJurnalMataPelajaran.id == id)
    )
    result = await db.execute(query)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=MataPelajaranResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=MataPelajaranResponse, status_code=status.HTTP_201_CREATED)
async def create_mata_pelajaran(
    payload: MataPelajaranCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_mata_pelajaran.create(db, obj_in=create_data)


@router.put("/{id}", response_model=MataPelajaranResponse)
@router.put("/update/{id}", response_model=MataPelajaranResponse)
async def update_mata_pelajaran(
    id: str,
    payload: MataPelajaranUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_mata_pelajaran.update(
        db, id=id, obj_in=payload.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_mata_pelajaran(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_mata_pelajaran.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}}
