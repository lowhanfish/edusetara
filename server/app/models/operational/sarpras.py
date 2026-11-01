"""Operational models for Sarana dan Prasarana."""

from sqlalchemy import Column, Integer, Numeric, String, Text
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class SarprasTanah(Base, OperationalBaseMixin):
    """Bidang tanah satuan pendidikan."""
    __tablename__ = "sarpras_tanah"

    title = Column(String(100), nullable=False)  # Luas tanah (m2) / deskripsi
    file = Column(String(255), nullable=True)     # Dokumen bukti kepemilikan/sertifikat
    file_type = Column(String(50), nullable=True) # pdf, jpg, png


class SarprasBangunan(Base, OperationalBaseMixin):
    """Fisik unit gedung sekolah."""
    __tablename__ = "sarpras_bangunan"

    nama = Column(String(200), nullable=False)
    luas = Column(String(100), nullable=True)
    kepemilikan_id = Column(String(50), nullable=True, index=True)
    tahun = Column(String(20), nullable=True)
    persentase = Column(Integer, nullable=True, default=0)
    kondisi_id = Column(String(50), nullable=True, index=True)
    jns_bantuan_id = Column(String(50), nullable=True, index=True)
    sumber_id = Column(String(50), nullable=True, index=True)


class SarprasRuang(Base, OperationalBaseMixin):
    """Unit ruangan spesifik di dalam bangunan."""
    __tablename__ = "sarpras_ruang"

    bangunan_id = Column(String(50), nullable=True, index=True)
    kelas_id = Column(String(50), nullable=True, index=True)
    nama = Column(String(200), nullable=False)
    luas = Column(String(100), nullable=True)
    kondisi_id = Column(String(50), nullable=True, index=True)


class SarprasPeralatan(Base, OperationalBaseMixin):
    """Inventaris barang/peralatan/aset sekolah."""
    __tablename__ = "sarpras_peralatan"

    ruang_id = Column(String(50), nullable=True, index=True)
    nama = Column(String(200), nullable=False)
    jml_alat = Column(Integer, nullable=True, default=1)
    kondisi_id = Column(String(50), nullable=True, index=True)
    tahun = Column(Integer, nullable=True)
    sumber_id = Column(String(50), nullable=True, index=True)
