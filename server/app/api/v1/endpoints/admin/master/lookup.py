"""Batch dropdown lookup endpoint for Admin frontend."""

from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.global_schemas.master.schemas import MasterLookupResponse
from app.services.master.lookup_service import get_batch_lookups

router = APIRouter(tags=["Admin Master Lookup"])


@router.get("/lookup", response_model=MasterLookupResponse)
async def get_master_lookup(
    keys: str | None = Query(
        None,
        description="Comma-separated master keys (e.g. 'kepemilikan,bangunan,sumber_dana')",
    ),
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Combined batch lookup endpoint for frontend dropdowns.
    Returns options list { key: [ { id, uraian }, ... ] }.
    """
    key_list = [k.strip() for k in keys.split(",")] if keys else None
    data = await get_batch_lookups(session, key_list)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Master lookup retrieved successfully",
        "data": data,
    }
