"""Inventory contracts; currency is returned as a decimal string."""

from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class AsetFields(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")
    kode_barang: str = Field(min_length=1, max_length=30)
    nomor_register: str = Field(min_length=1, max_length=50)
    kib: Literal["A", "B", "C", "D", "E", "F"]
    nama: str = Field(min_length=1, max_length=255)
    merk: str | None = Field(None, max_length=150)
    nomor_seri: str | None = Field(None, max_length=150)
    tahun_perolehan: int = Field(ge=1900, le=2100)
    tanggal_perolehan: date | None = None
    nilai_perolehan: Decimal = Field(ge=0, max_digits=20, decimal_places=2)
    lokasi: str = Field(min_length=1, max_length=255)
    sumber_dana_id: str | None = Field(None, max_length=50)
    keterangan: str | None = Field(None, max_length=4000)

    @field_validator("merk", "nomor_seri", "sumber_dana_id", "keterangan", mode="before")
    @classmethod
    def blank_as_none(cls, value):
        return None if isinstance(value, str) and not value.strip() else value

    @model_validator(mode="after")
    def valid_date(self):
        if self.tanggal_perolehan and self.tanggal_perolehan.year != self.tahun_perolehan:
            raise ValueError("Tahun dan tanggal perolehan harus sesuai")
        return self


class AsetCreate(AsetFields):
    sekolah_id: str = Field(min_length=1, max_length=50)
    kondisi_kode: int


class AsetUpdate(AsetFields):
    """Data correction; condition changes only through an inspection with photo evidence."""

    version: int = Field(ge=1)
    alasan: str = Field(min_length=1, max_length=1000)


class PenempatanUpdate(BaseModel):
    """School UPB where the asset is placed; null clears it."""

    model_config = ConfigDict(extra="forbid")
    upb_id: str | None = Field(None, min_length=1, max_length=50)


class AsetResponse(BaseModel):
    id: str
    upb_id: str
    upb_kode: str
    upb_nama: str
    kode_barang: str
    uraian_barang: str
    nomor_register: str
    kib: str
    nama: str
    merk: str | None
    nomor_seri: str | None
    tahun_perolehan: int
    tanggal_perolehan: date | None
    nilai_perolehan: Decimal
    lokasi: str
    kondisi_kode: int
    kondisi_nama: str
    sumber_dana_id: str | None
    sumber_dana_nama: str | None
    keterangan: str | None
    simda_id: str | None
    upb_penempatan_id: str | None
    penempatan_kode: str | None
    penempatan_nama: str | None
    status_penempatan: str | None
    version: int
    created_by: str
    created_at: datetime
    updated_at: datetime


class AsetList(BaseModel):
    total: int
    skip: int
    limit: int
    nilai_total: Decimal
    data: list[AsetResponse]


class KondisiSnapshot(BaseModel):
    kode: int
    nama: str


class RiwayatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    kondisi_lama: KondisiSnapshot | None
    kondisi_baru: KondisiSnapshot
    catatan: str
    foto_url: str | None
    version: int
    created_by: str
    created_at: datetime


class AsetDetail(AsetResponse):
    riwayat: list[RiwayatResponse]
