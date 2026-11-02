"""Public directory shares master data and hides administrative fields."""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.master.sekolah import MasterSekolah


@pytest.mark.asyncio
async def test_public_directory_uses_active_master_records(client: AsyncClient, db_session: AsyncSession):
    for index, (level, active) in enumerate([("SD", True), ("TK", True), ("PKBM", True), ("SMP", False)]):
        db_session.add(MasterSekolah(
            id=f"public-school-{index}", npsn=f"1234567{index}", nama_sekolah=f"School {index}",
            bentuk_pendidikan=level, status_sekolah="NEGERI", kecamatan="Andoolo",
            alamat_jalan="Jalan Sekolah", is_active=active,
            simpeg_unit_kerja_id="internal-unit",
        ))
    await db_session.commit()
    response = await client.get("/api/v1/publish/sekolah?limit=2")
    assert response.status_code == 200
    first = response.json()
    assert first["total"] == 3
    assert len(first["data"]) == 2
    second = (await client.get("/api/v1/publish/sekolah?skip=2&limit=2")).json()
    records = first["data"] + second["data"]
    assert {item["bentuk_pendidikan"] for item in records} == {"SD", "TK", "PKBM"}
    assert all("simpeg_unit_kerja_id" not in item for item in records)
    master = (await client.get("/api/v1/admin/master/sekolah?limit=500")).json()
    assert {item["id"] for item in records} == {item["id"] for item in master["data"]}
    for query in ["limit=501", "skip=-1", "limit=0"]:
        assert (await client.get(f"/api/v1/publish/sekolah?{query}")).status_code == 422
