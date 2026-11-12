"""Expose existing asset references through Master Sekolah without duplicating SIMDA keys."""

from fastapi import HTTPException
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.master.aset import MasterAsetUnit as Unit
from app.models.master.sekolah import MasterSekolah
from ..master_aset.specs import _enrich_unit, _validate_unit


def unit_row(unit):
    return {column.name: getattr(unit, column.name) for column in Unit.__table__.columns}


async def enrich_schools(db: AsyncSession, schools: list[dict]) -> None:
    if not schools:
        return
    ids = [school["id"] for school in schools]
    units = (await db.execute(select(Unit).where(
        or_(Unit.sekolah_id.in_(ids), Unit.sekolah_kedua_id.in_(ids))
    ))).scalars().all()
    rows = [unit_row(unit) for unit in units]
    await _enrich_unit(db, rows)
    by_school = {sid: row for row in rows
                 for sid in (row["sekolah_id"], row["sekolah_kedua_id"]) if sid}
    for school in schools:
        school["simda_upb"] = by_school.get(school["id"])


async def set_school_upb(db: AsyncSession, sekolah_id: str, upb_id: str | None) -> None:
    school = (await db.execute(select(MasterSekolah).where(or_(
        MasterSekolah.id == sekolah_id, MasterSekolah.npsn == sekolah_id
    )).with_for_update())).scalars().first()
    if school is None:
        raise HTTPException(404, "Data sekolah tidak ditemukan")
    sid = school.id
    # Lock references in a stable order before moving an association.
    conditions = [Unit.sekolah_id == sid, Unit.sekolah_kedua_id == sid]
    if upb_id:
        conditions.append(Unit.id == upb_id)
    units = (await db.execute(select(Unit).where(or_(*conditions))
                            .order_by(Unit.kode).with_for_update())).scalars().all()
    target = next((unit for unit in units if unit.id == upb_id), None)
    if upb_id and (target is None or target.tingkat != "upb"):
        raise HTTPException(422, "Pilih referensi SIMDA tingkat UPB yang tersedia.")
    if target and sid not in (target.sekolah_id, target.sekolah_kedua_id):
        if target.status_pencocokan == "bukan_sekolah":
            raise HTTPException(422, "UPB ini ditandai bukan sekolah. Periksa referensi aset terlebih dahulu.")
        if target.sekolah_id and (target.jenis != "SATAP" or target.sekolah_kedua_id):
            raise HTTPException(409, "UPB sudah digunakan sekolah lain. Hanya UPB SATAP dapat dipakai dua sekolah.")
    for unit in units:
        if unit is target:
            continue
        if unit.sekolah_id == sid:
            unit.sekolah_id = unit.sekolah_kedua_id
            unit.sekolah_kedua_id = None
        elif unit.sekolah_kedua_id == sid:
            unit.sekolah_kedua_id = None
        if not unit.sekolah_id:
            unit.status_pencocokan = "belum"
    await db.flush()
    if target:
        if sid not in (target.sekolah_id, target.sekolah_kedua_id):
            if target.sekolah_id:
                target.sekolah_kedua_id = sid
                target.status_pencocokan = "otomatis"
            else:
                target.sekolah_id = sid
        # A shared UPB remains pending until its full association is reviewed in asset references.
        if not target.sekolah_kedua_id:
            target.status_pencocokan = "manual"
        await _validate_unit(db, unit_row(target))
    await db.flush()
