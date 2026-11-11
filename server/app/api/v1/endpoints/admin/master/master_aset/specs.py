"""Resource definitions (search, ordering, validation, delete guards) for Master Aset."""

from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.endpoints.admin.master.master_aset import schemas as s
from app.api.v1.endpoints.admin.master.master_aset.factory import AsetMasterSpec, Row
from app.models.master.aset import (
    MasterAsetAlasanPenghapusan,
    MasterAsetKapitalisasiMasaManfaat,
    MasterAsetKodeBarang,
    MasterAsetKondisiBarang,
    MasterAsetMasaManfaat,
    MasterAsetMetodePenyusutan,
    MasterAsetNilaiMinimumKapitalisasi,
    MasterAsetStatusPemilik,
    MasterAsetUnit,
)
from app.models.master.sekolah import MasterSekolah

KodeBarang = MasterAsetKodeBarang
Metode = MasterAsetMetodePenyusutan
MasaManfaat = MasterAsetMasaManfaat
Kapitalisasi = MasterAsetKapitalisasiMasaManfaat
NilaiMinimum = MasterAsetNilaiMinimumKapitalisasi
Unit = MasterAsetUnit


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
    used_by = (
        (MasaManfaat, "Master Masa Manfaat"),
        (Kapitalisasi, "Master Kapitalisasi"),
        (NilaiMinimum, "Master Nilai Minimum Kapitalisasi"),
    )
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


# --- unit-sekolah --------------------------------------------------------------------------


def unit_kode(kd_bidang: int, kd_unit: int, kd_sub: int | None, kd_upb: int | None) -> str:
    """Kode bertitik dari kunci SIMDA: 08.01 (unit), 08.01.002 (sub unit), 08.01.002.003 (UPB)."""
    kode = f"{kd_bidang:02d}.{kd_unit:02d}"
    if kd_sub is not None:
        kode += f".{kd_sub:03d}"
        if kd_upb is not None:
            kode += f".{kd_upb:03d}"
    return kode


def derive_unit(data: Row) -> Row:
    kode = unit_kode(data["kd_bidang"], data["kd_unit"], data.get("kd_sub"), data.get("kd_upb"))
    level = kode.count(".")
    return {
        "kode": kode,
        "tingkat": ("unit", "sub_unit", "upb")[level - 1],
        "kode_induk": kode.rsplit(".", 1)[0] if level > 1 else None,
    }


async def _validate_unit(db: AsyncSession, data: Row) -> None:
    def invalid(detail: str) -> HTTPException:
        return HTTPException(status_code=422, detail=detail)

    if data.get("kd_upb") is not None and data.get("kd_sub") is None:
        raise invalid("Kode UPB memerlukan kode sub unit.")
    derived = derive_unit(data)
    induk = derived["kode_induk"]
    if induk and not await _count(db, Unit.kode, induk):
        raise invalid(f"Induk {induk} belum ada di Master Unit & Sekolah.")

    utama, kedua = data.get("sekolah_id"), data.get("sekolah_kedua_id")
    status = data["status_pencocokan"]
    if (utama or kedua) and derived["tingkat"] != "upb":
        raise invalid("Padanan sekolah hanya dapat diisi pada tingkat UPB.")
    if kedua and not utama:
        raise invalid("Sekolah kedua hanya diisi bila padanan utama sudah dipilih.")
    if kedua and kedua == utama:
        raise invalid("Sekolah kedua tidak boleh sama dengan padanan utama.")
    if status in ("otomatis", "manual") and not utama:
        raise invalid("Status pencocokan ini memerlukan padanan di Master Sekolah.")
    if status in ("belum", "bukan_sekolah") and utama:
        raise invalid("Lepas padanan sekolah atau ubah status pencocokannya.")

    for sekolah_id in filter(None, (utama, kedua)):
        if not await _count(db, MasterSekolah.id, sekolah_id):
            raise invalid(f"Sekolah {sekolah_id} tidak ada di Master Sekolah.")
        pemakai = await db.execute(
            select(Unit.kode).where(
                or_(Unit.sekolah_id == sekolah_id, Unit.sekolah_kedua_id == sekolah_id),
                Unit.kode != derived["kode"],
            )
        )
        lain = pemakai.scalars().first()
        if lain:
            raise _conflict(f"Sekolah {sekolah_id} sudah dipadankan dengan UPB {lain}.")


