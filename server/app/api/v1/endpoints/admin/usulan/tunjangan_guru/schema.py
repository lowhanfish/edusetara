"""Pydantic schemas for Usulan Tunjangan Guru (matching master pattern)."""

from decimal import Decimal

from pydantic import BaseModel, model_validator

from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class VerificationReadOnly(BaseModel):
    @model_validator(mode="before")
    @classmethod
    def reject_verification_fields(cls, data):
        if isinstance(data, dict) and {
            "status",
            "status_verifikasi",
            "pesan",
            "catatan",
            "verifikasi_id",
        }.intersection(data):
            raise ValueError(
                "Status dan catatan verifikasi hanya diubah melalui halaman verifikasi admin"
            )
        return data


class TunjanganGuruBase(OperationalBase, VerificationReadOnly):
    triwulan_id: str | None = None
    jenis_id: str | None = None
    kelas_id: str | None = None
    jml_guru: int | None = 1
    nominal: Decimal | float | None = None
    file: str | None = None
    file_type: str | None = None


class TunjanganGuruCreate(TunjanganGuruBase):
    id: str | None = None


class TunjanganGuruUpdate(VerificationReadOnly):
    nip: str | None = None
    unit_kerja: str | None = None
    triwulan_id: str | None = None
    jenis_id: str | None = None
    kelas_id: str | None = None
    jml_guru: int | None = None
    nominal: Decimal | float | None = None
    file: str | None = None
    file_type: str | None = None


class TunjanganGuruResponse(OperationalResponse):
    status_verifikasi: str = "Menunggu"
    catatan: str | None = None
    verifikasi_id: str | None = None
    triwulan_id: str | None = None
    jenis_id: str | None = None
    kelas_id: str | None = None
    jml_guru: int | None = None
    nominal: Decimal | float | None = None
    file: str | None = None
    file_type: str | None = None


class TunjanganGuruResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[TunjanganGuruResponse]
