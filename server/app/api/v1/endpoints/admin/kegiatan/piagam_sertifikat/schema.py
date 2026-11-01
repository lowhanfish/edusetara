"""Pydantic schemas for Piagam Sertifikat (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class PiagamSertifikatBase(OperationalBase):
    kegiatan: str
    penyelenggara: str | None = None
    tahun: int | str | None = None
    tempat_pelaksana: str | None = None
    sebagai: str | None = None
    file: str | None = None


class PiagamSertifikatCreate(PiagamSertifikatBase):
    id: str | None = None


class PiagamSertifikatUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    kegiatan: str | None = None
    penyelenggara: str | None = None
    tahun: int | str | None = None
    tempat_pelaksana: str | None = None
    sebagai: str | None = None
    file: str | None = None


class PiagamSertifikatResponse(OperationalResponse):
    kegiatan: str
    penyelenggara: str | None = None
    tahun: int | str | None = None
    tempat_pelaksana: str | None = None
    sebagai: str | None = None
    file: str | None = None


class PiagamSertifikatResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PiagamSertifikatResponse]
