"""HttpOnly cookie management for access and refresh tokens."""

from typing import Literal

from fastapi import Response

from app.core.config import settings


def set_auth_cookies(
    response: Response,
    access_token: str,
    refresh_token: str,
    csrf_token: str | None = None,
) -> None:
    """Attach secure HttpOnly cookies for access and refresh tokens, and CSRF token."""
    same_site: Literal["lax", "strict", "none"] = settings.COOKIE_SAMESITE.lower()  # type: ignore

    # Access Token Cookie (HttpOnly)
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=same_site,
        domain=settings.COOKIE_DOMAIN or None,
        path=settings.COOKIE_ACCESS_PATH,
    )

    # Refresh Token Cookie (HttpOnly)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=same_site,
        domain=settings.COOKIE_DOMAIN or None,
        path=settings.COOKIE_REFRESH_PATH,
    )

    # CSRF Token Cookie (Readable by JS frontend for Double-Submit Header)
    if csrf_token:
        response.set_cookie(
            key="csrf_token",
            value=csrf_token,
            max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
            httponly=False,
            secure=settings.COOKIE_SECURE,
            samesite=same_site,
            domain=settings.COOKIE_DOMAIN or None,
            path="/",
        )


def clear_auth_cookies(response: Response) -> None:
    """Delete authentication cookies across designated paths and domain."""
    response.delete_cookie(
        key="access_token",
        path=settings.COOKIE_ACCESS_PATH,
        domain=settings.COOKIE_DOMAIN or None,
    )
    response.delete_cookie(
        key="refresh_token",
        path=settings.COOKIE_REFRESH_PATH,
        domain=settings.COOKIE_DOMAIN or None,
    )
    response.delete_cookie(
        key="csrf_token",
        path="/",
        domain=settings.COOKIE_DOMAIN or None,
    )
