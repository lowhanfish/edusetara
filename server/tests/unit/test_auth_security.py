"""Unit tests for authentication security utilities and rate limiter."""

import pytest

from app.core.exceptions import RateLimitException
from app.core.rate_limit import InMemoryRateLimiter
from app.core.security import (
    create_access_token,
    decode_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)


def test_argon2id_password_hashing() -> None:
    """Test Argon2id password hashing and verification."""
    password = "SuperSecretPassword123!"
    hashed = hash_password(password)

    assert hashed != password
    assert hashed.startswith("$argon2id$")
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False


def test_jwt_access_token_lifecycle() -> None:
    """Test JWT creation with mandatory claims and decoding."""
    subject = "user-uuid-12345"
    claims = {"role": "admin", "username": "admin_konawe"}

    token = create_access_token(subject=subject, claims=claims)
    assert isinstance(token, str)

    payload = decode_access_token(token)
    assert payload["sub"] == subject
    assert payload["role"] == "admin"
    assert payload["username"] == "admin_konawe"
    assert payload["token_type"] == "access"
    assert "jti" in payload
    assert "exp" in payload
    assert "iss" in payload
    assert "aud" in payload


def test_refresh_token_generation_and_hashing() -> None:
    """Test opaque random refresh token generation and SHA-256 hash."""
    raw_token = generate_refresh_token()
    assert isinstance(raw_token, str)
    assert len(raw_token) >= 40

    hashed_1 = hash_refresh_token(raw_token)
    hashed_2 = hash_refresh_token(raw_token)

    assert len(hashed_1) == 64
    assert hashed_1 == hashed_2
    assert hashed_1 != raw_token


def test_in_memory_rate_limiter() -> None:
    """Test rate limiter prevents excessive calls per client."""
    limiter = InMemoryRateLimiter(requests_per_minute=3)

    class MockRequest:
        class Client:
            host = "192.168.1.100"

        client = Client()

    req = MockRequest()  # type: ignore

    # First 3 requests should pass
    limiter.check(req)
    limiter.check(req)
    limiter.check(req)

    # 4th request must raise RateLimitException (429)
    with pytest.raises(RateLimitException, match="Too many requests"):
        limiter.check(req)
