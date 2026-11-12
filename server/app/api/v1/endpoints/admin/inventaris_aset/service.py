"""Shared inventory queries and transactional writes."""

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.master.aset import MasterAsetKodeBarang as Barang
from app.models.master.aset import MasterAsetKondisiBarang as Kondisi
from app.models.master.aset import MasterAsetUnit as Unit
from app.models.master.sarpras import MasterSarprasSumberDana as Sumber
from app.models.master.sekolah import MasterSekolah
from app.models.operational.inventaris_aset import InventarisAset as Aset

# Kode barang level 3 (Permendagri 108/2016) menentukan kelompok KIB.
KIB_BY_PREFIX = {
    "01.03.01": "A",
    "01.03.02": "B",
    "01.03.03": "C",
    "01.03.04": "D",
    "01.03.05": "E",
    "01.03.06": "F",
}


def kib_of(kode_barang: str) -> str | None:
    return KIB_BY_PREFIX.get(".".join(kode_barang.split(".")[:3]))


def inventory_query():
    return (
        select(
            Aset,
            Unit.kode.label("upb_kode"),
            Unit.nama.label("upb_nama"),
            Barang.uraian.label("uraian_barang"),
            Kondisi.uraian.label("kondisi_nama"),
            Sumber.uraian.label("sumber_dana_nama"),
        )
        .join(Unit, Unit.id == Aset.upb_id)
        .join(Barang, Barang.kode == Aset.kode_barang)
        .join(Kondisi, Kondisi.kode == Aset.kondisi_kode)
        .outerjoin(Sumber, Sumber.id == Aset.sumber_dana_id)
    )


def serialize(row):
    obj = row[0]
    return {
        **{c.name: getattr(obj, c.name) for c in Aset.__table__.columns},
        **{
            key: getattr(row, key)
            for key in ("upb_kode", "upb_nama", "uraian_barang", "kondisi_nama", "sumber_dana_nama")
        },
    }


async def school_upb(db: AsyncSession, school_id: str):
    school = await db.get(MasterSekolah, school_id)
    if school is None or not school.is_active:
        raise HTTPException(404, "Sekolah aktif tidak ditemukan")
    units = (
        (
            await db.execute(
                select(Unit).where(
                    Unit.tingkat == "upb",
                    or_(Unit.sekolah_id == school_id, Unit.sekolah_kedua_id == school_id),
                )
            )
        )
        .scalars()
        .all()
    )
    if len(units) != 1:
        raise HTTPException(
            422, "Sekolah harus terhubung ke tepat satu UPB SIMDA. Periksa Master Sekolah."
        )
    if units[0].status_pencocokan != "manual":
        raise HTTPException(422, "Verifikasi padanan UPB di Master Sekolah sebelum mencatat aset.")
    return units[0]


async def get_condition(db: AsyncSession, kode: int):
    condition = (await db.execute(select(Kondisi).where(Kondisi.kode == kode))).scalar_one_or_none()
    if condition is None:
        raise HTTPException(422, "Kondisi barang tidak ditemukan di Master Aset")
    return condition


async def validate_item(db: AsyncSession, payload, upb_id: str, exclude_id: str | None = None):
    """Reference, KIB and register checks shared by initial recording and data correction."""
    barang = (
        await db.execute(select(Barang).where(Barang.kode == payload.kode_barang))
    ).scalar_one_or_none()
    if barang is None or barang.level != 7:
        raise HTTPException(422, "Pilih kode barang rinci (level 7) dari Master Aset")
    kib = kib_of(payload.kode_barang)
    if kib is None:
        raise HTTPException(422, "Kode barang bukan aset tetap KIB A–F")
    if payload.kib != kib:
        raise HTTPException(422, f"Kode barang {payload.kode_barang} termasuk KIB {kib}")
    if payload.sumber_dana_id and await db.get(Sumber, payload.sumber_dana_id) is None:
        raise HTTPException(422, "Sumber dana tidak ditemukan")
    query = (
        select(func.count())
        .select_from(Aset)
        .where(
            Aset.upb_id == upb_id,
            Aset.kode_barang == payload.kode_barang,
            Aset.tahun_perolehan == payload.tahun_perolehan,
            Aset.nomor_register == payload.nomor_register,
        )
    )
    if exclude_id:
        query = query.where(Aset.id != exclude_id)
    if await db.scalar(query):
        raise HTTPException(
            409, "Register sudah tercatat untuk UPB, kode barang, dan tahun perolehan ini"
        )


async def validate_create(db: AsyncSession, payload):
    unit = await school_upb(db, payload.sekolah_id)
    await get_condition(db, payload.kondisi_kode)
    await validate_item(db, payload, unit.id)
    return unit
