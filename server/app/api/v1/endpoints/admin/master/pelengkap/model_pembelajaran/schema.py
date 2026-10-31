"""Pydantic schemas for Master Model Pembelajaran (e-office pattern)."""

from pydantic import BaseModel

from app.global_schemas.master.base_schema import (
    MasterCreate,
    MasterResponse,
    MasterUpdate,
)


class ModelPembelajaranCreate(MasterCreate):
    pass


class ModelPembelajaranResponse(MasterResponse):
    pass


class ModelPembelajaranUpdate(MasterUpdate):
    pass


class ModelPembelajaranResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[ModelPembelajaranResponse]
