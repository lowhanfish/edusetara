"""Operational models for Verifikasi."""

from sqlalchemy import Column, String, Text
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class VerifikasiTunjanganGuru(Base, OperationalBaseMixin):
    __tablename__ = "verifikasi_tunjangan_guru"

    usulan_id = Column(String(50), nullable=True, index=True)
    status = Column(String(50), nullable=True)  # Disetujui, Ditolak, Menunggu
    pesan = Column(Text, nullable=True)


class VerifikasiRekonsiliasiBosp(Base, OperationalBaseMixin):
    __tablename__ = "verifikasi_rekonsiliasi_bosp"

    usulan_id = Column(String(50), nullable=True, index=True)
    status_1 = Column(String(50), nullable=True)
    pesan_1 = Column(Text, nullable=True)
