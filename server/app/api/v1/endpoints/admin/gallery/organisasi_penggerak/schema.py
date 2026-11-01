"""Pydantic schemas for Gallery Organisasi Penggerak (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    GalleryCommonBase,
    OperationalResponse,
)


class OrganisasiPenggerakBase(GalleryCommonBase):
    pass


class OrganisasiPenggerakCreate(OrganisasiPenggerakBase):
    id: str | None = None


class OrganisasiPenggerakUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    judul: str | None = None
    kategori: str | None = None
    tujuan: str | None = None
    proses: str | None = None
    hasil: str | None = None
    link: str | None = None
    file: str | None = None


class OrganisasiPenggerakResponse(OperationalResponse, GalleryCommonBase):
    pass


class OrganisasiPenggerakResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[OrganisasiPenggerakResponse]
