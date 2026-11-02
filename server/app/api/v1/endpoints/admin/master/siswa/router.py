"""Master Siswa endpoints (e-office pattern)."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_db
from app.api.v1.endpoints.admin.master.siswa.schema import (
    SiswaCreate,
    SiswaOption,
    SiswaResponse,
    SiswaResponseList,
    SiswaUpdate,
)
from app.db.transaction import commit_or_raise_unique_conflict
from app.models.auth.user import User
from app.models.master.siswa import MasterSiswa

router = APIRouter(tags=["Admin Master Siswa"])


def _to_response_dict(s: MasterSiswa) -> dict[str, Any]:
    return {
        "id": s.id,
        "nama": s.nama,
        "is_active": s.is_active,
        "nisn": s.nisn,
        "nik": s.nik,
        "jns_kelamin": s.jns_kelamin,
        "kelas_id": s.kelas_id,
        "kelas_uraian": s.kelas.uraian if s.kelas else None,
        "tmp_lahir": s.tmp_lahir,
        "tgl_lahir": s.tgl_lahir,
        "agama": s.agama,
        "alamat": s.alamat,
        "nama_ayah": s.nama_ayah,
        "nama_ibu": s.nama_ibu,
        "nama_wali": s.nama_wali,
        "file": s.file,
        "nip": s.nip,
        "unit_kerja": s.unit_kerja,
        "unit_kerja_id": s.unit_kerja_id,
        "created_by": s.created_by,
        "created_at": s.created_at,
        "updated_at": s.updated_at,
    }


@router.get("/option", response_model=list[SiswaOption])
async def read_siswa_options(
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[Any]:
    """Ambil opsi dropdown siswa (id, nama, nisn)."""
    stmt = select(MasterSiswa.id, MasterSiswa.nama, MasterSiswa.nisn)
    if search:
        stmt = stmt.where(
            (MasterSiswa.nama.ilike(f"%{search}%")) | (MasterSiswa.nisn.ilike(f"%{search}%"))
        )
    stmt = stmt.order_by(MasterSiswa.nama.asc())
    result = await db.execute(stmt)
    return [{"id": row.id, "uraian": row.nama, "nisn": row.nisn} for row in result.all()]


@router.get("/read", response_model=SiswaResponseList)
@router.get("", response_model=SiswaResponseList)
async def read_siswa_list(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: str | None = None,
    kelas_id: str | None = None,
) -> dict[str, Any]:
    """List data siswa dengan pagination dan filter kelas."""
    stmt = select(MasterSiswa).options(selectinload(MasterSiswa.kelas))
    if search:
        stmt = stmt.where(
            (MasterSiswa.nama.ilike(f"%{search}%"))
            | (MasterSiswa.nisn.ilike(f"%{search}%"))
            | (MasterSiswa.nik.ilike(f"%{search}%"))
        )
    if kelas_id:
        stmt = stmt.where(MasterSiswa.kelas_id == kelas_id)

    total_query = select(func.count()).select_from(stmt.subquery())
    total_res = await db.execute(total_query)
    total = total_res.scalar_one_or_none() or 0

    stmt = stmt.order_by(MasterSiswa.nama.asc()).offset(skip).limit(limit)
    result = await db.execute(stmt)
    items = result.scalars().all()

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": [_to_response_dict(s) for s in items],
    }


@router.get("/{item_id}", response_model=SiswaResponse)
async def get_siswa_detail(
    item_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Detail satu data siswa."""
    stmt = (
        select(MasterSiswa)
        .options(selectinload(MasterSiswa.kelas))
        .where(MasterSiswa.id == item_id)
    )
    result = await db.execute(stmt)
    s = result.scalars().first()
    if not s:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Siswa dengan id '{item_id}' tidak ditemukan",
        )
    return _to_response_dict(s)


@router.post("/create", response_model=SiswaResponse, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=SiswaResponse, status_code=status.HTTP_201_CREATED)
async def create_siswa(
    payload: SiswaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Tambah data siswa baru."""
    siswa_id = payload.id or str(uuid.uuid4())
    data = payload.model_dump(exclude_unset=True)
    data["id"] = siswa_id
    data["created_by"] = current_user.username if current_user else None
    if not data.get("nip"):
        data["nip"] = current_user.nip if current_user else None
    if not data.get("unit_kerja"):
        data["unit_kerja"] = current_user.instansi_id if current_user else None

    instance = MasterSiswa(**data)
    db.add(instance)
    conflict_msg = f"Siswa dengan NISN '{payload.nisn}' atau NIK '{payload.nik}' sudah terdaftar"
    await commit_or_raise_unique_conflict(db, conflict_message=conflict_msg)
    await db.refresh(instance)
    # Eager load kelas if present
    if instance.kelas_id:
        stmt = (
            select(MasterSiswa)
            .options(selectinload(MasterSiswa.kelas))
            .where(MasterSiswa.id == instance.id)
        )
        res = await db.execute(stmt)
        loaded = res.scalars().first()
        if loaded:
            return _to_response_dict(loaded)

    return _to_response_dict(instance)


@router.put("/update/{item_id}", response_model=SiswaResponse)
@router.put("/{item_id}", response_model=SiswaResponse)
async def update_siswa(
    item_id: str,
    payload: SiswaUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update data siswa."""
    stmt = (
        select(MasterSiswa)
        .options(selectinload(MasterSiswa.kelas))
        .where(MasterSiswa.id == item_id)
    )
    result = await db.execute(stmt)
    s = result.scalars().first()
    if not s:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Siswa dengan id '{item_id}' tidak ditemukan",
        )

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(s, k, v)

    await commit_or_raise_unique_conflict(db)
    await db.refresh(s)
    return _to_response_dict(s)


@router.delete("/delete/{item_id}")
@router.delete("/{item_id}")
async def delete_siswa(
    item_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Hapus data siswa."""
    stmt = select(MasterSiswa).where(MasterSiswa.id == item_id)
    result = await db.execute(stmt)
    s = result.scalars().first()
    if not s:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Siswa dengan id '{item_id}' tidak ditemukan",
        )

    nama = s.nama
    await db.delete(s)
    await commit_or_raise_unique_conflict(
        db,
        conflict_message="Tidak dapat menghapus siswa karena masih terikat pada data lain",
    )
    return {"message": f"Siswa '{nama}' telah dihapus", "id": item_id}
