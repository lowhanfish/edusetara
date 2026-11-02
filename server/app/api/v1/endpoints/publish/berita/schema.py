"""Pydantic schemas for Public Berita."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalResponse,
)


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
