"""Pydantic schemas for Master Jurnal Materi Ajar (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class MateriAjarCreate(MasterCreate):
    pass


class MateriAjarResponse(MasterResponse):
    pass


class MateriAjarUpdate(MasterUpdate):
    pass


class MateriAjarResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[MateriAjarResponse]
