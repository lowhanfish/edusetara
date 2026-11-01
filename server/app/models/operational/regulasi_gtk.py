"""Operational models for Regulasi dan Info GTK."""

from sqlalchemy import Column, String, Text
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class GtkPengumuman(Base, OperationalBaseMixin):
    __tablename__ = "gtk_pengumuman"

    judul = Column(String(255), nullable=False)
    deskripsi = Column(Text, nullable=True)
    file = Column(String(255), nullable=True)
    file_type = Column(String(50), nullable=True)


class GtkModulPelatihan(Base, OperationalBaseMixin):
    __tablename__ = "gtk_modul_pelatihan"

    judul = Column(String(255), nullable=False)
    deskripsi = Column(Text, nullable=True)
    file = Column(String(255), nullable=True)
    file_type = Column(String(50), nullable=True)


class GtkRegulasi(Base, OperationalBaseMixin):
    __tablename__ = "gtk_regulasi"

    judul = Column(String(255), nullable=False)
    deskripsi = Column(Text, nullable=True)
    tahun = Column(String(20), nullable=True)
    file = Column(String(255), nullable=True)
    file_type = Column(String(50), nullable=True)
