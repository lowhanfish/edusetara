"""Pydantic schemas for Master Jenjang (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class JenjangCreate(MasterCreate):
    pass


class JenjangResponse(MasterResponse):
    pass


class JenjangUpdate(MasterUpdate):
    pass


class JenjangResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[JenjangResponse]