async def _enrich_unit(db: AsyncSession, rows: list[Row]) -> None:
    induk_kodes = {r["kode_induk"] for r in rows if r["kode_induk"]}
    induk: dict[str, str] = {}
    if induk_kodes:
        found = await db.execute(select(Unit.kode, Unit.nama).where(Unit.kode.in_(induk_kodes)))
        induk = dict(found.all())

    ids = {r[k] for r in rows for k in ("sekolah_id", "sekolah_kedua_id") if r[k]}
    sekolah: dict[str, Any] = {}
    if ids:
        found = await db.execute(
            select(
                MasterSekolah.id,
                MasterSekolah.nama_sekolah,
                MasterSekolah.npsn,
                MasterSekolah.simpeg_unit_kerja_id,
                MasterSekolah.simpeg_unit_kerja_nama,
            ).where(MasterSekolah.id.in_(ids))
        )
        sekolah = {s.id: s for s in found.all()}

    def label(sekolah_id: str | None) -> str | None:
        s = sekolah.get(sekolah_id)
        return f"{s.nama_sekolah} (NPSN {s.npsn})" if s else None

    for row in rows:
        utama = sekolah.get(row["sekolah_id"])
        row["nama_induk"] = induk.get(row["kode_induk"])
        row["sekolah_label"] = label(row["sekolah_id"])
        row["sekolah_kedua_label"] = label(row["sekolah_kedua_id"])
        row["unit_kerja_id"] = utama.simpeg_unit_kerja_id if utama else None
        row["unit_kerja_nama"] = utama.simpeg_unit_kerja_nama if utama else None


async def _guard_unit(db: AsyncSession, obj: Any) -> None:
    if await _count(db, Unit.kode_induk, obj.kode):
        raise _conflict("Masih ada sub unit/UPB di bawahnya; hapus turunannya terlebih dahulu.")


# --- nilai-minimum-kapitalisasi ------------------------------------------------------------


async def _validate_nilai_minimum(db: AsyncSession, data: Row) -> None:
    await _require_kode_barang(db, data["kode_barang"])


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
    "alasan-penghapusan": AsetMasterSpec(
        model=MasterAsetAlasanPenghapusan,
        create_schema=s.AlasanPenghapusanCreate,
        update_schema=s.AlasanPenghapusanUpdate,
        response_schema=s.AlasanPenghapusanResponse,
        code_attr="kode",
        option_label=lambda o: o.uraian,
        search=lambda q: MasterAsetAlasanPenghapusan.uraian.ilike(_like(q), escape="\\"),
        order_by=(MasterAsetAlasanPenghapusan.kode,),
        lock_fields=("kode",),
    ),
    "nilai-minimum-kapitalisasi": AsetMasterSpec(
        model=NilaiMinimum,
        create_schema=s.NilaiMinimumKapitalisasiCreate,
        update_schema=s.NilaiMinimumKapitalisasiUpdate,
        response_schema=s.NilaiMinimumKapitalisasiResponse,
        code_attr="kode_barang",
        option_label=lambda o: f"{o.kode_barang} ({o.tahun_berlaku}: Rp{o.nilai_minimum_satuan:,})",
        search=lambda q: or_(
            NilaiMinimum.kode_barang.ilike(_like(q), escape="\\"),
            NilaiMinimum.kode_barang.in_(
                select(KodeBarang.kode).where(KodeBarang.uraian.ilike(_like(q), escape="\\"))
            ),
        ),
        order_by=(NilaiMinimum.tahun_berlaku.desc(), NilaiMinimum.kode_barang),
        filters={"tahun_berlaku": NilaiMinimum.tahun_berlaku},
        lock_fields=("kode_barang",),
        validate=_validate_nilai_minimum,
        enrich=_enrich_kapitalisasi,
    ),
    "unit-sekolah": AsetMasterSpec(
        model=Unit,
        create_schema=s.UnitSekolahCreate,
        update_schema=s.UnitSekolahUpdate,
        response_schema=s.UnitSekolahResponse,
        code_attr="kode",
        option_label=lambda o: f"{o.kode} - {o.nama}",
        search=lambda q: or_(
            Unit.kode.ilike(_like(q), escape="\\"),
            Unit.nama.ilike(_like(q), escape="\\"),
            Unit.nama_lama.ilike(_like(q), escape="\\"),
            Unit.nama_simda.ilike(_like(q), escape="\\"),
        ),
        order_by=(Unit.kode,),
        filters={
            "tingkat": Unit.tingkat,
            "jenis": Unit.jenis,
            "status_pencocokan": Unit.status_pencocokan,
        },
        lock_fields=("kd_bidang", "kd_unit", "kd_sub", "kd_upb"),
        derive=derive_unit,
        validate=_validate_unit,
        enrich=_enrich_unit,
        guard_delete=_guard_unit,
    ),
}
