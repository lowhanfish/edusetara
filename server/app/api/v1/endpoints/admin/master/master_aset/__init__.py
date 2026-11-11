"""Master Aset routers aggregator: /api/v1/admin/master/master_aset/<slug>."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.master.master_aset.factory import build_router
from app.api.v1.endpoints.admin.master.master_aset.specs import SPECS

master_aset_router = APIRouter(prefix="/master_aset", tags=["Admin Master Aset"])

for slug, spec in SPECS.items():
    master_aset_router.include_router(build_router(spec), prefix=f"/{slug}")

__all__ = ["master_aset_router"]
