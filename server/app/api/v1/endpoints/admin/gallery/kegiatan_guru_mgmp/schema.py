"""Pydantic schemas for Gallery Kegiatan Guru MGMP."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    GalleryCommonBase,
    OperationalResponse,
)


class KegiatanGuruMgmpBase(GalleryCommonBase):
    pass


class KegiatanGuruMgmpCreate(KegiatanGuruMgmpBase):
    id: str | None = None


class KegiatanGuruMgmpUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    judul: str | None = None
    kategori: str | None = None
    tujuan: str | None = None
    proses: str | None = None
    hasil: str | None = None
    link: str | None = None
    file: str | None = None


class KegiatanGuruMgmpResponse(OperationalResponse, GalleryCommonBase):
    pass


class KegiatanGuruMgmpResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[KegiatanGuruMgmpResponse]
