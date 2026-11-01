"""Pydantic schemas for Sarpras Ruang (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class RuangBase(OperationalBase):
    nama: str
    luas: str | None = None
    bangunan_id: str | None = None
    kelas_id: str | None = None
    kondisi_id: str | None = None


class RuangCreate(RuangBase):
    id: str | None = None


class RuangUpdate(BaseModel):
    nama: str | None = None
    luas: str | None = None
    bangunan_id: str | None = None
    kelas_id: str | None = None
    kondisi_id: str | None = None


class RuangResponse(OperationalResponse):
    nama: str
    luas: str | None = None
    bangunan_id: str | None = None
    kelas_id: str | None = None
    kondisi_id: str | None = None


class RuangResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[RuangResponse]
