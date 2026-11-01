"""Pydantic schemas for Regulasi GTK Pengumuman (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class GtkPengumumanBase(OperationalBase):
    judul: str
    deskripsi: str | None = None
    file: str | None = None
    file_type: str | None = None


class GtkPengumumanCreate(GtkPengumumanBase):
    id: str | None = None


class GtkPengumumanUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    judul: str | None = None
    deskripsi: str | None = None
    file: str | None = None
    file_type: str | None = None


class GtkPengumumanResponse(OperationalResponse):
    judul: str
    deskripsi: str | None = None
    file: str | None = None
    file_type: str | None = None


class GtkPengumumanResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[GtkPengumumanResponse]
