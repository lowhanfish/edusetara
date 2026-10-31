"""Integration tests for sovereign Master Sekolah endpoints."""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.master.sekolah import MasterSekolah


@pytest.mark.asyncio
async def test_read_sekolah_endpoints(client: AsyncClient, db_session: AsyncSession) -> None:
    """Test GET /api/v1/admin/master/sekolah reads schools."""
    # Seed a sample school
    sch = MasterSekolah(
        id="sch_40401228",
        npsn="40401228",
        nama_sekolah="SD NEGERI 6 MOWILA",
        bentuk_pendidikan="SD",
        status_sekolah="NEGERI",
        akreditasi="B",
        kecamatan_id=7405101,
        kecamatan="Mowila",
        desa_kelurahan_id=68992,
        desa_kelurahan="Rakawuta",
        alamat_jalan="Jalan Poros Mowila",
        latitude=-4.114,
        longitude=122.208,
        simpeg_unit_kerja_id=None,
        is_active=True,
    )
    db_session.add(sch)
    await db_session.commit()

    # 1. Test List
    res = await client.get("/api/v1/admin/master/sekolah")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    assert any(item["npsn"] == "40401228" for item in data["data"])

    # 2. Test Detail
    detail_res = await client.get("/api/v1/admin/master/sekolah/sch_40401228")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["npsn"] == "40401228"
    assert detail["bentuk_pendidikan"] == "SD"
    assert detail["simpeg_unit_kerja_id"] is None
    assert detail["latitude"] == -4.114

    # 3. Test Lookup
    lookup_res = await client.get("/api/v1/admin/master/sekolah/lookup?jenjang=SD")
    assert lookup_res.status_code == 200
    lookup_data = lookup_res.json()
    assert any(item["npsn"] == "40401228" for item in lookup_data)
