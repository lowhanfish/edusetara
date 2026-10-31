"""Shared Base Schemas for Master Data resources (e-office pattern)."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator


class MasterBase(BaseModel):
    """Base descriptors for standard master resources."""

    uraian: str | None = Field(None, max_length=255, description="Label teks uraian master")
    title: str | None = Field(None, max_length=255, description="Nama / judul master (alias uraian)")
    desc: str | None = Field(None, description="Penjelasan singkat / keterangan master")
    keterangan: str | None = Field(None, description="Keterangan master (alias desc)")
    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)

    @model_validator(mode="before")
    @classmethod
    def sync_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # Sync title <-> uraian
            val = data.get("title") or data.get("uraian")
            if val:
                data["title"] = val
                data["uraian"] = val
            # Sync desc <-> keterangan
            desc_val = data.get("desc") or data.get("keterangan")
            if desc_val is not None:
                data["desc"] = desc_val
                data["keterangan"] = desc_val
        elif hasattr(data, "__dict__"):
            val = getattr(data, "title", None) or getattr(data, "uraian", None)
            desc_val = getattr(data, "desc", None) or getattr(data, "keterangan", None)
            if hasattr(data, "__dict__"):
                if val:
                    data.__dict__["title"] = val
                    data.__dict__["uraian"] = val
                if desc_val is not None:
                    data.__dict__["desc"] = desc_val
                    data.__dict__["keterangan"] = desc_val
        return data


class MasterCreate(MasterBase):
    """Schema for creating a master resource."""

    id: str | None = Field(
        None, max_length=50, description="Opsional custom ID (misal: KBG-01, TW-01)"
    )

    @model_validator(mode="after")
    def validate_title_or_uraian(self) -> "MasterCreate":
        if not self.uraian and not self.title:
            raise ValueError("title atau uraian wajib diisi")
        if not self.uraian and self.title:
            self.uraian = self.title
        if not self.title and self.uraian:
            self.title = self.uraian
        return self


class MasterUpdate(BaseModel):
    """Schema for updating a master resource (partial update)."""

    uraian: str | None = Field(None, min_length=1, max_length=255)
    title: str | None = Field(None, min_length=1, max_length=255)
    desc: str | None = Field(None)
    keterangan: str | None = Field(None)
    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)

    @model_validator(mode="before")
    @classmethod
    def sync_update_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            val = data.get("title") or data.get("uraian")
            if val:
                data["title"] = val
                data["uraian"] = val
            desc_val = data.get("desc") or data.get("keterangan")
            if desc_val is not None:
                data["desc"] = desc_val
                data["keterangan"] = desc_val
        return data


class MasterOption(BaseModel):
    """Minimal schema for dropdown select options."""

    id: str
    uraian: str | None = None
    title: str | None = None

    @model_validator(mode="after")
    def fill_option_aliases(self) -> "MasterOption":
        val = self.title or self.uraian
        self.title = val
        self.uraian = val
        return self

    model_config = ConfigDict(from_attributes=True, extra="allow")


class MasterResponse(MasterBase):
    """Standard detailed response for a master resource item."""

    id: str
    title: str | None = None
    uraian: str | None = None
    desc: str | None = None
    keterangan: str | None = None
    created_by: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    @model_validator(mode="after")
    def fill_response_aliases(self) -> "MasterResponse":
        val = self.title or self.uraian
        self.title = val
        self.uraian = val
        desc_val = self.desc or self.keterangan
        self.desc = desc_val
        self.keterangan = desc_val
        return self

    model_config = ConfigDict(from_attributes=True, extra="allow")


class MasterResponseList(BaseModel):
    """Standard paginated list response (matching e-office format)."""

    total: int
    skip: int = 0
    limit: int = 100
    data: list[Any]
