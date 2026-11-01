"""Verifikasi Rekonsiliasi BOSP endpoints (matching master pattern)."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.verifikasi import VerifikasiRekonsiliasiBosp
from app.services.crud_service import CRUDBase

from .schema import (
    VerifikasiRekonsiliasiBospCreate,
    VerifikasiRekonsiliasiBospResponse,
    VerifikasiRekonsiliasiBospResponseList,
    VerifikasiRekonsiliasiBospUpdate,
)

router = APIRouter()
crud_verifikasi_bosp = CRUDBase(VerifikasiRekonsiliasiBosp)


@router.get("/option", response_model=list[VerifikasiRekonsiliasiBospResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(VerifikasiRekonsiliasiBosp)
    if search:
        query = query.where(
            or_(
                VerifikasiRekonsiliasiBosp.status_1.ilike(f"%{search}%"),
                VerifikasiRekonsiliasiBosp.unit_kerja.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=VerifikasiRekonsiliasiBospResponseList)
@router.get("/", response_model=VerifikasiRekonsiliasiBospResponseList)
@router.get("/read", response_model=VerifikasiRekonsiliasiBospResponseList)
async def read_verifikasi_rekonsiliasi_bosp(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(VerifikasiRekonsiliasiBosp)
    if search:
        query = query.where(
            or_(
                VerifikasiRekonsiliasiBosp.status_1.ilike(f"%{search}%"),
                VerifikasiRekonsiliasiBosp.unit_kerja.ilike(f"%{search}%"),
                VerifikasiRekonsiliasiBosp.pesan_1.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(VerifikasiRekonsiliasiBosp.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=VerifikasiRekonsiliasiBospResponse)
async def get_verifikasi_rekonsiliasi_bosp(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_verifikasi_bosp.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=VerifikasiRekonsiliasiBospResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=VerifikasiRekonsiliasiBospResponse, status_code=status.HTTP_201_CREATED)
async def create_verifikasi_rekonsiliasi_bosp(
    payload: VerifikasiRekonsiliasiBospCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_verifikasi_bosp.create(db, obj_in=create_data)


@router.put("/{id}", response_model=VerifikasiRekonsiliasiBospResponse)
@router.put("/update/{id}", response_model=VerifikasiRekonsiliasiBospResponse)
async def update_verifikasi_rekonsiliasi_bosp(
    id: str,
    payload: VerifikasiRekonsiliasiBospUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_verifikasi_bosp.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_verifikasi_rekonsiliasi_bosp(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_verifikasi_bosp.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
