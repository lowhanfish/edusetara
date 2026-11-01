"""Pydantic schemas for Regulasi GTK Regulasi (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class GtkRegulasiBase(OperationalBase):
    judul: str
    deskripsi: str | None = None
    tahun: int | str | None = None
    file: str | None = None
    file_type: str | None = None


class GtkRegulasiCreate(GtkRegulasiBase):
    id: str | None = None


class GtkRegulasiUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    judul: str | None = None
    deskripsi: str | None = None
    tahun: int | str | None = None
    file: str | None = None
    file_type: str | None = None


class GtkRegulasiResponse(OperationalResponse):
    judul: str
    deskripsi: str | None = None
    tahun: int | str | None = None
    file: str | None = None
    file_type: str | None = None


class GtkRegulasiResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[GtkRegulasiResponse]
