"""Authentication routes using HttpOnly Cookies and Argon2id/JWT."""

from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.api.v1.endpoints.auth.schema import (
    AuthData,
    AuthResponse,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
)
from app.api.v1.endpoints.auth.service import (
    authenticate_user,
    create_session,
    format_user_response,
    logout_all_sessions,
    logout_session,
    refresh_session,
    register_user,
)
from app.core.cookies import clear_auth_cookies, set_auth_cookies
from app.core.csrf import generate_csrf_token
from app.core.exceptions import UnauthorizedException
from app.core.rate_limit import auth_rate_limiter
from app.core.security import create_access_token
from app.models.auth.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new internal user account",
)
async def register(
    request: Request,
    response: Response,
    payload: RegisterRequest,
    session: AsyncSession = Depends(get_db),
) -> AuthResponse:
    """Register internal user, hash password with Argon2id, and set HttpOnly auth cookies."""
    auth_rate_limiter.check(request)

    user = await register_user(session, payload)
    user_response = format_user_response(user)

    # Generate tokens & session
    access_token = create_access_token(
        subject=user.id,
        claims={"role": user_response.role, "username": user.username},
    )
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    raw_refresh_token = await create_session(session, user.id, client_ip, user_agent)
    csrf_token = generate_csrf_token()

    set_auth_cookies(
        response=response,
        access_token=access_token,
        refresh_token=raw_refresh_token,
        csrf_token=csrf_token,
    )

    return AuthResponse(
        success=True,
        statusCode=status.HTTP_201_CREATED,
        message="Registration successful.",
        data=AuthData(user=user_response, csrf_token=csrf_token),
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Authenticate username/email and set HttpOnly auth cookies",
)
async def login(
    request: Request,
    response: Response,
    payload: LoginRequest,
    session: AsyncSession = Depends(get_db),
) -> AuthResponse:
    """Validate credentials, create session, and issue HttpOnly access & refresh cookies."""
    auth_rate_limiter.check(request)

    user = await authenticate_user(session, payload)
    user_response = format_user_response(user)

    access_token = create_access_token(
        subject=user.id,
        claims={"role": user_response.role, "username": user.username},
    )
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    raw_refresh_token = await create_session(session, user.id, client_ip, user_agent)
    csrf_token = generate_csrf_token()

    set_auth_cookies(
        response=response,
        access_token=access_token,
        refresh_token=raw_refresh_token,
        csrf_token=csrf_token,
    )

    return AuthResponse(
        success=True,
        statusCode=status.HTTP_200_OK,
        message="Login successful.",
        data=AuthData(user=user_response, csrf_token=csrf_token),
    )


@router.post(
    "/refresh",
    response_model=AuthResponse,
    summary="Rotate refresh token and issue new access token via HttpOnly cookies",
)
async def refresh_tokens(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_db),
) -> AuthResponse:
    """Rotate refresh token session with replay detection."""
    auth_rate_limiter.check(request)

    raw_refresh_token = request.cookies.get("refresh_token")
    if not raw_refresh_token:
        # Fallback to header if passed in non-browser environment
        raw_refresh_token = request.headers.get("X-Refresh-Token")

    if not raw_refresh_token:
        raise UnauthorizedException("Refresh token is required.")

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    user, new_refresh_token = await refresh_session(
        session,
        raw_refresh_token=raw_refresh_token,
        ip_address=client_ip,
        user_agent=user_agent,
    )
    user_response = format_user_response(user)

    access_token = create_access_token(
        subject=user.id,
        claims={"role": user_response.role, "username": user.username},
    )
    csrf_token = generate_csrf_token()

    set_auth_cookies(
        response=response,
        access_token=access_token,
        refresh_token=new_refresh_token,
        csrf_token=csrf_token,
    )

    return AuthResponse(
        success=True,
        statusCode=status.HTTP_200_OK,
        message="Token refreshed successfully.",
        data=AuthData(user=user_response, csrf_token=csrf_token),
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout current session and clear HttpOnly cookies",
)
async def logout(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Revoke active refresh token session and delete client authentication cookies."""
    raw_refresh_token = request.cookies.get("refresh_token") or request.headers.get(
        "X-Refresh-Token"
    )
    await logout_session(session, raw_refresh_token)
    clear_auth_cookies(response)

    return MessageResponse(
        success=True,
        statusCode=status.HTTP_200_OK,
        message="Logged out successfully.",
    )


@router.post(
    "/logout-all",
    response_model=MessageResponse,
    summary="Revoke all sessions across all devices for the current user",
)
async def logout_all(
    response: Response,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Revoke all refresh sessions for the authenticated user and clear cookies."""
    await logout_all_sessions(session, current_user.id)
    clear_auth_cookies(response)

    return MessageResponse(
        success=True,
        statusCode=status.HTTP_200_OK,
        message="All sessions across devices have been logged out.",
    )


@router.get(
    "/me",
    response_model=AuthResponse,
    summary="Get authenticated user profile",
)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> AuthResponse:
    """Return the profile of the currently logged-in user from the validated access token."""
    return AuthResponse(
        success=True,
        statusCode=status.HTTP_200_OK,
        message="Current user profile retrieved.",
        data=AuthData(user=format_user_response(current_user)),
    )
