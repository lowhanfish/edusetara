"""Jurnal Master routers aggregator (e-office pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.master.jurnal import (
    bahan_ajar,
    kelas,
    mata_pelajaran,
    materi_ajar,
)

jurnal_router = APIRouter(prefix="/jurnal", tags=["Admin Master Jurnal"])

jurnal_router.include_router(bahan_ajar.router, prefix="/bahan-ajar")
jurnal_router.include_router(materi_ajar.router, prefix="/materi-ajar")
jurnal_router.include_router(kelas.router, prefix="/kelas")
jurnal_router.include_router(mata_pelajaran.router, prefix="/mata-pelajaran")

__all__ = ["jurnal_router"]
