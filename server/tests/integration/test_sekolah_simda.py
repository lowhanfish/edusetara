"""School-side UPB assignment preserves the shared asset reference."""
from types import SimpleNamespace

import pytest_asyncio
from app.api.deps import get_current_user
from app.models.master.sekolah import MasterSekolah
from main import app

BASE = "/api/v1/admin/master/sekolah"
ASSET = "/api/v1/admin/master/master_aset/unit-sekolah"


@pytest_asyncio.fixture
async def setup(client, db_session):
    app.dependency_overrides[get_current_user] = lambda: SimpleNamespace(
        username="admin-test", role=SimpleNamespace(name="admin"))
    for n, level in ((1, "SD"), (2, "SMP"), (3, "SD")):
        db_session.add(MasterSekolah(id=f"sch{n}", npsn=f"1000000{n}",
                       nama_sekolah=f"School {n}", bentuk_pendidikan=level,
                       status_sekolah="NEGERI", is_active=True))
    await db_session.commit()
    async def create(**kwargs):
        response = await client.post(f"{ASSET}/create", json={
            "kd_bidang": 8, "kd_unit": 1, "jenis": "DINAS", "nama": "Dinas",
            "status_pencocokan": "belum", **kwargs})
        assert response.status_code == 201, response.text
        return response.json()
    unit = await create()
    await create(kd_sub=1, jenis="UPT", nama="UPT")
    upb = await create(kd_sub=1, kd_upb=1, jenis="SATAP", nama="SATAP")
    other = await create(kd_sub=1, kd_upb=2, jenis="SD", nama="SD")
    yield client, unit, upb, other
    app.dependency_overrides.pop(get_current_user, None)


async def test_assign_share_move_and_detach(setup):
    client, _, upb, other = setup
    response = await client.put(f"{BASE}/sch1", json={"simda_upb_id": upb["id"]})
    assert response.status_code == 200, response.text
    assert response.json()["simda_upb"]["kode"] == upb["kode"]
    assert response.json()["simda_upb"]["status_pencocokan"] == "manual"
    response = await client.put(f"{BASE}/10000002", json={"simda_upb_id": upb["id"]})
    assert response.status_code == 200, response.text
    assert response.json()["simda_upb"]["sekolah_kedua_id"] == "sch2"
    assert response.json()["simda_upb"]["status_pencocokan"] == "otomatis"
    listing = (await client.get(BASE)).json()["data"]
    assert sum(s["simda_upb"] is not None for s in listing) == 2
    response = await client.put(f"{BASE}/sch1", json={"simda_upb_id": other["id"], "akreditasi": "A"})
    assert response.status_code == 200, response.text
    assert response.json()["akreditasi"] == "A"
    remaining = (await client.get(f"{BASE}/sch2")).json()["simda_upb"]
    assert remaining["sekolah_id"] == "sch2" and remaining["sekolah_kedua_id"] is None
    response = await client.put(f"{BASE}/sch1", json={"simda_upb_id": None})
    assert response.status_code == 200 and response.json()["simda_upb"] is None
    asset = (await client.get(f"{ASSET}/read?search=SD")).json()["data"]
    assert asset[0]["status_pencocokan"] == "belum"


async def test_reject_invalid_or_occupied_upb_and_preserve_unedited_link(setup):
    client, unit, upb, other = setup
    for invalid in (unit["id"], "missing"):
        response = await client.put(f"{BASE}/sch1", json={"simda_upb_id": invalid})
        assert response.status_code == 422
    await client.put(f"{BASE}/sch1", json={"simda_upb_id": other["id"]})
    response = await client.put(f"{BASE}/sch2", json={"simda_upb_id": other["id"]})
    assert response.status_code == 409
    response = await client.put(f"{BASE}/sch1", json={"akreditasi": "B"})
    assert response.status_code == 200
    assert response.json()["simda_upb"]["id"] == other["id"]
    await client.put(f"{BASE}/sch2", json={"simda_upb_id": upb["id"]})
    await client.put(f"{BASE}/sch3", json={"simda_upb_id": upb["id"]})
    response = await client.put(f"{BASE}/sch1", json={"simda_upb_id": upb["id"]})
    assert response.status_code == 409
    assert (await client.get(f"{BASE}/sch1")).json()["simda_upb"]["id"] == other["id"]


async def test_bmd_filter_includes_shared_school_and_correct_pagination(setup):
    client, _, upb, _ = setup
    await client.put(f"{BASE}/sch1", json={"simda_upb_id": upb["id"]})
    await client.put(f"{BASE}/sch2", json={"simda_upb_id": upb["id"]})
    linked = await client.get(f"{BASE}?status_bmd=sudah&limit=1&skip=1")
    assert linked.status_code == 200, linked.text
    assert linked.json()["total"] == 2
    assert [s["id"] for s in linked.json()["data"]] == ["sch2"]
    unlinked = (await client.get(f"{BASE}?status_bmd=belum")).json()
    assert unlinked["total"] == 1
    assert [s["id"] for s in unlinked["data"]] == ["sch3"]
    combined = (await client.get(f"{BASE}?status_bmd=sudah&jenjang=SMP&search=School")).json()
    assert combined["total"] == 1
    assert combined["data"][0]["id"] == "sch2"
    assert (await client.get(BASE)).json()["total"] == 3
    assert (await client.get(f"{BASE}?status_bmd=invalid")).status_code == 422
