"""Master Data endpoints under /admin/master: Lookup, exact contract CRUD, and seeder."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_db
from app.core.exceptions import NotFoundException
from app.db.seed_master import seed_all_master_data
from app.db.transaction import commit_or_raise_unique_conflict
from app.global_schemas.master.schemas import (
    MasterItemCreate,
    MasterItemUpdate,
    MasterLookupResponse,
    MasterSiswaCreate,
    MasterSiswaUpdate,
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
    MasterSiswa,
    MasterTugas,
    MasterUsulanJenisPenerima,
    MasterUsulanKelasPenerima,
    MasterUsulanTriwulan,
)
from app.services.master.lookup_service import get_batch_lookups

# Router prefix is "/master", attached to admin_router (prefix="/admin")
router = APIRouter(prefix="/master", tags=["Admin Master Data"])

# Two-level resource mapping: /{category}/{submodule}
TWO_LEVEL_RESOURCES: dict[str, dict[str, Any]] = {
    "sarpras": {
        "bangunan": MasterSarprasBangunan,
        "kepemilikan": MasterSarprasKepemilikan,
        "sumber-dana": MasterSarprasSumberDana,
        "kondisi-alat": MasterSarprasKondisiAlat,
        "jenis-bantuan": MasterSarprasJenisBantuan,
    },
    "usulan": {
        "triwulan": MasterUsulanTriwulan,
        "jenis-penerima": MasterUsulanJenisPenerima,
        "kelas-penerima": MasterUsulanKelasPenerima,
    },
    "jurnal": {
        "bahan-ajar": MasterJurnalBahanAjar,
        "materi-ajar": MasterJurnalMateriAjar,
        "kelas": MasterJurnalKelas,
        "mata-pelajaran": MasterJurnalMataPelajaran,
    },
    "ppdb": {
        "agama": MasterPpdbAgama,
        "tempat-tinggal": MasterPpdbTempatTinggal,
        "transportasi": MasterPpdbTransportasi,
        "pendidikan": MasterPpdbPendidikan,
        "pekerjaan": MasterPpdbPekerjaan,
        "penghasilan": MasterPpdbPenghasilan,
    },
}

# One-level resource mapping: /{submodule}
ONE_LEVEL_RESOURCES: dict[str, Any] = {
    "jenjang": MasterJenjang,
    "bk-jenis-layanan": MasterBkJenisLayanan,
    "bk-kegiatan-layanan": MasterBkKegiatanLayanan,
    "model-pembelajaran": MasterModelPembelajaran,
    "pendampingan": MasterPendampingan,
    "tugas": MasterTugas,
    "kategori": MasterKategori,
}

# Flat path mapping for backward compatibility and lookup
MASTER_RESOURCE_MAP: dict[str, Any] = {
    **ONE_LEVEL_RESOURCES,
    **{
        f"{cat}/{sub}": model
        for cat, subs in TWO_LEVEL_RESOURCES.items()
        for sub, model in subs.items()
    },
}


# ======================== 1. Batch Lookup & Seeder ========================


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


# ======================== 2. Internal CRUD Helper Logic ========================


def _serialize_item(item: Any) -> dict[str, Any]:
    """Serialize master item object into API response format."""
    data = {
        "id": item.id,
        "uraian": getattr(item, "uraian", getattr(item, "title", str(item.id))),
        "nip": getattr(item, "nip", None),
        "unit_kerja": getattr(item, "unit_kerja", None),
        "created_by": getattr(item, "created_by", None),
        "created_at": getattr(item, "created_at", None),
        "updated_at": getattr(item, "updated_at", None),
    }
    if hasattr(item, "kelas_id"):
        data["kelas_id"] = item.kelas_id
        if hasattr(item, "kelas") and item.kelas:
            data["kelas_uraian"] = item.kelas.uraian
    return data


async def _list_items(
    session: AsyncSession,
    model: Any,
    label: str,
    search: str | None = None,
) -> dict[str, Any]:
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
        "message": f"Data master '{label}' berhasil diambil",
        "data": [_serialize_item(item) for item in items],
    }


async def _get_item(
    session: AsyncSession,
    model: Any,
    label: str,
    item_id: str,
) -> dict[str, Any]:
    stmt = select(model).where(model.id == item_id)
    result = await session.execute(stmt)
    item = result.scalars().first()
    if not item:
        raise NotFoundException(f"Data master '{label}' dengan id '{item_id}' tidak ditemukan")
    return {
        "success": True,
        "statusCode": 200,
        "message": f"Data master '{label}' berhasil diambil",
        "data": _serialize_item(item),
    }


async def _create_item(
    session: AsyncSession,
    model: Any,
    label: str,
    payload: MasterItemCreate,
    current_user: User,
) -> dict[str, Any]:
    item_id = payload.id or str(uuid.uuid4())
    item_data: dict[str, Any] = {
        "id": item_id,
        "uraian": payload.uraian,
        "created_by": current_user.username,
    }
    if hasattr(model, "nip"):
        item_data["nip"] = payload.nip or current_user.nip
    if hasattr(model, "unit_kerja"):
        item_data["unit_kerja"] = payload.unit_kerja or current_user.instansi_id
    if hasattr(model, "kelas_id") and payload.kelas_id is not None:
        item_data["kelas_id"] = payload.kelas_id

    instance = model(**item_data)
    session.add(instance)
    await commit_or_raise_unique_conflict(
        session,
        conflict_message=f"Item master dengan id atau uraian '{payload.uraian}' sudah terdaftar",
    )
    await session.refresh(instance)
    return {
        "success": True,
        "statusCode": 201,
        "message": f"Data master '{label}' berhasil ditambahkan",
        "data": _serialize_item(instance),
    }


async def _update_item(
    session: AsyncSession,
    model: Any,
    label: str,
    item_id: str,
    payload: MasterItemUpdate,
) -> dict[str, Any]:
    stmt = select(model).where(model.id == item_id)
    result = await session.execute(stmt)
    item = result.scalars().first()
    if not item:
        raise NotFoundException(f"Data master '{label}' dengan id '{item_id}' tidak ditemukan")

    if payload.uraian is not None and hasattr(item, "uraian"):
        item.uraian = payload.uraian
    if payload.nip is not None and hasattr(item, "nip"):
        item.nip = payload.nip
    if payload.unit_kerja is not None and hasattr(item, "unit_kerja"):
        item.unit_kerja = payload.unit_kerja
    if payload.kelas_id is not None and hasattr(item, "kelas_id"):
        item.kelas_id = payload.kelas_id

    await commit_or_raise_unique_conflict(session)
    await session.refresh(item)
    return {
        "success": True,
        "statusCode": 200,
        "message": f"Data master '{label}' berhasil diperbarui",
        "data": _serialize_item(item),
    }


async def _delete_item(
    session: AsyncSession,
    model: Any,
    label: str,
    item_id: str,
) -> dict[str, Any]:
    stmt = select(model).where(model.id == item_id)
    result = await session.execute(stmt)
    item = result.scalars().first()
    if not item:
        raise NotFoundException(f"Data master '{label}' dengan id '{item_id}' tidak ditemukan")

    await session.delete(item)
    await commit_or_raise_unique_conflict(
        session,
        conflict_message="Tidak dapat menghapus data master karena masih digunakan oleh data lain",
    )
    return {
        "success": True,
        "statusCode": 200,
        "message": f"Data master '{label}' berhasil dihapus",
        "data": {"id": item_id},
    }


def _get_two_level_model(category: str, submodule: str) -> Any:
    cat = TWO_LEVEL_RESOURCES.get(category.lower())
    if not cat:
        raise NotFoundException(f"Kategori master '{category}' tidak ditemukan")
    model = cat.get(submodule.lower())
    if not model:
        raise NotFoundException(f"Submodul master '{category}/{submodule}' tidak ditemukan")
    return model


def _get_one_level_model(submodule: str) -> Any:
    model = ONE_LEVEL_RESOURCES.get(submodule.lower())
    if not model:
        raise NotFoundException(f"Master resource '{submodule}' tidak ditemukan")
    return model


# ======================== 3. Dedicated CRUD: Master Siswa (/siswa) ========================


@router.get("/siswa")
async def list_master_siswa(
    search: str | None = None,
    kelas_id: str | None = None,
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """List Master Siswa aktif."""
    stmt = select(MasterSiswa).options(selectinload(MasterSiswa.kelas))
    if search:
        stmt = stmt.where(
            (MasterSiswa.nama.ilike(f"%{search}%"))
            | (MasterSiswa.nisn.ilike(f"%{search}%"))
            | (MasterSiswa.nik.ilike(f"%{search}%"))
        )
    if kelas_id:
        stmt = stmt.where(MasterSiswa.kelas_id == kelas_id)

    stmt = stmt.order_by(MasterSiswa.nama.asc())
    result = await session.execute(stmt)
    items = result.scalars().all()

    return {
        "success": True,
        "statusCode": 200,
        "message": "Data master siswa berhasil diambil",
        "data": [
            {
                "id": s.id,
                "nama": s.nama,
                "nisn": s.nisn,
                "nik": s.nik,
                "jns_kelamin": s.jns_kelamin,
                "kelas_id": s.kelas_id,
                "kelas_uraian": s.kelas.uraian if s.kelas else None,
                "tmp_lahir": s.tmp_lahir,
                "tgl_lahir": s.tgl_lahir.isoformat() if s.tgl_lahir else None,
                "agama": s.agama,
                "alamat": s.alamat,
                "nama_ayah": s.nama_ayah,
                "nama_ibu": s.nama_ibu,
                "nama_wali": s.nama_wali,
                "file": s.file,
                "nip": s.nip,
                "unit_kerja": s.unit_kerja,
                "unit_kerja_id": s.unit_kerja_id,
                "created_at": s.created_at,
            }
            for s in items
        ],
    }


@router.get("/siswa/{item_id}")
async def get_master_siswa(
    item_id: str,
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Detail satu siswa."""
    stmt = (
        select(MasterSiswa)
        .options(selectinload(MasterSiswa.kelas))
        .where(MasterSiswa.id == item_id)
    )
    result = await session.execute(stmt)
    s = result.scalars().first()
    if not s:
        raise NotFoundException(f"Siswa dengan id '{item_id}' tidak ditemukan")

    return {
        "success": True,
        "statusCode": 200,
        "message": "Data siswa berhasil diambil",
        "data": {
            "id": s.id,
            "nama": s.nama,
            "nisn": s.nisn,
            "nik": s.nik,
            "jns_kelamin": s.jns_kelamin,
            "kelas_id": s.kelas_id,
            "kelas_uraian": s.kelas.uraian if s.kelas else None,
            "tmp_lahir": s.tmp_lahir,
            "tgl_lahir": s.tgl_lahir.isoformat() if s.tgl_lahir else None,
            "agama": s.agama,
            "alamat": s.alamat,
            "nama_ayah": s.nama_ayah,
            "nama_ibu": s.nama_ibu,
            "nama_wali": s.nama_wali,
            "file": s.file,
            "nip": s.nip,
            "unit_kerja": s.unit_kerja,
            "unit_kerja_id": s.unit_kerja_id,
            "created_at": s.created_at,
        },
    }


