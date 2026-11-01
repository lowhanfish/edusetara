"""Pydantic schemas for Statistik Item."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class StatistikItemBase(OperationalBase):
    indicator: str
    value: str
    category: str | None = None
    unit: str | None = None
    period: str | None = None
    trend: str | None = None


class StatistikItemCreate(StatistikItemBase):
    id: str | None = None


class StatistikItemUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    indicator: str | None = None
    value: str | None = None
    category: str | None = None
    unit: str | None = None
    period: str | None = None
    trend: str | None = None


class StatistikItemResponse(OperationalResponse):
    indicator: str
    value: str
    category: str | None = None
    unit: str | None = None
    period: str | None = None
    trend: str | None = None


class StatistikItemResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[StatistikItemResponse]
