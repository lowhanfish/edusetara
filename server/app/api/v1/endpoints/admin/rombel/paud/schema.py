"""Pydantic schemas for Rombel PAUD (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class RombelPaudBase(OperationalBase):
    nama: str
    kategori: str | None = None
    jns_rombel: str | None = None
    tgkt_pendidikan: str | None = None
    kurikulum: str | None = None
    wali_kelas: str | None = None
    ruang_kelas: str | None = None


class RombelPaudCreate(RombelPaudBase):
    id: str | None = None


class RombelPaudUpdate(BaseModel):
    nama: str | None = None
    kategori: str | None = None
    jns_rombel: str | None = None
    tgkt_pendidikan: str | None = None
    kurikulum: str | None = None
    wali_kelas: str | None = None
    ruang_kelas: str | None = None


class RombelPaudResponse(OperationalResponse):
    nama: str
    kategori: str | None = None
    jns_rombel: str | None = None
    tgkt_pendidikan: str | None = None
    kurikulum: str | None = None
    wali_kelas: str | None = None
    ruang_kelas: str | None = None


class RombelPaudResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[RombelPaudResponse]
