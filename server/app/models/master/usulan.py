"""Master Usulan models (Triwulan, Jenis Penerima, Kelas Penerima)."""

import uuid

from sqlalchemy import Column, DateTime, String, Text
from sqlalchemy.orm import declared_attr, synonym
from sqlalchemy.sql import func

from app.db.base import Base


class UsulanDescriptionMixin:
    keterangan = Column(Text, nullable=True)

    @declared_attr
    def title(cls):
        return synonym("uraian")

    @declared_attr
    def desc(cls):
        return synonym("keterangan")


class MasterUsulanTriwulan(Base, UsulanDescriptionMixin):
    """Master Triwulan (contoh: 'Triwulan I (Januari - Maret)')."""

    __tablename__ = "master_usulan_triwulan"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    uraian = Column(String(150), nullable=False, unique=True)
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class MasterUsulanJenisPenerima(Base, UsulanDescriptionMixin):
    """Master Jenis Penerima Tunjangan (contoh: 'Tunjangan Profesi Guru (TPG) Sertifikasi')."""

    __tablename__ = "master_usulan_jenis_penerima"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    uraian = Column(String(150), nullable=False, unique=True)
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class MasterUsulanKelasPenerima(Base, UsulanDescriptionMixin):
    """Master Kelas Penerima (contoh: 'Golongan IV / Pembina (ASN Senior)')."""

    __tablename__ = "master_usulan_kelas_penerima"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    uraian = Column(String(150), nullable=False, unique=True)
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
