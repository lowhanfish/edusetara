"""Profile routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.profile import (
    renstra,
    tugas_fungsi,
    visi_misi,
)

profile_router = APIRouter(prefix="/profile", tags=["Admin Profile"])

profile_router.include_router(renstra.router, prefix="/renstra")
profile_router.include_router(tugas_fungsi.router, prefix="/tugas-fungsi")
profile_router.include_router(visi_misi.router, prefix="/visi-misi")

__all__ = ["profile_router"]
