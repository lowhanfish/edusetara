"""BMD pilot flow: validated references, shared UPB, exact totals and condition evidence."""

import base64
from types import SimpleNamespace

import pytest_asyncio
from sqlalchemy import select

from app.api.deps import get_current_user
from app.models.master.aset import MasterAsetKodeBarang, MasterAsetKondisiBarang, MasterAsetUnit
from app.models.master.sekolah import MasterSekolah
from app.models.operational.inventaris_aset import InventarisAset
from main import app

BASE = "/api/v1/admin/inventaris-aset"
PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg=="
)
BUKU = "01.03.05.01.01.01.01"
PERSEDIAAN = "01.01.07.01.01.01.01"
PAYLOAD = {
    "sekolah_id": "school1",
    "kode_barang": "01.03.02.05.01.05.12",
    "nomor_register": "000001",
    "kib": "B",
    "nama": "Laptop Tata Usaha",
    "tahun_perolehan": 2026,
    "nilai_perolehan": "1234567890123.45",
    "lokasi": "Tata Usaha",
    "kondisi_kode": 1,
}


@pytest_asyncio.fixture
async def inventory(client, db_session, monkeypatch, tmp_path):
    from app.api.v1.endpoints.admin.inventaris_aset import route

    monkeypatch.setattr(route, "BASE_UPLOAD_DIR", tmp_path)
    user = SimpleNamespace(username="admin-test", role=SimpleNamespace(name="admin"))
    app.dependency_overrides[get_current_user] = lambda: user
    db_session.add_all(
        [
            MasterSekolah(
                id="school1",
                npsn="10000001",
                nama_sekolah="SD SATAP",
                bentuk_pendidikan="SD",
                is_active=True,
            ),
            MasterSekolah(
                id="school2",
                npsn="10000002",
                nama_sekolah="SMP SATAP",
                bentuk_pendidikan="SMP",
                is_active=True,
            ),
            MasterSekolah(
                id="unlinked",
                npsn="10000003",
                nama_sekolah="SD Lain",
                bentuk_pendidikan="SD",
                is_active=True,
            ),
            MasterAsetKodeBarang(kode=PAYLOAD["kode_barang"], uraian="Laptop", level=7),
            MasterAsetKodeBarang(kode=BUKU, uraian="Buku", level=7),
            MasterAsetKodeBarang(kode=PERSEDIAAN, uraian="Kertas", level=7),
            MasterAsetKodeBarang(kode="01.03", uraian="Kelompok", level=2),
            MasterAsetKondisiBarang(kode=1, uraian="Baik"),
            MasterAsetKondisiBarang(kode=2, uraian="Rusak Ringan"),
            MasterAsetUnit(
                id="upb1",
                kode="08.01.001.001",
                tingkat="upb",
                kd_bidang=8,
                kd_unit=1,
                kd_sub=1,
                kd_upb=1,
                jenis="SATAP",
                nama="SD-SMP SATAP",
                sekolah_id="school1",
                sekolah_kedua_id="school2",
                status_pencocokan="manual",
            ),
        ]
    )
    await db_session.commit()
    yield client, db_session, tmp_path, user
    app.dependency_overrides.pop(get_current_user, None)


async def make_asset(client, **changes):
    response = await client.post(BASE, json={**PAYLOAD, **changes})
    assert response.status_code == 201, response.text
    return response.json()


async def test_inventory_auth_and_roles(client, inventory):
    _, _, _, user = inventory
    user.role.name = "user"
    assert (await client.get(BASE)).status_code == 403
    assert (await client.post(BASE, json=PAYLOAD)).status_code == 403
    app.dependency_overrides.pop(get_current_user)
    assert (await client.get(BASE)).status_code == 401
    assert (await client.get(f"{BASE}/missing")).status_code == 401


async def test_inventory_shared_upb_pagination_and_decimal_totals(inventory):
    client, _, _, _ = inventory
    asset = await make_asset(client)
    assert asset["nilai_perolehan"] == PAYLOAD["nilai_perolehan"]
    await make_asset(
        client,
        nomor_register="000002",
        nama="Buku",
        nilai_perolehan="100.25",
        kib="E",
        kode_barang=BUKU,
    )
    listed = (await client.get(f"{BASE}?sekolah_id=school2&limit=1&skip=1")).json()
    assert listed["total"] == 2
    assert len(listed["data"]) == 1
    assert listed["nilai_total"] == "1234567890223.70"
    filtered = (await client.get(f"{BASE}?kib=B&search=Laptop&kondisi_kode=1")).json()
    assert filtered["total"] == 1 and filtered["data"][0]["id"] == asset["id"]
    assert (await client.get(f"{BASE}?sekolah_id=unlinked")).json()["total"] == 0
    assert (await client.get(f"{BASE}?search=%25")).json()["total"] == 0
    for params in ("skip=-1", "limit=0", "limit=101", "kib=Z"):
        assert (await client.get(f"{BASE}?{params}")).status_code == 422


