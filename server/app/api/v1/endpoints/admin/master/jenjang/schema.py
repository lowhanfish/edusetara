"""Pydantic schemas for Master Jenjang (Arsitektur Sistem contract: title & desc)."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, model_validator


class JenjangCreate(BaseModel):
    id: str | None = Field(None, max_length=50)
    title: str | None = Field(None, description="Nama / tingkat jenjang (contoh: '1', '6', '7', '9')")
    desc: str | None = Field(None, description="Penjelasan singkat jenjang")
    uraian: str | None = None
    keterangan: str | None = None

    @model_validator(mode="after")
    def sync_fields(self):
        # Sync title and uraian
        if not self.title and self.uraian:
            self.title = self.uraian
        elif not self.uraian and self.title:
            self.uraian = self.title

        # Sync desc and keterangan
        if not self.desc and self.keterangan:
            self.desc = self.keterangan
        elif not self.keterangan and self.desc:
            self.keterangan = self.desc

        if not self.title:
            raise ValueError("title (nama jenjang) wajib diisi")
        return self


class JenjangUpdate(BaseModel):
    title: str | None = None
    desc: str | None = None
    uraian: str | None = None
    keterangan: str | None = None

    @model_validator(mode="after")
    def sync_fields(self):
        if not self.title and self.uraian:
            self.title = self.uraian
        elif not self.uraian and self.title:
            self.uraian = self.title

        if not self.desc and self.keterangan:
            self.desc = self.keterangan
        elif not self.keterangan and self.desc:
            self.keterangan = self.desc
        return self


class JenjangResponse(BaseModel):
    id: str
    title: str
    desc: str | None = None
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
