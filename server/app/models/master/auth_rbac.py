"""Auth & RBAC master models (Menus, Groups, Permissions)."""

import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    SmallInteger,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class AuthMenu(Base):
    """Hierarchical application navigation menu."""

    __tablename__ = "auth_menus"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    parent_id = Column(
        String(50),
        ForeignKey("auth_menus.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    title = Column(String(100), nullable=False)
    icon = Column(String(60), nullable=False)
    path = Column(String(200), nullable=False)
    index = Column(Integer, nullable=False, default=1)
    is_active = Column(Boolean, nullable=False, default=True)
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Hierarchical tree relationships
    parent = relationship("AuthMenu", remote_side=[id], back_populates="children")
    children = relationship(
        "AuthMenu",
        back_populates="parent",
        cascade="all, delete-orphan",
        order_by="AuthMenu.index",
    )


class AuthGroup(Base):
    """RBAC User Groups."""

    __tablename__ = "auth_groups"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(100), unique=True, nullable=False, index=True)
    level = Column(
        SmallInteger, nullable=False
    )  # 1 = Semua Satuan Pendidikan (Dinas), 2 = Satuan Pendidikan
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    permissions = relationship(
        "AuthGroupPermission",
        back_populates="group",
        cascade="all, delete-orphan",
    )


class AuthGroupPermission(Base):
    """Matrix of permissions per Group and Menu."""

    __tablename__ = "auth_group_permissions"
    __table_args__ = (UniqueConstraint("group_id", "menu_id", name="uq_group_menu_perm"),)

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    group_id = Column(
        String(50),
        ForeignKey("auth_groups.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    menu_id = Column(
        String(50),
        ForeignKey("auth_menus.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # Using Column names matching API contract while safe in Python
    create = Column("create", Boolean, nullable=False, default=False)
    read = Column("read", Boolean, nullable=False, default=False)
    update = Column("update", Boolean, nullable=False, default=False)
    delete = Column("delete", Boolean, nullable=False, default=False)
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    group = relationship("AuthGroup", back_populates="permissions")
    menu = relationship("AuthMenu")
