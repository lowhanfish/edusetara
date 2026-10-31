"""Pydantic schemas for Master Sarpras Bangunan (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class BangunanCreate(MasterCreate):
    """Payload untuk menambah data kondisi bangunan."""

    pass


class BangunanResponse(MasterResponse):
    """Response data detail kondisi bangunan."""

    pass


class BangunanUpdate(MasterUpdate):
    """Payload untuk mengubah data kondisi bangunan."""

    pass


class BangunanResponseList(BaseModel):
    """Response list data kondisi bangunan dengan metadata pagination."""

    total: int
    skip: int = 0
    limit: int = 100
    data: list[BangunanResponse]
