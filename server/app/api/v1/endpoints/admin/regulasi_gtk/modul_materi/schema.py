"""Pydantic schemas for Regulasi GTK Modul Pelatihan / Materi."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class GtkModulMateriBase(OperationalBase):
    judul: str
    deskripsi: str | None = None
    file: str | None = None
    file_type: str | None = None


class GtkModulMateriCreate(GtkModulMateriBase):
    id: str | None = None


class GtkModulMateriUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    judul: str | None = None
    deskripsi: str | None = None
    file: str | None = None
    file_type: str | None = None


class GtkModulMateriResponse(OperationalResponse):
    judul: str
    deskripsi: str | None = None
    file: str | None = None
    file_type: str | None = None


class GtkModulMateriResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[GtkModulMateriResponse]
