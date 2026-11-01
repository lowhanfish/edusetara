"""Operational models for Kegiatan Sekolah, Komunitas Belajar, and Piagam Sertifikat."""

from sqlalchemy import Column, String, Text
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class KegiatanSekolah(Base, OperationalBaseMixin):
    __tablename__ = "kegiatan_sekolah"

    judul = Column(String(255), nullable=False)
    deskripsi = Column(Text, nullable=True)
    tanggal = Column(String(50), nullable=True)
    tahun = Column(String(20), nullable=True)
    file = Column(String(255), nullable=True)
    link = Column(String(255), nullable=True)


class KomunitasBelajar(Base, OperationalBaseMixin):
    __tablename__ = "komunitas_belajar"

    uraian = Column(String(255), nullable=False)
    jns_kegiatan = Column(String(100), nullable=True)
    deskripsi = Column(Text, nullable=True)
    file = Column(String(255), nullable=True)
    type = Column(String(50), nullable=True)


class PiagamSertifikat(Base, OperationalBaseMixin):
    __tablename__ = "piagam_sertifikat"

    kegiatan = Column(String(255), nullable=False)
    penyelenggara = Column(String(200), nullable=True)
    tahun = Column(String(20), nullable=True)
    tempat_pelaksana = Column(String(200), nullable=True)
    sebagai = Column(String(150), nullable=True)
    file = Column(String(255), nullable=True)
