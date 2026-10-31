"""Auth router aggregator for /api/v1/admin/master/auth/*."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.master.auth.group import router as group_router
from app.api.v1.endpoints.admin.master.auth.menu import router as menu_router
from app.api.v1.endpoints.admin.master.auth.registrasi import router as registrasi_router

auth_router = APIRouter(prefix="/auth")

# Register sub-routers
auth_router.include_router(menu_router)
auth_router.include_router(group_router)
auth_router.include_router(registrasi_router)

__all__ = ["auth_router"]
