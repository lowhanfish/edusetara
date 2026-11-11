"""Master Aset endpoints: auth, CRUD, derived fields, references and delete guards."""

from types import SimpleNamespace

import pytest
import pytest_asyncio

from app.api.deps import get_current_user
from main import app

BASE = "/api/v1/admin/master/master_aset"

# The shared transaction helper maps only MySQL error 1062 to 409; SQLite (used by these tests)
# reports the same unique violation as 400. Production runs on MySQL.
DUPLICATE = (400, 409)


@pytest_asyncio.fixture
async def authed(client):
    user = SimpleNamespace(username="admin-test", role=SimpleNamespace(name="admin"))
    app.dependency_overrides[get_current_user] = lambda: user
    yield client
    app.dependency_overrides.pop(get_current_user, None)


async def _kode(client, kode: str, uraian: str):
    res = await client.post(f"{BASE}/kode-barang/create", json={"kode": kode, "uraian": uraian})
    assert res.status_code == 201, res.text
    return res.json()


async def test_requires_login(client):
    res = await client.get(f"{BASE}/kode-barang/read")
    assert res.status_code == 401


async def test_kode_barang_derives_level_and_parent(authed):
    created = await _kode(authed, "01.03.02.05.01.05", "Alat Kantor Lainnya")
    assert created["level"] == 6
    assert created["kode_induk"] == "01.03.02.05.01"
    assert created["created_by"] == "admin-test"

    top = await _kode(authed, "01", "ASET")
    assert top["level"] == 1 and top["kode_induk"] is None


async def test_kode_barang_rejects_bad_format_and_duplicates(authed):
    bad = await authed.post(f"{BASE}/kode-barang/create", json={"kode": "1.3.2", "uraian": "x"})
    assert bad.status_code == 422

    await _kode(authed, "01.03", "ASET TETAP")
    dup = await authed.post(f"{BASE}/kode-barang/create", json={"kode": "01.03", "uraian": "lagi"})
    assert dup.status_code in DUPLICATE


async def test_list_filter_search_and_option(authed):
    await _kode(authed, "01.03", "ASET TETAP")
    await _kode(authed, "01.03.02", "PERALATAN DAN MESIN")
    await _kode(authed, "01.03.02.05", "ALAT KANTOR DAN RUMAH TANGGA")

    listing = (await authed.get(f"{BASE}/kode-barang/read?limit=10")).json()
    assert listing["total"] == 3
    assert [r["kode"] for r in listing["data"]] == ["01.03", "01.03.02", "01.03.02.05"]

    level3 = (await authed.get(f"{BASE}/kode-barang/read?level=3")).json()
    assert [r["kode"] for r in level3["data"]] == ["01.03.02"]

    found = (await authed.get(f"{BASE}/kode-barang/read?search=kantor")).json()
    assert found["total"] == 1

    # wildcard characters are literals, not patterns
    assert (await authed.get(f"{BASE}/kode-barang/read?search=%25")).json()["total"] == 0

    options = (await authed.get(f"{BASE}/kode-barang/option?search=mesin")).json()
    assert options == [{"id": "01.03.02", "value": "01.03.02 - PERALATAN DAN MESIN"}]

    bad_filter = await authed.get(f"{BASE}/kode-barang/read?level=abc")
    assert bad_filter.status_code == 422


async def test_kode_is_locked_but_uraian_can_change(authed):
    row = await _kode(authed, "01.03", "ASET TETAP")
    ok = await authed.put(
        f"{BASE}/kode-barang/update/{row['id']}", json={"kode": "01.03", "uraian": "Aset Tetap"}
    )
    assert ok.status_code == 200 and ok.json()["uraian"] == "Aset Tetap"

    locked = await authed.put(f"{BASE}/kode-barang/update/{row['id']}", json={"kode": "01.04"})
    assert locked.status_code == 400

    missing = await authed.put(f"{BASE}/kode-barang/update/nope", json={"uraian": "x"})
    assert missing.status_code == 404


async def test_optional_text_can_be_cleared(authed):
    row = (
        await authed.post(
            f"{BASE}/kondisi-barang/create",
            json={"kode": 1, "uraian": "Baik", "keterangan": "layak pakai"},
        )
    ).json()
    cleared = await authed.put(
        f"{BASE}/kondisi-barang/update/{row['id']}", json={"uraian": "Baik", "keterangan": None}
    )
    assert cleared.status_code == 200 and cleared.json()["keterangan"] is None


