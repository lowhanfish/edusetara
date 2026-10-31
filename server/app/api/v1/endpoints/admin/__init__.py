"""Admin endpoints aggregator for /api/v1/admin/*."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.master import master_router

admin_router = APIRouter(prefix="/admin")

# Register admin sub-routers
admin_router.include_router(master_router)

__all__ = ["admin_router", "master_router"]
