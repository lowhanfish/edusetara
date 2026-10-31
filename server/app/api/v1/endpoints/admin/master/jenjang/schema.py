"""Pydantic schemas for Master Jenjang (uraian & keterangan)."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class JenjangCreate(BaseModel):
    id: str | None = Field(None, max_length=50)
    uraian: str = Field(..., min_length=1, max_length=255, description="Nama / label jenjang")
    keterangan: str | None = Field(None, description="Keterangan jenjang")


class JenjangUpdate(BaseModel):
    uraian: str | None = Field(None, min_length=1, max_length=255)
    keterangan: str | None = None


class JenjangResponse(BaseModel):
    id: str
    uraian: str
    keterangan: str | None = None
    created_by: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True, extra="allow")


class JenjangResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[JenjangResponse]
