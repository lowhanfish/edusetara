"""Pydantic schemas for Jurnal Pengawas (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class PengawasBase(OperationalBase):
    kepsek: str | None = None
    pendampingan_id: str | None = None
    temuan_akademik: str | None = None
    temuan_manajerial: str | None = None
    tindak_lanjut: str | None = None
    tugas_id: str | None = None
    tgl: str | None = None
    file: str | None = None


class PengawasCreate(PengawasBase):
    id: str | None = None


class PengawasUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    kepsek: str | None = None
    pendampingan_id: str | None = None
    temuan_akademik: str | None = None
    temuan_manajerial: str | None = None
    tindak_lanjut: str | None = None
    tugas_id: str | None = None
    tgl: str | None = None
    file: str | None = None


class PengawasResponse(OperationalResponse):
    kepsek: str | None = None
    pendampingan_id: str | None = None
    temuan_akademik: str | None = None
    temuan_manajerial: str | None = None
    tindak_lanjut: str | None = None
    tugas_id: str | None = None
    tgl: str | None = None
    file: str | None = None


class PengawasResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[PengawasResponse]
