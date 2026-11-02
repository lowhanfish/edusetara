"""Pydantic schemas for Usulan Rekonsiliasi BOSP (matching master pattern)."""

from decimal import Decimal
from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class RekonsiliasiBospBase(OperationalBase):
    sekolah: str | None = None
    tahap: str | None = None
    tahun: int | str | None = None
    nominal_dana: Decimal | float | int | None = None
    kategori_spj: str | None = None
    file_bku: str | None = None
    file_rekening: str | None = None
    file_sptjm: str | None = None
    status: str | None = None
    semester_id: str | None = None
    file: str | None = None


class RekonsiliasiBospCreate(RekonsiliasiBospBase):
    id: str | None = None


class RekonsiliasiBospUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    sekolah: str | None = None
    tahap: str | None = None
    tahun: int | str | None = None
    nominal_dana: Decimal | float | int | None = None
    kategori_spj: str | None = None
    file_bku: str | None = None
    file_rekening: str | None = None
    file_sptjm: str | None = None
    status: str | None = None
    semester_id: str | None = None
    file: str | None = None


class RekonsiliasiBospResponse(OperationalResponse):
    sekolah: str | None = None
    tahap: str | None = None
    tahun: int | str | None = None
    nominal_dana: Decimal | float | int | None = None
    kategori_spj: str | None = None
    file_bku: str | None = None
    file_rekening: str | None = None
    file_sptjm: str | None = None
    status: str | None = None
    semester_id: str | None = None
    file: str | None = None


class RekonsiliasiBospResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[RekonsiliasiBospResponse]

