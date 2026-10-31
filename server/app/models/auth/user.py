"""User model for authentication in edusetara primary database."""

import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class User(Base):
    """User account model."""

    __tablename__ = "users"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )
    email = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )
    password_hash = Column(
        String(255),
        nullable=False,
    )
    full_name = Column(
        String(150),
        nullable=False,
    )
    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )
    is_verified = Column(
        Boolean,
        default=False,
        nullable=False,
    )
    role_id = Column(
        String(50),
        ForeignKey("roles.id", ondelete="RESTRICT"),
        nullable=True,
        index=True,
    )
    nip = Column(
        String(30),
        nullable=True,
        index=True,
    )
    instansi_id = Column(
        String(50),
        nullable=True,
        index=True,
    )
    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    role = relationship("Role", back_populates="users", lazy="selectin")
    refresh_sessions = relationship(
        "RefreshSession",
        back_populates="user",
        cascade="all, delete-orphan",
    )
