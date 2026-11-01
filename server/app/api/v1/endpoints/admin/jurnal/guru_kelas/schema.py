"""Pydantic schemas for Jurnal Guru Kelas (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class GuruKelasBase(OperationalBase):
    sekolah: str | None = None
    tema: str
    materi_pokok: str
    pertemuan_ke: int | None = 1
    tgl: str | None = None
    model_pembelajaran: str | None = None
    metode_pembelajaran: str | None = None
    kegiatan: str | None = None
    penilaian: str | None = None
    siswa_hadir: int | None = 0
    siswa_izin: int | None = 0
    siswa_sakit: int | None = 0
    siswa_alpa: int | None = 0
    persentase: int | None = 100
    keterangan: str | None = None
    file: str | None = None


class GuruKelasCreate(GuruKelasBase):
    id: str | None = None


class GuruKelasUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    sekolah: str | None = None
    tema: str | None = None
    materi_pokok: str | None = None
    pertemuan_ke: int | None = None
    tgl: str | None = None
    model_pembelajaran: str | None = None
    metode_pembelajaran: str | None = None
    kegiatan: str | None = None
    penilaian: str | None = None
    siswa_hadir: int | None = None
    siswa_izin: int | None = None
    siswa_sakit: int | None = None
    siswa_alpa: int | None = None
    persentase: int | None = None
    keterangan: str | None = None
    file: str | None = None


class GuruKelasResponse(OperationalResponse):
    sekolah: str | None = None
    tema: str
    materi_pokok: str
    pertemuan_ke: int | None = None
    tgl: str | None = None
    model_pembelajaran: str | None = None
    metode_pembelajaran: str | None = None
    kegiatan: str | None = None
    penilaian: str | None = None
    siswa_hadir: int | None = None
    siswa_izin: int | None = None
    siswa_sakit: int | None = None
    siswa_alpa: int | None = None
    persentase: int | None = None
    keterangan: str | None = None
    file: str | None = None


class GuruKelasResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[GuruKelasResponse]
