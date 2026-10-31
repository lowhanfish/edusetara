"""Master Sekolah Meta model (Bridge/Extension entity for simpeg.unit_kerja)."""

from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.sql import func

from app.db.base import Base


class MasterSekolahMeta(Base):
    """
    Metadata extension for school units from SIMPEG.
    Provides categorization (jenjang, status_sekolah, NPSN, akreditasi, wilayah)
    without modifying simpeg.unit_kerja or duplicating school identity.
    """

    __tablename__ = "master_sekolah_meta"

    unit_kerja_id = Column(String(50), primary_key=True)
    jenjang = Column(String(20), nullable=False, index=True)  # PAUD, TK, SD, SMP, SATAP, PKBM
    status_sekolah = Column(
        String(20), nullable=False, default="NEGERI", index=True
    )  # NEGERI, SWASTA
    npsn = Column(String(20), nullable=True, index=True)
    akreditasi = Column(String(10), nullable=True)
    kecamatan = Column(String(100), nullable=True, index=True)
    desa_kelurahan = Column(String(100), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)

    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
