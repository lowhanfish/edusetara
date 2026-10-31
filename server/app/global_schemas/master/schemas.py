"""Pydantic schemas for Master Data items and batch Lookups."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class MasterItemBase(BaseModel):
    """Base schema for standard master items."""

    uraian: str = Field(..., min_length=1, max_length=255, description="Label teks uraian master")
    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)


class MasterItemCreate(MasterItemBase):
    """Schema for creating a new master record."""

    id: str | None = Field(None, max_length=50, description="Optional custom ID (e.g. KBG-01)")


class MasterItemUpdate(BaseModel):
    """Schema for updating an existing master record."""

    uraian: str | None = Field(None, min_length=1, max_length=255)
    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)


class MasterItemRead(MasterItemBase):
    """Schema for returning master record details."""

    id: str
    created_by: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class MasterOptionItem(BaseModel):
    """Minimal option schema for frontend dropdowns."""

    id: str
    uraian: str
    model_config = ConfigDict(extra="allow", from_attributes=True)


class MasterLookupResponse(BaseModel):
    """Uniform envelope for batch lookup dropdown options."""

    success: bool = True
    statusCode: int = 200
    message: str = "Master lookup retrieved successfully"
    data: dict[str, list[dict[str, Any]]]


class MasterListResponse(BaseModel):
    """Uniform envelope for list of master items."""

    success: bool = True
    statusCode: int = 200
    message: str = "Data retrieved successfully"
    data: list[MasterItemRead]


class MasterSingleResponse(BaseModel):
    """Uniform envelope for single master item mutation."""

    success: bool = True
    statusCode: int = 200
    message: str = "Data processed successfully"
    data: MasterItemRead
