"""Master Jenjang endpoints (e-office pattern)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.auth.user import User
from app.models.master.jenjang import MasterJenjang
from app.services.crud_service import CRUDBase

from .schema import JenjangCreate, JenjangResponse, JenjangResponseList, JenjangUpdate

router = APIRouter(tags=["Admin Master Jenjang"])
crud_jenjang = CRUDBase(MasterJenjang)


@router.get("/option", response_model=list[JenjangResponse])
async def option(
    db: AsyncSession = Depends(get_db),
    search: str | None = None,
):
    query = select(MasterJenjang)
    if search:
        query = query.where(MasterJenjang.uraian.ilike(f"%{search}%"))

    query = query.limit(50)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("", response_model=JenjangResponseList)
@router.get("/", response_model=JenjangResponseList)
@router.get("/read", response_model=JenjangResponseList)
async def read_jenjang(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
):
    query = select(MasterJenjang)
    if search:
        query = query.where(
            (MasterJenjang.uraian.ilike(f"%{search}%"))
            | (MasterJenjang.keterangan.ilike(f"%{search}%"))
        )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar_one_or_none() or 0

    query = query.order_by(MasterJenjang.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    data = list(result.scalars().all())

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data,
    }


@router.get("/{id}", response_model=JenjangResponse)
async def get_jenjang(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    item = await crud_jenjang.get(db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return item


@router.post("", response_model=JenjangResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=JenjangResponse, status_code=status.HTTP_201_CREATED)
async def create_jenjang(
    payload: JenjangCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = getattr(current_user, "username", "admin")
    return await crud_jenjang.create(db, obj_in=create_data)


@router.put("/{id}", response_model=JenjangResponse)
@router.put("/update/{id}", response_model=JenjangResponse)
async def update_jenjang(
    id: str,
    payload: JenjangUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud_jenjang.update(db, id=id, obj_in=payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return updated


@router.delete("/{id}")
@router.delete("/delete/{id}")
async def delete_jenjang(
    id: str,
    db: AsyncSession = Depends(get_db),
):
    success = await crud_jenjang.remove(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Gagal menghapus data")
    return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}}
