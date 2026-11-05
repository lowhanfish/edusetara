"""Expose the latest admin decision on each teacher allowance proposal."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.operational.verifikasi import VerifikasiTunjanganGuru


async def latest_verification(db: AsyncSession, usulan_id: str):
    return await db.scalar(
        select(VerifikasiTunjanganGuru)
        .where(VerifikasiTunjanganGuru.usulan_id == usulan_id)
        .order_by(VerifikasiTunjanganGuru.updated_at.desc(), VerifikasiTunjanganGuru.id.desc())
        .limit(1)
    )


async def attach_verifications(db: AsyncSession, proposals):
    if not proposals:
        return proposals
    results = await db.scalars(
        select(VerifikasiTunjanganGuru)
        .where(VerifikasiTunjanganGuru.usulan_id.in_([item.id for item in proposals]))
        .order_by(VerifikasiTunjanganGuru.updated_at.desc(), VerifikasiTunjanganGuru.id.desc())
    )
    latest = {}
    for decision in results:
        latest.setdefault(decision.usulan_id, decision)
    for proposal in proposals:
        decision = latest.get(proposal.id)
        proposal.status_verifikasi = (decision.status or "Menunggu") if decision else "Menunggu"
        proposal.catatan = decision.pesan if decision else None
        proposal.verifikasi_id = decision.id if decision else None
    return proposals
