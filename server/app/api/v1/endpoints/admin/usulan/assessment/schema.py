"""Pydantic schemas for Usulan Assessment (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class AssessmentBase(OperationalBase):
    status_sekolah_id: str | None = None
    jml_siswa: int | None = 0
    jml_laki: int | None = 0
    jml_perempuan: int | None = 0
    kurikulum_k13: str | None = None
    kurikulum_kurmer: str | None = None
    file: str | None = None


class AssessmentCreate(AssessmentBase):
    id: str | None = None


class AssessmentUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    status_sekolah_id: str | None = None
    jml_siswa: int | None = None
    jml_laki: int | None = None
    jml_perempuan: int | None = None
    kurikulum_k13: str | None = None
    kurikulum_kurmer: str | None = None
    file: str | None = None


class AssessmentResponse(OperationalResponse):
    status_sekolah_id: str | None = None
    jml_siswa: int | None = None
    jml_laki: int | None = None
    jml_perempuan: int | None = None
    kurikulum_k13: str | None = None
    kurikulum_kurmer: str | None = None
    file: str | None = None


class AssessmentResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[AssessmentResponse]
