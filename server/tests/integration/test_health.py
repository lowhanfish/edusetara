"""Integration tests for basic application health and routing."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient) -> None:
    response = await client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["statusCode"] == 200
    assert "EduSetara" in body["message"]


@pytest.mark.asyncio
async def test_api_v1_health_endpoint(client: AsyncClient) -> None:
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["statusCode"] == 200
    assert body["data"]["status"] == "online"
    assert body["data"]["version"] == "0.1.0"


@pytest.mark.asyncio
async def test_master_data_status_endpoint(client: AsyncClient) -> None:
    response = await client.get("/api/v1/master-data/status")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["status"] == "ready"


@pytest.mark.asyncio
async def test_404_envelope_response(client: AsyncClient) -> None:
    response = await client.get("/api/v1/non-existent-endpoint")
    assert response.status_code == 404
    body = response.json()
    assert body["success"] is False
    assert body["statusCode"] == 404
