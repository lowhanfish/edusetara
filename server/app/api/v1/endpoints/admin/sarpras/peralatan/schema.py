"""Pydantic schemas for Sarpras Peralatan (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class PeralatanBase(OperationalBase):
    nama: str
    ruang_id: str | None = None
    jml_alat: int | None = 1
    kondisi_id: str | None = None
    tahun: int | None = None
    sumber_id: str | None = None


class PeralatanCreate(PeralatanBase):
    id: str | None = None


class PeralatanUpdate(BaseModel):
    nama: str | None = None
    ruang_id: str | None = None
    jml_alat: int | None = None
    kondisi_id: str | None = None
    tahun: int | None = None
    sumber_id: str | None = None


class PeralatanResponse(OperationalResponse):
    nama: str
    ruang_id: str | None = None
    jml_alat: int | None = 1
    kondisi_id: str | None = None
    tahun: int | None = None
    sumber_id: str | None = None


class PeralatanResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PeralatanResponse]
