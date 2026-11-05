"""Usulan Rekonsiliasi BOSP endpoints (matching master pattern)."""

import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_current_user_optional, get_db
from app.db.transaction import commit_or_raise_unique_conflict
from app.models.auth.user import User
from app.models.master.pelengkap import MasterKategori
from app.models.operational.usulan import UsulanRekonsiliasiBosp, UsulanRekonsiliasiBospDokumen
from app.services.crud_service import CRUDBase
from app.services.upload_service import BASE_UPLOAD_DIR, FileUploadService

from .schema import (
    DokumenCreate,
    DokumenResponse,
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
@router.post(
    "/create", response_model=RekonsiliasiBospResponse, status_code=status.HTTP_201_CREATED
)
async def create_rekonsiliasi_bosp(
    payload: RekonsiliasiBospCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    if "status" in payload.model_fields_set:
        raise HTTPException(status_code=403, detail="Status hanya diubah melalui verifikasi admin")
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
    if "status" in payload.model_fields_set:
        raise HTTPException(status_code=403, detail="Status hanya diubah melalui verifikasi admin")
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


async def require_proposal(db: AsyncSession, usulan_id: str):
    proposal = await db.get(UsulanRekonsiliasiBosp, usulan_id)
    if proposal is None:
        raise HTTPException(status_code=404, detail="Usulan tidak ditemukan")
    return proposal


async def require_document(db: AsyncSession, usulan_id: str, dokumen_id: str):
    await require_proposal(db, usulan_id)
    document = await db.scalar(
        select(UsulanRekonsiliasiBospDokumen).where(
            UsulanRekonsiliasiBospDokumen.id == dokumen_id,
            UsulanRekonsiliasiBospDokumen.usulan_id == usulan_id,
        )
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Dokumen tidak ditemukan pada usulan ini")
    return document


async def document_values(
    db: AsyncSession, payload: DokumenCreate, existing_file: str | None = None
):
    category = await db.get(MasterKategori, payload.kategori_id)
    if category is None:
        raise HTTPException(
            status_code=422, detail="Kategori dokumen tidak ditemukan di master kategori"
        )
    # New attachments must be files saved by this module's upload service.
    if payload.file != existing_file:
        prefix = "/uploads/rekonsiliasi-bosp/"
        filename = payload.file.removeprefix(prefix)
        if (
            not payload.file.startswith(prefix)
            or Path(filename).name != filename
            or not (BASE_UPLOAD_DIR / "rekonsiliasi-bosp" / filename).is_file()
        ):
            raise HTTPException(status_code=422, detail="Lampiran belum diunggah atau tidak valid")
    return {**payload.model_dump(), "kategori_nama": category.uraian}


@router.get("/{id}/dokumen", response_model=list[DokumenResponse])
async def read_documents(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await require_proposal(db, id)
    result = await db.scalars(
        select(UsulanRekonsiliasiBospDokumen)
        .where(
            UsulanRekonsiliasiBospDokumen.usulan_id == id,
        )
        .order_by(UsulanRekonsiliasiBospDokumen.created_at, UsulanRekonsiliasiBospDokumen.id)
    )
    return list(result.all())


@router.post("/{id}/dokumen", response_model=DokumenResponse, status_code=201)
async def create_document(
    id: str,
    payload: DokumenCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await require_proposal(db, id)
    values = await document_values(db, payload)
    document = UsulanRekonsiliasiBospDokumen(
        usulan_id=id,
        created_by=current_user.username,
        **values,
    )
    db.add(document)
    await commit_or_raise_unique_conflict(db)
    await db.refresh(document)
    return document


@router.put("/{id}/dokumen/{dokumen_id}", response_model=DokumenResponse)
async def update_document(
    id: str,
    dokumen_id: str,
    payload: DokumenCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = await require_document(db, id, dokumen_id)
    values = await document_values(db, payload, document.file)
    changed = any(
        getattr(document, field) != values[field] for field in ("kategori_id", "uraian", "file")
    )
    for field, value in values.items():
        setattr(document, field, value)
    if changed:
        document.cek_benar = False
        document.cek_lengkap = False
    await commit_or_raise_unique_conflict(db)
    await db.refresh(document)
    return document


@router.delete("/{id}/dokumen/{dokumen_id}")
async def delete_document(
    id: str,
    dokumen_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = await require_document(db, id, dokumen_id)
    await db.delete(document)
    await commit_or_raise_unique_conflict(db)
    return {"message": "Dokumen berhasil dihapus"}
