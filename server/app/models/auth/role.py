"""Role model for RBAC authorization in edusetara primary database."""

import uuid

from sqlalchemy import Column, DateTime, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Role(Base):
    """System role model."""

    __tablename__ = "roles"

    id = Column(
        String(50),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    name = Column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )
    description = Column(
        String(255),
        nullable=True,
    )
    permissions = Column(
        Text,
        nullable=True,
    )  # JSON or comma-separated permission strings
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
    users = relationship("User", back_populates="role", lazy="selectin")
