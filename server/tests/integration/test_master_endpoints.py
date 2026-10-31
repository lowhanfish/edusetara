"""Integration tests for Master Data endpoints (batch lookup, exact contract CRUD, & Siswa)."""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.seed_master import seed_all_master_data


@pytest.mark.asyncio
async def test_get_master_lookup_endpoint(client: AsyncClient, db_session: AsyncSession) -> None:
    """Test GET /api/v1/admin/master/lookup with specified keys."""
    await seed_all_master_data(db_session)

    res = await client.get("/api/v1/admin/master/lookup?keys=bangunan,kepemilikan,sumber_dana")
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    assert body["statusCode"] == 200

    data = body["data"]
    assert "bangunan" in data
    assert "kepemilikan" in data
    assert "sumber_dana" in data
    assert len(data["bangunan"]) == 4
    assert len(data["kepemilikan"]) == 4
    assert len(data["sumber_dana"]) == 6

    # Verify option format matches contract { id, uraian }
    first_bangunan = data["bangunan"][0]
    assert "id" in first_bangunan
    assert "uraian" in first_bangunan


@pytest.mark.asyncio
async def test_get_master_lookup_all_keys(client: AsyncClient, db_session: AsyncSession) -> None:
    """Test GET /api/v1/admin/master/lookup without query params returns all keys."""
    await seed_all_master_data(db_session)

    res = await client.get("/api/v1/admin/master/lookup")
    assert res.status_code == 200
    body = res.json()
    data = body["data"]
    assert "triwulan" in data
    assert "agama" in data
    assert "jenjang" in data
    assert len(data["triwulan"]) == 4


