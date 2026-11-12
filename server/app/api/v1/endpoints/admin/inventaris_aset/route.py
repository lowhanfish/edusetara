"""Admin BMD inventory: one register per physical asset, condition history with photos."""

import uuid
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy import func, or_, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased
from starlette.concurrency import run_in_threadpool

from app.api.deps import get_db, require_roles
from app.db.transaction import commit_or_raise_unique_conflict
from app.models.auth.user import User
from app.models.master.aset import MasterAsetKodeBarang as Barang
from app.models.master.aset import MasterAsetUnit as Unit
from app.models.operational.inventaris_aset import InventarisAset as Aset
from app.models.operational.inventaris_aset import RiwayatKondisiAset as Riwayat
from app.services.upload_service import BASE_UPLOAD_DIR

from .schema import AsetCreate, AsetDetail, AsetList, AsetResponse, AsetUpdate, PenempatanUpdate
from .service import (
    KIB_BY_PREFIX,
    Tempat,
    get_condition,
    inventory_query,
    serialize,
    validate_create,
    validate_item,
)

admin_access = require_roles("admin", "superadmin")
router = APIRouter(
    prefix="/inventaris-aset", tags=["Admin Inventaris Aset"], dependencies=[Depends(admin_access)]
)
MAX_PHOTO = 10 * 1024 * 1024


@router.get("", response_model=AsetList)
async def list_assets(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    sekolah_id: str | None = None,
    sub_unit_id: str | None = Query(None, min_length=1, max_length=50),
    kondisi_kode: int | None = None,
    kib: Literal["A", "B", "C", "D", "E", "F"] | None = None,
    tahun_perolehan: int | None = Query(None, ge=1900, le=2100),
    search: str = Query("", max_length=255),
    db: AsyncSession = Depends(get_db),
):
    query = inventory_query()
    if sekolah_id:
        query = query.where(
            or_(
                Unit.sekolah_id == sekolah_id,
                Unit.sekolah_kedua_id == sekolah_id,
                Tempat.sekolah_id == sekolah_id,
                Tempat.sekolah_kedua_id == sekolah_id,
            )
        )
    if sub_unit_id:
        parent = aliased(Unit)
        parent_code = (
            select(parent.kode)
            .where(parent.id == sub_unit_id, parent.tingkat == "sub_unit")
            .scalar_subquery()
        )
        query = query.where(or_(Unit.kode_induk == parent_code, Tempat.kode_induk == parent_code))
    if kondisi_kode is not None:
        query = query.where(Aset.kondisi_kode == kondisi_kode)
    if kib:
        query = query.where(Aset.kib == kib)
    if tahun_perolehan is not None:
        query = query.where(Aset.tahun_perolehan == tahun_perolehan)
    if search.strip():
        query = query.where(
            or_(
                Aset.nama.icontains(search.strip(), autoescape=True),
                Aset.kode_barang.icontains(search.strip(), autoescape=True),
                Aset.nomor_register.icontains(search.strip(), autoescape=True),
                Aset.keterangan.icontains(search.strip(), autoescape=True),
            )
        )
    subset = query.subquery()
    total, nilai = (
        await db.execute(
            select(func.count(), func.coalesce(func.sum(subset.c.nilai_perolehan), 0)).select_from(
                subset
            )
        )
    ).one()
    rows = (
        await db.execute(query.order_by(Aset.created_at.desc(), Aset.id).offset(skip).limit(limit))
    ).all()
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "nilai_total": nilai,
        "data": [serialize(row) for row in rows],
    }


@router.get("/pilihan-kode-barang")
async def code_options(search: str = Query("", max_length=255), db: AsyncSession = Depends(get_db)):
    query = select(Barang).where(
        Barang.level == 7,
        or_(*(Barang.kode.startswith(f"{prefix}.", autoescape=True) for prefix in KIB_BY_PREFIX)),
    )
    if search.strip():
        query = query.where(
            or_(
                Barang.kode.icontains(search.strip(), autoescape=True),
                Barang.uraian.icontains(search.strip(), autoescape=True),
            )
        )
    rows = (await db.execute(query.order_by(Barang.kode).limit(50))).scalars().all()
    return [{"id": item.kode, "value": f"{item.kode} · {item.uraian}"} for item in rows]


@router.get("/pilihan-tahun")
async def year_options(db: AsyncSession = Depends(get_db)):
    """Tahun perolehan yang benar-benar ada di inventaris, terbaru lebih dulu."""
    years = (
        (
            await db.execute(
                select(Aset.tahun_perolehan).distinct().order_by(Aset.tahun_perolehan.desc())
            )
        )
        .scalars()
        .all()
    )
    return [{"id": str(year), "value": str(year)} for year in years]


@router.get("/pilihan-sub-unit")
async def sub_unit_options(db: AsyncSession = Depends(get_db)):
    rows = (
        (await db.execute(select(Unit).where(Unit.tingkat == "sub_unit").order_by(Unit.kode)))
        .scalars()
        .all()
    )
    return [{"id": item.id, "value": f"{item.kode} · {item.nama}"} for item in rows]


