"""Descriptions and incomplete reference records survive database round trips."""

import pytest

from app.models.master import MasterJurnalBahanAjar, MasterSiswa, MasterUsulanTriwulan
from app.services.crud_service import CRUDBase


@pytest.mark.asyncio
@pytest.mark.parametrize("model", [MasterJurnalBahanAjar, MasterUsulanTriwulan])
async def test_master_description_round_trip(model, db_session, client):
    crud = CRUDBase(model)
    row = await crud.create(db_session, obj_in={"title": "Referensi", "desc": "Keterangan awal"})
    row_id = row.id
    db_session.expunge_all()
    stored = await crud.get(db_session, row_id)
    assert stored.title == "Referensi"
    assert stored.desc == "Keterangan awal"
    await crud.update(db_session, id=row_id, obj_in={"desc": "Keterangan diperbarui"})
    db_session.expunge_all()
    assert (await crud.get(db_session, row_id)).desc == "Keterangan diperbarui"


@pytest.mark.asyncio
async def test_incomplete_student_read_preserves_missing_identifiers(db_session, client):
    db_session.add(
        MasterSiswa(id="REF-STUDENT-1", nama="A", is_active=False, source_data={"NISN": "0"})
    )
    await db_session.commit()
    response = await client.get("/api/v1/admin/master/siswa/read")
    assert response.status_code == 200
    student = response.json()["data"][0]
    assert student["nama"] == "A"
    assert student["nisn"] is None
    assert student["nik"] is None
    assert student["tgl_lahir"] is None
    assert student["is_active"] is False
