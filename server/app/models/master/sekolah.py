"""Master Sekolah model (Sovereign master data for EduSetara)."""

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func

from app.db.base import Base


class MasterSekolah(Base):
    """
    Sovereign Master Sekolah table for EduSetara, sourced from official Dapodik data.
    Stores comprehensive identity, hierarchy, regional IDs from egov, and geospatial coordinates.
    """

    __tablename__ = "master_sekolah"

    id = Column(String(50), primary_key=True)
    npsn = Column(String(20), unique=True, nullable=False, index=True)
    nama_sekolah = Column(String(255), nullable=False, index=True)
    bentuk_pendidikan = Column(String(50), nullable=False, index=True)  # SD, SMP, TK, KB, PKBM, SKB, etc.
    status_sekolah = Column(String(20), nullable=False, default="NEGERI", index=True)  # NEGERI, SWASTA
    akreditasi = Column(String(35), nullable=True)  # A, B, C, TT, Tidak Terakreditasi

    # Relasi ke Master Wilayah (egov)
    kecamatan_id = Column(Integer, nullable=True, index=True)
    kecamatan = Column(String(100), nullable=True, index=True)
    desa_kelurahan_id = Column(Integer, nullable=True, index=True)
    desa_kelurahan = Column(String(100), nullable=True)

    # Lokasi & Detail
    alamat_jalan = Column(Text, nullable=True)
    dusun = Column(String(100), nullable=True)
    kode_pos = Column(String(10), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Relasi Masa Depan dengan SIMPEG
    simpeg_unit_kerja_id = Column(String(50), nullable=True, default=None, index=True)

    is_active = Column(Boolean, nullable=False, default=True)
    created_by = Column(String(100), nullable=True, default="system_import")
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
