"""Pydantic schemas for Usulan Rekonsiliasi BOSP (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class RekonsiliasiBospBase(OperationalBase):
    tahun: int | str | None = None
    semester_id: str | None = None
    file: str | None = None


class RekonsiliasiBospCreate(RekonsiliasiBospBase):
    id: str | None = None


class RekonsiliasiBospUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    tahun: int | str | None = None
    semester_id: str | None = None
    file: str | None = None


class RekonsiliasiBospResponse(OperationalResponse):
    tahun: int | str | None = None
    semester_id: str | None = None
    file: str | None = None


class RekonsiliasiBospResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[RekonsiliasiBospResponse]
