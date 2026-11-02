"""Pydantic schemas for Public Pendidikan Program & Artikel."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalResponse,
)


class PendidikanProgramResponse(OperationalResponse):
    judul: str | None = None
    name: str | None = None
    kategori: str | None = None
    category: str | None = None
    penulis: str | None = None
    konten: str | None = None
    file: str | None = None
    scope: str | None = None
    total_units: str | None = None
    curriculum: str | None = None
    status: str | None = None


class PendidikanProgramResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PendidikanProgramResponse]
