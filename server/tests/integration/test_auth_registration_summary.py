"""Registration summaries must cover filtered results across all pages."""

import pytest

from app.api.v1.endpoints.admin.master.auth.registrasi import read_asn_registrations
from app.models.auth.user import User
from app.models.master.auth_rbac import AuthGroup


@pytest.mark.asyncio
async def test_registration_summary_before_pagination(db_session):
    db_session.add(AuthGroup(id="summary-group", title="Operator", level=2))
    await db_session.flush()
    for index in range(7):
        db_session.add(User(
            id=f"summary-{index}", username=f"summary-{index}",
            email=f"summary-{index}@example.com", password_hash="unused",
            full_name=f"ASN {index}", nip=f"900{index}",
            group_id="summary-group" if index < 4 else None,
            instansi_id="Sekolah A" if index < 4 else ("Sekolah B" if index < 6 else None),
        ))
    # Non-ASN accounts must not contribute to summaries.
    db_session.add(User(username="non-asn", email="non-asn@example.com",
                        password_hash="unused", full_name="Non ASN", instansi_id="Other"))
    await db_session.commit()

    async def read(skip=0, search="", group_id="all"):
        return await read_asn_registrations(
            skip=skip, limit=5, search=search, group_id=group_id,
            db=db_session, _=None,
        )

    first = await read()
    second = await read(skip=5)
    assert len(first["data"]) == 5
    assert len(second["data"]) == 2
    assert first["total"] == second["total"] == 7
    assert first["summary"] == second["summary"] == {
        "assigned": 4, "unassigned": 3, "units": 2,
    }
    assert (await read(group_id="unassigned"))["summary"] == {
        "assigned": 0, "unassigned": 3, "units": 1,
    }
    assert (await read(group_id="summary-group"))["summary"] == {
        "assigned": 4, "unassigned": 0, "units": 1,
    }
    assert (await read(search="Sekolah B"))["summary"] == {
        "assigned": 0, "unassigned": 2, "units": 1,
    }
    empty = await read(search="Tidak ditemukan")
    assert empty["total"] == 0
    assert empty["summary"] == {"assigned": 0, "unassigned": 0, "units": 0}
