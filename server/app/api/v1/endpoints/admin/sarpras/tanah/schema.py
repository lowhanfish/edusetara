"""Pydantic schemas for Sarpras Tanah (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class TanahBase(OperationalBase):
    title: str
    file: str | None = None
    file_type: str | None = None


class TanahCreate(TanahBase):
    id: str | None = None


class TanahUpdate(BaseModel):
    title: str | None = None
    file: str | None = None
    file_type: str | None = None


class TanahResponse(OperationalResponse):
    title: str
    file: str | None = None
    file_type: str | None = None


class TanahResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[TanahResponse]
