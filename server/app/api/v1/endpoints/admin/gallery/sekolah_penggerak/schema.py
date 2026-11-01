"""Pydantic schemas for Gallery Sekolah Penggerak (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    GalleryCommonBase,
    OperationalResponse,
)


class SekolahPenggerakBase(GalleryCommonBase):
    pass


class SekolahPenggerakCreate(SekolahPenggerakBase):
    id: str | None = None


class SekolahPenggerakUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    judul: str | None = None
    kategori: str | None = None
    tujuan: str | None = None
    proses: str | None = None
    hasil: str | None = None
    link: str | None = None
    file: str | None = None


class SekolahPenggerakResponse(OperationalResponse, GalleryCommonBase):
    pass


class SekolahPenggerakResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[SekolahPenggerakResponse]
