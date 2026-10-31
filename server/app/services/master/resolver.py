"""Resolver and helper utilities for Master Data resolution (ID vs Uraian)."""

from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import UnprocessableEntityException


async def resolve_master_id[ModelT: Any](
    session: AsyncSession,
    model: type[ModelT],
    value: str | None,
    allow_null: bool = False,
) -> str | None:
    """
    Menerima ID master atau Uraian master, dan mengembalikan ID primary key yang valid.
    Jika value cocok dengan ID atau Uraian, ID valid akan dikembalikan.
    Jika tidak ditemukan dan allow_null=False, melempar UnprocessableEntityException (HTTP 422).
    """
    if not value or not str(value).strip():
        if allow_null:
            return None
        table_name = getattr(model, "__tablename__", str(model))
        raise UnprocessableEntityException(f"Nilai referensi master wajib diisi untuk {table_name}")

    clean_val = str(value).strip()
    stmt = select(model.id).where((model.id == clean_val) | (model.uraian == clean_val))
    result = await session.scalar(stmt)

    if not result:
        table_name = getattr(model, "__tablename__", str(model))
        raise UnprocessableEntityException(
            f"Referensi master '{value}' tidak ditemukan pada {table_name}"
        )

    return str(result)
