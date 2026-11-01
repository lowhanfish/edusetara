"""Admin Rombel routers aggregator (matching master pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.rombel import paud, sd, smp

rombel_router = APIRouter(prefix="/rombel", tags=["Admin Rombel"])

rombel_router.include_router(paud.router, prefix="/paud")
rombel_router.include_router(sd.router, prefix="/sd")
rombel_router.include_router(smp.router, prefix="/smp")

__all__ = ["rombel_router"]
