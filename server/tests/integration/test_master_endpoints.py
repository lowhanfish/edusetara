"""Integration tests for Master Data endpoints (batch lookup & CRUD)."""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.seed_master import seed_all_master_data


@pytest.mark.asyncio
async def test_get_master_lookup_endpoint(client: AsyncClient, db_session: AsyncSession) -> None:
    """Test GET /api/v1/admin/master/lookup with specified keys."""
    await seed_all_master_data(db_session)

    res = await client.get("/api/v1/admin/master/lookup?keys=bangunan,kepemilikan,sumber_dana")
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    assert body["statusCode"] == 200

    data = body["data"]
    assert "bangunan" in data
    assert "kepemilikan" in data
    assert "sumber_dana" in data
    assert len(data["bangunan"]) == 4
    assert len(data["kepemilikan"]) == 4
    assert len(data["sumber_dana"]) == 6

    # Verify option format matches contract { id, uraian }
    first_bangunan = data["bangunan"][0]
    assert "id" in first_bangunan
    assert "uraian" in first_bangunan


@pytest.mark.asyncio
async def test_get_master_lookup_all_keys(client: AsyncClient, db_session: AsyncSession) -> None:
    """Test GET /api/v1/admin/master/lookup without query params returns all keys."""
    await seed_all_master_data(db_session)

    res = await client.get("/api/v1/admin/master/lookup")
    assert res.status_code == 200
    body = res.json()
    data = body["data"]
    assert "triwulan" in data
    assert "agama" in data
    assert "jenjang" in data
    assert len(data["triwulan"]) == 4


@pytest.mark.asyncio
async def test_master_resource_crud_lifecycle(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    """Test full CRUD lifecycle on master resource."""
    # 1. Register an admin user for authentication
    reg_payload = {
        "username": "admin_master",
        "email": "admin.master@konawe.go.id",
        "password": "Password123!",
        "full_name": "Admin Master",
    }
    reg_res = await client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201

    # 2. CREATE master item
    create_payload = {
        "id": "KBG-99",
        "uraian": "Kondisi Eksperimental",
    }
    create_res = await client.post(
        "/api/v1/admin/master/resource/sarpras/bangunan", json=create_payload
    )
    assert create_res.status_code == 201
    created_data = create_res.json()["data"]
    assert created_data["id"] == "KBG-99"

    # 3. LIST master items
    list_res = await client.get("/api/v1/admin/master/resource/sarpras/bangunan")
    assert list_res.status_code == 200
    items = list_res.json()["data"]
    assert any(i["id"] == "KBG-99" and i["uraian"] == "Kondisi Eksperimental" for i in items)

    # 4. UPDATE master item
    update_payload = {"uraian": "Kondisi Eksperimental Direvisi"}
    update_res = await client.put(
        "/api/v1/admin/master/resource/sarpras/bangunan/KBG-99", json=update_payload
    )
    assert update_res.status_code == 200
    assert update_res.json()["data"]["uraian"] == "Kondisi Eksperimental Direvisi"

    # 5. DELETE master item
    del_res = await client.delete("/api/v1/admin/master/resource/sarpras/bangunan/KBG-99")
    assert del_res.status_code == 200
    assert del_res.json()["data"]["id"] == "KBG-99"

    # Verify deletion
    list_after_res = await client.get("/api/v1/admin/master/resource/sarpras/bangunan")
    assert not any(i["id"] == "KBG-99" for i in list_after_res.json()["data"])
