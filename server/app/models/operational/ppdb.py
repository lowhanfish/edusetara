"""Operational models for PPDB and Kuota PPDB."""

from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class PpdbEntryBase(OperationalBaseMixin):
    nama = Column(String(200), nullable=False)
    nm_panggilan = Column(String(100), nullable=True)
    jns_kelamin = Column(String(20), nullable=True)
    nisn = Column(String(50), nullable=True, index=True)
    nik = Column(String(50), nullable=True, index=True)
    tmp_lahir = Column(String(100), nullable=True)
    tgl_lahir = Column(String(50), nullable=True)
    agama = Column(String(50), nullable=True)
    anak_keberapa = Column(Integer, nullable=True)
    jml_saudara = Column(Integer, nullable=True)
    kecamatan_id = Column(String(50), nullable=True, index=True)
    des_kel_id = Column(String(50), nullable=True, index=True)
    alamat = Column(Text, nullable=True)
    rt_rw = Column(String(50), nullable=True)
    dusun = Column(String(100), nullable=True)
    kode_pos = Column(String(20), nullable=True)
    tmp_tinggal = Column(String(100), nullable=True)
    lainnya = Column(String(255), nullable=True)
    moda_transportasi = Column(String(100), nullable=True)
    file = Column(String(255), nullable=True)
    
    # Orang Tua - Ayah
    nama_ayah = Column(String(150), nullable=True)
    nik_ayah = Column(String(50), nullable=True)
    thn_lahir_ayah = Column(String(20), nullable=True)
    pendidikan_ayah = Column(String(100), nullable=True)
    pekerjaan_ayah = Column(String(100), nullable=True)
    penghasilan_ayah = Column(String(100), nullable=True)

    # Orang Tua - Ibu
    nama_ibu = Column(String(150), nullable=True)
    nik_ibu = Column(String(50), nullable=True)
    thn_lahir_ibu = Column(String(20), nullable=True)
    pendidikan_ibu = Column(String(100), nullable=True)
    pekerjaan_ibu = Column(String(100), nullable=True)
    penghasilan_ibu = Column(String(100), nullable=True)

    # Wali
    nama_wali = Column(String(150), nullable=True)
    nik_wali = Column(String(50), nullable=True)
    thn_lahir_wali = Column(String(20), nullable=True)
    pendidikan_wali = Column(String(100), nullable=True)
    pekerjaan_wali = Column(String(100), nullable=True)
    penghasilan_wali = Column(String(100), nullable=True)

    kategori = Column(String(100), nullable=True)


class PpdbPaud(Base, PpdbEntryBase):
    __tablename__ = "ppdb_paud"


class PpdbSd(Base, PpdbEntryBase):
    __tablename__ = "ppdb_sd"


class PpdbSmp(Base, PpdbEntryBase):
    __tablename__ = "ppdb_smp"


class KuotaPpdb(Base, OperationalBaseMixin):
    __tablename__ = "kuota_ppdb"

    unit_kerja_id = Column(String(50), nullable=True, index=True)
    nama_sekolah = Column(String(200), nullable=False)
    jenjang = Column(String(50), nullable=True)
    jml_ruang_tersedia = Column(Integer, nullable=True, default=0)
    standar_maks_rombel = Column(Integer, nullable=True, default=28)
    total_daya_tampung = Column(Integer, nullable=True, default=0)
    siswa_terdaftar = Column(Integer, nullable=True, default=0)
    sisa_kuota = Column(Integer, nullable=True, default=0)
    status_kuota = Column(String(50), nullable=True, default="Tersedia")
