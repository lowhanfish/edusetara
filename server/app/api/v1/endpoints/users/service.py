"""User management service logic."""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.v1.endpoints.users.schema import UserItemResponse, UserUpdateRequest
from app.core.exceptions import ConflictException, NotFoundException
from app.db.transaction import commit_or_raise_unique_conflict
from app.models.auth.user import User


def format_user_item(user: User) -> UserItemResponse:
    """Format User model into UserItemResponse."""
    return UserItemResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        role=user.role.name if user.role else None,
        is_active=user.is_active,
        is_verified=user.is_verified,
        nip=user.nip,
        instansi_id=user.instansi_id,
        created_at=user.created_at,
    )


async def list_users(
    session: AsyncSession,
    skip: int = 0,
    limit: int = 50,
) -> tuple[int, list[UserItemResponse]]:
    """List users with pagination."""
    count_stmt = select(func.count(User.id))
    total_res = await session.execute(count_stmt)
    total = total_res.scalar_one()

    stmt = (
        select(User)
        .options(selectinload(User.role))
        .order_by(User.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await session.execute(stmt)
    users = result.scalars().all()

    return total, [format_user_item(u) for u in users]


async def update_user_profile(
    session: AsyncSession,
    user_id: str,
    payload: UserUpdateRequest,
) -> UserItemResponse:
    """Update user profile fields with unique conflict protection."""
    user = await session.get(User, user_id, options=[selectinload(User.role)])
    if not user:
        raise NotFoundException("User not found.")

    update_data = payload.model_dump(exclude_unset=True)
    if "email" in update_data and update_data["email"] != user.email:
        # Check email uniqueness
        existing = await session.execute(
            select(User).where(User.email == update_data["email"], User.id != user_id)
        )
        if existing.scalars().first():
            raise ConflictException("Email is already in use by another account.")

    for field, value in update_data.items():
        setattr(user, field, value)

    await commit_or_raise_unique_conflict(
        session, conflict_message="Duplicate unique constraint violation."
    )

    reloaded = await session.get(User, user_id, options=[selectinload(User.role)])
    return format_user_item(reloaded or user)
