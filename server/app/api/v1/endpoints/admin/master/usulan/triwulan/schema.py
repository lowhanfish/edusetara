"""Pydantic schemas for Master Usulan Triwulan (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class TriwulanCreate(MasterCreate):
    pass


class TriwulanResponse(MasterResponse):
    pass


class TriwulanUpdate(MasterUpdate):
    pass


class TriwulanResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[TriwulanResponse]
