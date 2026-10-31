"""Integration tests for Master Wilayah endpoints."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_kecamatan_list(client: AsyncClient) -> None:
    """Test GET /api/v1/admin/master/wilayah/kecamatan returns official subdistricts."""
    res = await client.get("/api/v1/admin/master/wilayah/kecamatan")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 2

    first = data[0]
    assert "id" in first
    assert "nama" in first
    assert "label" in first

    names = [item["nama"] for item in data]
    assert "ANDOOLO" in names
    assert "RANOMEETO" in names


@pytest.mark.asyncio
async def test_get_desa_kelurahan_filtered(client: AsyncClient) -> None:
    """Test GET /api/v1/admin/master/wilayah/desa-kelurahan with kecamatan_id."""
    # 7405020 is Andoolo
    res = await client.get("/api/v1/admin/master/wilayah/desa-kelurahan?kecamatan_id=7405020")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0

    for item in data:
        assert item["kecamatan_id"] == 7405020
        assert "id" in item
        assert "nama" in item
        assert "label" in item
