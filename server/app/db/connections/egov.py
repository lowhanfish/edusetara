"""External EGOV database engine and sessionmaker (Read Only, Optional)."""

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker

from app.core.config import settings
from app.db.engine import build_async_engine

egov_engine: AsyncEngine | None = None
egov_session_factory: async_sessionmaker[AsyncSession] | None = None

if settings.is_egov_configured():
    egov_url = settings.get_egov_database_url()
    if egov_url is not None:
        egov_engine = build_async_engine(
            url=egov_url,
            pool_size=settings.EXTERNAL_DB_POOL_SIZE,
            max_overflow=settings.EXTERNAL_DB_MAX_OVERFLOW,
            pool_timeout=settings.EXTERNAL_DB_POOL_TIMEOUT,
            pool_recycle=settings.EXTERNAL_DB_POOL_RECYCLE,
            echo=settings.DB_ECHO,
        )
        egov_session_factory = async_sessionmaker(
            bind=egov_engine,
            class_=AsyncSession,
            autoflush=False,
            expire_on_commit=False,
        )
