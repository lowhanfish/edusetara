"""FastAPI lifespan context manager for startup and shutdown hooks."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import logger, setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context."""
    # 1. Startup phase
    setup_logging()
    logger.info(f"Starting {settings.APP_NAME} in [{settings.APP_ENV}] environment...")

    # Validate security settings
    settings.validate_security()

    # Log active database status
    logger.info(
        f"Primary database configured: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
    )
    if settings.is_simpeg_configured():
        logger.info(f"External SIMPEG database configured: {settings.SIMPEG_DB_NAME}")
    else:
        logger.info("External SIMPEG database: disabled / unconfigured (optional)")

    if settings.is_egov_configured():
        logger.info(f"External EGOV database configured: {settings.EGOV_DB_NAME}")
    else:
        logger.info("External EGOV database: disabled / unconfigured (optional)")

    yield

    # 2. Shutdown phase
    logger.info("Shutting down application and disposing database engines...")
    from app.db.connections.edusetara import edusetara_engine
    from app.db.connections.egov import egov_engine
    from app.db.connections.simpeg import simpeg_engine

    if edusetara_engine is not None:
        await edusetara_engine.dispose()
        logger.info("Primary edusetara engine disposed.")

    if simpeg_engine is not None:
        await simpeg_engine.dispose()
        logger.info("SIMPEG engine disposed.")

    if egov_engine is not None:
        await egov_engine.dispose()
        logger.info("EGOV engine disposed.")

    logger.info("Cleanup completed. Goodbye!")
