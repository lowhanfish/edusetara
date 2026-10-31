"""Sarpras Master routers aggregator (e-office pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.master.sarpras import (
    bangunan,
    jenis_bantuan,
    kepemilikan,
    kondisi_alat,
    sumber_dana,
)

sarpras_router = APIRouter(prefix="/sarpras", tags=["Admin Master Sarpras"])

sarpras_router.include_router(bangunan.router, prefix="/bangunan")
sarpras_router.include_router(kepemilikan.router, prefix="/kepemilikan")
sarpras_router.include_router(sumber_dana.router, prefix="/sumber-dana")
sarpras_router.include_router(kondisi_alat.router, prefix="/kondisi-alat")
sarpras_router.include_router(jenis_bantuan.router, prefix="/jenis-bantuan")

__all__ = ["sarpras_router"]
