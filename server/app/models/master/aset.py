"""Master Aset models: reference data for Barang Milik Daerah (modeled on SIMDA BMD)."""

import uuid

from sqlalchemy import (
    Column,
    DateTime,
    Index,
    Integer,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.sql import func

from app.db.base import Base


class AsetMasterMixin:
    """Primary key and audit columns shared by every Master Aset table."""

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class MasterAsetKodeBarang(Base, AsetMasterMixin):
    """Kode barang Permendagri 108/2016 (SIMDA: Ref_Rek0..5_108), 1-7 segmen."""

    __tablename__ = "master_aset_kode_barang"

    kode = Column(String(30), nullable=False, unique=True)  # mis. 01.03.02.05.01.05.12
    uraian = Column(String(255), nullable=False)
    keterangan = Column(Text, nullable=True)
    level = Column(SmallInteger, nullable=False, index=True)  # jumlah segmen kode
    kode_induk = Column(String(30), nullable=True, index=True)


class MasterAsetMetodePenyusutan(Base, AsetMasterMixin):
    """Metode penyusutan (SIMDA: Ref_Metode)."""

    __tablename__ = "master_aset_metode_penyusutan"

    kode = Column(Integer, nullable=False, unique=True)
    nama = Column(String(100), nullable=False)
    keterangan = Column(Text, nullable=True)


class MasterAsetMasaManfaat(Base, AsetMasterMixin):
    """Masa manfaat per sub rincian objek, per tahun dan metode (SIMDA: Ref_Penyusutan)."""

    __tablename__ = "master_aset_masa_manfaat"
    __table_args__ = (
        UniqueConstraint(
            "tahun_berlaku", "kode_barang", "metode_id", name="uq_master_aset_masa_manfaat"
        ),
        Index("ix_master_aset_masa_manfaat_kode", "kode_barang"),
    )

    tahun_berlaku = Column(Integer, nullable=False, index=True)
    kode_barang = Column(String(30), nullable=False)  # 6 segmen
    metode_id = Column(Integer, nullable=False)  # master_aset_metode_penyusutan.kode
    umur_tahun = Column(Integer, nullable=False)
    dasar_hukum = Column(String(255), nullable=True)


class MasterAsetKapitalisasiMasaManfaat(Base, AsetMasterMixin):
    """Tambahan masa manfaat menurut persentase biaya kapitalisasi (SIMDA: Ref_Kap_Umur)."""

    __tablename__ = "master_aset_kapitalisasi_masa_manfaat"
    __table_args__ = (
        UniqueConstraint(
            "kode_barang",
            "jenis_kapitalisasi",
            "batas_bawah_persen",
            "batas_atas_persen",
            name="uq_master_aset_kapitalisasi",
        ),
        Index("ix_master_aset_kapitalisasi_kode", "kode_barang"),
    )

    kode_barang = Column(String(30), nullable=False)  # 3-6 segmen
    batas_bawah_persen = Column(Integer, nullable=False)
    batas_atas_persen = Column(Integer, nullable=False)
    tambahan_umur_tahun = Column(Integer, nullable=False)
    jenis_kapitalisasi = Column(Integer, nullable=False)  # SIMDA Jn_Kap (1/2)


class MasterAsetKondisiBarang(Base, AsetMasterMixin):
    """Kondisi barang (SIMDA: Ref_Kondisi)."""

    __tablename__ = "master_aset_kondisi_barang"

    kode = Column(Integer, nullable=False, unique=True)
    uraian = Column(String(255), nullable=False)
    keterangan = Column(Text, nullable=True)


class MasterAsetStatusPemilik(Base, AsetMasterMixin):
    """Pemilik barang (SIMDA: Ref_Pemilik)."""

    __tablename__ = "master_aset_status_pemilik"

    kode = Column(Integer, nullable=False, unique=True)
    nama = Column(String(255), nullable=False)
    keterangan = Column(Text, nullable=True)
