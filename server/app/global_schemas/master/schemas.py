"""Pydantic schemas for Master Data items, Siswa, and batch Lookups."""

from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class MasterItemBase(BaseModel):
    """Base schema for standard master items."""

    uraian: str = Field(..., min_length=1, max_length=255, description="Label teks uraian master")
    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)


class MasterItemCreate(MasterItemBase):
    """Schema for creating a new master record."""

    id: str | None = Field(None, max_length=50, description="Optional custom ID (e.g. KBG-01)")
    kelas_id: str | None = Field(
        None, max_length=50, description="Optional FK kelas_id (e.g. mata-pelajaran)"
    )

    model_config = ConfigDict(extra="allow", from_attributes=True)


class MasterItemUpdate(BaseModel):
    """Schema for updating an existing master record."""

    uraian: str | None = Field(None, min_length=1, max_length=255)
    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)
    kelas_id: str | None = Field(None, max_length=50)

    model_config = ConfigDict(extra="allow", from_attributes=True)


class MasterItemRead(MasterItemBase):
    """Schema for returning master record details."""

    id: str
    kelas_id: str | None = None
    created_by: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(extra="allow", from_attributes=True)


class MasterOptionItem(BaseModel):
    """Minimal option schema for frontend dropdowns."""

    id: str
    uraian: str
    model_config = ConfigDict(extra="allow", from_attributes=True)


class MasterLookupResponse(BaseModel):
    """Uniform envelope for batch lookup dropdown options."""

    success: bool = True
    statusCode: int = 200
    message: str = "Master lookup retrieved successfully"
    data: dict[str, list[dict[str, Any]]]


class MasterListResponse(BaseModel):
    """Uniform envelope for list of master items."""

    success: bool = True
    statusCode: int = 200
    message: str = "Data retrieved successfully"
    data: list[dict[str, Any]]


class MasterSingleResponse(BaseModel):
    """Uniform envelope for single master item mutation."""

    success: bool = True
    statusCode: int = 200
    message: str = "Data processed successfully"
    data: dict[str, Any]


# ======================== Master Siswa Schemas ========================


class MasterSiswaBase(BaseModel):
    """Base fields for Master Siswa."""

    nama: str = Field(..., min_length=2, max_length=150)
    nisn: str = Field(..., min_length=5, max_length=20)
    nik: str = Field(..., min_length=5, max_length=20)
    jns_kelamin: str = Field(..., max_length=20)  # Laki-laki / Perempuan
    kelas_id: str | None = Field(None, max_length=50)
    tmp_lahir: str | None = Field(None, max_length=100)
    tgl_lahir: date
    agama: str | None = Field(None, max_length=50)
    alamat: str = Field(...)
    nama_ayah: str | None = Field(None, max_length=150)
    nama_ibu: str | None = Field(None, max_length=150)
    nama_wali: str | None = Field(None, max_length=150)
    file: str | None = Field(None, max_length=255)


class MasterSiswaCreate(MasterSiswaBase):
    """Create schema for Master Siswa."""

    id: str | None = Field(None, max_length=50)
    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)
    unit_kerja_id: str | None = Field(None, max_length=50)

    model_config = ConfigDict(from_attributes=True)


class MasterSiswaUpdate(BaseModel):
    """Update schema for Master Siswa."""

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


class MasterSiswaRead(MasterSiswaBase):
    """Read schema for Master Siswa."""

    id: str
    nip: str | None = None
    unit_kerja: str | None = None
    unit_kerja_id: str | None = None
    created_by: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    kelas_uraian: str | None = None

    model_config = ConfigDict(from_attributes=True)
