"""Pydantic schemas for Public Statistik Item."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalResponse,
)


class StatistikItemResponse(OperationalResponse):
    indikator: str | None = None
    indicator: str | None = None
    kategori: str | None = None
    category: str | None = None
    nilai: str | None = None
    value: str | None = None
    satuan: str | None = None
    unit: str | None = None
    tahun: str | int | None = None
    period: str | None = None
    trend: str | None = None
    keterangan: str | None = None


class StatistikItemResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[StatistikItemResponse]