@router.get("/pilihan-upb")
async def upb_options(search: str = Query("", max_length=255), db: AsyncSession = Depends(get_db)):
    """UPB sekolah untuk penempatan barang."""
    query = select(Unit).where(Unit.tingkat == "upb", Unit.jenis.notin_(("DINAS", "UPT")))
    if search.strip():
        query = query.where(
            or_(
                Unit.kode.icontains(search.strip(), autoescape=True),
                Unit.nama.icontains(search.strip(), autoescape=True),
                Unit.nama_lama.icontains(search.strip(), autoescape=True),
            )
        )
    rows = (await db.execute(query.order_by(Unit.kode).limit(50))).scalars().all()
    return [{"id": item.id, "value": f"{item.kode} · {item.nama}"} for item in rows]


@router.get("/{aset_id}", response_model=AsetDetail)
async def detail(aset_id: str, db: AsyncSession = Depends(get_db)):
    row = (await db.execute(inventory_query().where(Aset.id == aset_id))).one_or_none()
    if row is None:
        raise HTTPException(404, "Aset tidak ditemukan")
    history = (
        (
            await db.execute(
                select(Riwayat)
                .where(Riwayat.aset_id == aset_id)
                .order_by(Riwayat.version.desc(), Riwayat.created_at.desc(), Riwayat.id)
            )
        )
        .scalars()
        .all()
    )
    return {**serialize(row), "riwayat": history}


@router.post("", response_model=AsetResponse, status_code=201)
async def create(
    payload: AsetCreate, db: AsyncSession = Depends(get_db), user: User = Depends(admin_access)
):
    unit = await validate_create(db, payload)
    data = payload.model_dump(exclude={"sekolah_id"})
    asset_id = str(uuid.uuid4())
    obj = Aset(id=asset_id, upb_id=unit.id, version=1, created_by=user.username, **data)
    condition = await get_condition(db, payload.kondisi_kode)
    db.add(obj)
    # Flush the parent before its history; catch duplicate races at the unique constraint.
    try:
        await db.flush()
        db.add(
            Riwayat(
                aset_id=asset_id,
                kondisi_lama=None,
                kondisi_baru={"kode": condition.kode, "nama": condition.uraian},
                catatan="Pencatatan awal inventaris",
                version=1,
                created_by=user.username,
            )
        )
        await commit_or_raise_unique_conflict(db, "Register aset sudah tercatat")
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            409,
            "Register sudah tercatat atau referensi telah berubah. Muat ulang dan periksa data.",
        ) from exc
    except Exception:
        await db.rollback()
        raise
    return await detail(asset_id, db)


LABELS = {
    "kode_barang": "kode barang",
    "nomor_register": "nomor register",
    "kib": "KIB",
    "nama": "nama",
    "merk": "merk",
    "nomor_seri": "nomor seri",
    "tahun_perolehan": "tahun perolehan",
    "tanggal_perolehan": "tanggal perolehan",
    "nilai_perolehan": "nilai perolehan",
    "lokasi": "lokasi",
    "sumber_dana_id": "sumber dana",
    "keterangan": "keterangan",
}


@router.put("/{aset_id}", response_model=AsetDetail)
async def correct(
    aset_id: str,
    payload: AsetUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(admin_access),
):
    """Correct recorded data. Every correction is kept in the history with its reason."""
    obj = (
        await db.execute(select(Aset).where(Aset.id == aset_id).with_for_update())
    ).scalar_one_or_none()
    if obj is None:
        raise HTTPException(404, "Aset tidak ditemukan")
    if obj.version != payload.version:
        raise HTTPException(409, "Data aset sudah berubah. Muat ulang detail sebelum menyimpan.")
    await validate_item(db, payload, obj.upb_id, exclude_id=aset_id)
    data = payload.model_dump(exclude={"version", "alasan"})
    changes = [
        f"{LABELS[key]}: {getattr(obj, key) if getattr(obj, key) is not None else '—'}"
        f" → {value if value is not None else '—'}"
        for key, value in data.items()
        if getattr(obj, key) != value
    ]
    if not changes:
        raise HTTPException(422, "Tidak ada data yang diubah")
    condition = await get_condition(db, obj.kondisi_kode)
    snapshot = {"kode": condition.kode, "nama": condition.uraian}
    try:
        result = await db.execute(
            update(Aset)
            .where(Aset.id == aset_id, Aset.version == payload.version)
            .values(**data, version=payload.version + 1, updated_at=func.now())
        )
        if result.rowcount != 1:
            raise HTTPException(409, "Data aset sudah berubah. Muat ulang detail.")
        db.add(
            Riwayat(
                aset_id=aset_id,
                kondisi_lama=snapshot,
                kondisi_baru=snapshot,
                catatan=f"Koreksi data — {'; '.join(changes)}. Alasan: {payload.alasan}",
                version=payload.version + 1,
                created_by=user.username,
            )
        )
        await commit_or_raise_unique_conflict(db, "Register aset sudah tercatat")
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            409,
            "Register sudah tercatat atau referensi telah berubah. Muat ulang dan periksa data.",
        ) from exc
    except Exception:
        await db.rollback()
        raise
    db.expire_all()
    return await detail(aset_id, db)


