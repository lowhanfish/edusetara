"""Pydantic schemas for Public Profil Section."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalResponse,
)


class ProfilSectionResponse(OperationalResponse):
    judul: str | None = None
    title: str | None = None
    kategori: str | None = None
    category: str | None = None
    konten: str | None = None
    content: str | None = None
    file: str | None = None
    urutan: str | int | None = None
    status: str | None = None


class ProfilSectionResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[ProfilSectionResponse]