async def test_masa_manfaat_needs_existing_references_and_enriches(authed):
    payload = {
        "tahun_berlaku": "2023",
        "kode_barang": "01.03.02.05.01.05",
        "metode_id": "1",  # the admin form sends select values as strings
        "umur_tahun": 4,
        "dasar_hukum": "Permendagri 1/2019",
    }
    res = await authed.post(f"{BASE}/masa-manfaat/create", json=payload)
    assert res.status_code == 422  # kode barang not in master yet

    await _kode(authed, "01.03.02.05.01.05", "Alat Kantor Lainnya")
    res = await authed.post(f"{BASE}/masa-manfaat/create", json=payload)
    assert res.status_code == 422  # metode not in master yet

    await authed.post(
        f"{BASE}/metode-penyusutan/create", json={"kode": 1, "nama": "Garis Lurus"}
    )
    res = await authed.post(f"{BASE}/masa-manfaat/create", json=payload)
    assert res.status_code == 201, res.text
    body = res.json()
    assert body["uraian_barang"] == "Alat Kantor Lainnya"
    assert body["metode_nama"] == "Garis Lurus"
    assert body["metode_id"] == 1

    dup = await authed.post(f"{BASE}/masa-manfaat/create", json=payload)
    assert dup.status_code in DUPLICATE

    by_year = (await authed.get(f"{BASE}/masa-manfaat/read?tahun_berlaku=2022")).json()
    assert by_year["total"] == 0
    by_name = (await authed.get(f"{BASE}/masa-manfaat/read?search=kantor")).json()
    assert by_name["total"] == 1


async def test_delete_guards_protect_referenced_codes(authed):
    parent = await _kode(authed, "01.03.02.05.01", "Alat Kantor")
    leaf = await _kode(authed, "01.03.02.05.01.05", "Alat Kantor Lainnya")
    metode_res = await authed.post(
        f"{BASE}/metode-penyusutan/create", json={"kode": 1, "nama": "Garis Lurus"}
    )
    metode = metode_res.json()
    mm = (
        await authed.post(
            f"{BASE}/masa-manfaat/create",
            json={
                "tahun_berlaku": 2023,
                "kode_barang": leaf["kode"],
                "metode_id": 1,
                "umur_tahun": 4,
            },
        )
    ).json()

    assert (await authed.delete(f"{BASE}/kode-barang/delete/{parent['id']}")).status_code == 409
    assert (await authed.delete(f"{BASE}/kode-barang/delete/{leaf['id']}")).status_code == 409
    metode_url = f"{BASE}/metode-penyusutan/delete/{metode['id']}"
    assert (await authed.delete(metode_url)).status_code == 409

    assert (await authed.delete(f"{BASE}/masa-manfaat/delete/{mm['id']}")).status_code == 200
    assert (await authed.delete(metode_url)).status_code == 200
    assert (await authed.delete(f"{BASE}/kode-barang/delete/{leaf['id']}")).status_code == 200
    assert (await authed.delete(f"{BASE}/kode-barang/delete/{parent['id']}")).status_code == 200


async def test_kapitalisasi_validates_range_and_reference(authed):
    await _kode(authed, "01.03.02.05", "Alat Kantor dan Rumah Tangga")
    body = {
        "kode_barang": "01.03.02.05",
        "batas_bawah_persen": 0,
        "batas_atas_persen": 25,
        "tambahan_umur_tahun": 1,
        "jenis_kapitalisasi": 1,
    }
    ok = await authed.post(f"{BASE}/kapitalisasi-masa-manfaat/create", json=body)
    assert ok.status_code == 201 and ok.json()["uraian_barang"] == "Alat Kantor dan Rumah Tangga"

    inverted = await authed.post(
        f"{BASE}/kapitalisasi-masa-manfaat/create",
        json={**body, "batas_bawah_persen": 50, "batas_atas_persen": 10},
    )
    assert inverted.status_code == 422

    unknown = await authed.post(
        f"{BASE}/kapitalisasi-masa-manfaat/create", json={**body, "kode_barang": "01.03.09.09"}
    )
    assert unknown.status_code == 422


@pytest.mark.parametrize("slug", ["status-pemilik", "kondisi-barang", "metode-penyusutan"])
async def test_simple_masters_option_uses_code_as_id(authed, slug):
    field = "uraian" if slug == "kondisi-barang" else "nama"
    kode = 0 if slug == "status-pemilik" else 1
    await authed.post(f"{BASE}/{slug}/create", json={"kode": kode, field: "Contoh"})
    options = (await authed.get(f"{BASE}/{slug}/option")).json()
    assert options == [{"id": str(kode), "value": "Contoh"}]
