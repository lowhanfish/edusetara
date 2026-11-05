"""Pydantic schemas for Verifikasi Tunjangan Guru (matching master pattern)."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class VerifikasiTunjanganGuruBase(OperationalBase):
    usulan_id: str | None = None
    status: str | None = "Menunggu"
    pesan: str | None = None


class VerifikasiTunjanganGuruCreate(VerifikasiTunjanganGuruBase):
    id: str | None = None


class VerifikasiTunjanganGuruUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    usulan_id: str | None = None
    status: str | None = None
    pesan: str | None = None


class VerifikasiTunjanganGuruResponse(OperationalResponse):
    usulan_id: str | None = None
    status: str | None = None
    pesan: str | None = None


class VerifikasiTunjanganGuruResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[VerifikasiTunjanganGuruResponse]


class AdminVerificationInput(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    status: Literal["Menunggu", "Disetujui", "Perbaikan", "Ditolak"]
    pesan: str | None = Field(None, max_length=5000)
