"""Pydantic schemas for Master Sekolah."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SekolahBase(BaseModel):
    jenjang: str = Field(..., description="Jenjang pendidikan (PAUD, TK, SD, SMP, SATAP, PKBM)")
    status_sekolah: str = Field("NEGERI", description="Status kelembagaan (NEGERI / SWASTA)")
    npsn: str | None = Field(None, description="Nomor Pokok Sekolah Nasional")
    akreditasi: str | None = Field(None, description="Peringkat Akreditasi (A, B, C, TT)")
    kecamatan: str | None = Field(None, description="Kecamatan di Kab. Konawe Selatan")
    desa_kelurahan: str | None = Field(None, description="Desa atau kelurahan")
    is_active: bool = Field(True, description="Status keaktifan data sekolah")


class SekolahUpdate(BaseModel):
    jenjang: str | None = None
    status_sekolah: str | None = None
    npsn: str | None = None
    akreditasi: str | None = None
    kecamatan: str | None = None
    desa_kelurahan: str | None = None
    is_active: bool | None = None


class SekolahResponse(SekolahBase):
    id: str
    unit_kerja_id: str
    nama_sekolah: str
    name: str
    alamat: str | None = None
    address: str | None = None
    level: str
    status: str
    district: str | None = None
    village: str | None = None
    url: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class SekolahResponseList(BaseModel):
    total: int
    skip: int
    limit: int
    data: list[SekolahResponse]


class SekolahLookupItem(BaseModel):
    id: str
    unit_kerja_id: str
    nama: str
    jenjang: str
    status: str
    kecamatan: str | None = None
