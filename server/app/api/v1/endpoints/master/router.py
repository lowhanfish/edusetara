"""Master Data endpoints: Lookup, CRUD resources, and initial seeding."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.core.exceptions import NotFoundException
from app.db.seed_master import seed_all_master_data
from app.db.transaction import commit_or_raise_unique_conflict
from app.global_schemas.master.schemas import (
    MasterItemCreate,
    MasterItemUpdate,
    MasterLookupResponse,
)
from app.models.auth.user import User
from app.models.master import (
    MasterBkJenisLayanan,
    MasterBkKegiatanLayanan,
    MasterJenjang,
    MasterJurnalBahanAjar,
    MasterJurnalKelas,
    MasterJurnalMataPelajaran,
    MasterJurnalMateriAjar,
    MasterKategori,
    MasterModelPembelajaran,
    MasterPendampingan,
    MasterPpdbAgama,
    MasterPpdbPekerjaan,
    MasterPpdbPendidikan,
    MasterPpdbPenghasilan,
    MasterPpdbTempatTinggal,
    MasterPpdbTransportasi,
    MasterSarprasBangunan,
    MasterSarprasJenisBantuan,
    MasterSarprasKepemilikan,
    MasterSarprasKondisiAlat,
    MasterSarprasSumberDana,
    MasterTugas,
    MasterUsulanJenisPenerima,
    MasterUsulanKelasPenerima,
    MasterUsulanTriwulan,
)
from app.services.master.lookup_service import get_batch_lookups

router = APIRouter(prefix="/admin/master", tags=["Admin Master Data"])

# Path mapping for master resources
MASTER_RESOURCE_MAP: dict[str, Any] = {
    # Sarpras
    "sarpras/bangunan": MasterSarprasBangunan,
    "sarpras/kepemilikan": MasterSarprasKepemilikan,
    "sarpras/sumber-dana": MasterSarprasSumberDana,
    "sarpras/kondisi-alat": MasterSarprasKondisiAlat,
    "sarpras/jenis-bantuan": MasterSarprasJenisBantuan,
    # Usulan
    "usulan/triwulan": MasterUsulanTriwulan,
    "usulan/jenis-penerima": MasterUsulanJenisPenerima,
    "usulan/kelas-penerima": MasterUsulanKelasPenerima,
    # Jurnal
    "jurnal/bahan-ajar": MasterJurnalBahanAjar,
    "jurnal/materi-ajar": MasterJurnalMateriAjar,
    "jurnal/kelas": MasterJurnalKelas,
    "jurnal/mata-pelajaran": MasterJurnalMataPelajaran,
    # Jenjang
    "jenjang": MasterJenjang,
    # PPDB
    "ppdb/agama": MasterPpdbAgama,
    "ppdb/tempat-tinggal": MasterPpdbTempatTinggal,
    "ppdb/transportasi": MasterPpdbTransportasi,
    "ppdb/pendidikan": MasterPpdbPendidikan,
    "ppdb/pekerjaan": MasterPpdbPekerjaan,
    "ppdb/penghasilan": MasterPpdbPenghasilan,
    # Pelengkap
    "bk-jenis-layanan": MasterBkJenisLayanan,
    "bk-kegiatan-layanan": MasterBkKegiatanLayanan,
    "model-pembelajaran": MasterModelPembelajaran,
    "pendampingan": MasterPendampingan,
    "tugas": MasterTugas,
    "kategori": MasterKategori,
}


@router.get("/lookup", response_model=MasterLookupResponse)
async def get_master_lookup(
    keys: str | None = Query(
        None,
        description="Comma-separated master keys (e.g. 'kepemilikan,bangunan,sumber_dana')",
    ),
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Combined batch lookup endpoint for frontend dropdowns.
    Returns options list { key: [ { id, uraian }, ... ] }.
    """
    key_list = [k.strip() for k in keys.split(",")] if keys else None
    data = await get_batch_lookups(session, key_list)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Master lookup retrieved successfully",
        "data": data,
    }


