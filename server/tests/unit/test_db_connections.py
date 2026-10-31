"""Unit tests for multi-database connection isolation and session lifecycle."""

import pytest

from app.core.exceptions import AppException
from app.db.base import Base, EgovBase, SimpegBase
from app.db.connections.edusetara import edusetara_engine, edusetara_session_factory
from app.db.session import get_egov_db, get_simpeg_db


def test_base_metadata_isolation() -> None:
    """Verify that Alembic's target_metadata is isolated to edusetara's Base."""
    assert Base.metadata is not SimpegBase.metadata
    assert Base.metadata is not EgovBase.metadata
    assert SimpegBase.metadata is not EgovBase.metadata


def test_primary_engine_and_session_factory_exist() -> None:
    assert edusetara_engine is not None
    assert edusetara_session_factory is not None


@pytest.mark.asyncio
async def test_unconfigured_external_db_raises_503() -> None:
    """When SIMPEG or EGOV is unconfigured, dependency raises 503 instead of crashing startup."""
    with pytest.raises(AppException) as exc_simpeg:
        async for _ in get_simpeg_db():
            pass
    assert exc_simpeg.value.status_code == 503
    assert "SIMPEG" in exc_simpeg.value.message

    with pytest.raises(AppException) as exc_egov:
        async for _ in get_egov_db():
            pass
    assert exc_egov.value.status_code == 503
    assert "EGOV" in exc_egov.value.message
