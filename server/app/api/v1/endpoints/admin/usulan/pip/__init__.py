"""Admin Usulan PIP sub-routers aggregator."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.usulan.pip import data_pendukung, data_penerima

pip_router = APIRouter(prefix="/pip", tags=["Admin Usulan PIP"])

pip_router.include_router(data_pendukung.router, prefix="/data-pendukung")
pip_router.include_router(data_penerima.router, prefix="/data-penerima")

__all__ = ["pip_router"]
