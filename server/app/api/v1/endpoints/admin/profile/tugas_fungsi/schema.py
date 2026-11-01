"""Pydantic schemas for Profile Tugas dan Fungsi (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class TugasFungsiBase(OperationalBase):
    isi: str
    file: str | None = None


class TugasFungsiCreate(TugasFungsiBase):
    id: str | None = None


class TugasFungsiUpdate(BaseModel):
    isi: str | None = None
    file: str | None = None


class TugasFungsiResponse(OperationalResponse):
    isi: str
    file: str | None = None


class TugasFungsiResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[TugasFungsiResponse]
