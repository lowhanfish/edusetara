"""Berita endpoints (matching master pattern)."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.auth.user import User
from app.models.operational.berita import Berita
from app.services.crud_service import CRUDBase
from app.services.upload_service import FileUploadService

from .schema import (
    BeritaCreate,
    BeritaResponse,
    BeritaResponseList,
    BeritaUpdate,
)

router = APIRouter()
crud_berita = CRUDBase(Berita)


@router.get("/option", response_model=list[BeritaResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(Berita)
    if search:
        query = query.where(
            or_(
                Berita.judul.ilike(f"%{search}%"),
                Berita.kategori.ilike(f"%{search}%"),
                Berita.sumber.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=BeritaResponseList)
@router.get("/", response_model=BeritaResponseList)
@router.get("/read", response_model=BeritaResponseList)
async def read_berita(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(Berita)
    if search:
        query = query.where(
            or_(
                Berita.judul.ilike(f"%{search}%"),
                Berita.deskripsi.ilike(f"%{search}%"),
                Berita.sumber.ilike(f"%{search}%"),
                Berita.kategori.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(Berita.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=BeritaResponse)
async def get_berita(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_berita.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=BeritaResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=BeritaResponse, status_code=status.HTTP_201_CREATED)
async def create_berita(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" in content_type:
        form = await request.form()
        data = dict(form)
        file = form.get("foto") or form.get("file")
        if file and hasattr(file, "filename") and file.filename:
            service = FileUploadService(module="berita")
            uploaded = await service.save_file(file)
            data["foto"] = uploaded["file_url"]
        create_data = BeritaCreate.model_validate(data).model_dump(exclude_unset=True)
    else:
        body = await request.json()
        create_data = BeritaCreate.model_validate(body).model_dump(exclude_unset=True)

    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_berita.create(db, obj_in=create_data)


@router.put("/{id}", response_model=BeritaResponse)
@router.put("/update/{id}", response_model=BeritaResponse)
async def update_berita(
    id: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" in content_type:
        form = await request.form()
        data = dict(form)
        file = form.get("foto") or form.get("file")
        if file and hasattr(file, "filename") and file.filename:
            service = FileUploadService(module="berita")
            uploaded = await service.save_file(file)
            data["foto"] = uploaded["file_url"]
        update_data = BeritaUpdate.model_validate(data).model_dump(exclude_unset=True)
    else:
        body = await request.json()
        update_data = BeritaUpdate.model_validate(body).model_dump(exclude_unset=True)

    updated = await crud_berita.update(db, id=id, obj_in=update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_berita(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_berita.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    if getattr(item, "foto", None):
        FileUploadService.delete_file(item.foto)
    await crud_berita.remove(db, id=id)
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}
