"""Pydantic schemas for Master Kategori Berkas (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class KategoriCreate(MasterCreate):
    pass


class KategoriResponse(MasterResponse):
    pass


class KategoriUpdate(MasterUpdate):
    pass


class KategoriResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[KategoriResponse]
