"""Pydantic schemas for Master BK Jenis Layanan (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class BkJenisLayananCreate(MasterCreate):
    pass


class BkJenisLayananResponse(MasterResponse):
    pass


class BkJenisLayananUpdate(MasterUpdate):
    pass


class BkJenisLayananResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[BkJenisLayananResponse]
