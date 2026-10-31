"""Shared Base Schemas for Master Data resources (e-office pattern)."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class MasterBase(BaseModel):
    """Base descriptors for standard master resources."""

    uraian: str = Field(..., min_length=1, max_length=255, description="Label teks uraian master")
    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)


class MasterCreate(MasterBase):
    """Schema for creating a master resource."""

    id: str | None = Field(
        None, max_length=50, description="Opsional custom ID (misal: KBG-01, TW-01)"
    )


class MasterUpdate(BaseModel):
    """Schema for updating a master resource (partial update)."""

    uraian: str | None = Field(None, min_length=1, max_length=255)
    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)


class MasterOption(BaseModel):
    """Minimal schema for dropdown select options."""

    id: str
    uraian: str

    model_config = ConfigDict(from_attributes=True, extra="allow")


class MasterResponse(MasterBase):
    """Standard detailed response for a master resource item."""

    id: str
    created_by: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True, extra="allow")


class MasterResponseList(BaseModel):
    """Standard paginated list response (matching e-office format)."""

    total: int
    skip: int = 0
    limit: int = 100
    data: list[Any]
