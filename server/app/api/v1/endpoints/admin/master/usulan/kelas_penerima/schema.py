"""Pydantic schemas for Master Usulan Kelas Penerima (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class KelasPenerimaCreate(MasterCreate):
    pass


class KelasPenerimaResponse(MasterResponse):
    pass


class KelasPenerimaUpdate(MasterUpdate):
    pass


class KelasPenerimaResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[KelasPenerimaResponse]