@router.post("/siswa", status_code=status.HTTP_201_CREATED)
async def create_master_siswa(
    payload: MasterSiswaCreate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Tambah data siswa baru."""
    siswa_id = payload.id or str(uuid.uuid4())
    data = payload.model_dump(exclude_unset=True)
    data["id"] = siswa_id
    data["created_by"] = current_user.username
    if not data.get("nip"):
        data["nip"] = current_user.nip
    if not data.get("unit_kerja"):
        data["unit_kerja"] = current_user.instansi_id

    instance = MasterSiswa(**data)
    session.add(instance)
    await commit_or_raise_unique_conflict(
        session,
        conflict_message=(
            f"Siswa dengan NISN '{payload.nisn}' atau NIK '{payload.nik}' sudah terdaftar"
        ),
    )
    await session.refresh(instance)

    return {
        "success": True,
        "statusCode": 201,
        "message": "Data siswa berhasil ditambahkan",
        "data": {"id": instance.id, "nama": instance.nama, "nisn": instance.nisn},
    }


@router.put("/siswa/{item_id}")
async def update_master_siswa(
    item_id: str,
    payload: MasterSiswaUpdate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Update data siswa."""
    stmt = select(MasterSiswa).where(MasterSiswa.id == item_id)
    result = await session.execute(stmt)
    s = result.scalars().first()
    if not s:
        raise NotFoundException(f"Siswa dengan id '{item_id}' tidak ditemukan")

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(s, k, v)

    await commit_or_raise_unique_conflict(session)
    await session.refresh(s)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Data siswa berhasil diperbarui",
        "data": {"id": s.id, "nama": s.nama, "nisn": s.nisn},
    }


