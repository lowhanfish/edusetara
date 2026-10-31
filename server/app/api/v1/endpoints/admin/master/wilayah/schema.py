"""Pydantic schemas for Master Wilayah (from egov database)."""

from pydantic import BaseModel, ConfigDict, Field


class KecamatanItem(BaseModel):
    id: int = Field(..., description="ID Kecamatan (egov.master_kecamatan.kecamatan_id)")
    kode: str | None = Field(None, description="Kode Kecamatan")
    nama: str = Field(..., description="Nama Kecamatan (UPPERCASE)")
    label: str = Field(..., description="Nama Kecamatan (Title Case)")

    model_config = ConfigDict(from_attributes=True)


class DesaKelurahanItem(BaseModel):
    id: int = Field(..., description="ID Desa/Kelurahan (egov.master_des_kel.des_kel_id)")
    kecamatan_id: int = Field(..., description="ID Kecamatan")
    kode: str | None = Field(None, description="Kode Desa/Kelurahan")
    nama: str = Field(..., description="Nama Desa/Kelurahan (UPPERCASE)")
    label: str = Field(..., description="Nama Desa/Kelurahan (Title Case)")

    model_config = ConfigDict(from_attributes=True)
