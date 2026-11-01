"""Pydantic schemas for Pengumuman Publish."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class PengumumanPublishBase(OperationalBase):
    judul: str
    nomor: str | None = None
    kategori: str | None = None
    ringkasan: str | None = None
    target_audience: str | None = None
    deadline: str | None = None
    lampiran: str | None = None
    is_important: bool | None = False
    status: str | None = "Aktif"


class PengumumanPublishCreate(PengumumanPublishBase):
    id: str | None = None


class PengumumanPublishUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    nomor: str | None = None
    judul: str | None = None
    kategori: str | None = None
    ringkasan: str | None = None
    target_audience: str | None = None
    deadline: str | None = None
    lampiran: str | None = None
    is_important: bool | None = None
    status: str | None = None


class PengumumanPublishResponse(OperationalResponse):
    nomor: str | None = None
    judul: str
    kategori: str | None = None
    ringkasan: str | None = None
    target_audience: str | None = None
    deadline: str | None = None
    lampiran: str | None = None
    is_important: bool | None = None
    status: str | None = None


class PengumumanPublishResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PengumumanPublishResponse]