@router.post("/seed")
async def run_master_seed(
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Seed default master reference data from API_CONTRACT_ADMIN.md."""
    counts = await seed_all_master_data(session)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Master data seed completed successfully",
        "data": counts,
    }


def _get_model_for_path(path: str) -> Any:
    clean_path = path.strip("/").lower()
    model = MASTER_RESOURCE_MAP.get(clean_path)
    if not model:
        raise NotFoundException(f"Master resource '{path}' tidak ditemukan.")
    return model


@router.get("/resource/{path:path}")
async def list_master_resource(
    path: str,
    search: str | None = None,
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """List master items for a specified resource path."""
    model = _get_model_for_path(path)
    stmt = select(model)

    if search and hasattr(model, "uraian"):
        stmt = stmt.where(model.uraian.ilike(f"%{search}%"))

    if hasattr(model, "uraian"):
        stmt = stmt.order_by(model.uraian.asc())

    result = await session.execute(stmt)
    items = result.scalars().all()

    return {
        "success": True,
        "statusCode": 200,
        "message": f"Data master '{path}' berhasil diambil",
        "data": [
            {
                "id": item.id,
                "uraian": getattr(item, "uraian", getattr(item, "title", str(item.id))),
                "nip": getattr(item, "nip", None),
                "unit_kerja": getattr(item, "unit_kerja", None),
                "created_by": getattr(item, "created_by", None),
                "created_at": getattr(item, "created_at", None),
            }
            for item in items
        ],
    }


@router.post("/resource/{path:path}", status_code=status.HTTP_201_CREATED)
async def create_master_resource(
    path: str,
    payload: MasterItemCreate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Create a new master item for a specified resource path."""
    model = _get_model_for_path(path)
    item_id = payload.id or str(uuid.uuid4())

    item_data = {
        "id": item_id,
        "uraian": payload.uraian,
        "created_by": current_user.username,
    }
    if hasattr(model, "nip"):
        item_data["nip"] = payload.nip or current_user.nip
    if hasattr(model, "unit_kerja"):
        item_data["unit_kerja"] = payload.unit_kerja or current_user.instansi_id

    instance = model(**item_data)
    session.add(instance)
    await commit_or_raise_unique_conflict(
        session,
        conflict_message=f"Item master dengan id atau uraian '{payload.uraian}' sudah terdaftar",
    )

    return {
        "success": True,
        "statusCode": 201,
        "message": f"Data master '{path}' berhasil ditambahkan",
        "data": {
            "id": instance.id,
            "uraian": instance.uraian,
        },
    }


@router.put("/resource/{path:path}/{item_id}")
async def update_master_resource(
    path: str,
    item_id: str,
    payload: MasterItemUpdate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Update an existing master item."""
    model = _get_model_for_path(path)
    stmt = select(model).where(model.id == item_id)
    result = await session.execute(stmt)
    item = result.scalars().first()

    if not item:
        raise NotFoundException(f"Item master dengan id '{item_id}' tidak ditemukan")

    if payload.uraian is not None:
        item.uraian = payload.uraian
    if payload.nip is not None and hasattr(item, "nip"):
        item.nip = payload.nip
    if payload.unit_kerja is not None and hasattr(item, "unit_kerja"):
        item.unit_kerja = payload.unit_kerja

    await commit_or_raise_unique_conflict(session)

    return {
        "success": True,
        "statusCode": 200,
        "message": f"Data master '{path}' berhasil diperbarui",
        "data": {
            "id": item.id,
            "uraian": getattr(item, "uraian", ""),
        },
    }


@router.delete("/resource/{path:path}/{item_id}")
async def delete_master_resource(
    path: str,
    item_id: str,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Delete a master item."""
    model = _get_model_for_path(path)
    stmt = select(model).where(model.id == item_id)
    result = await session.execute(stmt)
    item = result.scalars().first()

    if not item:
        raise NotFoundException(f"Item master dengan id '{item_id}' tidak ditemukan")

    await session.delete(item)
    await commit_or_raise_unique_conflict(
        session,
        conflict_message="Tidak dapat menghapus data master karena masih digunakan oleh data lain",
    )

    return {
        "success": True,
        "statusCode": 200,
        "message": f"Data master '{path}' berhasil dihapus",
        "data": {"id": item_id},
    }
