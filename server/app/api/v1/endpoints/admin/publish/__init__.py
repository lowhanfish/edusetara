"""Admin Publish routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.publish import (
    banner,
    berita,
    kebudayaan,
    kontak,
    layanan,
    pendidikan,
    pengumuman,
    profil,
    statistik,
)

publish_router = APIRouter(prefix="/publish", tags=["Admin Publish"])

publish_router.include_router(berita.router, prefix="/berita")
publish_router.include_router(pengumuman.router, prefix="/pengumuman")
publish_router.include_router(layanan.router, prefix="/layanan")
publish_router.include_router(kontak.router, prefix="/kontak")
publish_router.include_router(banner.router, prefix="/banner")
publish_router.include_router(kebudayaan.router, prefix="/kebudayaan")
publish_router.include_router(pendidikan.router, prefix="/pendidikan")
publish_router.include_router(profil.router, prefix="/profil")
publish_router.include_router(statistik.router, prefix="/statistik")

# Individual router exports for direct mount
berita_router = berita.router
pengumuman_router = pengumuman.router
layanan_router = layanan.router
kontak_router = kontak.router
banner_router = banner.router
kebudayaan_router = kebudayaan.router
pendidikan_router = pendidikan.router
profil_router = profil.router
statistik_router = statistik.router

__all__ = [
    "publish_router",
    "berita_router",
    "pengumuman_router",
    "layanan_router",
    "kontak_router",
    "banner_router",
    "kebudayaan_router",
    "pendidikan_router",
    "profil_router",
    "statistik_router",
]
