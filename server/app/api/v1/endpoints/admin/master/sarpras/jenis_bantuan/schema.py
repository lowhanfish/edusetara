"""Pydantic schemas for Master Sarpras Jenis Bantuan (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class JenisBantuanCreate(MasterCreate):
    """Payload untuk menambah data jenis bantuan sarpras."""

    pass


class JenisBantuanResponse(MasterResponse):
    """Response detail jenis bantuan sarpras."""

    pass


class JenisBantuanUpdate(MasterUpdate):
    """Payload untuk mengubah data jenis bantuan sarpras."""

    pass


class JenisBantuanResponseList(BaseModel):
    """Response list data jenis bantuan sarpras dengan pagination."""

    total: int
    skip: int = 0
    limit: int = 100
    data: list[JenisBantuanResponse]
