"""Pydantic schemas for Master Pendampingan (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class PendampinganCreate(MasterCreate):
    pass


class PendampinganResponse(MasterResponse):
    pass


class PendampinganUpdate(MasterUpdate):
    pass


class PendampinganResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PendampinganResponse]
