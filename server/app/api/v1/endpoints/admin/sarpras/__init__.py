"""Sarpras Operational routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.sarpras import (
    bangunan,
    peralatan,
    ruang,
    tanah,
)

sarpras_router = APIRouter(prefix="/sarpras", tags=["Admin Sarpras"])

sarpras_router.include_router(tanah.router, prefix="/tanah")
sarpras_router.include_router(bangunan.router, prefix="/bangunan")
sarpras_router.include_router(ruang.router, prefix="/ruang")
sarpras_router.include_router(peralatan.router, prefix="/peralatan")

__all__ = ["sarpras_router"]
