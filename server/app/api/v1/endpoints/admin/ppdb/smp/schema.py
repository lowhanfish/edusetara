"""Pydantic schemas for PPDB SMP (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalResponse,
    PpdbCommonBase,
    PpdbCommonUpdate,
)


class PpdbSmpBase(PpdbCommonBase):
    pass


class PpdbSmpCreate(PpdbSmpBase):
    id: str | None = None


class PpdbSmpUpdate(PpdbCommonUpdate):
    pass


class PpdbSmpResponse(OperationalResponse, PpdbCommonBase):
    pass


class PpdbSmpResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PpdbSmpResponse]
