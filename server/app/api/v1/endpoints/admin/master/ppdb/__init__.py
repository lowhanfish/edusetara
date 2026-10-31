"""PPDB Master routers aggregator (e-office pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.master.ppdb import (
    agama,
    pekerjaan,
    pendidikan,
    penghasilan,
    tempat_tinggal,
    transportasi,
)

ppdb_router = APIRouter(prefix="/ppdb", tags=["Admin Master PPDB"])

ppdb_router.include_router(agama.router, prefix="/agama")
ppdb_router.include_router(tempat_tinggal.router, prefix="/tempat-tinggal")
ppdb_router.include_router(transportasi.router, prefix="/transportasi")
ppdb_router.include_router(pendidikan.router, prefix="/pendidikan")
ppdb_router.include_router(pekerjaan.router, prefix="/pekerjaan")
ppdb_router.include_router(penghasilan.router, prefix="/penghasilan")

__all__ = ["ppdb_router"]
