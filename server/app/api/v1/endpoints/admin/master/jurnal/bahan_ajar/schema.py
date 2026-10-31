"""Pydantic schemas for Master Jurnal Bahan Ajar (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class BahanAjarCreate(MasterCreate):
    pass


class BahanAjarResponse(MasterResponse):
    pass


class BahanAjarUpdate(MasterUpdate):
    pass


class BahanAjarResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[BahanAjarResponse]
