"""Pydantic schemas for Master Sarpras Kepemilikan (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class KepemilikanCreate(MasterCreate):
    """Payload untuk menambah data kepemilikan sarpras."""

    pass


class KepemilikanResponse(MasterResponse):
    """Response detail kepemilikan sarpras."""

    pass


class KepemilikanUpdate(MasterUpdate):
    """Payload untuk mengubah data kepemilikan sarpras."""

    pass


class KepemilikanResponseList(BaseModel):
    """Response list data kepemilikan sarpras dengan pagination."""

    total: int
    skip: int = 0
    limit: int = 100
    data: list[KepemilikanResponse]
