"""Pydantic schemas for Jurnal Kepala Sekolah (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class KepalaSekolahBase(OperationalBase):
    uraian: str
    target: str | None = None
    hasil: str | None = None
    keterlibatan: str | None = None
    tgl: str | None = None
    keterangan: str | None = None
    file: str | None = None


class KepalaSekolahCreate(KepalaSekolahBase):
    id: str | None = None


class KepalaSekolahUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    uraian: str | None = None
    target: str | None = None
    hasil: str | None = None
    keterlibatan: str | None = None
    tgl: str | None = None
    keterangan: str | None = None
    file: str | None = None


class KepalaSekolahResponse(OperationalResponse):
    uraian: str
    target: str | None = None
    hasil: str | None = None
    keterlibatan: str | None = None
    tgl: str | None = None
    keterangan: str | None = None
    file: str | None = None


class KepalaSekolahResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[KepalaSekolahResponse]
