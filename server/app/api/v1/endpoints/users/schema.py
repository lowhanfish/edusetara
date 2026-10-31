"""Pydantic schemas for User management endpoints."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserUpdateRequest(BaseModel):
    """Payload for updating user profile."""

    full_name: str | None = Field(default=None, min_length=2, max_length=150)
    email: EmailStr | None = None
    nip: str | None = Field(default=None, max_length=30)
    instansi_id: str | None = Field(default=None, max_length=50)


class UserItemResponse(BaseModel):
    """User representation response."""

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


class UserListResponse(BaseModel):
    """Paginated user list envelope response."""

    success: bool = True
    statusCode: int = 200
    message: str = "User list retrieved."
    total: int
    data: list[UserItemResponse]
