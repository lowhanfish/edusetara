"""Pydantic schemas for Gallery Kegiatan Pengawas."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    GalleryCommonBase,
    OperationalResponse,
)


class KegiatanPengawasBase(GalleryCommonBase):
    pass


class KegiatanPengawasCreate(KegiatanPengawasBase):
    id: str | None = None


class KegiatanPengawasUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    judul: str | None = None
    kategori: str | None = None
    tujuan: str | None = None
    proses: str | None = None
    hasil: str | None = None
    link: str | None = None
    file: str | None = None


class KegiatanPengawasResponse(OperationalResponse, GalleryCommonBase):
    pass


class KegiatanPengawasResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[KegiatanPengawasResponse]
