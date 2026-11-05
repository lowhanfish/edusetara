"""Document relationships and verification use an isolated test database."""

from types import SimpleNamespace

import pytest
import pytest_asyncio

from app.api.deps import get_current_user
from app.api.v1.endpoints.admin.usulan.rekonsiliasi_bosp import rekonsiliasi_bosp as endpoints
from app.models.master.pelengkap import MasterKategori
from app.services import upload_service
from main import app

BASE = "/api/v1/admin/usulan/rekonsiliasi-bosp"
VERIFY = "/api/v1/admin/verifikasi/rekonsiliasi-bosp/usulan"


@pytest_asyncio.fixture
async def setup_documents(client, db_session, tmp_path, monkeypatch):
    user = SimpleNamespace(username="operator-test", role=SimpleNamespace(name="operator"))
    app.dependency_overrides[get_current_user] = lambda: user
    monkeypatch.setattr(upload_service, "BASE_UPLOAD_DIR", tmp_path)
    monkeypatch.setattr(endpoints, "BASE_UPLOAD_DIR", tmp_path)
    db_session.add(MasterKategori(id="bku", uraian="Buku Kas Umum"))
    await db_session.commit()
    response = await client.post(
        f"{BASE}/create", json={"sekolah": "SEKOLAH UJI", "tahun": "2026", "tahap": "Semester I"}
    )
    assert response.status_code == 201
    upload = await client.post(
        f"{BASE}/upload", files={"file": ("bku.pdf", b"%PDF-1.4\n", "application/pdf")}
    )
    assert upload.status_code == 200
    return (
        response.json(),
        {"kategori_id": "bku", "uraian": "BKU PDF", "file": upload.json()["file_url"]},
        user,
    )


@pytest.mark.asyncio
async def test_repeat_categories_and_parent_boundary(client, setup_documents):
    proposal, body, _ = setup_documents
    url = f"{BASE}/{proposal['id']}/dokumen"
    first = await client.post(url, json=body)
    second = await client.post(url, json={**body, "uraian": "BKU Excel"})
    assert first.status_code == second.status_code == 201
    assert first.json()["id"] != second.json()["id"]
    documents = (await client.get(url)).json()
    assert len(documents) == 2
    assert all(item["kategori_id"] == "bku" and not item["cek_benar"] for item in documents)
    other = (await client.post(f"{BASE}/create", json={"sekolah": "LAIN", "tahun": "2026"})).json()
    document_id = first.json()["id"]
    for method in ("put", "delete"):
        kwargs = {"json": body} if method == "put" else {}
        response = await getattr(client, method)(
            f"{BASE}/{other['id']}/dokumen/{document_id}", **kwargs
        )
        assert response.status_code == 404
    assert (await client.delete(f"{url}/{document_id}")).status_code == 200
    remaining = (await client.get(url)).json()
    assert [item["id"] for item in remaining] == [second.json()["id"]]


@pytest.mark.asyncio
async def test_independent_admin_checks_reset_when_document_changes(client, setup_documents):
    proposal, body, user = setup_documents
    base = f"{BASE}/{proposal['id']}/dokumen"
    first = (await client.post(base, json=body)).json()
    second = (await client.post(base, json=body)).json()
    url = f"{base}/{first['id']}"
    verify_url = f"{VERIFY}/{proposal['id']}/dokumen/{first['id']}/verifikasi"
    assert (await client.patch(verify_url, json={"cek_benar": True})).status_code == 403
    assert (await client.get(f"{VERIFY}/read")).status_code == 403
    assert (await client.get(f"{VERIFY}/{proposal['id']}/dokumen")).status_code == 403
    assert (await client.patch(f"{url}/verifikasi", json={"cek_benar": True})).status_code == 404
    user.role.name = "admin"
    listing = await client.get(f"{VERIFY}/read")
    assert listing.status_code == 200
    assert listing.json()["data"][0]["id"] == proposal["id"]
    detail = await client.get(f"{VERIFY}/{proposal['id']}/dokumen")
    assert detail.status_code == 200
    assert {item["id"] for item in detail.json()} == {first["id"], second["id"]}
    approved = await client.patch(verify_url, json={"cek_benar": True, "cek_lengkap": True})
    assert approved.status_code == 200
    assert approved.json()["cek_benar"] and approved.json()["cek_lengkap"]
    rows = (await client.get(base)).json()
    assert not next(item for item in rows if item["id"] == second["id"])["cek_benar"]
    assert (await client.put(url, json=body)).json()["cek_benar"]
    edited = await client.put(url, json={**body, "uraian": "BKU diperbaiki"})
    assert edited.status_code == 200
    assert not edited.json()["cek_benar"] and not edited.json()["cek_lengkap"]


@pytest.mark.asyncio
async def test_invalid_references_files_and_unauthenticated_access(client, setup_documents):
    proposal, body, _ = setup_documents
    url = f"{BASE}/{proposal['id']}/dokumen"
    for invalid in (
        {"kategori_id": "missing"},
        {"uraian": "   "},
        {"file": "/uploads/rekonsiliasi-bosp/../../etc/passwd"},
        {"file": "missing.pdf"},
        {"cek_benar": True},
    ):
        assert (await client.post(url, json={**body, **invalid})).status_code == 422
    assert (await client.post(f"{BASE}/missing/dokumen", json=body)).status_code == 404
    assert (await client.get(url)).json() == []
    app.dependency_overrides.pop(get_current_user)
    assert (await client.get(url)).status_code == 401


@pytest.mark.asyncio
async def test_proposal_screen_cannot_set_status(client, setup_documents):
    proposal, _, _ = setup_documents
    update = await client.put(f"{BASE}/update/{proposal['id']}", json={"status": "Disetujui"})
    assert update.status_code == 403
    create = await client.post(f"{BASE}/create", json={"sekolah": "UJI", "status": "Disetujui"})
    assert create.status_code == 403
