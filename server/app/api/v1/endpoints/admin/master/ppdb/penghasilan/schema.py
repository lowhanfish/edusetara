"""Pydantic schemas for Master PPDB Penghasilan (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class PenghasilanCreate(MasterCreate):
    pass


class PenghasilanResponse(MasterResponse):
    pass


class PenghasilanUpdate(MasterUpdate):
    pass


class PenghasilanResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PenghasilanResponse]
