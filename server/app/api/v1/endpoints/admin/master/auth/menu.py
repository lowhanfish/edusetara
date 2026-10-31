"""Endpoints for Auth Menus management (/api/v1/admin/master/auth/menu)."""

import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_db
from app.api.v1.endpoints.admin.master.auth.schema import (
    AuthMenuCreate,
    AuthMenuItem,
    AuthMenuTreeNode,
    AuthMenuUpdate,
)
from app.models.auth.user import User
from app.models.master.auth_rbac import AuthMenu

router = APIRouter(prefix="/menu", tags=["Admin Master Auth Menus"])


@router.get("/tree")
async def get_menu_tree(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve all active navigation menus as a hierarchical tree."""
    stmt = (
        select(AuthMenu)
        .where(AuthMenu.is_active.is_(True))
        .order_by(AuthMenu.index.asc())
    )
    result = await db.execute(stmt)
    all_menus = result.scalars().all()

    node_map: dict[str, dict[str, Any]] = {}
    for m in all_menus:
        node_map[m.id] = {
            "id": m.id,
            "title": m.title,
            "icon": m.icon,
            "path": m.path,
            "index": m.index,
            "parent_id": m.parent_id,
            "is_active": m.is_active,
            "created_by": m.created_by,
            "created_at": m.created_at.isoformat() if m.created_at else None,
            "children": [],
        }

    tree: list[dict[str, Any]] = []
    for m in all_menus:
        node = node_map[m.id]
        if m.parent_id and m.parent_id in node_map:
            node_map[m.parent_id]["children"].append(node)
        elif not m.parent_id:
            tree.append(node)

    return {
        "success": True,
        "statusCode": 200,
        "message": "Menu tree retrieved successfully",
        "data": tree,
    }


@router.get("/read")
async def read_menus(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    search: str = Query("", description="Pencarian judul atau path"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Get paginated list of menus with search filter."""
    query = select(AuthMenu)
    count_query = select(func.count(AuthMenu.id))

    if search.strip():
        term = f"%{search.strip()}%"
        filter_clause = (AuthMenu.title.ilike(term)) | (AuthMenu.path.ilike(term))
        query = query.where(filter_clause)
        count_query = count_query.where(filter_clause)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(AuthMenu.parent_id.asc(), AuthMenu.index.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    data = [
        {
            "id": item.id,
            "title": item.title,
            "icon": item.icon,
            "path": item.path,
            "index": item.index,
            "parent_id": item.parent_id,
            "is_active": item.is_active,
            "created_by": item.created_by,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        }
        for item in items
    ]

    return {
        "success": True,
        "statusCode": 200,
        "message": "Data menu berhasil dimuat",
        "total": total,
        "data": data,
    }


@router.get("/option")
async def get_menu_options(
    search: str = Query("", description="Pencarian judul menu"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[dict[str, Any]]:
    """Return flat list of menus for parent selector dropdowns."""
    query = select(AuthMenu.id, AuthMenu.title, AuthMenu.path).order_by(AuthMenu.title.asc())
    if search.strip():
        query = query.where(AuthMenu.title.ilike(f"%{search.strip()}%"))
    
    result = await db.execute(query)
    return [
        {"id": row.id, "value": f"{row.title} ({row.path})" if row.path else row.title}
        for row in result.all()
    ]


@router.get("/view/{menu_id}")
async def view_menu(
    menu_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve detailed info for a single menu."""
    item = await db.get(AuthMenu, menu_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu dengan ID '{menu_id}' tidak ditemukan",
        )
    return {
        "success": True,
        "statusCode": 200,
        "message": "Data menu ditemukan",
        "data": {
            "id": item.id,
            "title": item.title,
            "icon": item.icon,
            "path": item.path,
            "index": item.index,
            "parent_id": item.parent_id,
            "is_active": item.is_active,
            "created_by": item.created_by,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        },
    }


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_menu(
    payload: AuthMenuCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Create a new menu or sub-menu."""
    # Generate sequential or UUID-based ID
    count = (await db.execute(select(func.count(AuthMenu.id)))).scalar() or 0
    menu_id = f"MNU-{count + 1:03d}"
    
    # Check if exists
    existing = await db.get(AuthMenu, menu_id)
    if existing:
        menu_id = f"MNU-{uuid.uuid4().hex[:6].upper()}"

    new_menu = AuthMenu(
        id=menu_id,
        title=payload.title,
        icon=payload.icon,
        path=payload.path,
        index=payload.index,
        parent_id=payload.parent_id if payload.parent_id else None,
        is_active=payload.is_active,
        created_by=current_user.full_name or current_user.username,
    )
    db.add(new_menu)
    await db.commit()
    await db.refresh(new_menu)

    return {
        "success": True,
        "statusCode": 201,
        "message": "Menu berhasil ditambahkan",
        "data": {
            "id": new_menu.id,
            "title": new_menu.title,
            "path": new_menu.path,
        },
    }


@router.put("/update/{menu_id}")
async def update_menu(
    menu_id: str,
    payload: AuthMenuUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Update existing menu attributes."""
    item = await db.get(AuthMenu, menu_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu dengan ID '{menu_id}' tidak ditemukan",
        )

    for field, val in payload.model_dump(exclude_unset=True).items():
        if field == "parent_id" and val == "":
            val = None
        setattr(item, field, val)

    await db.commit()
    await db.refresh(item)

    return {
        "success": True,
        "statusCode": 200,
        "message": "Menu berhasil diperbarui",
        "data": {
            "id": item.id,
            "title": item.title,
            "path": item.path,
        },
    }


@router.delete("/delete/{menu_id}")
async def delete_menu(
    menu_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Delete a menu and all its cascade children."""
    item = await db.get(AuthMenu, menu_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu dengan ID '{menu_id}' tidak ditemukan",
        )

    await db.delete(item)
    await db.commit()

    return {
        "success": True,
        "statusCode": 200,
        "message": "Menu berhasil dihapus",
    }
