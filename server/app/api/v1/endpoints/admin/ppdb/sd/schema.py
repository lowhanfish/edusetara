"""Pydantic schemas for PPDB SD (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalResponse,
    PpdbCommonBase,
)


class PpdbSdBase(PpdbCommonBase):
    pass


class PpdbSdCreate(PpdbSdBase):
    id: str | None = None


class PpdbSdUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    nama: str | None = None
    nm_panggilan: str | None = None
    jns_kelamin: str | None = None
    nisn: str | None = None
    nik: str | None = None
    tmp_lahir: str | None = None
    tgl_lahir: str | None = None
    agama: str | None = None
    alamat: str | None = None
    file: str | None = None
    kategori: str | None = None


class PpdbSdResponse(OperationalResponse, PpdbCommonBase):
    pass


class PpdbSdResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PpdbSdResponse]
