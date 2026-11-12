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


async def validate_create(db: AsyncSession, payload):
    unit = await school_upb(db, payload.sekolah_id)
    barang = (
        await db.execute(select(Barang).where(Barang.kode == payload.kode_barang))
    ).scalar_one_or_none()
    if barang is None or barang.level != 7:
        raise HTTPException(422, "Pilih kode barang rinci (level 7) dari Master Aset")
    await get_condition(db, payload.kondisi_kode)
    if payload.sumber_dana_id and await db.get(Sumber, payload.sumber_dana_id) is None:
        raise HTTPException(422, "Sumber dana tidak ditemukan")
    duplicate = await db.scalar(
        select(func.count())
        .select_from(Aset)
        .where(
            Aset.upb_id == unit.id,
            Aset.kode_barang == payload.kode_barang,
            Aset.tahun_perolehan == payload.tahun_perolehan,
            Aset.nomor_register == payload.nomor_register,
        )
    )
    if duplicate:
        raise HTTPException(
            409, "Register sudah tercatat untuk UPB, kode barang, dan tahun perolehan ini"
        )
    return unit
