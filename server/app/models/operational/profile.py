"""Operational models for Profile Dinas (Renstra, Tugas Fungsi, Visi Misi)."""

from sqlalchemy import Column, String, Text
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class ProfileRenstra(Base, OperationalBaseMixin):
    __tablename__ = "profile_renstra"

    isi = Column(Text, nullable=False)
    file = Column(String(255), nullable=True)


class ProfileTugasFungsi(Base, OperationalBaseMixin):
    __tablename__ = "profile_tugas_fungsi"

    isi = Column(Text, nullable=False)
    file = Column(String(255), nullable=True)


class ProfileVisiMisi(Base, OperationalBaseMixin):
    __tablename__ = "profile_visi_misi"

    isi = Column(Text, nullable=False)
    file = Column(String(255), nullable=True)
