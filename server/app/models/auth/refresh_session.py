"""Refresh session model for secure token rotation and reuse detection."""

import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class RefreshSession(Base):
    """Stores hashed refresh token sessions for revocation and rotation."""

    __tablename__ = "refresh_sessions"

    id = Column(
        String(50),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    user_id = Column(
        String(50),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token_hash = Column(
        String(64),
        unique=True,
        index=True,
        nullable=False,
    )  # SHA-256 hash of opaque token
    jti = Column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )
    ip_address = Column(
        String(45),
        nullable=True,
    )
    user_agent = Column(
        String(255),
        nullable=True,
    )
    is_revoked = Column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
    )
    expires_at = Column(
        DateTime,
        nullable=False,
        index=True,
    )
    revoked_at = Column(
        DateTime,
        nullable=True,
    )
    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="refresh_sessions", lazy="selectin")
