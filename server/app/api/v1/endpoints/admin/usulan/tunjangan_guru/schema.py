"""Pydantic schemas for Usulan Tunjangan Guru (matching master pattern)."""

from decimal import Decimal
from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class TunjanganGuruBase(OperationalBase):
    triwulan_id: str | None = None
    jenis_id: str | None = None
    kelas_id: str | None = None
    jml_guru: int | None = 1
    nominal: Decimal | float | None = None
    file: str | None = None
    file_type: str | None = None


class TunjanganGuruCreate(TunjanganGuruBase):
    id: str | None = None


class TunjanganGuruUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    triwulan_id: str | None = None
    jenis_id: str | None = None
    kelas_id: str | None = None
    jml_guru: int | None = None
    nominal: Decimal | float | None = None
    file: str | None = None
    file_type: str | None = None


class TunjanganGuruResponse(OperationalResponse):
    triwulan_id: str | None = None
    jenis_id: str | None = None
    kelas_id: str | None = None
    jml_guru: int | None = None
    nominal: Decimal | float | None = None
    file: str | None = None
    file_type: str | None = None


class TunjanganGuruResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[TunjanganGuruResponse]
