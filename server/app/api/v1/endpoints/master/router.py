"""Backward compatibility proxy for master router."""

from app.api.v1.endpoints.admin.master import master_router as router

__all__ = ["router"]
