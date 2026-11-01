"""Pydantic schemas for Pendidikan Program."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class PendidikanProgramBase(OperationalBase):
    name: str
    category: str | None = None
    scope: str | None = None
    total_units: str | None = None
    curriculum: str | None = None
    status: str | None = "Aktif"


class PendidikanProgramCreate(PendidikanProgramBase):
    id: str | None = None


class PendidikanProgramUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    name: str | None = None
    category: str | None = None
    scope: str | None = None
    total_units: str | None = None
    curriculum: str | None = None
    status: str | None = None


class PendidikanProgramResponse(OperationalResponse):
    name: str
    category: str | None = None
    scope: str | None = None
    total_units: str | None = None
    curriculum: str | None = None
    status: str | None = None


class PendidikanProgramResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PendidikanProgramResponse]
