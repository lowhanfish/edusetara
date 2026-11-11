"""Pydantic schemas for Master Aset resources."""

from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, model_validator

Kode7 = Annotated[str, StringConstraints(pattern=r"^\d{2}(\.\d{2,3}){0,6}$", max_length=30)]
Kode6 = Annotated[str, StringConstraints(pattern=r"^\d{2}(\.\d{2}){5}$")]
Kode3to6 = Annotated[str, StringConstraints(pattern=r"^\d{2}(\.\d{2}){2,5}$")]
Teks = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]


class AuditResponse(BaseModel):
    """Audit columns present in every response."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    created_by: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


# --- kode-barang ---------------------------------------------------------------------------


class KodeBarangCreate(BaseModel):
    kode: Kode7
    uraian: Teks
    keterangan: str | None = None


class KodeBarangUpdate(BaseModel):
    kode: Kode7 | None = None
    uraian: Teks | None = None
    keterangan: str | None = None


class KodeBarangResponse(AuditResponse):
    kode: str
    uraian: str
    keterangan: str | None = None
    level: int
    kode_induk: str | None = None


# --- metode-penyusutan ---------------------------------------------------------------------


class MetodePenyusutanCreate(BaseModel):
    kode: int = Field(ge=1, le=99)
    nama: Teks
    keterangan: str | None = None


class MetodePenyusutanUpdate(BaseModel):
    kode: int | None = Field(None, ge=1, le=99)
    nama: Teks | None = None
    keterangan: str | None = None


class MetodePenyusutanResponse(AuditResponse):
    kode: int
    nama: str
    keterangan: str | None = None


# --- masa-manfaat --------------------------------------------------------------------------


class MasaManfaatCreate(BaseModel):
    tahun_berlaku: int = Field(ge=2000, le=2100)
    kode_barang: Kode6
    metode_id: int = Field(ge=1, le=99)
    umur_tahun: int = Field(ge=1, le=100)
    dasar_hukum: str | None = Field(None, max_length=255)


class MasaManfaatUpdate(BaseModel):
    tahun_berlaku: int | None = Field(None, ge=2000, le=2100)
    kode_barang: Kode6 | None = None
    metode_id: int | None = Field(None, ge=1, le=99)
    umur_tahun: int | None = Field(None, ge=1, le=100)
    dasar_hukum: str | None = Field(None, max_length=255)


class MasaManfaatResponse(AuditResponse):
    tahun_berlaku: int
    kode_barang: str
    metode_id: int
    umur_tahun: int
    dasar_hukum: str | None = None
    uraian_barang: str | None = None
    metode_nama: str | None = None


# --- kapitalisasi-masa-manfaat -------------------------------------------------------------


class KapitalisasiCreate(BaseModel):
    kode_barang: Kode3to6
    batas_bawah_persen: int = Field(ge=0, le=100)
    batas_atas_persen: int = Field(ge=0, le=100)
    tambahan_umur_tahun: int = Field(ge=0, le=50)
    jenis_kapitalisasi: int = Field(ge=1, le=2)

    @model_validator(mode="after")
    def check_range(self) -> "KapitalisasiCreate":
        if self.batas_atas_persen < self.batas_bawah_persen:
            raise ValueError("Batas atas tidak boleh lebih kecil dari batas bawah.")
        return self


class KapitalisasiUpdate(BaseModel):
    kode_barang: Kode3to6 | None = None
    batas_bawah_persen: int | None = Field(None, ge=0, le=100)
    batas_atas_persen: int | None = Field(None, ge=0, le=100)
    tambahan_umur_tahun: int | None = Field(None, ge=0, le=50)
    jenis_kapitalisasi: int | None = Field(None, ge=1, le=2)


class KapitalisasiResponse(AuditResponse):
    kode_barang: str
    batas_bawah_persen: int
    batas_atas_persen: int
    tambahan_umur_tahun: int
    jenis_kapitalisasi: int
    uraian_barang: str | None = None


# --- kondisi-barang ------------------------------------------------------------------------


class KondisiBarangCreate(BaseModel):
    kode: int = Field(ge=1, le=99)
    uraian: Teks
    keterangan: str | None = None


class KondisiBarangUpdate(BaseModel):
    kode: int | None = Field(None, ge=1, le=99)
    uraian: Teks | None = None
    keterangan: str | None = None


class KondisiBarangResponse(AuditResponse):
    kode: int
    uraian: str
    keterangan: str | None = None


# --- status-pemilik ------------------------------------------------------------------------


class StatusPemilikCreate(BaseModel):
    kode: int = Field(ge=0, le=99)
    nama: Teks
    keterangan: str | None = None


class StatusPemilikUpdate(BaseModel):
    kode: int | None = Field(None, ge=0, le=99)
    nama: Teks | None = None
    keterangan: str | None = None


class StatusPemilikResponse(AuditResponse):
    kode: int
    nama: str
    keterangan: str | None = None
