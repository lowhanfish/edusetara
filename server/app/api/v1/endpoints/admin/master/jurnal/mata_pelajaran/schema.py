"""Pydantic schemas for Master Jurnal Mata Pelajaran (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterOption,
    MasterResponse,
    MasterUpdate,
)


class MataPelajaranCreate(MasterCreate):
    kelas_id: str


class MataPelajaranResponse(MasterResponse):
    kelas_id: str | None = None
    kelas: MasterOption | None = None


class MataPelajaranUpdate(MasterUpdate):
    kelas_id: str | None = None


class MataPelajaranResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[MataPelajaranResponse]
