"""Pydantic schemas for Public Pesan Kontak."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class PesanKontakPublicCreate(OperationalBase):
    id: str | None = None
    nama: str
    email: str | None = None
    phone: str | None = None
    telepon: str | None = None
    subjek: str | None = None
    kategori: str | None = "Aspirasi"
    pesan: str
    status: str | None = "Baru"


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
