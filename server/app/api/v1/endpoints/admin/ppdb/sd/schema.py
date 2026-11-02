"""Pydantic schemas for PPDB SD (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalResponse,
    PpdbCommonBase,
    PpdbCommonUpdate,
)


class PpdbSdBase(PpdbCommonBase):
    pass


class PpdbSdCreate(PpdbSdBase):
    id: str | None = None


class PpdbSdUpdate(PpdbCommonUpdate):
    pass


class PpdbSdResponse(OperationalResponse, PpdbCommonBase):
    pass


class PpdbSdResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PpdbSdResponse]
