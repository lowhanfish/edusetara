"""Integration tests for authentication, cookie sessions, rotation, and authorization."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_and_login_flow(client: AsyncClient) -> None:
    """Test user registration, login, cookie issuance, and /me access."""
    # 1. Register new user
    register_payload = {
        "username": "pegawai_konawe",
        "email": "pegawai@konawe.go.id",
        "password": "SecurePassword123!",
        "full_name": "Pegawai Dinas Pendidikan",
        "nip": "198501012010011001",
    }
    reg_res = await client.post("/api/v1/auth/register", json=register_payload)
    assert reg_res.status_code == 201
    reg_json = reg_res.json()
    assert reg_json["success"] is True
    assert reg_json["data"]["user"]["username"] == "pegawai_konawe"
    assert reg_json["data"]["user"]["role"] == "user"

    # Verify cookies are present and NO token in JSON body
    assert "access_token" in reg_res.cookies
    assert "refresh_token" in reg_res.cookies
    assert "csrf_token" in reg_res.cookies
    assert "access_token" not in reg_json["data"]
    assert "refresh_token" not in reg_json["data"]

    # 2. Access /auth/me with cookies from registration
    me_res = await client.get("/api/v1/auth/me")
    assert me_res.status_code == 200
    me_json = me_res.json()
    assert me_json["data"]["user"]["email"] == "pegawai@konawe.go.id"

    # 3. Login with credentials
    login_payload = {
        "username_or_email": "pegawai_konawe",
        "password": "SecurePassword123!",
    }
    login_res = await client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    login_json = login_res.json()
    assert login_json["success"] is True
    assert "access_token" in login_res.cookies
    assert "refresh_token" in login_res.cookies


@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient) -> None:
    """Test login rejection with invalid credentials."""
    login_payload = {
        "username_or_email": "pegawai_konawe",
        "password": "WrongPassword999!",
    }
    login_res = await client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 401
    data = login_res.json()
    assert data["success"] is False


@pytest.mark.asyncio
async def test_refresh_token_rotation_and_replay_detection(client: AsyncClient) -> None:
    """Test refresh token rotation and replay detection security."""
    # 1. Register a dedicated test user
    payload = {
        "username": "rotation_user",
        "email": "rotation@konawe.go.id",
        "password": "Password123!",
        "full_name": "Rotation Tester",
    }
    reg_res = await client.post("/api/v1/auth/register", json=payload)
    assert reg_res.status_code == 201

    first_refresh_cookie = reg_res.cookies.get("refresh_token")
    assert first_refresh_cookie is not None

    # 2. Rotate token via /refresh
    refresh_res = await client.post("/api/v1/auth/refresh")
    assert refresh_res.status_code == 200
    second_refresh_cookie = refresh_res.cookies.get("refresh_token")
    assert second_refresh_cookie is not None
    assert second_refresh_cookie != first_refresh_cookie

    # 3. REPLAY ATTACK SIMULATION
    # Attempt to reuse the first (now revoked) refresh token
    # Create client that explicitly passes the old revoked token
    client.cookies.set("refresh_token", first_refresh_cookie)
    replay_res = await client.post("/api/v1/auth/refresh")

    # Should detect reuse and return 401 Unauthorized
    assert replay_res.status_code == 401
    replay_json = replay_res.json()
    assert "reuse detected" in replay_json["message"].lower()

    # 4. Verify that second token was also revoked because replay compromised the user's session
    client.cookies.set("refresh_token", second_refresh_cookie)
    subsequent_res = await client.post("/api/v1/auth/refresh")
    assert subsequent_res.status_code == 401


@pytest.mark.asyncio
async def test_logout_flow(client: AsyncClient) -> None:
    """Test logout clears session cookies."""
    # Register/login
    payload = {
        "username": "logout_user",
        "email": "logout@konawe.go.id",
        "password": "Password123!",
        "full_name": "Logout Tester",
    }
    await client.post("/api/v1/auth/register", json=payload)

    # Logout
    logout_res = await client.post("/api/v1/auth/logout")
    assert logout_res.status_code == 200
    logout_json = logout_res.json()
    assert logout_json["success"] is True

    # Accessing /auth/me after logout without cookies should return 401
    client.cookies.clear()
    me_res = await client.get("/api/v1/auth/me")
    assert me_res.status_code == 401


@pytest.mark.asyncio
async def test_role_authorization_forbidden(client: AsyncClient) -> None:
    """Test normal user cannot access admin-only endpoint /api/v1/users (returns 403)."""
    # Register regular user (role='user')
    payload = {
        "username": "regular_user",
        "email": "regular@konawe.go.id",
        "password": "Password123!",
        "full_name": "Regular User",
    }
    await client.post("/api/v1/auth/register", json=payload)

    # Try to access admin users list
    users_res = await client.get("/api/v1/users")
    assert users_res.status_code == 403
    users_json = users_res.json()
    assert users_json["success"] is False
    assert "Access denied" in users_json["message"]
