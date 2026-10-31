"""Main API v1 router combining all feature sub-routers."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin import admin_router
from app.api.v1.endpoints.auth.route import router as auth_router
from app.api.v1.endpoints.master_data.router import router as master_data_router
from app.api.v1.endpoints.users.route import router as users_router

api_v1_router = APIRouter(prefix="/api/v1")


@api_v1_router.get("/health", tags=["Health"])
async def health_check() -> dict:
    """System health check endpoint."""
    return {
        "success": True,
        "statusCode": 200,
        "message": "EduSetara API v1 is healthy.",
        "data": {
            "status": "online",
            "version": "0.1.0",
        },
    }


# Register sub-routers
api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(master_data_router)
api_v1_router.include_router(admin_router)
