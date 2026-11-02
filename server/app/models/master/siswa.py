"""Master Siswa model for student registry."""

import uuid

from sqlalchemy import JSON, Boolean, Column, Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class MasterSiswa(Base):
    """Master Peserta Didik Aktif."""

    __tablename__ = "master_siswa"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    nama = Column(String(150), nullable=False)
    nisn = Column(String(20), unique=True, nullable=True, index=True)
    nik = Column(String(20), unique=True, nullable=True, index=True)
    jns_kelamin = Column(String(20), nullable=True)
    kelas_id = Column(
        String(50),
        ForeignKey("master_jurnal_kelas.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    tmp_lahir = Column(String(100), nullable=True)
    tgl_lahir = Column(Date, nullable=True)
    agama = Column(String(50), nullable=True)
    alamat = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=True, default=True, server_default="1")
    source_data = Column(JSON, nullable=True)
    nama_ayah = Column(String(150), nullable=True)
    nama_ibu = Column(String(150), nullable=True)
    nama_wali = Column(String(150), nullable=True)
    file = Column(String(255), nullable=True)

    # Audit & Scope
    nip = Column(String(50), nullable=True, index=True)
    unit_kerja_id = Column(String(50), nullable=True, index=True)
    unit_kerja = Column(String(150), nullable=True, index=True)
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relasi ke data master kelas (eager loaded)
    kelas = relationship("MasterJurnalKelas", lazy="joined")
