"""Endpoints for ASN Registration & Role Assignment (/api/v1/admin/master/auth/registrasi)."""

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_db
from app.api.v1.endpoints.admin.master.auth.schema import AsnUpdateGroupRequest
from app.models.auth.user import User
from app.models.master.auth_rbac import AuthGroup

router = APIRouter(prefix="/registrasi", tags=["Admin Master Auth Registrasi ASN"])


@router.get("/read")
async def read_asn_registrations(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query("", description="Pencarian nama, NIP, atau satuan pendidikan"),
    group_id: str = Query("", description="Filter ID role group ('unassigned' untuk belum punya role)"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """List all registered ASN users with their role group assignments."""
    query = (
        select(User)
        .options(selectinload(User.group))
        .where(User.nip.is_not(None))  # Only ASN users with NIP
    )
    count_query = select(func.count(User.id)).where(User.nip.is_not(None))

    if search.strip():
        term = f"%{search.strip()}%"
        filter_clause = or_(
            User.full_name.ilike(term),
            User.nip.ilike(term),
            User.instansi_id.ilike(term),
            User.jabatan.ilike(term),
        )
        query = query.where(filter_clause)
        count_query = count_query.where(filter_clause)

    if group_id.strip():
        if group_id.strip() == "unassigned":
            query = query.where(User.group_id.is_(None))
            count_query = count_query.where(User.group_id.is_(None))
        elif group_id.strip() != "all":
            query = query.where(User.group_id == group_id.strip())
            count_query = count_query.where(User.group_id == group_id.strip())

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(User.full_name.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()

    data = [
        {
            "id": u.id,
            "nip": u.nip,
            "nama_lengkap": u.full_name,
            "email": u.email,
            "satuan_pendidikan": u.instansi_id or "-",
            "jabatan": u.jabatan or "-",
            "group_id": u.group_id,
            "group_title": u.group.title if u.group else None,
            "group_level": u.group.level if u.group else None,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]

    return {
        "success": True,
        "statusCode": 200,
        "message": "Data registrasi ASN berhasil dimuat",
        "total": total,
        "data": data,
    }


@router.get("/option")
async def get_asn_options(
    search: str = Query("", description="Pencarian nama atau NIP ASN"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[dict[str, Any]]:
    """Return flat options for ASN selectors."""
    query = (
        select(User.id, User.nip, User.full_name, User.instansi_id)
        .where(User.nip.is_not(None))
        .order_by(User.full_name.asc())
    )
    if search.strip():
        term = f"%{search.strip()}%"
        query = query.where(or_(User.full_name.ilike(term), User.nip.ilike(term)))

    result = await db.execute(query)
    return [
        {
            "id": row.id,
            "value": f"{row.full_name} ({row.nip}) - {row.instansi_id or 'Dinas'}",
            "nip": row.nip,
            "full_name": row.full_name,
        }
        for row in result.all()
    ]


@router.get("/view/{user_id}")
async def view_asn(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve detailed info for an ASN user."""
    stmt = select(User).options(selectinload(User.group)).where(User.id == user_id)
    result = await db.execute(stmt)
    u = result.scalar_one_or_none()
    if not u:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ASN dengan ID '{user_id}' tidak ditemukan",
        )

    return {
        "success": True,
        "statusCode": 200,
        "message": "Data ASN ditemukan",
        "data": {
            "id": u.id,
            "nip": u.nip,
            "nama_lengkap": u.full_name,
            "email": u.email,
            "satuan_pendidikan": u.instansi_id,
            "jabatan": u.jabatan,
            "group_id": u.group_id,
            "group_title": u.group.title if u.group else None,
            "group_level": u.group.level if u.group else None,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        },
    }


@router.put("/update/{user_id}")
async def update_asn_group(
    user_id: str,
    payload: AsnUpdateGroupRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Assign or change the role group for an ASN user."""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ASN dengan ID '{user_id}' tidak ditemukan",
        )

    if payload.group_id:
        group = await db.get(AuthGroup, payload.group_id)
        if not group:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Role Group ID '{payload.group_id}' tidak valid",
            )
        user.group_id = group.id
    else:
        user.group_id = None

    await db.commit()
    await db.refresh(user)

    return {
        "success": True,
        "statusCode": 200,
        "message": f"Hak akses role untuk '{user.full_name}' berhasil diperbarui",
        "data": {
            "id": user.id,
            "full_name": user.full_name,
            "group_id": user.group_id,
        },
    }
