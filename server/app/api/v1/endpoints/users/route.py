"""User management route endpoints."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db, require_roles
from app.api.v1.endpoints.users.schema import (
    UserItemResponse,
    UserListResponse,
    UserUpdateRequest,
)
from app.api.v1.endpoints.users.service import (
    format_user_item,
    list_users,
    update_user_profile,
)
from app.models.auth.user import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserItemResponse,
    summary="Get current user profile",
)
async def get_my_user_profile(
    current_user: User = Depends(get_current_user),
) -> UserItemResponse:
    """Return current logged in user information."""
    return format_user_item(current_user)


@router.patch(
    "/me",
    response_model=UserItemResponse,
    summary="Update current user profile",
)
async def update_my_user_profile(
    payload: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> UserItemResponse:
    """Update profile fields for the authenticated user."""
    return await update_user_profile(session, current_user.id, payload)


@router.get(
    "",
    response_model=UserListResponse,
    summary="List all users (Admin/Superadmin only)",
)
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    _: User = Depends(require_roles("superadmin", "admin")),
    session: AsyncSession = Depends(get_db),
) -> UserListResponse:
    """Paginated list of users restricted to administrators."""
    total, items = await list_users(session, skip=skip, limit=limit)
    return UserListResponse(
        success=True,
        statusCode=status.HTTP_200_OK,
        total=total,
        data=items,
    )
