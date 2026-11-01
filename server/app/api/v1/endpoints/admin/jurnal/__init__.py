"""Admin Jurnal routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.jurnal import bk, guru_kelas, kepala_sekolah, pengawas

jurnal_router = APIRouter(prefix="/jurnal", tags=["Admin Jurnal"])

jurnal_router.include_router(guru_kelas.router, prefix="/guru-kelas")
jurnal_router.include_router(kepala_sekolah.router, prefix="/kepala-sekolah")
jurnal_router.include_router(pengawas.router, prefix="/pengawas")
jurnal_router.include_router(bk.router, prefix="/bk")

__all__ = ["jurnal_router"]
