"""Pydantic schemas for Master Sekolah (Sovereign master dataset)."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SekolahBase(BaseModel):
    npsn: str = Field(..., description="Nomor Pokok Sekolah Nasional")
    nama_sekolah: str = Field(..., description="Nama resmi sekolah")
    bentuk_pendidikan: str = Field(..., description="Bentuk pendidikan (SD, SMP, TK, KB, PKBM, SKB, dll.)")
    jenjang: str | None = Field(None, description="Jenjang pendidikan (alias bentuk_pendidikan)")
    status_sekolah: str = Field("NEGERI", description="Status kelembagaan (NEGERI / SWASTA)")
    akreditasi: str | None = Field(None, description="Peringkat Akreditasi (A, B, C, TT)")
    kecamatan_id: int | None = Field(None, description="ID Kecamatan di egov.master_kecamatan")
    kecamatan: str | None = Field(None, description="Kecamatan di Kab. Konawe Selatan")
    desa_kelurahan_id: int | None = Field(None, description="ID Desa/Kelurahan di egov.master_des_kel")
    desa_kelurahan: str | None = Field(None, description="Desa atau kelurahan")
    alamat_jalan: str | None = Field(None, description="Alamat jalan / dusun")
    dusun: str | None = Field(None, description="Nama dusun")
    kode_pos: str | None = Field(None, description="Kode pos")
    latitude: float | None = Field(None, description="Koordinat lintang (Latitude)")
    longitude: float | None = Field(None, description="Koordinat bujur (Longitude)")
    simpeg_unit_kerja_id: str | None = Field(None, description="ID relasi ke simpeg.unit_kerja (opsional)")
    is_active: bool = Field(True, description="Status keaktifan data sekolah")


class SekolahUpdate(BaseModel):
    nama_sekolah: str | None = None
    bentuk_pendidikan: str | None = None
    jenjang: str | None = None
    status_sekolah: str | None = None
    npsn: str | None = None
    akreditasi: str | None = None
    kecamatan_id: int | None = None
    kecamatan: str | None = None
    desa_kelurahan_id: int | None = None
    desa_kelurahan: str | None = None
    alamat_jalan: str | None = None
    dusun: str | None = None
    kode_pos: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    simpeg_unit_kerja_id: str | None = None
    is_active: bool | None = None


class SekolahResponse(SekolahBase):
    id: str
    unit_kerja_id: str | None = None
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
    npsn: str
    nama: str
    bentuk_pendidikan: str
    jenjang: str
    status: str
    kecamatan: str | None = None
    simpeg_unit_kerja_id: str | None = None
