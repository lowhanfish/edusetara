"""Pydantic schemas for Master BK Kegiatan Layanan (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class BkKegiatanLayananCreate(MasterCreate):
    pass


class BkKegiatanLayananResponse(MasterResponse):
    pass


class BkKegiatanLayananUpdate(MasterUpdate):
    pass


class BkKegiatanLayananResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[BkKegiatanLayananResponse]
