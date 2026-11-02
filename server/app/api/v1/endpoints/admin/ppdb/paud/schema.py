"""Pydantic schemas for PPDB PAUD (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalResponse,
    PpdbCommonBase,
    PpdbCommonUpdate,
)


class PpdbPaudBase(PpdbCommonBase):
    pass


class PpdbPaudCreate(PpdbPaudBase):
    id: str | None = None


class PpdbPaudUpdate(PpdbCommonUpdate):
    pass


class PpdbPaudResponse(OperationalResponse, PpdbCommonBase):
    pass


class PpdbPaudResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PpdbPaudResponse]
