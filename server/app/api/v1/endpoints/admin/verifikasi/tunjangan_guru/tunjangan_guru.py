"""Verifikasi Tunjangan Guru endpoints (matching master pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_current_user_optional, get_db, require_roles
from app.api.v1.endpoints.admin.usulan.tunjangan_guru.schema import (
    TunjanganGuruResponse,
    TunjanganGuruResponseList,
)
from app.api.v1.endpoints.admin.usulan.tunjangan_guru.tunjangan_guru import read_tunjangan_guru
from app.db.transaction import commit_or_raise_unique_conflict
from app.models.auth.user import User
from app.models.operational.usulan import UsulanTunjanganGuru
from app.models.operational.verifikasi import VerifikasiTunjanganGuru
from app.services.crud_service import CRUDBase
from app.services.tunjangan_verification import attach_verifications, latest_verification

from .schema import (
    AdminVerificationInput,
    VerifikasiTunjanganGuruCreate,
    VerifikasiTunjanganGuruResponse,
    VerifikasiTunjanganGuruResponseList,
    VerifikasiTunjanganGuruUpdate,
)

router = APIRouter(dependencies=[Depends(require_roles("admin", "superadmin"))])
crud_verifikasi_tg = CRUDBase(VerifikasiTunjanganGuru)


@router.get("/option", response_model=list[VerifikasiTunjanganGuruResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(VerifikasiTunjanganGuru)
    if search:
        query = query.where(
            or_(
                VerifikasiTunjanganGuru.status.ilike(f"%{search}%"),
                VerifikasiTunjanganGuru.unit_kerja.ilike(f"%{search}%"),
            )
        )
    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=VerifikasiTunjanganGuruResponseList)
@router.get("/", response_model=VerifikasiTunjanganGuruResponseList)
@router.get("/read", response_model=VerifikasiTunjanganGuruResponseList)
async def read_verifikasi_tunjangan_guru(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(VerifikasiTunjanganGuru)
    if search:
        query = query.where(
            or_(
                VerifikasiTunjanganGuru.status.ilike(f"%{search}%"),
                VerifikasiTunjanganGuru.unit_kerja.ilike(f"%{search}%"),
                VerifikasiTunjanganGuru.pesan.ilike(f"%{search}%"),
            )
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(VerifikasiTunjanganGuru.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=VerifikasiTunjanganGuruResponse)
async def get_verifikasi_tunjangan_guru(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_verifikasi_tg.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post(
    "", response_model=VerifikasiTunjanganGuruResponse, status_code=status.HTTP_201_CREATED
)
@router.post(
    "/create", response_model=VerifikasiTunjanganGuruResponse, status_code=status.HTTP_201_CREATED
)
async def create_verifikasi_tunjangan_guru(
    payload: VerifikasiTunjanganGuruCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_verifikasi_tg.create(db, obj_in=create_data)


@router.put("/{id}", response_model=VerifikasiTunjanganGuruResponse)
@router.put("/update/{id}", response_model=VerifikasiTunjanganGuruResponse)
async def update_verifikasi_tunjangan_guru(
    id: str,
    payload: VerifikasiTunjanganGuruUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_verifikasi_tg.update(
        db, id=id, obj_in=payload.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_verifikasi_tunjangan_guru(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_verifikasi_tg.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}, "success": True}


@router.get("/usulan/read", response_model=TunjanganGuruResponseList)
async def read_proposals_for_verification(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    return await read_tunjangan_guru(db=db, skip=skip, limit=limit, search=search)


@router.patch("/usulan/{id}/verifikasi", response_model=TunjanganGuruResponse)
async def verify_proposal(
    id: str,
    payload: AdminVerificationInput,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    proposal = await db.scalar(
        select(UsulanTunjanganGuru).where(UsulanTunjanganGuru.id == id).with_for_update()
    )
    if proposal is None:
        raise HTTPException(status_code=404, detail="Usulan tunjangan guru tidak ditemukan")
    decision = await latest_verification(db, id)
    if decision is None:
        decision = VerifikasiTunjanganGuru(id=str(uuid.uuid4()), usulan_id=id)
        db.add(decision)
    decision.status = payload.status
    decision.pesan = payload.pesan
    decision.created_by = current_user.username
    decision.unit_kerja = proposal.unit_kerja
    decision.nip = proposal.nip
    await commit_or_raise_unique_conflict(db)
    await attach_verifications(db, [proposal])
    return proposal
