"""Master data seeding endpoint."""

from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.db.seed_master import seed_all_master_data
from app.models.auth.user import User

router = APIRouter(tags=["Admin Master Seed"])


@router.post("/seed")
async def run_master_seed(
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Seed default master reference data from API_CONTRACT_ADMIN.md."""
    counts = await seed_all_master_data(session)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Master data seed completed successfully",
        "data": counts,
    }
