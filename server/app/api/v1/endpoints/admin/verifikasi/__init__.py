"""Admin Verifikasi routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.verifikasi import rekonsiliasi_bosp, tunjangan_guru

verifikasi_router = APIRouter(prefix="/verifikasi", tags=["Admin Verifikasi"])

verifikasi_router.include_router(tunjangan_guru.router, prefix="/tunjangan-guru")
verifikasi_router.include_router(rekonsiliasi_bosp.router, prefix="/rekonsiliasi-bosp")

__all__ = ["verifikasi_router"]
