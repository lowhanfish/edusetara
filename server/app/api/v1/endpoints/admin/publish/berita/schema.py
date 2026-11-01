"""Pydantic schemas for Berita (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class BeritaBase(OperationalBase):
    judul: str
    slug: str | None = None
    sumber: str | None = None
    kategori: str | None = "Pendidikan"
    author: str | None = None
    deskripsi: str | None = None
    isi: str | None = None
    foto: str | None = None
    status: str | None = "Terbit"
    featured: bool | None = False


class BeritaCreate(BeritaBase):
    id: str | None = None


class BeritaUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    judul: str | None = None
    slug: str | None = None
    sumber: str | None = None
    kategori: str | None = None
    author: str | None = None
    deskripsi: str | None = None
    isi: str | None = None
    foto: str | None = None
    status: str | None = None
    featured: bool | None = None


class BeritaResponse(OperationalResponse):
    judul: str
    slug: str | None = None
    sumber: str | None = None
    kategori: str | None = None
    author: str | None = None
    deskripsi: str | None = None
    isi: str | None = None
    foto: str | None = None
    status: str | None = None
    featured: bool | None = None


class BeritaResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[BeritaResponse]
