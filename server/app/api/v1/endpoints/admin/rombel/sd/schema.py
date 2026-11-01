"""Pydantic schemas for Rombel SD (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class RombelSdBase(OperationalBase):
    nama: str
    kategori: str | None = None
    jns_rombel: str | None = None
    tgkt_pendidikan: str | None = None
    kurikulum: str | None = None
    wali_kelas: str | None = None
    ruang_kelas: str | None = None


class RombelSdCreate(RombelSdBase):
    id: str | None = None


class RombelSdUpdate(BaseModel):
    nama: str | None = None
    kategori: str | None = None
    jns_rombel: str | None = None
    tgkt_pendidikan: str | None = None
    kurikulum: str | None = None
    wali_kelas: str | None = None
    ruang_kelas: str | None = None


class RombelSdResponse(OperationalResponse):
    nama: str
    kategori: str | None = None
    jns_rombel: str | None = None
    tgkt_pendidikan: str | None = None
    kurikulum: str | None = None
    wali_kelas: str | None = None
    ruang_kelas: str | None = None


class RombelSdResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[RombelSdResponse]
