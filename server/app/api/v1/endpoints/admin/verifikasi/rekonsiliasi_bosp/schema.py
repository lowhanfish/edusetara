"""Pydantic schemas for Verifikasi Rekonsiliasi BOSP (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class VerifikasiRekonsiliasiBospBase(OperationalBase):
    usulan_id: str | None = None
    status_1: str | None = "Menunggu"
    pesan_1: str | None = None


class VerifikasiRekonsiliasiBospCreate(VerifikasiRekonsiliasiBospBase):
    id: str | None = None


class VerifikasiRekonsiliasiBospUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    usulan_id: str | None = None
    status_1: str | None = None
    pesan_1: str | None = None


class VerifikasiRekonsiliasiBospResponse(OperationalResponse):
    usulan_id: str | None = None
    status_1: str | None = None
    pesan_1: str | None = None


class VerifikasiRekonsiliasiBospResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[VerifikasiRekonsiliasiBospResponse]
