"""Admin Gallery routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.gallery import (
    guru_penggerak,
    kegiatan_guru_mgmp,
    kegiatan_kepala_sekolah,
    kegiatan_kkg_sd,
    kegiatan_pengawas,
    kegiatan_tk_paud,
    organisasi_penggerak,
    sekolah_penggerak,
    video_testimoni,
)

gallery_router = APIRouter(prefix="/gallery", tags=["Admin Gallery"])

gallery_router.include_router(sekolah_penggerak.router, prefix="/sekolah-penggerak")
gallery_router.include_router(guru_penggerak.router, prefix="/guru-penggerak")
gallery_router.include_router(organisasi_penggerak.router, prefix="/organisasi-penggerak")
gallery_router.include_router(kegiatan_kepala_sekolah.router, prefix="/kegiatan-kepala-sekolah")
gallery_router.include_router(kegiatan_kkg_sd.router, prefix="/kegiatan-kkg-sd")
gallery_router.include_router(kegiatan_guru_mgmp.router, prefix="/kegiatan-guru-mgmp")
gallery_router.include_router(kegiatan_tk_paud.router, prefix="/kegiatan-tk-paud")
gallery_router.include_router(kegiatan_pengawas.router, prefix="/kegiatan-pengawas")
gallery_router.include_router(video_testimoni.router, prefix="/video-testimoni")

__all__ = ["gallery_router"]
