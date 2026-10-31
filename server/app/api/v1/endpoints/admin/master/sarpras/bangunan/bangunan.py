"""Master Sarpras Bangunan endpoints (e-office pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.auth.user import User
from app.models.master.sarpras import MasterSarprasBangunan
from app.services.crud_service import CRUDBase

from .schema import BangunanCreate, BangunanResponse, BangunanResponseList, BangunanUpdate

router = APIRouter()
crud_bangunan = CRUDBase(MasterSarprasBangunan)


@router.get("/option", response_model=list[BangunanResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    """
    ## Mengambil daftar opsi Kondisi Bangunan untuk dropdown
    Mengambil data Kondisi Bangunan untuk kebutuhan opsi select di frontend.
    """
    query = select(MasterSarprasBangunan)
    if search:
        query = query.where(MasterSarprasBangunan.uraian.ilike(f"%{search}%"))

    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=BangunanResponseList)
@router.get("/", response_model=BangunanResponseList)
@router.get("/read", response_model=BangunanResponseList)
async def read_bangunan(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    """
    ## Mengambil semua List Kondisi Bangunan
    Membaca data master kondisi bangunan dari sistem dengan pagination.

    **Parameter:**
    - `search`: String, pencarian berdasarkan teks uraian kondisi bangunan.
    - `skip`: Int, offset pagination data.
    - `limit`: Int, batas jumlah data per halaman.
    """
    query = select(MasterSarprasBangunan)
    if search:
        query = query.where(MasterSarprasBangunan.uraian.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(MasterSarprasBangunan.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=BangunanResponse)
async def get_bangunan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    ## Mengambil 1 Kondisi Bangunan berdasarkan ID
    Membaca data spesifik kondisi bangunan dari sistem.
    """
    item = await crud_bangunan.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=BangunanResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=BangunanResponse, status_code=status.HTTP_201_CREATED)
async def create_bangunan(
    payload: BangunanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    ## Menambah Kondisi Bangunan
    Menambahkan data master kondisi bangunan baru ke dalam sistem.

    **Parameter:**
    - `id`: Opsional string identifier (jika kosong akan dibuat otomatis UUID).
    - `uraian`: String teks deskripsi kondisi bangunan (e.g. "Baik", "Rusak Sedang").
    """
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_bangunan.create(db, obj_in=create_data)


@router.put("/{id}", response_model=BangunanResponse)
@router.put("/update/{id}", response_model=BangunanResponse)
async def update_bangunan(
    id: str,
    payload: BangunanUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    ## Mengubah Kondisi Bangunan
    Mengubah data item master kondisi bangunan di dalam sistem.

    **Key Path:**
    - `id`: ID data item yang akan diubah.
    """
    updated = await crud_bangunan.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_bangunan(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    ## Menghapus Kondisi Bangunan
    Menghapus data item master kondisi bangunan dari sistem.

    **Key Path:**
    - `id`: ID data item yang akan dihapus.
    """
    success = await crud_bangunan.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}}
