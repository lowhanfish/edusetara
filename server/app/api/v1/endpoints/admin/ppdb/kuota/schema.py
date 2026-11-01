"""Pydantic schemas for Kuota PPDB (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class KuotaPpdbBase(OperationalBase):
    nama_sekolah: str
    unit_kerja_id: str | None = None
    jenjang: str | None = None
    jml_ruang_tersedia: int | None = 0
    standar_maks_rombel: int | None = 28
    total_daya_tampung: int | None = 0
    siswa_terdaftar: int | None = 0
    sisa_kuota: int | None = 0
    status_kuota: str | None = "Tersedia"


class KuotaPpdbCreate(KuotaPpdbBase):
    id: str | None = None


class KuotaPpdbUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    nama_sekolah: str | None = None
    unit_kerja_id: str | None = None
    jenjang: str | None = None
    jml_ruang_tersedia: int | None = None
    standar_maks_rombel: int | None = None
    total_daya_tampung: int | None = None
    siswa_terdaftar: int | None = None
    sisa_kuota: int | None = None
    status_kuota: str | None = None


class KuotaPpdbResponse(OperationalResponse):
    nama_sekolah: str
    unit_kerja_id: str | None = None
    jenjang: str | None = None
    jml_ruang_tersedia: int | None = None
    standar_maks_rombel: int | None = None
    total_daya_tampung: int | None = None
    siswa_terdaftar: int | None = None
    sisa_kuota: int | None = None
    status_kuota: str | None = None


class KuotaPpdbResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[KuotaPpdbResponse]
