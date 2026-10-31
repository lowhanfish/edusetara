"""Pelengkap Master routers aggregator (e-office pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.master.pelengkap import (
    bk_jenis_layanan,
    bk_kegiatan_layanan,
    kategori,
    model_pembelajaran,
    pendampingan,
    tugas,
)

pelengkap_router = APIRouter(tags=["Admin Master Pelengkap"])

pelengkap_router.include_router(bk_jenis_layanan.router, prefix="/bk-jenis-layanan")
pelengkap_router.include_router(bk_kegiatan_layanan.router, prefix="/bk-kegiatan-layanan")
pelengkap_router.include_router(model_pembelajaran.router, prefix="/model-pembelajaran")
pelengkap_router.include_router(pendampingan.router, prefix="/pendampingan")
pelengkap_router.include_router(tugas.router, prefix="/tugas")
pelengkap_router.include_router(kategori.router, prefix="/kategori")

__all__ = ["pelengkap_router"]
