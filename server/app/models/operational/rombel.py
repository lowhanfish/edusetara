"""Operational models for Rombel (Rombongan Belajar)."""

from sqlalchemy import Column, String
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class RombelBaseMixin(OperationalBaseMixin):
    kategori = Column(String(100), nullable=True)
    jns_rombel = Column(String(100), nullable=True)
    tgkt_pendidikan = Column(String(50), nullable=True)
    kurikulum = Column(String(100), nullable=True)
    nama = Column(String(150), nullable=False)
    wali_kelas = Column(String(150), nullable=True)
    ruang_kelas = Column(String(150), nullable=True)


class RombelPaud(Base, RombelBaseMixin):
    __tablename__ = "rombel_paud"


class RombelSd(Base, RombelBaseMixin):
    __tablename__ = "rombel_sd"


class RombelSmp(Base, RombelBaseMixin):
    __tablename__ = "rombel_smp"
