"""Pydantic schemas for Master Sarpras Kondisi Alat (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class KondisiAlatCreate(MasterCreate):
    """Payload untuk menambah data kondisi alat sarpras."""

    pass


class KondisiAlatResponse(MasterResponse):
    """Response detail kondisi alat sarpras."""

    pass


class KondisiAlatUpdate(MasterUpdate):
    """Payload untuk mengubah data kondisi alat sarpras."""

    pass


class KondisiAlatResponseList(BaseModel):
    """Response list data kondisi alat sarpras dengan pagination."""

    total: int
    skip: int = 0
    limit: int = 100
    data: list[KondisiAlatResponse]
