"""Schemas for Master Siswa module (e-office pattern)."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class SiswaBase(BaseModel):
    """Base fields for Peserta Didik."""

    nama: str = Field(..., min_length=2, max_length=150)
    nisn: str = Field(..., min_length=5, max_length=20)
    nik: str = Field(..., min_length=5, max_length=20)
    jns_kelamin: str = Field(..., max_length=20)
    kelas_id: str | None = Field(None, max_length=50)
    tmp_lahir: str | None = Field(None, max_length=100)
    tgl_lahir: date
    agama: str | None = Field(None, max_length=50)
    alamat: str = Field(...)
    nama_ayah: str | None = Field(None, max_length=150)
    nama_ibu: str | None = Field(None, max_length=150)
    nama_wali: str | None = Field(None, max_length=150)
    file: str | None = Field(None, max_length=255)


class SiswaCreate(SiswaBase):
    """Create schema for Siswa."""

    id: str | None = Field(None, max_length=50)
    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)
    unit_kerja_id: str | None = Field(None, max_length=50)

    model_config = ConfigDict(from_attributes=True)


class SiswaUpdate(BaseModel):
    """Update schema for Siswa."""

    nama: str | None = Field(None, min_length=2, max_length=150)
    nisn: str | None = Field(None, min_length=5, max_length=20)
    nik: str | None = Field(None, min_length=5, max_length=20)
    jns_kelamin: str | None = Field(None, max_length=20)
    kelas_id: str | None = Field(None, max_length=50)
    tmp_lahir: str | None = Field(None, max_length=100)
    tgl_lahir: date | None = None
    agama: str | None = Field(None, max_length=50)
    alamat: str | None = None
    nama_ayah: str | None = Field(None, max_length=150)
    nama_ibu: str | None = Field(None, max_length=150)
    nama_wali: str | None = Field(None, max_length=150)
    file: str | None = Field(None, max_length=255)

    model_config = ConfigDict(from_attributes=True)


class SiswaOption(BaseModel):
    """Option schema for dropdown select."""

    id: str
    uraian: str
    nisn: str | None = None

    model_config = ConfigDict(from_attributes=True)


class SiswaResponse(SiswaBase):
    """Response schema for Siswa item."""

    id: str
    nama: str
    nisn: str | None = None
    nik: str | None = None
    jns_kelamin: str | None = None
    tgl_lahir: date | None = None
    alamat: str | None = None
    is_active: bool | None = True
    nip: str | None = None
    unit_kerja: str | None = None
    unit_kerja_id: str | None = None
    created_by: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    kelas_uraian: str | None = None

    model_config = ConfigDict(from_attributes=True)


class SiswaResponseList(BaseModel):
    """Paginated response list for Siswa."""

    total: int
    skip: int = 0
    limit: int = 100
    data: list[SiswaResponse]
