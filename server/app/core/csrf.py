"""CSRF protection helpers and token verification."""

import hmac
import secrets

from fastapi import Request

from app.core.config import settings
from app.core.exceptions import ForbiddenException

CSRF_COOKIE_NAME = "csrf_token"
CSRF_HEADER_NAME = "X-CSRF-Token"


def generate_csrf_token() -> str:
    """Generate a cryptographically secure random CSRF token."""
    return secrets.token_urlsafe(32)


def verify_csrf(request: Request) -> None:
    """
    Validate CSRF token for state-changing HTTP methods.
    Exempts safe methods: GET, HEAD, OPTIONS, TRACE.
    """
    if request.method in ("GET", "HEAD", "OPTIONS", "TRACE"):
        return

    # Check origin/referrer against allowed origins
    origin = request.headers.get("origin")
    if origin and origin not in settings.ALLOWED_ORIGINS:
        raise ForbiddenException("Invalid request origin.")

    cookie_token = request.cookies.get(CSRF_COOKIE_NAME)
    header_token = request.headers.get(CSRF_HEADER_NAME)

    if not cookie_token or not header_token:
        # For non-browser or initial development, verify if token matches
        raise ForbiddenException("Missing CSRF protection token.")

    if not hmac.compare_digest(cookie_token, header_token):
        raise ForbiddenException("CSRF token validation failed.")
