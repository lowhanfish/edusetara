"""Pydantic schemas for Master PPDB Pendidikan (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class PendidikanCreate(MasterCreate):
    pass


class PendidikanResponse(MasterResponse):
    pass


class PendidikanUpdate(MasterUpdate):
    pass


class PendidikanResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PendidikanResponse]
