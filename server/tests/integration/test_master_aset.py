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


# --- tahap 2: alasan penghapusan, nilai minimum kapitalisasi, unit & sekolah ----------------


async def test_alasan_penghapusan_crud_and_lock(authed):
    res = await authed.post(
        f"{BASE}/alasan-penghapusan/create", json={"kode": 103, "uraian": "Hilang"}
    )
    assert res.status_code == 201, res.text
    row = res.json()
    options = (await authed.get(f"{BASE}/alasan-penghapusan/option")).json()
    assert options == [{"id": "103", "value": "Hilang"}]

    url = f"{BASE}/alasan-penghapusan/update/{row['id']}"
    assert (await authed.put(url, json={"kode": 104})).status_code == 400
    assert (await authed.put(url, json={"uraian": "Hilang/kerugian"})).json()["uraian"] == (
        "Hilang/kerugian"
    )
    too_big = await authed.post(
        f"{BASE}/alasan-penghapusan/create", json={"kode": 999, "uraian": "x"}
    )
    assert too_big.status_code == 422


async def test_nilai_minimum_kapitalisasi_reference_filter_and_guard(authed):
    body = {
        "tahun_berlaku": 2025,
        "kode_barang": "01.03.02.05.01",
        "nilai_minimum_satuan": "1000000",  # the admin form may send numbers as strings
        "nilai_minimum_total": 0,
    }
    url = f"{BASE}/nilai-minimum-kapitalisasi"
    assert (await authed.post(f"{url}/create", json=body)).status_code == 422  # kode unknown

    kode = await _kode(authed, "01.03.02.05.01", "Alat Kantor")
    res = await authed.post(f"{url}/create", json=body)
    assert res.status_code == 201, res.text
    row = res.json()
    assert row["nilai_minimum_satuan"] == 1_000_000
    assert row["uraian_barang"] == "Alat Kantor"

    assert (await authed.post(f"{url}/create", json=body)).status_code in DUPLICATE
    negative = await authed.post(f"{url}/create", json={**body, "nilai_minimum_satuan": -1})
    assert negative.status_code == 422

    assert (await authed.get(f"{url}/read?tahun_berlaku=2024")).json()["total"] == 0
    assert (await authed.get(f"{url}/read?search=kantor")).json()["total"] == 1

    # kode barang cannot be removed while a threshold still refers to it
    assert (await authed.delete(f"{BASE}/kode-barang/delete/{kode['id']}")).status_code == 409
    assert (await authed.delete(f"{url}/delete/{row['id']}")).status_code == 200
    assert (await authed.delete(f"{BASE}/kode-barang/delete/{kode['id']}")).status_code == 200


UNIT = f"{BASE}/unit-sekolah"


async def _unit(client, **body):
    payload = {"kd_bidang": 8, "kd_unit": 1, "jenis": "DINAS", "status_pencocokan": "bukan_sekolah"}
    res = await client.post(f"{UNIT}/create", json={**payload, **body})
    assert res.status_code == 201, res.text
    return res.json()


async def _sekolah(db_session, sid: str, nama: str, simpeg: str | None = None):
    from app.models.master.sekolah import MasterSekolah

    db_session.add(
        MasterSekolah(
            id=sid,
            npsn=sid[-8:],
            nama_sekolah=nama,
            bentuk_pendidikan="SD",
            status_sekolah="NEGERI",
            simpeg_unit_kerja_id=simpeg,
            simpeg_unit_kerja_nama=f"UK {nama}" if simpeg else None,
        )
    )
    await db_session.commit()


