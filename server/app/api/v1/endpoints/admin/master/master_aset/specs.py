"""Resource definitions (search, ordering, validation, delete guards) for Master Aset."""

from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.endpoints.admin.master.master_aset import schemas as s
from app.api.v1.endpoints.admin.master.master_aset.factory import AsetMasterSpec, Row
from app.models.master.aset import (
    MasterAsetKapitalisasiMasaManfaat,
    MasterAsetKodeBarang,
    MasterAsetKondisiBarang,
    MasterAsetMasaManfaat,
    MasterAsetMetodePenyusutan,
    MasterAsetStatusPemilik,
)

KodeBarang = MasterAsetKodeBarang
Metode = MasterAsetMetodePenyusutan
MasaManfaat = MasterAsetMasaManfaat
Kapitalisasi = MasterAsetKapitalisasiMasaManfaat


def _like(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    return f"%{escaped}%"


def _conflict(detail: str) -> HTTPException:
    return HTTPException(status_code=409, detail=detail)


async def _count(db: AsyncSession, column: Any, value: Any) -> int:
    return (await db.execute(select(func.count()).where(column == value))).scalar_one()


# --- kode-barang ---------------------------------------------------------------------------


def _derive_kode_barang(data: Row) -> Row:
    kode: str = data["kode"]
    level = kode.count(".") + 1
    return {"level": level, "kode_induk": kode.rsplit(".", 1)[0] if level > 1 else None}


async def _guard_kode_barang(db: AsyncSession, obj: Any) -> None:
    if await _count(db, KodeBarang.kode_induk, obj.kode):
        raise _conflict("Kode masih memiliki kode turunan; hapus kode turunannya terlebih dahulu.")
    used_by = ((MasaManfaat, "Master Masa Manfaat"), (Kapitalisasi, "Master Kapitalisasi"))
    for model, label in used_by:
        if await _count(db, model.kode_barang, obj.kode):
            raise _conflict(f"Kode masih dipakai di {label}.")


# --- helpers shared by masa-manfaat / kapitalisasi -----------------------------------------


async def _uraian_by_kode(db: AsyncSession, kodes: set[str]) -> dict[str, str]:
    if not kodes:
        return {}
    rows = await db.execute(
        select(KodeBarang.kode, KodeBarang.uraian).where(KodeBarang.kode.in_(kodes))
    )
    return dict(rows.all())


async def _require_kode_barang(db: AsyncSession, kode: str) -> None:
    if not await _count(db, KodeBarang.kode, kode):
        raise HTTPException(
            status_code=422, detail=f"Kode barang {kode} belum ada di Master Kode Barang."
        )


# --- masa-manfaat --------------------------------------------------------------------------


async def _validate_masa_manfaat(db: AsyncSession, data: Row) -> None:
    await _require_kode_barang(db, data["kode_barang"])
    if not await _count(db, Metode.kode, data["metode_id"]):
        raise HTTPException(
            status_code=422,
            detail=f"Metode penyusutan {data['metode_id']} belum ada di Master Metode Penyusutan.",
        )


async def _enrich_masa_manfaat(db: AsyncSession, rows: list[Row]) -> None:
    uraian = await _uraian_by_kode(db, {r["kode_barang"] for r in rows})
    metode_ids = {r["metode_id"] for r in rows}
    metode: dict[int, str] = {}
    if metode_ids:
        found = await db.execute(
            select(Metode.kode, Metode.nama).where(Metode.kode.in_(metode_ids))
        )
        metode = dict(found.all())
    for row in rows:
        row["uraian_barang"] = uraian.get(row["kode_barang"])
        row["metode_nama"] = metode.get(row["metode_id"])


async def _guard_metode(db: AsyncSession, obj: Any) -> None:
    if await _count(db, MasaManfaat.metode_id, obj.kode):
        raise _conflict("Metode masih dipakai di Master Masa Manfaat.")


# --- kapitalisasi --------------------------------------------------------------------------


async def _validate_kapitalisasi(db: AsyncSession, data: Row) -> None:
    await _require_kode_barang(db, data["kode_barang"])
    if data["batas_atas_persen"] < data["batas_bawah_persen"]:
        raise HTTPException(
            status_code=422, detail="Batas atas tidak boleh lebih kecil dari batas bawah."
        )


async def _enrich_kapitalisasi(db: AsyncSession, rows: list[Row]) -> None:
    uraian = await _uraian_by_kode(db, {r["kode_barang"] for r in rows})
    for row in rows:
        row["uraian_barang"] = uraian.get(row["kode_barang"])


# --- spec table ----------------------------------------------------------------------------

SPECS: dict[str, AsetMasterSpec] = {
    "kode-barang": AsetMasterSpec(
        model=KodeBarang,
        create_schema=s.KodeBarangCreate,
        update_schema=s.KodeBarangUpdate,
        response_schema=s.KodeBarangResponse,
        code_attr="kode",
        option_label=lambda o: f"{o.kode} - {o.uraian}",
        search=lambda q: or_(
            KodeBarang.kode.ilike(_like(q), escape="\\"),
            KodeBarang.uraian.ilike(_like(q), escape="\\"),
        ),
        order_by=(KodeBarang.kode,),
        filters={"level": KodeBarang.level},
        lock_fields=("kode",),
        derive=_derive_kode_barang,
        guard_delete=_guard_kode_barang,
    ),
    "masa-manfaat": AsetMasterSpec(
        model=MasaManfaat,
        create_schema=s.MasaManfaatCreate,
        update_schema=s.MasaManfaatUpdate,
        response_schema=s.MasaManfaatResponse,
        code_attr="kode_barang",
        option_label=lambda o: f"{o.kode_barang} ({o.umur_tahun} tahun)",
        search=lambda q: or_(
            MasaManfaat.kode_barang.ilike(_like(q), escape="\\"),
            MasaManfaat.kode_barang.in_(
                select(KodeBarang.kode).where(KodeBarang.uraian.ilike(_like(q), escape="\\"))
            ),
        ),
        order_by=(MasaManfaat.tahun_berlaku.desc(), MasaManfaat.kode_barang),
        filters={"tahun_berlaku": MasaManfaat.tahun_berlaku},
        lock_fields=("kode_barang",),
        validate=_validate_masa_manfaat,
        enrich=_enrich_masa_manfaat,
    ),
    "metode-penyusutan": AsetMasterSpec(
        model=Metode,
        create_schema=s.MetodePenyusutanCreate,
        update_schema=s.MetodePenyusutanUpdate,
        response_schema=s.MetodePenyusutanResponse,
        code_attr="kode",
        option_label=lambda o: o.nama,
        search=lambda q: Metode.nama.ilike(_like(q), escape="\\"),
        order_by=(Metode.kode,),
        lock_fields=("kode",),
        guard_delete=_guard_metode,
    ),
    "kapitalisasi-masa-manfaat": AsetMasterSpec(
        model=Kapitalisasi,
        create_schema=s.KapitalisasiCreate,
        update_schema=s.KapitalisasiUpdate,
        response_schema=s.KapitalisasiResponse,
        code_attr="kode_barang",
        option_label=lambda o: f"{o.kode_barang} ({o.batas_bawah_persen}-{o.batas_atas_persen}%)",
        search=lambda q: or_(
            Kapitalisasi.kode_barang.ilike(_like(q), escape="\\"),
            Kapitalisasi.kode_barang.in_(
                select(KodeBarang.kode).where(KodeBarang.uraian.ilike(_like(q), escape="\\"))
            ),
        ),
        order_by=(
            Kapitalisasi.kode_barang,
            Kapitalisasi.jenis_kapitalisasi,
            Kapitalisasi.batas_bawah_persen,
        ),
        validate=_validate_kapitalisasi,
        enrich=_enrich_kapitalisasi,
    ),
    "kondisi-barang": AsetMasterSpec(
        model=MasterAsetKondisiBarang,
        create_schema=s.KondisiBarangCreate,
        update_schema=s.KondisiBarangUpdate,
        response_schema=s.KondisiBarangResponse,
        code_attr="kode",
        option_label=lambda o: o.uraian,
        search=lambda q: MasterAsetKondisiBarang.uraian.ilike(_like(q), escape="\\"),
        order_by=(MasterAsetKondisiBarang.kode,),
        lock_fields=("kode",),
    ),
    "status-pemilik": AsetMasterSpec(
        model=MasterAsetStatusPemilik,
        create_schema=s.StatusPemilikCreate,
        update_schema=s.StatusPemilikUpdate,
        response_schema=s.StatusPemilikResponse,
        code_attr="kode",
        option_label=lambda o: o.nama,
        search=lambda q: MasterAsetStatusPemilik.nama.ilike(_like(q), escape="\\"),
        order_by=(MasterAsetStatusPemilik.kode,),
        lock_fields=("kode",),
    ),
}
