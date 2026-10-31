"""Pydantic schemas for Master Jurnal Kelas (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class KelasCreate(MasterCreate):
    pass


class KelasResponse(MasterResponse):
    pass


class KelasUpdate(MasterUpdate):
    pass


class KelasResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[KelasResponse]
