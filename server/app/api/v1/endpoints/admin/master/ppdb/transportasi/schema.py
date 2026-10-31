"""Pydantic schemas for Master PPDB Transportasi (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class TransportasiCreate(MasterCreate):
    pass


class TransportasiResponse(MasterResponse):
    pass


class TransportasiUpdate(MasterUpdate):
    pass


class TransportasiResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[TransportasiResponse]
