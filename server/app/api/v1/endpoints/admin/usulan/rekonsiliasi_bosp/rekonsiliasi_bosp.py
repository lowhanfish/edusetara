"""Usulan Rekonsiliasi BOSP endpoints (matching master pattern)."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, UploadFile, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_current_user_optional, get_db
from app.services.upload_service import FileUploadService
from app.models.auth.user import User
from app.models.operational.usulan import UsulanRekonsiliasiBosp
from app.services.crud_service import CRUDBase

from .schema import (
    RekonsiliasiBospCreate,
    RekonsiliasiBospResponse,
    RekonsiliasiBospResponseList,
    RekonsiliasiBospUpdate,
)

router = APIRouter()
crud_rekonsiliasi_bosp = CRUDBase(UsulanRekonsiliasiBosp)


@router.post("/upload")
async def upload_document(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
):
    return await FileUploadService(module="rekonsiliasi-bosp").save_file(file)


@router.get("/option", response_model=list[RekonsiliasiBospResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(UsulanRekonsiliasiBosp)
    if search:
        query = query.where(
            or_(
                UsulanRekonsiliasiBosp.sekolah.ilike(f"%{search}%"),
                UsulanRekonsiliasiBosp.unit_kerja.ilike(f"%{search}%"),
                UsulanRekonsiliasiBosp.tahun.ilike(f"%{search}%"),
                UsulanRekonsiliasiBosp.status.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=RekonsiliasiBospResponseList)
@router.get("/", response_model=RekonsiliasiBospResponseList)
@router.get("/read", response_model=RekonsiliasiBospResponseList)
async def read_rekonsiliasi_bosp(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(UsulanRekonsiliasiBosp)
    if search:
        query = query.where(
            or_(
                UsulanRekonsiliasiBosp.sekolah.ilike(f"%{search}%"),
                UsulanRekonsiliasiBosp.unit_kerja.ilike(f"%{search}%"),
                UsulanRekonsiliasiBosp.tahun.ilike(f"%{search}%"),
                UsulanRekonsiliasiBosp.status.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(UsulanRekonsiliasiBosp.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=RekonsiliasiBospResponse)
async def get_rekonsiliasi_bosp(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_rekonsiliasi_bosp.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=RekonsiliasiBospResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=RekonsiliasiBospResponse, status_code=status.HTTP_201_CREATED)
async def create_rekonsiliasi_bosp(
    payload: RekonsiliasiBospCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    if create_data.get("sekolah") and not create_data.get("unit_kerja"):
        create_data["unit_kerja"] = create_data["sekolah"]
    if create_data.get("tahap") and not create_data.get("semester_id"):
        create_data["semester_id"] = create_data["tahap"]
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_rekonsiliasi_bosp.create(db, obj_in=create_data)


@router.put("/{id}", response_model=RekonsiliasiBospResponse)
@router.put("/update/{id}", response_model=RekonsiliasiBospResponse)
async def update_rekonsiliasi_bosp(
    id: str,
    payload: RekonsiliasiBospUpdate,
    db: AsyncSession = Depends(get_db),
):
    update_data = payload.model_dump(exclude_unset=True)
    if update_data.get("sekolah") and not update_data.get("unit_kerja"):
        update_data["unit_kerja"] = update_data["sekolah"]
    if update_data.get("tahap") and not update_data.get("semester_id"):
        update_data["semester_id"] = update_data["tahap"]
    updated = await crud_rekonsiliasi_bosp.update(db, id=id, obj_in=update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_rekonsiliasi_bosp(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_rekonsiliasi_bosp.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
