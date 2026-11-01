"""Admin endpoints aggregator for /api/v1/admin/* (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.gallery import gallery_router
from app.api.v1.endpoints.admin.jurnal import jurnal_router
from app.api.v1.endpoints.admin.kegiatan import (
    kegiatan_router,
    kegiatan_sekolah_router,
    komunitas_belajar_router,
    piagam_sertifikat_router,
)
from app.api.v1.endpoints.admin.master import master_router
from app.api.v1.endpoints.admin.ppdb import kuota, ppdb_router
from app.api.v1.endpoints.admin.profile import profile_router
from app.api.v1.endpoints.admin.publish import (
    banner_router,
    berita_router,
    kebudayaan_router,
    kontak_router,
    layanan_router,
    pendidikan_router,
    pengumuman_router,
    profil_router,
    publish_router,
    statistik_router,
)
from app.api.v1.endpoints.admin.regulasi_gtk import regulasi_gtk_router
from app.api.v1.endpoints.admin.rombel import rombel_router
from app.api.v1.endpoints.admin.sarpras import sarpras_router
from app.api.v1.endpoints.admin.usulan import usulan_router
from app.api.v1.endpoints.admin.verifikasi import verifikasi_router

admin_router = APIRouter(prefix="/admin")

# 1. Master Data Domain
admin_router.include_router(master_router)

# 2. Operational Domains
admin_router.include_router(profile_router)
admin_router.include_router(sarpras_router)
admin_router.include_router(rombel_router)
admin_router.include_router(usulan_router)
admin_router.include_router(jurnal_router)
admin_router.include_router(verifikasi_router)
admin_router.include_router(regulasi_gtk_router)
admin_router.include_router(ppdb_router)
admin_router.include_router(gallery_router)
admin_router.include_router(kegiatan_router)
admin_router.include_router(publish_router)

# 3. Direct Route Aliases for Frontend Client Compatibility
admin_router.include_router(kegiatan_sekolah_router, prefix="/kegiatan-sekolah")
admin_router.include_router(komunitas_belajar_router, prefix="/komunitas-belajar")
admin_router.include_router(piagam_sertifikat_router, prefix="/piagam-sertifikat")
admin_router.include_router(kuota.router, prefix="/kuota-ppdb")
admin_router.include_router(berita_router, prefix="/berita")
admin_router.include_router(pengumuman_router, prefix="/pengumuman")
admin_router.include_router(layanan_router, prefix="/layanan")
admin_router.include_router(kontak_router, prefix="/kontak")
admin_router.include_router(banner_router, prefix="/banner")
admin_router.include_router(kebudayaan_router, prefix="/kebudayaan")
admin_router.include_router(pendidikan_router, prefix="/pendidikan")
admin_router.include_router(profil_router, prefix="/profil")
admin_router.include_router(statistik_router, prefix="/statistik")

__all__ = [
    "admin_router",
    "master_router",
    "profile_router",
    "sarpras_router",
    "rombel_router",
    "usulan_router",
    "jurnal_router",
    "verifikasi_router",
    "regulasi_gtk_router",
    "ppdb_router",
    "gallery_router",
    "kegiatan_router",
    "publish_router",
]
