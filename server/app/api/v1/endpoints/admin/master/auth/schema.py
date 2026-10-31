"""Schemas for Master Auth (Menus, Groups, ASN Registration)."""

from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


# ----------------------------------------------------
# 1. Auth Menu Schemas
# ----------------------------------------------------
class AuthMenuBase(BaseModel):
    title: str = Field(..., max_length=100, description="Nama menu atau sub-menu")
    icon: str = Field(default="Folder", max_length=60, description="Icon menu lucide-react")
    path: str = Field(default="", max_length=200, description="Route URL path")
    index: int = Field(default=1, description="Urutan index tampilan")
    parent_id: str | None = Field(default=None, description="ID menu induk jika sub-menu")
    is_active: bool = Field(default=True, description="Status aktif menu")


class AuthMenuCreate(AuthMenuBase):
    pass


class AuthMenuUpdate(BaseModel):
    title: str | None = None
    icon: str | None = None
    path: str | None = None
    index: int | None = None
    parent_id: str | None = None
    is_active: bool | None = None


class AuthMenuItem(AuthMenuBase):
    id: str
    created_by: str | None = None
    created_at: datetime | str | None = None

    class Config:
        from_attributes = True


class AuthMenuTreeNode(AuthMenuItem):
    children: list["AuthMenuTreeNode"] = []


# ----------------------------------------------------
# 2. Auth Group & Permissions Schemas
# ----------------------------------------------------
class AuthGroupBase(BaseModel):
    title: str = Field(..., max_length=100, description="Nama role group")
    level: int = Field(..., ge=1, le=2, description="Level akses: 1 = Semua Satuan Pendidikan (Dinas), 2 = Satuan Pendidikan")


class AuthGroupCreate(AuthGroupBase):
    pass


class AuthGroupUpdate(BaseModel):
    title: str | None = None
    level: int | None = None


class AuthGroupItem(AuthGroupBase):
    id: str
    member_count: int = 0
    created_by: str | None = None
    created_at: datetime | str | None = None

    class Config:
        from_attributes = True


class GroupPermissionRule(BaseModel):
    menu_id: str
    create: bool = False
    read: bool = False
    update: bool = False
    delete: bool = False


class GroupPermissionItem(GroupPermissionRule):
    id: str | None = None
    group_id: str
    menu_title: str | None = None
    menu_path: str | None = None
    menu_icon: str | None = None


class BatchUpdatePermissionsRequest(BaseModel):
    permissions: list[GroupPermissionRule]


# ----------------------------------------------------
# 3. Auth Registrasi ASN Schemas
# ----------------------------------------------------
class AsnRegistrationItem(BaseModel):
    id: str
    nip: str | None = None
    nama_lengkap: str
    email: str | None = None
    satuan_pendidikan: str | None = None
    jabatan: str | None = None
    group_id: str | None = None
    group_title: str | None = None
    group_level: int | None = None
    created_at: datetime | str | None = None

    class Config:
        from_attributes = True


class AsnUpdateGroupRequest(BaseModel):
    group_id: str | None = Field(None, description="Role Group ID yang dipilih")
