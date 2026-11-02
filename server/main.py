"""FastAPI Entry Point for EduSetara Backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.lifespan import lifespan


def create_application() -> FastAPI:
    """Instantiate and configure the FastAPI application."""
    application = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0",
        description=(
            "FastAPI Backend for Sistem Informasi Dinas Pendidikan & Kebudayaan "
            "Kabupaten Konawe Selatan (EduSetara)"
        ),
        lifespan=lifespan,
        docs_url="/docs" if settings.APP_DEBUG else None,
        redoc_url="/redoc" if settings.APP_DEBUG else None,
    )

    # 1. CORS Configuration
    # Important: Do NOT use wildcard '*' when allow_credentials=True
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 2. Centralized Exception Handlers
    register_exception_handlers(application)

    # 3. Register Feature Routers
    application.include_router(api_v1_router)

    # 4. Static Files Mount for Uploaded Media
    from fastapi.staticfiles import StaticFiles
    from pathlib import Path

    uploads_dir = Path(__file__).resolve().parent / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)
    application.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

    # 5. Root Welcome Route
    @application.get("/", tags=["Root"])
    async def root_index() -> dict:
        return {
            "success": True,
            "statusCode": 200,
            "message": f"Welcome to {settings.APP_NAME} Backend API",
            "data": {
                "environment": settings.APP_ENV,
                "docs": "/docs" if settings.APP_DEBUG else "disabled",
            },
        }

    return application


app = create_application()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.APP_DEBUG,
    )
