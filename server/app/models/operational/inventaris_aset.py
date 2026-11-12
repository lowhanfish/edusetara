"""Individual registered BMD assets and immutable condition observations."""

import uuid

from sqlalchemy import (
    JSON,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.sql import func

from app.db.base import Base


class InventarisAset(Base):
    __tablename__ = "inventaris_aset"
    __table_args__ = (
        UniqueConstraint(
            "upb_id",
            "kode_barang",
            "tahun_perolehan",
            "nomor_register",
            name="uq_inventaris_register",
        ),
    )

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    upb_id = Column(
        String(50),
        ForeignKey("master_aset_unit.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    kode_barang = Column(
        String(30),
        ForeignKey("master_aset_kode_barang.kode", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    nomor_register = Column(String(50), nullable=False)
    kib = Column(String(1), nullable=False, index=True)
    nama = Column(String(255), nullable=False)
    merk = Column(String(150), nullable=True)
    nomor_seri = Column(String(150), nullable=True)
    tahun_perolehan = Column(Integer, nullable=False, index=True)
    tanggal_perolehan = Column(Date, nullable=True)
    nilai_perolehan = Column(Numeric(20, 2), nullable=False)
    lokasi = Column(String(255), nullable=False)
    kondisi_kode = Column(
        Integer,
        ForeignKey("master_aset_kondisi_barang.kode", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    sumber_dana_id = Column(
        String(50), ForeignKey("master_sarpras_sumber_dana.id", ondelete="RESTRICT"), nullable=True
    )
    keterangan = Column(Text, nullable=True)
    version = Column(Integer, nullable=False, default=1)
    created_by = Column(String(100), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class RiwayatKondisiAset(Base):
    __tablename__ = "inventaris_aset_riwayat_kondisi"
    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    aset_id = Column(
        String(50),
        ForeignKey("inventaris_aset.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    kondisi_lama = Column(JSON, nullable=True)
    kondisi_baru = Column(JSON, nullable=False)
    catatan = Column(Text, nullable=False)
    foto_url = Column(String(255), nullable=True)
    version = Column(Integer, nullable=False)
    created_by = Column(String(100), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
