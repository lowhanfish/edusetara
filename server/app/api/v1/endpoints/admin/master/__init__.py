"""Master data admin endpoints (e-office pattern)."""

from fastapi import APIRouter

from app.api.v1.endpoints.admin.master.auth import auth_router
from app.api.v1.endpoints.admin.master.jenjang import router as jenjang_router
from app.api.v1.endpoints.admin.master.jurnal import jurnal_router
from app.api.v1.endpoints.admin.master.lookup import router as lookup_router
from app.api.v1.endpoints.admin.master.pelengkap import pelengkap_router
from app.api.v1.endpoints.admin.master.ppdb import ppdb_router
from app.api.v1.endpoints.admin.master.sarpras import sarpras_router
from app.api.v1.endpoints.admin.master.sekolah import router as sekolah_router
from app.api.v1.endpoints.admin.master.seed import router as seed_router
from app.api.v1.endpoints.admin.master.siswa import siswa_router
from app.api.v1.endpoints.admin.master.usulan import usulan_router

master_router = APIRouter(prefix="/master")

# 1. Lookup aggregator & Seeder
master_router.include_router(lookup_router)
master_router.include_router(seed_router)

# 2. Master Auth (/auth/menu, /auth/group, /auth/registrasi)
master_router.include_router(auth_router)

# 3. Master Siswa
master_router.include_router(siswa_router, prefix="/siswa")

# 4. Master Jenjang
master_router.include_router(jenjang_router, prefix="/jenjang")

# 5. Master Sarpras (/sarpras/*)
master_router.include_router(sarpras_router)

# 6. Master PPDB (/ppdb/*)
master_router.include_router(ppdb_router)

# 7. Master Usulan (/usulan/*)
master_router.include_router(usulan_router)

# 8. Master Jurnal (/jurnal/*)
master_router.include_router(jurnal_router)

# 9. Master Pelengkap (/bk-jenis-layanan, /model-pembelajaran, etc.)
master_router.include_router(pelengkap_router)

# 10. Master Sekolah (/sekolah)
master_router.include_router(sekolah_router, prefix="/sekolah")

# Alias for backward compatibility
router = master_router

__all__ = ["master_router", "router"]
