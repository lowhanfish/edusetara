"""Pydantic schemas for Kebudayaan Item."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class KebudayaanItemBase(OperationalBase):
    nama: str | None = None
    name: str | None = None
    kategori: str | None = None
    type: str | None = None
    lokasi: str | None = None
    location: str | None = None
    deskripsi: str | None = None
    description: str | None = None
    foto: str | None = None
    status: str | None = "Terverifikasi"


class KebudayaanItemCreate(KebudayaanItemBase):
    id: str | None = None


class KebudayaanItemUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    nama: str | None = None
    name: str | None = None
    kategori: str | None = None
    type: str | None = None
    lokasi: str | None = None
    location: str | None = None
    deskripsi: str | None = None
    description: str | None = None
    foto: str | None = None
    status: str | None = None


class KebudayaanItemResponse(OperationalResponse):
    nama: str | None = None
    name: str | None = None
    kategori: str | None = None
    type: str | None = None
    lokasi: str | None = None
    location: str | None = None
    deskripsi: str | None = None
    description: str | None = None
    foto: str | None = None
    status: str | None = None


class KebudayaanItemResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[KebudayaanItemResponse]
