"""Unit tests for Master Data resolver and lookup services."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import UnprocessableEntityException
from app.models.master import MasterSarprasBangunan, MasterUsulanTriwulan
from app.services.master.lookup_service import get_batch_lookups
from app.services.master.resolver import resolve_master_id


@pytest.mark.asyncio
async def test_resolve_master_id_by_exact_id(db_session: AsyncSession) -> None:
    """Test resolving master reference when exact ID is supplied."""
    item = MasterUsulanTriwulan(id="TW-01", uraian="Triwulan I (Januari - Maret)")
    db_session.add(item)
    await db_session.commit()

    resolved_id = await resolve_master_id(db_session, MasterUsulanTriwulan, "TW-01")
    assert resolved_id == "TW-01"


@pytest.mark.asyncio
async def test_resolve_master_id_by_uraian(db_session: AsyncSession) -> None:
    """Test resolving master reference when label text (uraian) is supplied."""
    item = MasterSarprasBangunan(id="KBG-01", uraian="Baik")
    db_session.add(item)
    await db_session.commit()

    # Frontend may pass "Baik" instead of "KBG-01"
    resolved_id = await resolve_master_id(db_session, MasterSarprasBangunan, "Baik")
    assert resolved_id == "KBG-01"


@pytest.mark.asyncio
async def test_resolve_master_id_not_found_raises_422(db_session: AsyncSession) -> None:
    """Test that resolving a non-existent value raises HTTP 422 Unprocessable Entity."""
    with pytest.raises(UnprocessableEntityException) as exc_info:
        await resolve_master_id(db_session, MasterSarprasBangunan, "KondisiTidakValid")

    assert exc_info.value.status_code == 422
    assert "tidak ditemukan" in str(exc_info.value.message)


@pytest.mark.asyncio
async def test_resolve_master_id_allow_null(db_session: AsyncSession) -> None:
    """Test allow_null returns None without raising an exception."""
    resolved = await resolve_master_id(db_session, MasterSarprasBangunan, None, allow_null=True)
    assert resolved is None

    resolved_empty = await resolve_master_id(db_session, MasterSarprasBangunan, "", allow_null=True)
    assert resolved_empty is None


@pytest.mark.asyncio
async def test_get_batch_lookups_service(db_session: AsyncSession) -> None:
    """Test batch lookups for specific keys."""
    b1 = MasterSarprasBangunan(id="KBG-01", uraian="Baik")
    b2 = MasterSarprasBangunan(id="KBG-02", uraian="Rusak")
    t1 = MasterUsulanTriwulan(id="TW-01", uraian="Triwulan I")
    db_session.add_all([b1, b2, t1])
    await db_session.commit()

    lookups = await get_batch_lookups(db_session, ["bangunan", "triwulan"])
    assert "bangunan" in lookups
    assert "triwulan" in lookups
    assert len(lookups["bangunan"]) == 2
    assert len(lookups["triwulan"]) == 1
    assert lookups["bangunan"][0]["id"] == "KBG-01"
