"""Gallery Organisasi Penggerak endpoints (matching master pattern)."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.gallery import GalleryOrganisasiPenggerak
from app.services.crud_service import CRUDBase

from .schema import (
    OrganisasiPenggerakCreate,
    OrganisasiPenggerakResponse,
    OrganisasiPenggerakResponseList,
    OrganisasiPenggerakUpdate,
)

router = APIRouter()
crud_organisasi_penggerak = CRUDBase(GalleryOrganisasiPenggerak)


@router.get("/option", response_model=list[OrganisasiPenggerakResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(GalleryOrganisasiPenggerak)
    if search:
        query = query.where(
            or_(
                GalleryOrganisasiPenggerak.judul.ilike(f"%{search}%"),
                GalleryOrganisasiPenggerak.kategori.ilike(f"%{search}%"),
                GalleryOrganisasiPenggerak.unit_kerja.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=OrganisasiPenggerakResponseList)
@router.get("/", response_model=OrganisasiPenggerakResponseList)
@router.get("/read", response_model=OrganisasiPenggerakResponseList)
async def read_organisasi_penggerak(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(GalleryOrganisasiPenggerak)
    if search:
        query = query.where(
            or_(
                GalleryOrganisasiPenggerak.judul.ilike(f"%{search}%"),
                GalleryOrganisasiPenggerak.kategori.ilike(f"%{search}%"),
                GalleryOrganisasiPenggerak.unit_kerja.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(GalleryOrganisasiPenggerak.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=OrganisasiPenggerakResponse)
async def get_organisasi_penggerak(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_organisasi_penggerak.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=OrganisasiPenggerakResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=OrganisasiPenggerakResponse, status_code=status.HTTP_201_CREATED)
async def create_organisasi_penggerak(
    payload: OrganisasiPenggerakCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_organisasi_penggerak.create(db, obj_in=create_data)


@router.put("/{id}", response_model=OrganisasiPenggerakResponse)
@router.put("/update/{id}", response_model=OrganisasiPenggerakResponse)
async def update_organisasi_penggerak(
    id: str,
    payload: OrganisasiPenggerakUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_organisasi_penggerak.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_organisasi_penggerak(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_organisasi_penggerak.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
