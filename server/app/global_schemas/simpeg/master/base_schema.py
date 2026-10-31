"""Reusable base schemas for master data domains."""

from datetime import datetime
from typing import TypeVar

from pydantic import BaseModel, ConfigDict


class MasterBase(BaseModel):
    kode: str
    nama: str


class MasterCreate(MasterBase):
    pass


class MasterUpdate(BaseModel):
    kode: str | None = None
    nama: str | None = None


class MasterResponse(MasterBase):
    id: str
    created_by: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


T = TypeVar("T")


class MasterResponseList[T](BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[T]
