"""Pydantic schemas for Usulan Rekonsiliasi BOSP (matching master pattern)."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class DokumenSpj(BaseModel):
    kategori_id: str
    nama: str
    file: str


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
    dokumen_spj: list[DokumenSpj] | None = None
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


class DokumenCreate(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    kategori_id: str = Field(min_length=1, max_length=50)
    uraian: str = Field(min_length=1, max_length=5000)
    file: str = Field(min_length=1, max_length=255)


class DokumenResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    usulan_id: str
    kategori_id: str | None = None
    kategori_nama: str
    uraian: str
    file: str
    cek_benar: bool
    cek_lengkap: bool


class DokumenVerification(BaseModel):
    model_config = ConfigDict(extra="forbid")

    cek_benar: bool | None = None
    cek_lengkap: bool | None = None
