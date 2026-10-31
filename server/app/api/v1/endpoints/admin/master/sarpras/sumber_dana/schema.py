"""Pydantic schemas for Master Sarpras Sumber Dana (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class SumberDanaCreate(MasterCreate):
    """Payload untuk menambah data sumber dana sarpras."""

    pass


class SumberDanaResponse(MasterResponse):
    """Response detail sumber dana sarpras."""

    pass


class SumberDanaUpdate(MasterUpdate):
    """Payload untuk mengubah data sumber dana sarpras."""

    pass


class SumberDanaResponseList(BaseModel):
    """Response list data sumber dana sarpras dengan pagination."""

    total: int
    skip: int = 0
    limit: int = 100
    data: list[SumberDanaResponse]
