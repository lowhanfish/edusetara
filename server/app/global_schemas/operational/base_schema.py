"""Shared Base Schemas for Operational Data resources (matching master pattern)."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class OperationalBase(BaseModel):
    """Base descriptors for operational resources."""

    model_config = ConfigDict(from_attributes=True, extra="allow")

    nip: str | None = Field(None, max_length=50)
    unit_kerja: str | None = Field(None, max_length=150)


class OperationalResponse(OperationalBase):
    """Standard detailed response for an operational resource item."""

    id: str
    created_by: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class OperationalResponseList(BaseModel):
    """Standard paginated list response."""

    total: int
    skip: int = 0
    limit: int = 100
    data: list[Any]


class PpdbCommonBase(OperationalBase):
    """Shared fields for PPDB registration entries."""

    nama: str
    nm_panggilan: str | None = None
    jns_kelamin: str | None = None
    nisn: str | None = None
    nik: str | None = None
    tmp_lahir: str | None = None
    tgl_lahir: str | None = None
    agama: str | None = None
    anak_keberapa: int | None = None
    jml_saudara: int | None = None
    kecamatan_id: str | None = None
    des_kel_id: str | None = None
    alamat: str | None = None
    rt_rw: str | None = None
    dusun: str | None = None
    kode_pos: str | None = None
    tmp_tinggal: str | None = None
    lainnya: str | None = None
    moda_transportasi: str | None = None
    file: str | None = None

    # Ayah
    nama_ayah: str | None = None
    nik_ayah: str | None = None
    thn_lahir_ayah: str | None = None
    pendidikan_ayah: str | None = None
    pekerjaan_ayah: str | None = None
    penghasilan_ayah: str | None = None

    # Ibu
    nama_ibu: str | None = None
    nik_ibu: str | None = None
    thn_lahir_ibu: str | None = None
    pendidikan_ibu: str | None = None
    pekerjaan_ibu: str | None = None
    penghasilan_ibu: str | None = None

    # Wali
    nama_wali: str | None = None
    nik_wali: str | None = None
    thn_lahir_wali: str | None = None
    pendidikan_wali: str | None = None
    pekerjaan_wali: str | None = None
    penghasilan_wali: str | None = None

    kategori: str | None = None


class PpdbCommonUpdate(BaseModel):
    """Shared optional fields for PPDB registration update."""

    nip: str | None = None
    unit_kerja: str | None = None
    nama: str | None = None
    nm_panggilan: str | None = None
    jns_kelamin: str | None = None
    nisn: str | None = None
    nik: str | None = None
    tmp_lahir: str | None = None
    tgl_lahir: str | None = None
    agama: str | None = None
    anak_keberapa: int | None = None
    jml_saudara: int | None = None
    kecamatan_id: str | None = None
    des_kel_id: str | None = None
    alamat: str | None = None
    rt_rw: str | None = None
    dusun: str | None = None
    kode_pos: str | None = None
    tmp_tinggal: str | None = None
    lainnya: str | None = None
    moda_transportasi: str | None = None
    file: str | None = None

    # Ayah
    nama_ayah: str | None = None
    nik_ayah: str | None = None
    thn_lahir_ayah: str | None = None
    pendidikan_ayah: str | None = None
    pekerjaan_ayah: str | None = None
    penghasilan_ayah: str | None = None

    # Ibu
    nama_ibu: str | None = None
    nik_ibu: str | None = None
    thn_lahir_ibu: str | None = None
    pendidikan_ibu: str | None = None
    pekerjaan_ibu: str | None = None
    penghasilan_ibu: str | None = None

    # Wali
    nama_wali: str | None = None
    nik_wali: str | None = None
    thn_lahir_wali: str | None = None
    pendidikan_wali: str | None = None
    pekerjaan_wali: str | None = None
    penghasilan_wali: str | None = None

    kategori: str | None = None


class GalleryCommonBase(OperationalBase):
    """Shared fields for Gallery operational items."""

    judul: str
    kategori: str | None = None
    tujuan: str | None = None
    proses: str | None = None
    hasil: str | None = None
    link: str | None = None
    file: str | None = None