async def test_inventory_references_duplicates_and_unverified_upb(inventory):
    client, db, _, _ = inventory
    await make_asset(client)
    assert (await client.post(BASE, json=PAYLOAD)).status_code == 409
    for changes in (
        {"sekolah_id": "unlinked"},
        {"kode_barang": "01.03"},
        {"kib": "A"},
        {"kode_barang": PERSEDIAAN},
        {"kondisi_kode": 999},
        {"sumber_dana_id": "missing"},
        {"nilai_perolehan": "-1"},
        {"tanggal_perolehan": "2025-01-01"},
        {"nama": "   "},
    ):
        response = await client.post(BASE, json={**PAYLOAD, "nomor_register": "new", **changes})
        assert response.status_code == 422, response.text
    unit = await db.get(MasterAsetUnit, "upb1")
    unit.status_pencocokan = "otomatis"
    await db.commit()
    assert (await client.post(BASE, json={**PAYLOAD, "nomor_register": "new"})).status_code == 422


async def test_inventory_condition_photo_history_and_conflicting_update(inventory):
    client, _, folder, _ = inventory
    asset = await make_asset(client)
    url = f"{BASE}/{asset['id']}/kondisi"
    response = await client.post(
        url,
        data={"version": 1, "kondisi_kode": 2, "catatan": "Casing retak"},
        files={"foto": ("bukti.png", PNG, "image/png")},
    )
    assert response.status_code == 200, response.text
    detail = response.json()
    assert detail["version"] == 2 and detail["kondisi_kode"] == 2
    assert len(detail["riwayat"]) == 2
    history = detail["riwayat"][0]
    assert history["kondisi_lama"]["nama"] == "Baik"
    assert history["kondisi_baru"]["nama"] == "Rusak Ringan"
    assert history["created_by"] == "admin-test"
    assert len(list(folder.rglob("*.png"))) == 1
    stale = await client.post(
        url,
        data={"version": 1, "kondisi_kode": 1, "catatan": "stale"},
        files={"foto": ("bukti.png", PNG, "image/png")},
    )
    assert stale.status_code == 409
    for filename, content, expected in (
        ("fake.png", b"not an image", 422),
        ("file.svg", b"<svg/>", 422),
        ("big.png", PNG + b"x" * (10 * 1024 * 1024), 413),
    ):
        invalid = await client.post(
            url,
            data={"version": 2, "kondisi_kode": 1, "catatan": "test"},
            files={"foto": (filename, content, "image/png")},
        )
        assert invalid.status_code == expected, invalid.text
    missing = await client.post(url, data={"version": 2, "kondisi_kode": 1, "catatan": "No photo"})
    assert missing.status_code == 422
    assert len(list(folder.rglob("*.png"))) == 1
    assert (await client.get(f"{BASE}/{asset['id']}")).json()["version"] == 2


async def test_inventory_failed_commit_cleans_uploaded_photo(inventory, monkeypatch):
    client, db, folder, _ = inventory
    asset = await make_asset(client)

    async def fail():
        raise RuntimeError("simulated commit failure")

    # Invoke the endpoint directly so the exception is visible and cleanup can be checked.
    from io import BytesIO

    from fastapi import UploadFile

    from app.api.v1.endpoints.admin.inventaris_aset.route import change_condition

    monkeypatch.setattr(db, "commit", fail)
    import pytest

    with pytest.raises(RuntimeError, match="simulated"):
        await change_condition(
            asset["id"],
            2,
            1,
            "Failed write",
            UploadFile(filename="evidence.png", file=BytesIO(PNG)),
            db,
            SimpleNamespace(username="admin-test"),
        )
    assert list(folder.rglob("*.png")) == []
    saved = (
        await db.execute(select(InventarisAset).where(InventarisAset.id == asset["id"]))
    ).scalar_one()
    assert saved.version == 1 and saved.kondisi_kode == 1


async def test_inventory_options_only_leaf_codes_and_master_delete_guards(inventory):
    client, db, _, _ = inventory
    options = await client.get(f"{BASE}/pilihan-kode-barang?search=Laptop")
    assert options.status_code == 200, options.text
    assert [item["id"] for item in options.json()] == [PAYLOAD["kode_barang"]]
    every = (await client.get(f"{BASE}/pilihan-kode-barang")).json()
    assert [item["id"] for item in every] == [PAYLOAD["kode_barang"], BUKU]  # tanpa persediaan
    await make_asset(client)
    barang = (
        await db.execute(
            select(MasterAsetKodeBarang).where(MasterAsetKodeBarang.kode == PAYLOAD["kode_barang"])
        )
    ).scalar_one()
    condition = (
        await db.execute(select(MasterAsetKondisiBarang).where(MasterAsetKondisiBarang.kode == 1))
    ).scalar_one()
    for slug, id in (
        ("unit-sekolah", "upb1"),
        ("kode-barang", barang.id),
        ("kondisi-barang", condition.id),
    ):
        response = await client.delete(f"/api/v1/admin/master/master_aset/{slug}/delete/{id}")
        assert response.status_code == 409, response.text


