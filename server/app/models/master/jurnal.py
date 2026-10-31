"""Master Jurnal models (Bahan Ajar, Materi Ajar, Kelas, Mata Pelajaran)."""

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.master.base_master import MasterBaseMixin


class MasterJurnalBahanAjar(Base, MasterBaseMixin):
    """Master Bahan Ajar untuk modul Jurnal."""

    __tablename__ = "master_jurnal_bahan_ajar"


class MasterJurnalMateriAjar(Base, MasterBaseMixin):
    """Master Materi Ajar untuk modul Jurnal."""

    __tablename__ = "master_jurnal_materi_ajar"


class MasterJurnalKelas(Base, MasterBaseMixin):
    """Master Tingkat Kelas (contoh: 'Kelas I (Satu)')."""

    __tablename__ = "master_jurnal_kelas"

    # Relasi ke mata pelajaran
    mata_pelajaran = relationship(
        "MasterJurnalMataPelajaran",
        back_populates="kelas",
        cascade="all, delete-orphan",
    )


class MasterJurnalMataPelajaran(Base, MasterBaseMixin):
    """Master Mata Pelajaran dengan referensi tingkat kelas."""

    __tablename__ = "master_jurnal_mata_pelajaran"

    kelas_id = Column(
        String(50),
        ForeignKey("master_jurnal_kelas.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Relasi eager-load ke kelas
    kelas = relationship("MasterJurnalKelas", back_populates="mata_pelajaran", lazy="joined")
