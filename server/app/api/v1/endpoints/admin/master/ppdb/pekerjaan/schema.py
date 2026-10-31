"""Pydantic schemas for Master PPDB Pekerjaan (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class PekerjaanCreate(MasterCreate):
    pass


class PekerjaanResponse(MasterResponse):
    pass


class PekerjaanUpdate(MasterUpdate):
    pass


class PekerjaanResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PekerjaanResponse]
