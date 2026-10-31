"""Database session dependencies for FastAPI."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.db.connections.edusetara import edusetara_session_factory
from app.db.connections.egov import egov_session_factory
from app.db.connections.simpeg import simpeg_session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency yielding an AsyncSession for the primary edusetara database.
    """
    async with edusetara_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_simpeg_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency yielding a read-only AsyncSession for the external SIMPEG database.
    Raises 503 Service Unavailable if unconfigured in the current environment.
    """
    if simpeg_session_factory is None:
        raise AppException(
            status_code=503,
            message="External SIMPEG database connection is not configured.",
        )

    async with simpeg_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_egov_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency yielding a read-only AsyncSession for the external EGOV database.
    Raises 503 Service Unavailable if unconfigured in the current environment.
    """
    if egov_session_factory is None:
        raise AppException(
            status_code=503,
            message="External EGOV database connection is not configured.",
        )

    async with egov_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
