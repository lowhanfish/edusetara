"""Pydantic schemas for Banner Slide."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


class BannerSlideBase(OperationalBase):
    title: str
    subtitle: str | None = None
    badge_text: str | None = None
    primary_button_label: str | None = None
    primary_button_link: str | None = None
    image: str | None = None
    order_num: str | None = "1"
    status: str | None = "Aktif"


class BannerSlideCreate(BannerSlideBase):
    id: str | None = None


class BannerSlideUpdate(BaseModel):
    nip: str | None = None
    unit_kerja: str | None = None
    title: str | None = None
    subtitle: str | None = None
    badge_text: str | None = None
    primary_button_label: str | None = None
    primary_button_link: str | None = None
    image: str | None = None
    order_num: str | None = None
    status: str | None = None


class BannerSlideResponse(OperationalResponse):
    title: str
    subtitle: str | None = None
    badge_text: str | None = None
    primary_button_label: str | None = None
    primary_button_link: str | None = None
    image: str | None = None
    order_num: str | None = None
    status: str | None = None


class BannerSlideResponseList(BaseModel):
    total: int
    skip: int = 0
    limit: int = 100
    data: list[BannerSlideResponse]
