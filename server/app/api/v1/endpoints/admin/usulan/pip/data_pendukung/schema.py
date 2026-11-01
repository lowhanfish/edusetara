"""Pydantic schemas for Usulan PIP Data Pendukung."""

from decimal import Decimal
from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class PipPendukungBase(OperationalBase):
    uraian: str
    jenjang_id: str | None = None
    nominal: Decimal | float | None = None
    tahun: int | str | None = None
    file: str | None = None


class PipPendukungCreate(PipPendukungBase):
    id: str | None = None


class PipPendukungUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    uraian: str | None = None
    jenjang_id: str | None = None
    nominal: Decimal | float | None = None
    tahun: int | str | None = None
    file: str | None = None


class PipPendukungResponse(OperationalResponse):
    uraian: str
    jenjang_id: str | None = None
    nominal: Decimal | float | None = None
    tahun: int | str | None = None
    file: str | None = None


class PipPendukungResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PipPendukungResponse]
