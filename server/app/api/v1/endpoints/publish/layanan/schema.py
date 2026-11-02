"""Pydantic schemas for Public Layanan Publik."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalResponse,
)


class LayananPublikResponse(OperationalResponse):
    nama_layanan: str
    kategori: str | None = None
    deskripsi: str | None = None
    syarat: str | None = None
    prosedur: str | None = None
    penanggung_jawab: str | None = None
    waktu_layanan: str | None = None
    biaya: str | None = None
    kontak: str | None = None
    status: str | None = None


class LayananPublikResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[LayananPublikResponse]
