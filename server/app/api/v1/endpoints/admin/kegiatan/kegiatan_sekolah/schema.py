"""Pydantic schemas for Kegiatan Sekolah (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class KegiatanSekolahBase(OperationalBase):
    judul: str
    deskripsi: str | None = None
    tanggal: str | None = None
    tahun: int | str | None = None
    file: str | None = None
    link: str | None = None


class KegiatanSekolahCreate(KegiatanSekolahBase):
    id: str | None = None


class KegiatanSekolahUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    judul: str | None = None
    deskripsi: str | None = None
    tanggal: str | None = None
    tahun: int | str | None = None
    file: str | None = None
    link: str | None = None


class KegiatanSekolahResponse(OperationalResponse):
    judul: str
    deskripsi: str | None = None
    tanggal: str | None = None
    tahun: int | str | None = None
    file: str | None = None
    link: str | None = None


class KegiatanSekolahResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[KegiatanSekolahResponse]
