"""Pydantic schemas for Pesan Kontak."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class PesanKontakBase(OperationalBase):
    nama: str
    email: str | None = None
    phone: str | None = None
    telepon: str | None = None
    subjek: str | None = None
    kategori: str | None = None
    pesan: str
    tanggapan: str | None = None
    status: str | None = "Baru"


class PesanKontakCreate(PesanKontakBase):
    id: str | None = None


class PesanKontakUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    nama: str | None = None
    email: str | None = None
    phone: str | None = None
    telepon: str | None = None
    subjek: str | None = None
    kategori: str | None = None
    pesan: str | None = None
    tanggapan: str | None = None
    status: str | None = None


class PesanKontakResponse(OperationalResponse):
    nama: str
    email: str | None = None
    phone: str | None = None
    telepon: str | None = None
    subjek: str | None = None
    kategori: str | None = None
    pesan: str
    tanggapan: str | None = None
    status: str | None = None


class PesanKontakResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PesanKontakResponse]
