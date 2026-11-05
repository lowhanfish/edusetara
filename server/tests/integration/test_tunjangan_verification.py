"""Admin decisions are linked to real proposals and read-only to applicants."""

from datetime import datetime
from types import SimpleNamespace

import pytest
import pytest_asyncio
from sqlalchemy import func, select

from app.api.deps import get_current_user
from app.models.operational.verifikasi import VerifikasiTunjanganGuru
from main import app

USULAN = "/api/v1/admin/usulan/tunjangan-guru"
VERIFY = "/api/v1/admin/verifikasi/tunjangan-guru"


@pytest_asyncio.fixture
async def proposal(client):
    user = SimpleNamespace(username="operator", role=SimpleNamespace(name="operator"))
    app.dependency_overrides[get_current_user] = lambda: user
    response = await client.post(
        f"{USULAN}/create",
        json={"unit_kerja": "SD UJI", "nip": "123", "jml_guru": 2, "file": "lampiran.pdf"},
    )
    assert response.status_code == 201
    return response.json(), user


@pytest.mark.asyncio
async def test_only_admin_can_verify_and_applicant_reads_same_result(client, db_session, proposal):
    item, user = proposal
    url = f"{VERIFY}/usulan/{item['id']}/verifikasi"
    assert item["status_verifikasi"] == "Menunggu"
    assert (await client.patch(url, json={"status": "Disetujui"})).status_code == 403
    assert (await client.get(f"{VERIFY}/usulan/read")).status_code == 403
    assert (
        await client.post(f"{VERIFY}/create", json={"usulan_id": item["id"], "status": "Disetujui"})
    ).status_code == 403
    user.role.name = "admin"
    listing = await client.get(f"{VERIFY}/usulan/read?search=SD%20UJI")
    assert listing.status_code == 200 and listing.json()["data"][0]["id"] == item["id"]
    response = await client.patch(url, json={"status": "Perbaikan", "pesan": "Lengkapi SKTP"})
    assert response.status_code == 200
    user.role.name = "operator"
    read = (await client.get(f"{USULAN}/{item['id']}")).json()
    assert read["status_verifikasi"] == "Perbaikan" and read["catatan"] == "Lengkapi SKTP"
    assert read["file"] == "lampiran.pdf" and read["jml_guru"] == 2
    listing = (await client.get(f"{USULAN}/read")).json()
    assert listing["data"][0]["status_verifikasi"] == "Perbaikan"
    user.role.name = "admin"
    approved = await client.patch(url, json={"status": "Disetujui", "pesan": "Sesuai"})
    assert approved.json()["status_verifikasi"] == "Disetujui"
    assert await db_session.scalar(select(func.count()).select_from(VerifikasiTunjanganGuru)) == 1


@pytest.mark.asyncio
async def test_status_injection_is_rejected_in_user_create_and_update(client, proposal):
    item, _ = proposal
    for field in ("status", "status_verifikasi", "pesan", "catatan", "verifikasi_id"):
        assert (await client.post(f"{USULAN}/create", json={field: "Disetujui"})).status_code == 422
        assert (
            await client.put(f"{USULAN}/update/{item['id']}", json={field: "Disetujui"})
        ).status_code == 422
    assert (await client.get(f"{USULAN}/{item['id']}")).json()["status_verifikasi"] == "Menunggu"


@pytest.mark.asyncio
async def test_invalid_verification_and_missing_proposal_do_not_create_decision(
    client, db_session, proposal
):
    item, user = proposal
    user.role.name = "superadmin"
    url = f"{VERIFY}/usulan/{item['id']}/verifikasi"
    for body in (
        {"status": "unknown"},
        {"status": None},
        {"status": "Disetujui", "usulan_id": "other"},
    ):
        assert (await client.patch(url, json=body)).status_code == 422
    assert (
        await client.patch(f"{VERIFY}/usulan/missing/verifikasi", json={"status": "Disetujui"})
    ).status_code == 404
    assert await db_session.scalar(select(func.count()).select_from(VerifikasiTunjanganGuru)) == 0
    app.dependency_overrides.pop(get_current_user)
    assert (await client.patch(url, json={"status": "Disetujui"})).status_code == 401


@pytest.mark.asyncio
async def test_legacy_verification_is_visible_and_updated_without_losing_relationship(
    client, db_session, proposal
):
    item, user = proposal
    db_session.add_all(
        [
            VerifikasiTunjanganGuru(
                id="old", usulan_id=item["id"], status="Ditolak", updated_at=datetime(2025, 1, 1)
            ),
            VerifikasiTunjanganGuru(
                id="latest",
                usulan_id=item["id"],
                status="Perbaikan",
                pesan="Catatan lama",
                updated_at=datetime(2026, 1, 1),
            ),
        ]
    )
    await db_session.commit()
    read = (await client.get(f"{USULAN}/{item['id']}")).json()
    assert read["verifikasi_id"] == "latest" and read["catatan"] == "Catatan lama"
    user.role.name = "admin"
    response = await client.patch(
        f"{VERIFY}/usulan/{item['id']}/verifikasi",
        json={"status": "Disetujui", "pesan": "Sudah diperbaiki"},
    )
    assert response.json()["verifikasi_id"] == "latest"
    assert response.json()["status_verifikasi"] == "Disetujui"
