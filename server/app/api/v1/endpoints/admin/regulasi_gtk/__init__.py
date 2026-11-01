"""Admin Regulasi dan Info GTK routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.regulasi_gtk import modul_materi, pengumuman, regulasi

regulasi_gtk_router = APIRouter(prefix="/regulasi-gtk", tags=["Admin Regulasi GTK"])

regulasi_gtk_router.include_router(pengumuman.router, prefix="/pengumuman")
regulasi_gtk_router.include_router(modul_materi.router, prefix="/modul-materi")
regulasi_gtk_router.include_router(regulasi.router, prefix="/regulasi")

__all__ = ["regulasi_gtk_router"]
