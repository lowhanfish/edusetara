"""Authentication service layer: Business logic, database queries, token management."""

import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.v1.endpoints.auth.schema import LoginRequest, RegisterRequest, UserResponse
from app.core.config import settings
from app.core.exceptions import ConflictException, UnauthorizedException
from app.core.security import (
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)
from app.db.transaction import commit_or_raise_unique_conflict
from app.models.auth.refresh_session import RefreshSession
from app.models.auth.role import Role
from app.models.auth.user import User


def format_user_response(user: User) -> UserResponse:
    """Serialize User ORM instance into UserResponse Pydantic model."""
    role_name = user.role.name if user.role else None
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        role=role_name,
        is_active=user.is_active,
        is_verified=user.is_verified,
        nip=user.nip,
        instansi_id=user.instansi_id,
        created_at=user.created_at,
    )


async def register_user(session: AsyncSession, payload: RegisterRequest) -> User:
    """Register a new internal user account."""
    # 1. Check unique username or email
    stmt = select(User).where(
        or_(
            User.username == payload.username,
            User.email == payload.email,
        )
    )
    result = await session.execute(stmt)
    existing_user = result.scalars().first()
    if existing_user:
        if existing_user.username == payload.username:
            raise ConflictException("Username is already taken.")
        raise ConflictException("Email is already registered.")

    # 2. Assign default role ('user')
    role_stmt = select(Role).where(Role.name == "user")
    role_result = await session.execute(role_stmt)
    default_role = role_result.scalars().first()
    if not default_role:
        # Create default 'user' role if not yet initialized
        default_role = Role(
            id=str(uuid.uuid4()),
            name="user",
            description="Default internal user role",
        )
        session.add(default_role)
        await session.flush()

    # 3. Hash password and build User model
    new_user = User(
        id=str(uuid.uuid4()),
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
        is_active=True,
        is_verified=False,
        role=default_role,
        role_id=default_role.id,
        nip=payload.nip,
        instansi_id=payload.instansi_id,
    )
    session.add(new_user)

    # 4. Commit with unique conflict safety
    await commit_or_raise_unique_conflict(
        session, conflict_message="Username or email already exists."
    )

    # Query with selectinload to ensure relations are bound
    reload_stmt = select(User).options(selectinload(User.role)).where(User.id == new_user.id)
    reload_res = await session.execute(reload_stmt)
    reloaded = reload_res.scalars().first()
    return reloaded or new_user


async def authenticate_user(session: AsyncSession, payload: LoginRequest) -> User:
    """Authenticate username/email/nip and password."""
    stmt = (
        select(User)
        .options(selectinload(User.role))
        .where(
            or_(
                User.username == payload.username_or_email,
                User.email == payload.username_or_email,
                User.nip == payload.username_or_email,
            )
        )
    )
    result = await session.execute(stmt)
    user = result.scalars().first()

    if not user:
        raise UnauthorizedException("Invalid credentials.")

    if not verify_password(payload.password, user.password_hash):
        raise UnauthorizedException("Invalid credentials.")

    if not user.is_active:
        raise UnauthorizedException("Account is deactivated. Please contact the administrator.")

    return user


async def create_session(
    session: AsyncSession,
    user_id: str,
    ip_address: str | None,
    user_agent: str | None,
) -> str:
    """Create a new hashed refresh token session in database and return raw token."""
    raw_token = generate_refresh_token()
    token_hash = hash_refresh_token(raw_token)
    now_utc = datetime.now(UTC)
    expires_at = now_utc + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    new_session = RefreshSession(
        id=str(uuid.uuid4()),
        user_id=user_id,
        token_hash=token_hash,
        jti=str(uuid.uuid4()),
        ip_address=ip_address[:45] if ip_address else None,
        user_agent=user_agent[:255] if user_agent else None,
        is_revoked=False,
        expires_at=expires_at,
    )
    session.add(new_session)
    await session.commit()
    return raw_token


async def refresh_session(
    session: AsyncSession,
    raw_refresh_token: str,
    ip_address: str | None,
    user_agent: str | None,
) -> tuple[User, str]:
    """
    Validate refresh token, detect reuse/replay attacks, and rotate token.
    Returns authenticated user and new raw refresh token.
    """
    token_hash = hash_refresh_token(raw_refresh_token)

    # 1. Query existing session with row lock
    stmt = select(RefreshSession).where(RefreshSession.token_hash == token_hash).with_for_update()
    result = await session.execute(stmt)
    current_session = result.scalars().first()

    if not current_session:
        raise UnauthorizedException("Invalid refresh token session.")

    # 2. REPLAY / REUSE DETECTION
    # If a revoked token is presented, someone may have compromised it!
    # Immediately revoke ALL sessions for this user.
    if current_session.is_revoked:
        await session.execute(
            update(RefreshSession)
            .where(
                RefreshSession.user_id == current_session.user_id,
                RefreshSession.is_revoked.is_(False),
            )
            .values(is_revoked=True, revoked_at=func.now())
        )
        await session.commit()
        raise UnauthorizedException(
            "Refresh token reuse detected. All sessions have been revoked for security."
        )

    # 3. Expiry verification
    now_utc = datetime.now(UTC)
    # MySQL datetime is naive UTC; compare properly
    session_expiry = current_session.expires_at
    if session_expiry.tzinfo is None:
        session_expiry = session_expiry.replace(tzinfo=UTC)

    if session_expiry < now_utc:
        current_session.is_revoked = True
        current_session.revoked_at = func.now()
        await session.commit()
        raise UnauthorizedException("Refresh token expired. Please login again.")

    # 4. Check user status
    user_stmt = (
        select(User).options(selectinload(User.role)).where(User.id == current_session.user_id)
    )
    user_res = await session.execute(user_stmt)
    user = user_res.scalars().first()
    if not user or not user.is_active:
        raise UnauthorizedException("User account is inactive or not found.")

    # 5. Token Rotation: Revoke old session and issue new session
    current_session.is_revoked = True
    current_session.revoked_at = func.now()

    new_raw_token = generate_refresh_token()
    new_token_hash = hash_refresh_token(new_raw_token)
    new_expires_at = now_utc + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    new_session = RefreshSession(
        id=str(uuid.uuid4()),
        user_id=user.id,
        token_hash=new_token_hash,
        jti=str(uuid.uuid4()),
        ip_address=ip_address[:45] if ip_address else None,
        user_agent=user_agent[:255] if user_agent else None,
        is_revoked=False,
        expires_at=new_expires_at,
    )
    session.add(new_session)
    await session.commit()

    return user, new_raw_token


async def logout_session(session: AsyncSession, raw_refresh_token: str | None) -> None:
    """Revoke specific refresh session upon logout."""
    if not raw_refresh_token:
        return
    token_hash = hash_refresh_token(raw_refresh_token)
    await session.execute(
        update(RefreshSession)
        .where(
            RefreshSession.token_hash == token_hash,
            RefreshSession.is_revoked.is_(False),
        )
        .values(is_revoked=True, revoked_at=func.now())
    )
    await session.commit()


async def logout_all_sessions(session: AsyncSession, user_id: str) -> None:
    """Revoke all active refresh sessions for a specific user."""
    await session.execute(
        update(RefreshSession)
        .where(
            RefreshSession.user_id == user_id,
            RefreshSession.is_revoked.is_(False),
        )
        .values(is_revoked=True, revoked_at=func.now())
    )
    await session.commit()
