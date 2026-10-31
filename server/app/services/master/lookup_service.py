"""Lookup service for batch dropdown options in EduSetara Admin."""

from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.master import (
    AuthGroup,
    AuthMenu,
    MasterBkJenisLayanan,
    MasterBkKegiatanLayanan,
    MasterJenjang,
    MasterJurnalBahanAjar,
    MasterJurnalKelas,
    MasterJurnalMataPelajaran,
    MasterJurnalMateriAjar,
    MasterKategori,
    MasterModelPembelajaran,
    MasterPendampingan,
    MasterPpdbAgama,
    MasterPpdbPekerjaan,
    MasterPpdbPendidikan,
    MasterPpdbPenghasilan,
    MasterPpdbTempatTinggal,
    MasterPpdbTransportasi,
    MasterSarprasBangunan,
    MasterSarprasJenisBantuan,
    MasterSarprasKepemilikan,
    MasterSarprasKondisiAlat,
    MasterSarprasSumberDana,
    MasterTugas,
    MasterUsulanJenisPenerima,
    MasterUsulanKelasPenerima,
    MasterUsulanTriwulan,
)

# Registry mapping from lookup query key to ORM model
MASTER_LOOKUP_REGISTRY: dict[str, Any] = {
    # Sarpras
    "kepemilikan": MasterSarprasKepemilikan,
    "bangunan": MasterSarprasBangunan,
    "kondisi_bangunan": MasterSarprasBangunan,
    "sumber_dana": MasterSarprasSumberDana,
    "kondisi_alat": MasterSarprasKondisiAlat,
    "jenis_bantuan": MasterSarprasJenisBantuan,
    # Usulan
    "triwulan": MasterUsulanTriwulan,
    "jenis_penerima": MasterUsulanJenisPenerima,
    "kelas_penerima": MasterUsulanKelasPenerima,
    # Jurnal
    "bahan_ajar": MasterJurnalBahanAjar,
    "materi_ajar": MasterJurnalMateriAjar,
    "kelas": MasterJurnalKelas,
    "mata_pelajaran": MasterJurnalMataPelajaran,
    "mapel": MasterJurnalMataPelajaran,
    # Jenjang
    "jenjang": MasterJenjang,
    # PPDB
    "agama": MasterPpdbAgama,
    "tempat_tinggal": MasterPpdbTempatTinggal,
    "transportasi": MasterPpdbTransportasi,
    "pendidikan": MasterPpdbPendidikan,
    "pekerjaan": MasterPpdbPekerjaan,
    "penghasilan": MasterPpdbPenghasilan,
    # Pelengkap
    "bk_jenis_layanan": MasterBkJenisLayanan,
    "bk_kegiatan_layanan": MasterBkKegiatanLayanan,
    "model_pembelajaran": MasterModelPembelajaran,
    "pendampingan": MasterPendampingan,
    "tugas": MasterTugas,
    "kategori": MasterKategori,
    # Auth
    "groups": AuthGroup,
    "menus": AuthMenu,
}


async def fetch_lookup_for_model(
    session: AsyncSession,
    model: Any,
) -> list[dict[str, Any]]:
    """Fetch options list for a specific Master model."""
    if model is MasterJurnalMataPelajaran:
        stmt = select(model.id, model.uraian, model.kelas_id).order_by(model.uraian.asc())
        result = await session.execute(stmt)
        return [
            {"id": row.id, "uraian": row.uraian, "kelas_id": row.kelas_id} for row in result.all()
        ]

    if model is AuthGroup:
        stmt = select(model.id, model.title, model.level).order_by(
            model.level.asc(), model.title.asc()
        )
        result = await session.execute(stmt)
        return [
            {"id": row.id, "uraian": row.title, "title": row.title, "level": row.level}
            for row in result.all()
        ]

    if model is AuthMenu:
        stmt = (
            select(model.id, model.title, model.path, model.parent_id, model.index)
            .where(model.is_active.is_(True))
            .order_by(model.index.asc())
        )
        result = await session.execute(stmt)
        return [
            {
                "id": row.id,
                "uraian": row.title,
                "title": row.title,
                "path": row.path,
                "parent_id": row.parent_id,
            }
            for row in result.all()
        ]

    # Standard Master models (id, uraian)
    stmt = select(model.id, model.uraian).order_by(model.uraian.asc())
    result = await session.execute(stmt)
    return [{"id": row.id, "uraian": row.uraian} for row in result.all()]


async def fetch_sekolah_lookup(session: AsyncSession) -> list[dict[str, Any]]:
    """Fetch all active schools for dropdown lookup."""
    from sqlalchemy import text
    sql = text("""
        SELECT id, nama_sekolah, jenjang, status_sekolah, kecamatan
        FROM master_sekolah
        WHERE is_active = 1
        ORDER BY nama_sekolah ASC
    """)
    result = await session.execute(sql)
    return [
        {
            "id": r[0],
            "uraian": (r[1] or "").strip(),
            "jenjang": r[2],
            "status": r[3],
            "kecamatan": r[4],
        }
        for r in result.fetchall()
    ]


async def get_batch_lookups(
    session: AsyncSession,
    keys: list[str] | None = None,
) -> dict[str, list[dict[str, Any]]]:
    """
    Fetch batch master lookup data.
    If keys is provided, only return options for specified keys.
    If keys is None or empty, return options for all available master keys.
    """
    results: dict[str, list[dict[str, Any]]] = {}

    recognized_keys = set(MASTER_LOOKUP_REGISTRY.keys()) | {"sekolah"}

    if not keys:
        target_keys = list(MASTER_LOOKUP_REGISTRY.keys())
    else:
        # Filter only recognized keys
        target_keys = [
            k.strip().lower() for k in keys if k.strip().lower() in recognized_keys
        ]

    for key in target_keys:
        if key == "sekolah":
            results[key] = await fetch_sekolah_lookup(session)
        else:
            model = MASTER_LOOKUP_REGISTRY[key]
            results[key] = await fetch_lookup_for_model(session, model)

    return results
