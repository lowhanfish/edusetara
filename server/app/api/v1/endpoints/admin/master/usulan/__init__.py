"""Usulan Master routers aggregator (e-office pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.master.usulan import (
    jenis_penerima,
    kelas_penerima,
    triwulan,
)

usulan_router = APIRouter(prefix="/usulan", tags=["Admin Master Usulan"])

usulan_router.include_router(triwulan.router, prefix="/triwulan")
usulan_router.include_router(jenis_penerima.router, prefix="/jenis-penerima")
usulan_router.include_router(kelas_penerima.router, prefix="/kelas-penerima")

__all__ = ["usulan_router"]