@pytest.mark.asyncio
async def test_exact_contract_two_level_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    """Test CRUD directly on exact contract path: /api/v1/admin/master/sarpras/bangunan."""
    # 1. Login user
    reg_payload = {
        "username": "user_contract_two",
        "email": "user.two@konawe.go.id",
        "password": "Password123!",
        "full_name": "User Two",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    # 2. CREATE item directly on /sarpras/bangunan (e-office returns BangunanResponse)
    create_payload = {"id": "KBG-TEST", "uraian": "Gedung Uji Coba"}
    create_res = await client.post(
        "/api/v1/admin/master/sarpras/bangunan/create", json=create_payload
    )
    assert create_res.status_code == 201
    assert create_res.json()["id"] == "KBG-TEST"

    # 3. GET item directly on /sarpras/bangunan/KBG-TEST
    get_res = await client.get("/api/v1/admin/master/sarpras/bangunan/KBG-TEST")
    assert get_res.status_code == 200
    assert get_res.json()["uraian"] == "Gedung Uji Coba"

    # 4. LIST items on /sarpras/bangunan (e-office returns { total, skip, limit, data })
    list_res = await client.get("/api/v1/admin/master/sarpras/bangunan")
    assert list_res.status_code == 200
    assert any(i["id"] == "KBG-TEST" for i in list_res.json()["data"])

    # 5. OPTION items on /sarpras/bangunan/option (e-office returns list[BangunanResponse])
    opt_res = await client.get("/api/v1/admin/master/sarpras/bangunan/option")
    assert opt_res.status_code == 200
    assert any(i["id"] == "KBG-TEST" for i in opt_res.json())

    # 6. UPDATE item via /update/{id}
    update_res = await client.put(
        "/api/v1/admin/master/sarpras/bangunan/update/KBG-TEST",
        json={"uraian": "Gedung Uji Coba Direvisi"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["uraian"] == "Gedung Uji Coba Direvisi"

    # 7. DELETE item via /delete/{id}
    del_res = await client.delete("/api/v1/admin/master/sarpras/bangunan/delete/KBG-TEST")
    assert del_res.status_code == 200
    assert "Berhasil" in del_res.json()["message"]


@pytest.mark.asyncio
async def test_exact_contract_one_level_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    """Test CRUD directly on exact contract path: /api/v1/admin/master/jenjang."""
    reg_payload = {
        "username": "user_contract_one",
        "email": "user.one@konawe.go.id",
        "password": "Password123!",
        "full_name": "User One",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    # CREATE
    create_res = await client.post(
        "/api/v1/admin/master/jenjang",
        json={"id": "JJG-TEST", "uraian": "Jenjang Khusus"},
    )
    assert create_res.status_code == 201

    # GET
    get_res = await client.get("/api/v1/admin/master/jenjang/JJG-TEST")
    assert get_res.status_code == 200
    assert get_res.json()["uraian"] == "Jenjang Khusus"

    # DELETE
    del_res = await client.delete("/api/v1/admin/master/jenjang/JJG-TEST")
    assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_master_siswa_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    """Test dedicated CRUD on /api/v1/admin/master/siswa."""
    reg_payload = {
        "username": "admin_siswa",
        "email": "admin.siswa@konawe.go.id",
        "password": "Password123!",
        "full_name": "Admin Siswa",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    # 1. CREATE Siswa
    siswa_payload = {
        "id": "SIS-001",
        "nama": "Ahmad Dani",
        "nisn": "0012345678",
        "nik": "7405011234560001",
        "jns_kelamin": "Laki-laki",
        "tgl_lahir": "2015-05-10",
        "alamat": "Jl. Pendidikan No. 10 Unaaha",
        "agama": "Islam",
    }
    create_res = await client.post("/api/v1/admin/master/siswa", json=siswa_payload)
    assert create_res.status_code == 201
    assert create_res.json()["id"] == "SIS-001"

    # 2. GET Siswa
    get_res = await client.get("/api/v1/admin/master/siswa/SIS-001")
    assert get_res.status_code == 200
    assert get_res.json()["nama"] == "Ahmad Dani"

    # 3. LIST Siswa with search
    list_res = await client.get("/api/v1/admin/master/siswa?search=Ahmad")
    assert list_res.status_code == 200
    assert len(list_res.json()["data"]) == 1

    # 4. UPDATE Siswa
    update_res = await client.put(
        "/api/v1/admin/master/siswa/SIS-001",
        json={"nama": "Ahmad Dani Pratama"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["nama"] == "Ahmad Dani Pratama"

    # 5. DELETE Siswa
    del_res = await client.delete("/api/v1/admin/master/siswa/SIS-001")
    assert del_res.status_code == 200
    assert "telah dihapus" in del_res.json()["message"]


@pytest.mark.asyncio
async def test_ppdb_and_usulan_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    """Test CRUD on PPDB and Usulan e-office modules."""
    reg_payload = {
        "username": "user_ppdb_usulan",
        "email": "user.pu@konawe.go.id",
        "password": "Password123!",
        "full_name": "User PPDB Usulan",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    # 1. PPDB Agama
    res_agama = await client.post(
        "/api/v1/admin/master/ppdb/agama/create",
        json={"id": "AGM-TEST", "uraian": "Agama Test"},
    )
    assert res_agama.status_code == 201
    assert res_agama.json()["id"] == "AGM-TEST"

    opt_agama = await client.get("/api/v1/admin/master/ppdb/agama/option")
    assert opt_agama.status_code == 200
    assert any(a["id"] == "AGM-TEST" for a in opt_agama.json())

    # 2. Usulan Triwulan
    res_tw = await client.post(
        "/api/v1/admin/master/usulan/triwulan/create",
        json={"id": "TW-TEST", "uraian": "Triwulan Uji"},
    )
    assert res_tw.status_code == 201
    assert res_tw.json()["id"] == "TW-TEST"

    read_tw = await client.get("/api/v1/admin/master/usulan/triwulan/read")
    assert read_tw.status_code == 200
    assert any(t["id"] == "TW-TEST" for t in read_tw.json()["data"])


@pytest.mark.asyncio
async def test_jurnal_and_pelengkap_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    """Test CRUD on Jurnal and Pelengkap e-office modules."""
    reg_payload = {
        "username": "user_jurnal_pelengkap",
        "email": "user.jp@konawe.go.id",
        "password": "Password123!",
        "full_name": "User Jurnal Pelengkap",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    # 1. Jurnal Kelas
    res_kls = await client.post(
        "/api/v1/admin/master/jurnal/kelas/create",
        json={"id": "KLS-TEST", "uraian": "Kelas Test"},
    )
    assert res_kls.status_code == 201

    # 2. Jurnal Mata Pelajaran with kelas_id
    res_mapel = await client.post(
        "/api/v1/admin/master/jurnal/mata-pelajaran/create",
        json={"id": "MP-TEST", "kelas_id": "KLS-TEST", "uraian": "Matematika Uji"},
    )
    assert res_mapel.status_code == 201
    assert res_mapel.json()["kelas_id"] == "KLS-TEST"

    # 3. Pelengkap BK Jenis Layanan
    res_bk = await client.post(
        "/api/v1/admin/master/bk-jenis-layanan/create",
        json={"id": "BK-TEST", "uraian": "Konseling Khusus"},
    )
    assert res_bk.status_code == 201
    assert res_bk.json()["id"] == "BK-TEST"

    # 4. Pelengkap Kategori Berkas
    res_kat = await client.get("/api/v1/admin/master/kategori/option")
    assert res_kat.status_code == 200
