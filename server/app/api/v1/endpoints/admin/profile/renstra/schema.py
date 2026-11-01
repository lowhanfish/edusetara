"""Pydantic schemas for Profile Renstra (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class RenstraBase(OperationalBase):
    isi: str
    file: str | None = None


class RenstraCreate(RenstraBase):
    id: str | None = None


class RenstraUpdate(BaseModel):
    isi: str | None = None
    file: str | None = None


class RenstraResponse(OperationalResponse):
    isi: str
    file: str | None = None


class RenstraResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[RenstraResponse]
