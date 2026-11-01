"""Operational models for Jurnal V2."""

from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class JurnalGuruKelas(Base, OperationalBaseMixin):
    __tablename__ = "jurnal_guru_kelas"

    sekolah = Column(String(200), nullable=True)
    tema = Column(String(255), nullable=False)
    materi_pokok = Column(String(255), nullable=False)
    pertemuan_ke = Column(Integer, nullable=True, default=1)
    tgl = Column(String(50), nullable=True)
    model_pembelajaran = Column(String(100), nullable=True)
    metode_pembelajaran = Column(String(100), nullable=True)
    kegiatan = Column(Text, nullable=True)
    penilaian = Column(String(100), nullable=True)
    siswa_hadir = Column(Integer, nullable=True, default=0)
    siswa_izin = Column(Integer, nullable=True, default=0)
    siswa_sakit = Column(Integer, nullable=True, default=0)
    siswa_alpa = Column(Integer, nullable=True, default=0)
    persentase = Column(Integer, nullable=True, default=100)
    keterangan = Column(Text, nullable=True)
    file = Column(String(255), nullable=True)


class JurnalKepalaSekolah(Base, OperationalBaseMixin):
    __tablename__ = "jurnal_kepala_sekolah"

    uraian = Column(String(255), nullable=False)
    target = Column(String(255), nullable=True)
    hasil = Column(Text, nullable=True)
    keterlibatan = Column(String(255), nullable=True)
    tgl = Column(String(50), nullable=True)
    keterangan = Column(Text, nullable=True)
    file = Column(String(255), nullable=True)


class JurnalPengawas(Base, OperationalBaseMixin):
    __tablename__ = "jurnal_pengawas"

    kepsek = Column(String(200), nullable=True)
    pendampingan_id = Column(String(50), nullable=True, index=True)
    temuan_akademik = Column(Text, nullable=True)
    temuan_manajerial = Column(Text, nullable=True)
    tindak_lanjut = Column(Text, nullable=True)
    tugas_id = Column(String(50), nullable=True, index=True)
    tgl = Column(String(50), nullable=True)
    file = Column(String(255), nullable=True)


class JurnalBk(Base, OperationalBaseMixin):
    __tablename__ = "jurnal_bk"

    nm_siswa = Column(String(200), nullable=False)
    kelas_id = Column(String(50), nullable=True, index=True)
    tgl = Column(String(50), nullable=True)
    materi_layanan = Column(String(255), nullable=True)
    permasalahan = Column(Text, nullable=True)
    mdl_kegiatan_id = Column(String(50), nullable=True, index=True)
    jns_layanan_id = Column(String(50), nullable=True, index=True)
    hasil = Column(Text, nullable=True)
    rnc_tindak_lanjut = Column(Text, nullable=True)
    keterangan = Column(Text, nullable=True)
    file = Column(String(255), nullable=True)
