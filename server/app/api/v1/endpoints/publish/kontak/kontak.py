"""Public Pesan Kontak endpoints."""

import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.operational.berita import PesanKontak
from app.services.crud_service import CRUDBase

from .schema import (
    PesanKontakPublicCreate,
    PesanKontakResponse,
)

router = APIRouter()
crud_kontak = CRUDBase(PesanKontak)


@router.post("", response_model=PesanKontakResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=PesanKontakResponse, status_code=status.HTTP_201_CREATED)
@router.post("/create", response_model=PesanKontakResponse, status_code=status.HTTP_201_CREATED)
async def submit_public_kontak(
    payload: PesanKontakPublicCreate,
    db: AsyncSession = Depends(get_db),
):
    create_data = payload.model_dump(exclude_unset=True)
    if not create_data.get("id"):
        create_data["id"] = str(uuid.uuid4())
    create_data["created_by"] = "Masyarakat Publik"
    create_data["status"] = "Baru"
    return await crud_kontak.create(db, obj_in=create_data)
