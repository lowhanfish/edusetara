"""Pydantic schemas for Usulan PIP Data Penerima."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class PipPenerimaBase(OperationalBase):
    pendukung_id: str | None = None
    siswa_id: str | None = None


class PipPenerimaCreate(PipPenerimaBase):
    id: str | None = None


class PipPenerimaUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    pendukung_id: str | None = None
    siswa_id: str | None = None


class PipPenerimaResponse(OperationalResponse):
    pendukung_id: str | None = None
    siswa_id: str | None = None


class PipPenerimaResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PipPenerimaResponse]
