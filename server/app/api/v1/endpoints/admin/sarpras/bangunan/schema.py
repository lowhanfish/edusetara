"""Pydantic schemas for Sarpras Bangunan (matching master pattern)."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class BangunanBase(OperationalBase):
    nama: str
    luas: str | None = None
    kepemilikan_id: str | None = None
    tahun: str | None = None
    persentase: int | None = 0
    kondisi_id: str | None = None
    jns_bantuan_id: str | None = None
    sumber_id: str | None = None


class BangunanCreate(BangunanBase):
    id: str | None = None


class BangunanUpdate(BaseModel):
    nama: str | None = None
    luas: str | None = None
    kepemilikan_id: str | None = None
    tahun: str | None = None
    persentase: int | None = None
    kondisi_id: str | None = None
    jns_bantuan_id: str | None = None
    sumber_id: str | None = None


class BangunanResponse(OperationalResponse):
    nama: str
    luas: str | None = None
    kepemilikan_id: str | None = None
    tahun: str | None = None
    persentase: int | None = 0
    kondisi_id: str | None = None
    jns_bantuan_id: str | None = None
    sumber_id: str | None = None


class BangunanResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[BangunanResponse]
