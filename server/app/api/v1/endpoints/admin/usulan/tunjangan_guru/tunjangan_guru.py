"""Usulan Tunjangan Guru endpoints (matching master pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.usulan import UsulanTunjanganGuru
from app.services.crud_service import CRUDBase
from app.services.tunjangan_verification import attach_verifications

from .schema import (
    TunjanganGuruCreate,
    TunjanganGuruResponse,
    TunjanganGuruResponseList,
    TunjanganGuruUpdate,
)

router = APIRouter()
crud_tunjangan_guru = CRUDBase(UsulanTunjanganGuru)


@router.get("/option", response_model=list[TunjanganGuruResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(UsulanTunjanganGuru)
    if search:
        query = query.where(
            or_(
                UsulanTunjanganGuru.unit_kerja.ilike(f"%{search}%"),
                UsulanTunjanganGuru.nip.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return await attach_verifications(db, list(result.scalars().all()))


@router.get("", response_model=TunjanganGuruResponseList)
@router.get("/", response_model=TunjanganGuruResponseList)
@router.get("/read", response_model=TunjanganGuruResponseList)
async def read_tunjangan_guru(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(UsulanTunjanganGuru)
    if search:
        query = query.where(
            or_(
                UsulanTunjanganGuru.unit_kerja.ilike(f"%{search}%"),
                UsulanTunjanganGuru.nip.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(UsulanTunjanganGuru.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = await attach_verifications(db, list(result.scalars().all()))

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=TunjanganGuruResponse)
async def get_tunjangan_guru(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_tunjangan_guru.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    await attach_verifications(db, [item])
    return item


@router.post("", response_model=TunjanganGuruResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=TunjanganGuruResponse, status_code=status.HTTP_201_CREATED)
async def create_tunjangan_guru(
    payload: TunjanganGuruCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_tunjangan_guru.create(db, obj_in=create_data)


@router.put("/{id}", response_model=TunjanganGuruResponse)
@router.put("/update/{id}", response_model=TunjanganGuruResponse)
async def update_tunjangan_guru(
    id: str,
    payload: TunjanganGuruUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_tunjangan_guru.update(
        db, id=id, obj_in=payload.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    await attach_verifications(db, [updated])
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_tunjangan_guru(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_tunjangan_guru.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
