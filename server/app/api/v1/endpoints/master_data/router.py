"""Master Data API routes."""

from fastapi import APIRouter

router = APIRouter(prefix="/master-data", tags=["Master Data"])


@router.get("/status")
async def get_master_data_status() -> dict:
    """Check master data service status."""
    return {
        "success": True,
        "statusCode": 200,
        "message": "Master data infrastructure initialized.",
        "data": {"status": "ready"},
    }
