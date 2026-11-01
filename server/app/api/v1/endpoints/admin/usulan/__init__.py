"""Admin Usulan routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.usulan import assessment, pip, rekonsiliasi_bosp, tunjangan_guru

usulan_router = APIRouter(prefix="/usulan", tags=["Admin Usulan"])

usulan_router.include_router(tunjangan_guru.router, prefix="/tunjangan-guru")
usulan_router.include_router(pip.pip_router)
usulan_router.include_router(assessment.router, prefix="/assessment")
usulan_router.include_router(rekonsiliasi_bosp.router, prefix="/rekonsiliasi-bosp")

__all__ = ["usulan_router"]
