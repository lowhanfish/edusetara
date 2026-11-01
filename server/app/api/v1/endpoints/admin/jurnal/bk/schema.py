"""Pydantic schemas for Jurnal Bimbingan Konseling (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class BkBase(OperationalBase):
    nm_siswa: str
    kelas_id: str | None = None
    tgl: str | None = None
    materi_layanan: str | None = None
    permasalahan: str | None = None
    mdl_kegiatan_id: str | None = None
    jns_layanan_id: str | None = None
    hasil: str | None = None
    rnc_tindak_lanjut: str | None = None
    keterangan: str | None = None
    file: str | None = None


class BkCreate(BkBase):
    id: str | None = None


class BkUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    nm_siswa: str | None = None
    kelas_id: str | None = None
    tgl: str | None = None
    materi_layanan: str | None = None
    permasalahan: str | None = None
    mdl_kegiatan_id: str | None = None
    jns_layanan_id: str | None = None
    hasil: str | None = None
    rnc_tindak_lanjut: str | None = None
    keterangan: str | None = None
    file: str | None = None


class BkResponse(OperationalResponse):
    nm_siswa: str
    kelas_id: str | None = None
    tgl: str | None = None
    materi_layanan: str | None = None
    permasalahan: str | None = None
    mdl_kegiatan_id: str | None = None
    jns_layanan_id: str | None = None
    hasil: str | None = None
    rnc_tindak_lanjut: str | None = None
    keterangan: str | None = None
    file: str | None = None


class BkResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[BkResponse]
