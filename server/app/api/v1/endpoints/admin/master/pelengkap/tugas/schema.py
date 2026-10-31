"""Pydantic schemas for Master Tugas Pokok (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class TugasCreate(MasterCreate):
    pass


class TugasResponse(MasterResponse):
    pass


class TugasUpdate(MasterUpdate):
    pass


class TugasResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[TugasResponse]
