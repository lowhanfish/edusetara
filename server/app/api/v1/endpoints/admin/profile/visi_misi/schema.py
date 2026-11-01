"""Pydantic schemas for Profile Visi dan Misi (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class VisiMisiBase(OperationalBase):
    isi: str
    file: str | None = None


class VisiMisiCreate(VisiMisiBase):
    id: str | None = None


class VisiMisiUpdate(BaseModel):
    isi: str | None = None
    file: str | None = None


class VisiMisiResponse(OperationalResponse):
    isi: str
    file: str | None = None


class VisiMisiResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[VisiMisiResponse]
