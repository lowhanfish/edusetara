"""Pydantic schemas for Master PPDB Tempat Tinggal (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class TempatTinggalCreate(MasterCreate):
    pass


class TempatTinggalResponse(MasterResponse):
    pass


class TempatTinggalUpdate(MasterUpdate):
    pass


class TempatTinggalResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[TempatTinggalResponse]
