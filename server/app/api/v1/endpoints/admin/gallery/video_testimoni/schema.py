"""Pydantic schemas for Gallery Video Testimoni."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class VideoTestimoniBase(OperationalBase):
    judul: str
    file: str | None = None
    link: str | None = None


class VideoTestimoniCreate(VideoTestimoniBase):
    id: str | None = None


class VideoTestimoniUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    judul: str | None = None
    file: str | None = None
    link: str | None = None


class VideoTestimoniResponse(OperationalResponse):
    judul: str
    file: str | None = None
    link: str | None = None


class VideoTestimoniResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[VideoTestimoniResponse]