@router.put("/{aset_id}/penempatan", response_model=AsetDetail)
async def place(
    aset_id: str,
    payload: PenempatanUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(admin_access),
):
    """Set or clear the school UPB where the asset is placed; the booking UPB is unchanged."""
    obj = (
        await db.execute(select(Aset).where(Aset.id == aset_id).with_for_update())
    ).scalar_one_or_none()
    if obj is None:
        raise HTTPException(404, "Aset tidak ditemukan")
    target = await db.get(Unit, payload.upb_id) if payload.upb_id else None
    if payload.upb_id and (target is None or target.tingkat != "upb"):
        raise HTTPException(422, "Pilih UPB sekolah dari Referensi Unit & UPB SIMDA")
    if target is not None and target.id == obj.upb_id:
        raise HTTPException(422, "Barang sudah dibukukan pada UPB ini")
    if (target.id if target else None) == obj.upb_penempatan_id and (
        target is None or obj.status_penempatan == "manual"
    ):
        raise HTTPException(422, "Penempatan tidak berubah")
    before = await db.get(Unit, obj.upb_penempatan_id) if obj.upb_penempatan_id else None
    condition = await get_condition(db, obj.kondisi_kode)
    snapshot = {"kode": condition.kode, "nama": condition.uraian}

    def label(unit, status=None):
        if unit is None:
            return "belum ditetapkan"
        return f"{unit.kode} {unit.nama}" + (" (otomatis)" if status == "otomatis" else "")

    obj.upb_penempatan_id = target.id if target else None
    note = f"Penempatan — {label(before, obj.status_penempatan)} → {label(target)}"
    obj.status_penempatan = "manual" if target else None
    # Placement is local data: the version is kept so SIMDA re-imports still refresh the item.
    db.add(
        Riwayat(
            aset_id=aset_id,
            kondisi_lama=snapshot,
            kondisi_baru=snapshot,
            catatan=note,
            version=obj.version,
            created_by=user.username,
        )
    )
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise
    db.expire_all()
    return await detail(aset_id, db)


async def read_photo(photo: UploadFile) -> tuple[bytes, str]:
    """Bound upload size and check raster signatures instead of trusting MIME or filename."""
    try:
        content = await photo.read(MAX_PHOTO + 1)
        if len(content) > MAX_PHOTO:
            raise HTTPException(413, "Foto maksimal 10 MB")
        extension = Path(photo.filename or "").suffix.lower()
        valid = (
            (extension in (".jpg", ".jpeg") and content.startswith(b"\xff\xd8\xff"))
            or (extension == ".png" and content.startswith(b"\x89PNG\r\n\x1a\n"))
            or (extension == ".webp" and content[:4] == b"RIFF" and content[8:12] == b"WEBP")
        )
        if not valid:
            raise HTTPException(422, "Gunakan foto JPG, PNG, atau WebP yang valid")
        return content, extension
    finally:
        await photo.close()


@router.post("/{aset_id}/kondisi", response_model=AsetDetail)
async def change_condition(
    aset_id: str,
    kondisi_kode: int = Form(...),
    version: int = Form(..., ge=1),
    catatan: str = Form(..., min_length=1, max_length=4000),
    foto: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(admin_access),
):
    note = catatan.strip()
    if not note:
        raise HTTPException(422, "Catatan pemeriksaan wajib diisi")
    obj = (
        await db.execute(select(Aset).where(Aset.id == aset_id).with_for_update())
    ).scalar_one_or_none()
    if obj is None:
        raise HTTPException(404, "Aset tidak ditemukan")
    if obj.version != version:
        raise HTTPException(409, "Data aset sudah berubah. Muat ulang detail sebelum menyimpan.")
    before = await get_condition(db, obj.kondisi_kode)
    after = await get_condition(db, kondisi_kode)
    content, extension = await read_photo(foto)
    folder = BASE_UPLOAD_DIR / "inventaris-aset"
    path = folder / f"{uuid.uuid4().hex}{extension}"
    url = f"/uploads/inventaris-aset/{path.name}"
    try:
        await run_in_threadpool(folder.mkdir, parents=True, exist_ok=True)
        await run_in_threadpool(path.write_bytes, content)
        # Version predicate also prevents lost updates on databases without FOR UPDATE support.
        result = await db.execute(
            update(Aset)
            .where(Aset.id == aset_id, Aset.version == version)
            .values(kondisi_kode=kondisi_kode, version=version + 1, updated_at=func.now())
        )
        if result.rowcount != 1:
            raise HTTPException(409, "Data aset sudah berubah. Muat ulang detail.")
        db.add(
            Riwayat(
                aset_id=aset_id,
                kondisi_lama={"kode": before.kode, "nama": before.uraian},
                kondisi_baru={"kode": after.kode, "nama": after.uraian},
                catatan=note,
                foto_url=url,
                version=version + 1,
                created_by=user.username,
            )
        )
        await db.commit()
    except Exception:
        await db.rollback()
        await run_in_threadpool(path.unlink, missing_ok=True)
        raise
    return await detail(aset_id, db)