async def test_sub_unit_filter_options_combination_totals_and_pagination(inventory):
    client, db, _, _ = inventory
    db.add_all(
        [
            MasterAsetUnit(
                id="sub1",
                kode="08.01.001",
                tingkat="sub_unit",
                kd_bidang=8,
                kd_unit=1,
                kd_sub=1,
                jenis="UPT",
                nama="UPT Andoolo",
            ),
            MasterAsetUnit(
                id="sub2",
                kode="08.01.002",
                tingkat="sub_unit",
                kd_bidang=8,
                kd_unit=1,
                kd_sub=2,
                jenis="UPT",
                nama="UPT Konda",
            ),
            MasterAsetUnit(
                id="upb2",
                kode="08.01.002.001",
                kode_induk="08.01.002",
                tingkat="upb",
                kd_bidang=8,
                kd_unit=1,
                kd_sub=2,
                kd_upb=1,
                jenis="SD",
                nama="SD Konda",
                status_pencocokan="manual",
            ),
        ]
    )
    unit = await db.get(MasterAsetUnit, "upb1")
    unit.kode_induk = "08.01.001"
    await db.commit()
    first = await make_asset(client, nilai_perolehan="100.25")
    await make_asset(client, nomor_register="000002", nilai_perolehan="200.50")
    db.add(
        InventarisAset(
            upb_id="upb2",
            kode_barang=PAYLOAD["kode_barang"],
            nomor_register="000001",
            kib="B",
            nama="Laptop Konda",
            tahun_perolehan=2026,
            nilai_perolehan="999.00",
            lokasi="Kelas",
            kondisi_kode=1,
            version=1,
            created_by="admin-test",
        )
    )
    await db.commit()
    options = await client.get(f"{BASE}/pilihan-sub-unit")
    assert options.status_code == 200, options.text
    assert [item["id"] for item in options.json()] == ["sub1", "sub2"]
    page = (await client.get(f"{BASE}?sub_unit_id=sub1&limit=1&skip=1")).json()
    assert page["total"] == 2 and len(page["data"]) == 1
    assert page["nilai_total"] == "300.75"
    combined = (
        await client.get(
            f"{BASE}?sub_unit_id=sub1&sekolah_id=school2&kib=B&kondisi_kode=1&search=Laptop"
        )
    ).json()
    assert combined["total"] == 2
    assert first["id"] in [item["id"] for item in combined["data"]]
    second = (await client.get(f"{BASE}?sub_unit_id=sub2")).json()
    assert second["total"] == 1 and second["nilai_total"] == "999.00"
    assert (await client.get(f"{BASE}?sub_unit_id=sub2&sekolah_id=school1")).json()["total"] == 0
    assert (await client.get(f"{BASE}?sub_unit_id=upb1")).json()["total"] == 0


async def test_inventory_correction_keeps_history_and_rejects_conflicts(inventory):
    client, _, _, _ = inventory
    asset = await make_asset(client)
    other = await make_asset(client, nomor_register="000002")
    url = f"{BASE}/{asset['id']}"
    body = {
        key: value for key, value in PAYLOAD.items() if key not in ("sekolah_id", "kondisi_kode")
    }
    fixed = {**body, "nilai_perolehan": "2500000.00", "nama": "Laptop TU", "version": 1}
    assert (await client.put(url, json=fixed)).status_code == 422  # alasan wajib
    response = await client.put(url, json={**fixed, "alasan": "Salah ketik nilai"})
    assert response.status_code == 200, response.text
    detail = response.json()
    assert detail["version"] == 2 and detail["nilai_perolehan"] == "2500000.00"
    assert detail["nama"] == "Laptop TU" and detail["kondisi_kode"] == 1
    entry = detail["riwayat"][0]
    assert entry["kondisi_lama"] == entry["kondisi_baru"]
    assert "nilai perolehan: 1234567890123.45 → 2500000.00" in entry["catatan"]
    assert "Alasan: Salah ketik nilai" in entry["catatan"]
    assert entry["created_by"] == "admin-test"
    current = {**fixed, "alasan": "uji", "version": 2}
    assert (await client.put(url, json={**current, "version": 1})).status_code == 409
    assert (await client.put(url, json=current)).status_code == 422  # tidak ada perubahan
    assert (await client.put(url, json={**current, "nomor_register": "000002"})).status_code == 409
    assert (await client.put(url, json={**current, "kib": "C"})).status_code == 422
    assert (await client.put(url, json={**current, "kondisi_kode": 2})).status_code == 422
    assert (await client.put(f"{BASE}/missing", json=current)).status_code == 404
    listed = (await client.get(f"{BASE}?search=000002")).json()
    assert listed["data"][0]["id"] == other["id"] and listed["data"][0]["version"] == 1
