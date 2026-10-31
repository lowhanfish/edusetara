"""Centralized FastAPI dependencies for database sessions and authentication."""

from collections.abc import Callable

from fastapi import Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_access_token
from app.db.session import get_db, get_egov_db, get_simpeg_db
from app.models.auth.user import User

__all__ = [
    "get_db",
    "get_simpeg_db",
    "get_egov_db",
    "get_current_user",
    "require_roles",
]


async def get_current_user(
    request: Request,
    session: AsyncSession = Depends(get_db),
) -> User:
    """
    Extract and validate JWT access token from HttpOnly cookie (or Bearer fallback),
    retrieve User from edusetara database, and verify active status.
    """
    token = request.cookies.get("access_token")
    if not token:
        # Check authorization header fallback for API clients / tests
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]

    if not token:
        raise UnauthorizedException("Authentication required. Please login.")

    try:
        payload = decode_access_token(token)
    except Exception as exc:
        raise UnauthorizedException("Invalid or expired authentication session.") from exc

    if payload.get("token_type") != "access":
        raise UnauthorizedException("Invalid token type provided.")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token subject.")

    stmt = select(User).options(selectinload(User.role)).where(User.id == user_id)
    result = await session.execute(stmt)
    user = result.scalars().first()

    if not user:
        raise UnauthorizedException("User account not found.")

    if not user.is_active:
        raise UnauthorizedException("User account is deactivated.")

    return user


def require_roles(*allowed_roles: str) -> Callable:
    """
    Dependency factory to enforce role-based access control (RBAC).
    Returns 403 Forbidden if user does not possess one of the allowed roles.
    """

    async def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        user_role = current_user.role.name if current_user.role else None
        if not user_role or user_role not in allowed_roles:
            raise ForbiddenException(f"Access denied. Requires one of roles: {list(allowed_roles)}")
        return current_user

    return role_checker
