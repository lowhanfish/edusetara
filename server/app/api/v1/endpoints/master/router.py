"""Backward compatibility proxy for master router."""

from app.api.v1.endpoints.admin.master.router import router

__all__ = ["router"]
