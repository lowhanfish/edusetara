"""Reusable AsyncEngine factory for MySQL multi-database connections."""

from sqlalchemy.engine import URL
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine


def build_async_engine(
    url: URL,
    pool_size: int = 10,
    max_overflow: int = 20,
    pool_timeout: int = 30,
    pool_recycle: int = 1800,
    echo: bool = False,
) -> AsyncEngine:
    """
    Build a tuned SQLAlchemy AsyncEngine for MySQL via asyncmy.

    Args:
        url: SQLAlchemy URL with mysql+asyncmy driver.
        pool_size: Base connection pool capacity.
        max_overflow: Overflow connections permitted beyond pool_size.
        pool_timeout: Seconds to wait before giving up on borrowing a connection.
        pool_recycle: Seconds after which connections are recycled to prevent MySQL server drops.
        echo: If True, log SQL statements.
    """
    return create_async_engine(
        url,
        pool_size=pool_size,
        max_overflow=max_overflow,
        pool_timeout=pool_timeout,
        pool_recycle=pool_recycle,
        echo=echo,
        future=True,
    )
