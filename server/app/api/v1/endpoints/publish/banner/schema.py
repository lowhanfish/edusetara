"""Pydantic schemas for Public Banner Slide."""

from pydantic import BaseModel
from app.global_schemas.operational.base_schema import (
    OperationalBase,
    OperationalResponse,
)


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
