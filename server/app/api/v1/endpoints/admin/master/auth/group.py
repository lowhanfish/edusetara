"""Endpoints for Auth Groups (Roles & Permissions) management (/api/v1/admin/master/auth/group)."""

import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.api.v1.endpoints.admin.master.auth.schema import (
    AuthGroupCreate,
    AuthGroupUpdate,
    BatchUpdatePermissionsRequest,
)
from app.models.auth.user import User
from app.models.master.auth_rbac import AuthGroup, AuthGroupPermission, AuthMenu

router = APIRouter(prefix="/group", tags=["Admin Master Auth Groups"])


@router.get("/read")
async def read_groups(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: str = Query("", description="Pencarian nama group"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Get list of user role groups."""
    query = select(AuthGroup)
    count_query = select(func.count(AuthGroup.id))

    if search.strip():
        term = f"%{search.strip()}%"
        query = query.where(AuthGroup.title.ilike(term))
        count_query = count_query.where(AuthGroup.title.ilike(term))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(AuthGroup.level.asc(), AuthGroup.title.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    groups = result.scalars().all()

    # Get member count per group from users table
    member_counts_res = await db.execute(
        select(User.group_id, func.count(User.id)).group_by(User.group_id)
    )
    counts_map = {row[0]: row[1] for row in member_counts_res.all() if row[0]}

    data = [
        {
            "id": g.id,
            "title": g.title,
            "level": g.level,
            "member_count": counts_map.get(g.id, 0),
            "created_by": g.created_by,
            "created_at": g.created_at.isoformat() if g.created_at else None,
        }
        for g in groups
    ]

    return {
        "success": True,
        "statusCode": 200,
        "message": "Data role group berhasil dimuat",
        "total": total,
        "data": data,
    }


@router.get("/option")
async def get_group_options(
    search: str = Query("", description="Pencarian group"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[dict[str, Any]]:
    """Return flat options for dropdown selectors."""
    query = select(AuthGroup.id, AuthGroup.title, AuthGroup.level).order_by(AuthGroup.level.asc(), AuthGroup.title.asc())
    if search.strip():
        query = query.where(AuthGroup.title.ilike(f"%{search.strip()}%"))
    
    result = await db.execute(query)
    return [
        {
            "id": row.id,
            "value": f"{row.title} (Level {row.level} - {'Dinas/Semua' if row.level == 1 else 'Satuan Pendidikan'})",
            "title": row.title,
            "level": row.level,
        }
        for row in result.all()
    ]


@router.get("/view/{group_id}")
async def view_group(
    group_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve detailed info for a single group."""
    item = await db.get(AuthGroup, group_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role Group dengan ID '{group_id}' tidak ditemukan",
        )
    return {
        "success": True,
        "statusCode": 200,
        "message": "Data group ditemukan",
        "data": {
            "id": item.id,
            "title": item.title,
            "level": item.level,
            "created_by": item.created_by,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        },
    }


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_group(
    payload: AuthGroupCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Create a new role group."""
    # Sequential ID GRP-XXX
    count = (await db.execute(select(func.count(AuthGroup.id)))).scalar() or 0
    group_id = f"GRP-{count + 1:03d}"
    
    existing = await db.get(AuthGroup, group_id)
    if existing:
        group_id = f"GRP-{uuid.uuid4().hex[:6].upper()}"

    new_group = AuthGroup(
        id=group_id,
        title=payload.title,
        level=payload.level,
        created_by=current_user.full_name or current_user.username,
    )
    db.add(new_group)
    await db.commit()
    await db.refresh(new_group)

    return {
        "success": True,
        "statusCode": 201,
        "message": "Role group berhasil ditambahkan",
        "data": {
            "id": new_group.id,
            "title": new_group.title,
            "level": new_group.level,
        },
    }


@router.put("/update/{group_id}")
async def update_group(
    group_id: str,
    payload: AuthGroupUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Update role group name or level."""
    item = await db.get(AuthGroup, group_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role Group dengan ID '{group_id}' tidak ditemukan",
        )

    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, val)

    await db.commit()
    await db.refresh(item)

    return {
        "success": True,
        "statusCode": 200,
        "message": "Role group berhasil diperbarui",
        "data": {
            "id": item.id,
            "title": item.title,
            "level": item.level,
        },
    }


@router.delete("/delete/{group_id}")
async def delete_group(
    group_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Delete a role group."""
    item = await db.get(AuthGroup, group_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role Group dengan ID '{group_id}' tidak ditemukan",
        )

    await db.delete(item)
    await db.commit()

    return {
        "success": True,
        "statusCode": 200,
        "message": "Role group berhasil dihapus",
    }


# ----------------------------------------------------
# Permissions Matrix per Group
# ----------------------------------------------------
@router.get("/{group_id}/permissions")
async def get_group_permissions(
    group_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Get the full menu permission matrix for this group."""
    group = await db.get(AuthGroup, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group tidak ditemukan")

    # Fetch all menus
    menus_res = await db.execute(
        select(AuthMenu.id, AuthMenu.title, AuthMenu.path, AuthMenu.icon, AuthMenu.parent_id, AuthMenu.index)
        .where(AuthMenu.is_active.is_(True))
        .order_by(AuthMenu.parent_id.asc(), AuthMenu.index.asc())
    )
    menus = menus_res.all()

    # Fetch existing permissions for this group
    perms_res = await db.execute(
        select(AuthGroupPermission).where(AuthGroupPermission.group_id == group_id)
    )
    perm_map = {p.menu_id: p for p in perms_res.scalars().all()}

    matrix = []
    for m in menus:
        perm = perm_map.get(m.id)
        matrix.append({
            "menu_id": m.id,
            "menu_title": m.title,
            "menu_path": m.path,
            "menu_icon": m.icon,
            "parent_id": m.parent_id,
            "create": perm.create if perm else False,
            "read": perm.read if perm else False,
            "update": perm.update if perm else False,
            "delete": perm.delete if perm else False,
        })

    return {
        "success": True,
        "statusCode": 200,
        "message": "Permissions matrix retrieved successfully",
        "data": {
            "group_id": group.id,
            "group_title": group.title,
            "group_level": group.level,
            "permissions": matrix,
        },
    }


@router.post("/{group_id}/permissions")
async def update_group_permissions(
    group_id: str,
    payload: BatchUpdatePermissionsRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Batch update menu permissions for a group."""
    group = await db.get(AuthGroup, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group tidak ditemukan")

    # Fetch existing permissions
    existing_res = await db.execute(
        select(AuthGroupPermission).where(AuthGroupPermission.group_id == group_id)
    )
    existing_map = {p.menu_id: p for p in existing_res.scalars().all()}

    for item in payload.permissions:
        if item.menu_id in existing_map:
            perm = existing_map[item.menu_id]
            perm.create = item.create
            perm.read = item.read
            perm.update = item.update
            perm.delete = item.delete
        else:
            new_perm = AuthGroupPermission(
                id=str(uuid.uuid4()),
                group_id=group_id,
                menu_id=item.menu_id,
                create=item.create,
                read=item.read,
                update=item.update,
                delete=item.delete,
                created_by=current_user.full_name or current_user.username,
            )
            db.add(new_perm)

    await db.commit()
    return {
        "success": True,
        "statusCode": 200,
        "message": f"Hak akses untuk role group '{group.title}' berhasil disimpan",
    }
