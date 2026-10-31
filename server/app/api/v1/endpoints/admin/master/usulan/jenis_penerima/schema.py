"""Pydantic schemas for Master Usulan Jenis Penerima (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class JenisPenerimaCreate(MasterCreate):
    pass


class JenisPenerimaResponse(MasterResponse):
    pass


class JenisPenerimaUpdate(MasterUpdate):
    pass


class JenisPenerimaResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[JenisPenerimaResponse]