async def test_unit_hierarchy_codes_parents_and_delete_guard(authed):
    orphan = await authed.post(
        f"{UNIT}/create",
        json={"kd_bidang": 8, "kd_unit": 1, "kd_sub": 2, "jenis": "UPT", "nama": "UPT",
              "status_pencocokan": "bukan_sekolah"},
    )
    assert orphan.status_code == 422  # parent unit missing

    unit = await _unit(authed, nama="DINAS PENDIDIKAN DAN KEBUDAYAAN",
                       nama_lama="DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA")
    assert (unit["kode"], unit["tingkat"], unit["kode_induk"]) == ("08.01", "unit", None)

    sub = await _unit(authed, kd_sub=2, jenis="UPT", nama="UPT KECAMATAN TINANGGEA")
    assert (sub["kode"], sub["tingkat"], sub["kode_induk"]) == ("08.01.002", "sub_unit", "08.01")
    assert sub["nama_induk"] == "DINAS PENDIDIKAN DAN KEBUDAYAAN"

    upb = await _unit(authed, kd_sub=2, kd_upb=3, jenis="SD", nama="SDN 2 TINANGGEA",
                      nama_lama="SDN NGAPAAHA", status_pencocokan="belum")
    assert (upb["kode"], upb["tingkat"]) == ("08.01.002.003", "upb")

    no_sub = await authed.post(
        f"{UNIT}/create",
        json={"kd_bidang": 8, "kd_unit": 1, "kd_upb": 3, "jenis": "SD", "nama": "x"},
    )
    assert no_sub.status_code == 422
    dup = await authed.post(
        f"{UNIT}/create",
        json={"kd_bidang": 8, "kd_unit": 1, "kd_sub": 2, "jenis": "UPT", "nama": "lagi",
              "status_pencocokan": "bukan_sekolah"},
    )
    assert dup.status_code in DUPLICATE

    listing = (await authed.get(f"{UNIT}/read")).json()
    assert [r["kode"] for r in listing["data"]] == ["08.01", "08.01.002", "08.01.002.003"]
    assert (await authed.get(f"{UNIT}/read?tingkat=upb")).json()["total"] == 1
    assert (await authed.get(f"{UNIT}/read?jenis=UPT")).json()["total"] == 1
    assert (await authed.get(f"{UNIT}/read?search=ngapaaha")).json()["total"] == 1  # nama lama

    locked = await authed.put(f"{UNIT}/update/{upb['id']}", json={"kd_upb": 4})
    assert locked.status_code == 400

    assert (await authed.delete(f"{UNIT}/delete/{unit['id']}")).status_code == 409
    assert (await authed.delete(f"{UNIT}/delete/{sub['id']}")).status_code == 409
    assert (await authed.delete(f"{UNIT}/delete/{upb['id']}")).status_code == 200
    assert (await authed.delete(f"{UNIT}/delete/{sub['id']}")).status_code == 200


async def test_unit_school_matching_rules(authed, db_session):
    await _sekolah(db_session, "sch_10000001", "SD NEGERI 1 TINANGGEA", simpeg="uk-1")
    await _sekolah(db_session, "sch_10000002", "SMP NEGERI SATAP 1")
    await _unit(authed, nama="DINAS")
    sub = await _unit(authed, kd_sub=2, jenis="UPT", nama="UPT")
    upb = await _unit(authed, kd_sub=2, kd_upb=2, jenis="SD", nama="SDN 1 TINANGGEA",
                      status_pencocokan="belum")
    url = f"{UNIT}/update/{upb['id']}"

    async def put(target: str, **body):
        return await authed.put(target, json=body)

    # status and link must agree
    assert (await put(url, status_pencocokan="manual")).status_code == 422
    assert (await put(url, sekolah_id="sch_10000001")).status_code == 422
    assert (await put(url, sekolah_id="tidak-ada", status_pencocokan="manual")).status_code == 422
    assert (
        await put(url, sekolah_kedua_id="sch_10000002", status_pencocokan="belum")
    ).status_code == 422
    # only UPB rows can be linked
    sub_url = f"{UNIT}/update/{sub['id']}"
    assert (
        await put(sub_url, sekolah_id="sch_10000001", status_pencocokan="manual")
    ).status_code == 422

    ok = await put(url, sekolah_id="sch_10000001", sekolah_kedua_id="sch_10000002",
                   status_pencocokan="manual")
    assert ok.status_code == 200, ok.text
    body = ok.json()
    assert body["sekolah_label"] == "SD NEGERI 1 TINANGGEA (NPSN 10000001)"
    assert body["sekolah_kedua_label"] == "SMP NEGERI SATAP 1 (NPSN 10000002)"
    assert (body["unit_kerja_id"], body["unit_kerja_nama"]) == ("uk-1", "UK SD NEGERI 1 TINANGGEA")
    assert (await authed.get(f"{UNIT}/read?status_pencocokan=manual")).json()["total"] == 1

    # one school cannot be matched to two UPB
    other = await _unit(authed, kd_sub=2, kd_upb=3, jenis="SD", nama="SDN 2",
                        status_pencocokan="belum")
    clash = await put(f"{UNIT}/update/{other['id']}", sekolah_id="sch_10000002",
                      status_pencocokan="manual")
    assert clash.status_code == 409

    # unlinking: both ids cleared together with the status
    cleared = await put(url, sekolah_id=None, sekolah_kedua_id=None, status_pencocokan="belum")
    assert cleared.status_code == 200 and cleared.json()["sekolah_label"] is None
