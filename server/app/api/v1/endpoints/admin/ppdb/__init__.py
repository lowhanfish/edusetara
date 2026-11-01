"""Admin PPDB routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.ppdb import kuota, paud, sd, smp

ppdb_router = APIRouter(prefix="/ppdb", tags=["Admin PPDB"])

ppdb_router.include_router(paud.router, prefix="/paud")
ppdb_router.include_router(sd.router, prefix="/sd")
ppdb_router.include_router(smp.router, prefix="/smp")
ppdb_router.include_router(kuota.router, prefix="/kuota")

__all__ = ["ppdb_router"]
