"""Pydantic schemas for authentication requests and responses."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    """Payload for user registration."""

    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_-]+$")
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str = Field(..., min_length=2, max_length=150)
    nip: str | None = Field(default=None, max_length=30)
    instansi_id: str | None = Field(default=None, max_length=50)


class LoginRequest(BaseModel):
    """Payload for user login."""

    username_or_email: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=1, max_length=128)


class RoleSummary(BaseModel):
    """Summary of role information."""

    id: str
    name: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    """User profile response."""

    id: str
    username: str
    email: str
    full_name: str
    is_active: bool
    is_verified: bool
    role: str | None = None
    nip: str | None = None
    instansi_id: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuthData(BaseModel):
    """Returned in authenticated endpoints (Tokens are ONLY inside HttpOnly cookies)."""

    user: UserResponse
    csrf_token: str | None = None


class AuthResponse(BaseModel):
    """Standard envelope response for authentication actions."""

    success: bool = True
    statusCode: int = 200
    message: str
    data: AuthData


class MessageResponse(BaseModel):
    """Standard message response for logout and revocations."""

    success: bool = True
    statusCode: int = 200
    message: str