@router.delete("/siswa/{item_id}")
async def delete_master_siswa(
    item_id: str,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Hapus data siswa."""
    stmt = select(MasterSiswa).where(MasterSiswa.id == item_id)
    result = await session.execute(stmt)
    s = result.scalars().first()
    if not s:
        raise NotFoundException(f"Siswa dengan id '{item_id}' tidak ditemukan")

    await session.delete(s)
    await commit_or_raise_unique_conflict(session)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Data siswa berhasil dihapus",
        "data": {"id": item_id},
    }


# ======================== 4. Exact Contract Routes ========================

# --- A. 3-Segment Routes: /{category}/{submodule}/{item_id} (GET, PUT, DELETE) ---


@router.get("/{category}/{submodule}/{item_id}")
async def get_two_level_master_item(
    category: str,
    submodule: str,
    item_id: str,
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Detail satu item master kategori berjenjang (contoh: /sarpras/bangunan/KBG-01)."""
    model = _get_two_level_model(category, submodule)
    return await _get_item(session, model, f"{category}/{submodule}", item_id)


@router.put("/{category}/{submodule}/{item_id}")
async def update_two_level_master_item(
    category: str,
    submodule: str,
    item_id: str,
    payload: MasterItemUpdate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Update item master kategori berjenjang (contoh: /sarpras/bangunan/KBG-01)."""
    model = _get_two_level_model(category, submodule)
    return await _update_item(session, model, f"{category}/{submodule}", item_id, payload)


@router.delete("/{category}/{submodule}/{item_id}")
async def delete_two_level_master_item(
    category: str,
    submodule: str,
    item_id: str,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Hapus item master kategori berjenjang (contoh: /sarpras/bangunan/KBG-01)."""
    model = _get_two_level_model(category, submodule)
    return await _delete_item(session, model, f"{category}/{submodule}", item_id)


# --- B. 2-Segment Routes: /{seg1}/{seg2} ---


@router.get("/{seg1}/{seg2}")
async def get_or_list_two_segment_master(
    seg1: str,
    seg2: str,
    search: str | None = None,
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Handle 2-segment GET:
    1. Kategori berjenjang: list data /category/submodule (e.g. /sarpras/bangunan).
    2. Submodul tunggal: ambil detail by ID (e.g. /jenjang/JJG-01).
    """
    seg1_clean = seg1.lower()
    if seg1_clean in TWO_LEVEL_RESOURCES:
        model = _get_two_level_model(seg1, seg2)
        return await _list_items(session, model, f"{seg1}/{seg2}", search)

    if seg1_clean in ONE_LEVEL_RESOURCES:
        model = _get_one_level_model(seg1)
        return await _get_item(session, model, seg1, seg2)

    raise NotFoundException(f"Master endpoint '{seg1}/{seg2}' tidak ditemukan")


@router.post("/{category}/{submodule}", status_code=status.HTTP_201_CREATED)
async def create_two_level_master_item(
    category: str,
    submodule: str,
    payload: MasterItemCreate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Tambah item baru pada master kategori berjenjang (contoh: POST /sarpras/bangunan)."""
    model = _get_two_level_model(category, submodule)
    return await _create_item(session, model, f"{category}/{submodule}", payload, current_user)


@router.put("/{submodule}/{item_id}")
async def update_one_level_master_item(
    submodule: str,
    item_id: str,
    payload: MasterItemUpdate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Update item master tingkat tunggal (contoh: PUT /jenjang/JJG-01)."""
    model = _get_one_level_model(submodule)
    return await _update_item(session, model, submodule, item_id, payload)


@router.delete("/{submodule}/{item_id}")
async def delete_one_level_master_item(
    submodule: str,
    item_id: str,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Hapus item master tingkat tunggal (contoh: DELETE /jenjang/JJG-01)."""
    model = _get_one_level_model(submodule)
    return await _delete_item(session, model, submodule, item_id)


# --- C. 1-Segment Routes: /{submodule} ---


@router.get("/{submodule}")
async def list_one_level_master(
    submodule: str,
    search: str | None = None,
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """List data master tingkat tunggal (contoh: GET /jenjang, GET /kategori)."""
    model = _get_one_level_model(submodule)
    return await _list_items(session, model, submodule, search)


@router.post("/{submodule}", status_code=status.HTTP_201_CREATED)
async def create_one_level_master_item(
    submodule: str,
    payload: MasterItemCreate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Tambah data master tingkat tunggal baru (contoh: POST /jenjang)."""
    model = _get_one_level_model(submodule)
    return await _create_item(session, model, submodule, payload, current_user)


# ======================== 5. Backward Compatibility: /resource/{path:path} ========================


@router.get("/resource/{path:path}")
async def list_master_resource_compat(
    path: str,
    search: str | None = None,
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    clean_path = path.strip("/").lower()
    model = MASTER_RESOURCE_MAP.get(clean_path)
    if not model:
        raise NotFoundException(f"Master resource '{path}' tidak ditemukan.")
    return await _list_items(session, model, path, search)


@router.post("/resource/{path:path}", status_code=status.HTTP_201_CREATED)
async def create_master_resource_compat(
    path: str,
    payload: MasterItemCreate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    clean_path = path.strip("/").lower()
    model = MASTER_RESOURCE_MAP.get(clean_path)
    if not model:
        raise NotFoundException(f"Master resource '{path}' tidak ditemukan.")
    return await _create_item(session, model, path, payload, current_user)


@router.put("/resource/{path:path}/{item_id}")
async def update_master_resource_compat(
    path: str,
    item_id: str,
    payload: MasterItemUpdate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    clean_path = path.strip("/").lower()
    model = MASTER_RESOURCE_MAP.get(clean_path)
    if not model:
        raise NotFoundException(f"Master resource '{path}' tidak ditemukan.")
    return await _update_item(session, model, path, item_id, payload)


@router.delete("/resource/{path:path}/{item_id}")
async def delete_master_resource_compat(
    path: str,
    item_id: str,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    clean_path = path.strip("/").lower()
    model = MASTER_RESOURCE_MAP.get(clean_path)
    if not model:
        raise NotFoundException(f"Master resource '{path}' tidak ditemukan.")
    return await _delete_item(session, model, path, item_id)
