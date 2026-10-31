"""Pydantic schemas for Master PPDB Agama (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class AgamaCreate(MasterCreate):
    pass


class AgamaResponse(MasterResponse):
    pass


class AgamaUpdate(MasterUpdate):
    pass


class AgamaResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[AgamaResponse]
