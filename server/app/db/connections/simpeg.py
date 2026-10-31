"""External SIMPEG database engine and sessionmaker (Read Only, Optional)."""

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker

from app.core.config import settings
from app.db.engine import build_async_engine

simpeg_engine: AsyncEngine | None = None
simpeg_session_factory: async_sessionmaker[AsyncSession] | None = None

if settings.is_simpeg_configured():
    simpeg_url = settings.get_simpeg_database_url()
    if simpeg_url is not None:
        simpeg_engine = build_async_engine(
            url=simpeg_url,
            pool_size=settings.EXTERNAL_DB_POOL_SIZE,
            max_overflow=settings.EXTERNAL_DB_MAX_OVERFLOW,
            pool_timeout=settings.EXTERNAL_DB_POOL_TIMEOUT,
            pool_recycle=settings.EXTERNAL_DB_POOL_RECYCLE,
            echo=settings.DB_ECHO,
        )
        simpeg_session_factory = async_sessionmaker(
            bind=simpeg_engine,
            class_=AsyncSession,
            autoflush=False,
            expire_on_commit=False,
        )
