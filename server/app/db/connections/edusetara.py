"""Primary edusetara database engine and sessionmaker."""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.config import settings
from app.db.engine import build_async_engine

# Primary database engine
edusetara_engine = build_async_engine(
    url=settings.get_primary_database_url(),
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_recycle=settings.DB_POOL_RECYCLE,
    echo=settings.DB_ECHO,
)

# AsyncSession factory
edusetara_session_factory = async_sessionmaker(
    bind=edusetara_engine,
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False,
)
