"""Operational models for Usulan Sekolah."""

from sqlalchemy import Boolean, Column, ForeignKey, JSON, Integer, Numeric, String, Text
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class UsulanTunjanganGuru(Base, OperationalBaseMixin):
    """Usulan tunjangan guru (TPG, TKG, Tamsil)."""
    __tablename__ = "usulan_tunjangan_guru"

    triwulan_id = Column(String(50), nullable=True, index=True)
    jenis_id = Column(String(50), nullable=True, index=True)
    kelas_id = Column(String(50), nullable=True, index=True)
    jml_guru = Column(Integer, nullable=True, default=1)
    nominal = Column(Numeric(15, 2), nullable=True)
    file = Column(String(255), nullable=True)
    file_type = Column(String(50), nullable=True)


class UsulanPipPendukung(Base, OperationalBaseMixin):
    """Dokumen data pendukung bantuan PIP."""
    __tablename__ = "usulan_pip_pendukung"

    uraian = Column(String(255), nullable=False)
    jenjang_id = Column(String(50), nullable=True, index=True)
    nominal = Column(Numeric(15, 2), nullable=True)
    tahun = Column(String(20), nullable=True)
    file = Column(String(255), nullable=True)


class UsulanPipPenerima(Base, OperationalBaseMixin):
    """Data siswa penerima bantuan PIP."""
    __tablename__ = "usulan_pip_penerima"

    pendukung_id = Column(String(50), nullable=True, index=True)
    siswa_id = Column(String(50), nullable=True, index=True)


class UsulanAssessment(Base, OperationalBaseMixin):
    """Usulan data asesmen/ANBK sekolah."""
    __tablename__ = "usulan_assessment"

    status_sekolah_id = Column(String(50), nullable=True, index=True)
    jml_siswa = Column(Integer, nullable=True, default=0)
    jml_laki = Column(Integer, nullable=True, default=0)
    jml_perempuan = Column(Integer, nullable=True, default=0)
    kurikulum_k13 = Column(String(50), nullable=True)
    kurikulum_kurmer = Column(String(50), nullable=True)
    file = Column(String(255), nullable=True)


class UsulanRekonsiliasiBosp(Base, OperationalBaseMixin):
    """Usulan rekonsiliasi SPJ dana BOSP."""
    __tablename__ = "usulan_rekonsiliasi_bosp"

    sekolah = Column(String(255), nullable=True, index=True)
    tahap = Column(String(50), nullable=True)
    tahun = Column(String(20), nullable=True)
    nominal_dana = Column(Numeric(15, 2), nullable=True)
    dokumen_spj = Column(JSON, nullable=True)
    kategori_spj = Column(String(255), nullable=True)
    file_bku = Column(String(255), nullable=True)
    file_rekening = Column(String(255), nullable=True)
    file_sptjm = Column(String(255), nullable=True)
    status = Column(String(50), nullable=True)
    semester_id = Column(String(50), nullable=True, index=True)
    file = Column(String(255), nullable=True)



class UsulanRekonsiliasiBospDokumen(Base, OperationalBaseMixin):
    """One attachment and its verification within a BOSP proposal."""
    __tablename__ = "usulan_rekonsiliasi_bosp_dokumen"

    usulan_id = Column(String(50), ForeignKey("usulan_rekonsiliasi_bosp.id", ondelete="CASCADE"), nullable=False, index=True)
    kategori_id = Column(String(50), ForeignKey("master_kategori.id", ondelete="SET NULL"), nullable=True, index=True)
    kategori_nama = Column(String(255), nullable=False)
    uraian = Column(Text, nullable=False)
    file = Column(String(255), nullable=False)
    cek_benar = Column(Boolean, nullable=False, default=False, server_default="0")
    cek_lengkap = Column(Boolean, nullable=False, default=False, server_default="0")
