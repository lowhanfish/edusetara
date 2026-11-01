"""Admin Kegiatan routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.kegiatan import (
    kegiatan_sekolah,
    komunitas_belajar,
    piagam_sertifikat,
)

kegiatan_router = APIRouter(prefix="/kegiatan", tags=["Admin Kegiatan"])

kegiatan_router.include_router(kegiatan_sekolah.router, prefix="/kegiatan-sekolah")
kegiatan_router.include_router(komunitas_belajar.router, prefix="/komunitas-belajar")
kegiatan_router.include_router(piagam_sertifikat.router, prefix="/piagam-sertifikat")

kegiatan_sekolah_router = kegiatan_sekolah.router
komunitas_belajar_router = komunitas_belajar.router
piagam_sertifikat_router = piagam_sertifikat.router

__all__ = [
    "kegiatan_router",
    "kegiatan_sekolah_router",
    "komunitas_belajar_router",
    "piagam_sertifikat_router",
]
