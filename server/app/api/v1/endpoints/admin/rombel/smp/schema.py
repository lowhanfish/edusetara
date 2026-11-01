"""Pydantic schemas for Rombel SMP (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class RombelSmpBase(OperationalBase):
    nama: str
    kategori: str | None = None
    jns_rombel: str | None = None
    tgkt_pendidikan: str | None = None
    kurikulum: str | None = None
    wali_kelas: str | None = None
    ruang_kelas: str | None = None


class RombelSmpCreate(RombelSmpBase):
    id: str | None = None


class RombelSmpUpdate(BaseModel):
    nama: str | None = None
    kategori: str | None = None
    jns_rombel: str | None = None
    tgkt_pendidikan: str | None = None
    kurikulum: str | None = None
    wali_kelas: str | None = None
    ruang_kelas: str | None = None


class RombelSmpResponse(OperationalResponse):
    nama: str
    kategori: str | None = None
    jns_rombel: str | None = None
    tgkt_pendidikan: str | None = None
    kurikulum: str | None = None
    wali_kelas: str | None = None
    ruang_kelas: str | None = None


class RombelSmpResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[RombelSmpResponse]
