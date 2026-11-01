"""Pydantic schemas for Komunitas Belajar (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class KomunitasBelajarBase(OperationalBase):
    uraian: str
    jns_kegiatan: str | None = None
    deskripsi: str | None = None
    file: str | None = None
    type: str | None = None


class KomunitasBelajarCreate(KomunitasBelajarBase):
    id: str | None = None


class KomunitasBelajarUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    uraian: str | None = None
    jns_kegiatan: str | None = None
    deskripsi: str | None = None
    file: str | None = None
    type: str | None = None


class KomunitasBelajarResponse(OperationalResponse):
    uraian: str
    jns_kegiatan: str | None = None
    deskripsi: str | None = None
    file: str | None = None
    type: str | None = None


class KomunitasBelajarResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[KomunitasBelajarResponse]
