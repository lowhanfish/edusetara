"""Operational models for Berita, Pengumuman, and Public Publish."""

from sqlalchemy import Boolean, Column, String, Text
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class Berita(Base, OperationalBaseMixin):
    __tablename__ = "berita"

    judul = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=True, index=True)
    sumber = Column(String(150), nullable=True)
    kategori = Column(String(100), nullable=True, default="Pendidikan")
    author = Column(String(150), nullable=True)
    deskripsi = Column(Text, nullable=True)
    isi = Column(Text, nullable=True)
    foto = Column(String(255), nullable=True)
    status = Column(String(50), nullable=True, default="Terbit")
    featured = Column(Boolean, nullable=True, default=False)


class PengumumanPublish(Base, OperationalBaseMixin):
    __tablename__ = "pengumuman_publish"

    nomor = Column(String(100), nullable=True)
    judul = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=True)
    kategori = Column(String(100), nullable=True)
    ringkasan = Column(Text, nullable=True)
    isi = Column(Text, nullable=True)
    tanggal = Column(String(50), nullable=True)
    target_audience = Column(String(150), nullable=True)
    deadline = Column(String(50), nullable=True)
    lampiran = Column(String(255), nullable=True)
    file = Column(String(255), nullable=True)
    is_important = Column(Boolean, nullable=True, default=False)
    status = Column(String(50), nullable=True, default="Aktif")


class LayananPublik(Base, OperationalBaseMixin):
    __tablename__ = "layanan_publik"

    nama_layanan = Column(String(255), nullable=False)
    kategori = Column(String(100), nullable=True)
    deskripsi = Column(Text, nullable=True)
    syarat = Column(Text, nullable=True)
    prosedur = Column(Text, nullable=True)
    penanggung_jawab = Column(String(150), nullable=True)
    waktu_layanan = Column(String(100), nullable=True)
    biaya = Column(String(100), nullable=True, default="Gratis")
    kontak = Column(String(100), nullable=True)
    status = Column(String(50), nullable=True, default="Aktif")


class PesanKontak(Base, OperationalBaseMixin):
    __tablename__ = "pesan_kontak"

    nama = Column(String(150), nullable=False)
    email = Column(String(150), nullable=True)
    phone = Column(String(50), nullable=True)
    telepon = Column(String(50), nullable=True)
    subjek = Column(String(255), nullable=True)
    kategori = Column(String(100), nullable=True)
    pesan = Column(Text, nullable=False)
    tanggapan = Column(Text, nullable=True)
    status = Column(String(50), nullable=True, default="Baru")


class BannerSlide(Base, OperationalBaseMixin):
    __tablename__ = "banner_slider"

    title = Column(String(255), nullable=False)
    subtitle = Column(Text, nullable=True)
    badge_text = Column(String(150), nullable=True)
    primary_button_label = Column(String(100), nullable=True)
    primary_button_link = Column(String(255), nullable=True)
    image = Column(String(255), nullable=True)
    order_num = Column(String(20), nullable=True, default="1")
    status = Column(String(50), nullable=True, default="Aktif")


class KebudayaanItem(Base, OperationalBaseMixin):
    __tablename__ = "kebudayaan_item"

    name = Column(String(255), nullable=True)
    nama = Column(String(255), nullable=True)
    type = Column(String(100), nullable=True)
    kategori = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)
    lokasi = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    deskripsi = Column(Text, nullable=True)
    foto = Column(String(255), nullable=True)
    status = Column(String(50), nullable=True, default="Terverifikasi")


class PendidikanProgram(Base, OperationalBaseMixin):
    __tablename__ = "pendidikan_program"

    name = Column(String(255), nullable=True)
    judul = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
    kategori = Column(String(100), nullable=True)
    penulis = Column(String(150), nullable=True)
    konten = Column(Text, nullable=True)
    file = Column(String(255), nullable=True)
    scope = Column(String(255), nullable=True)
    total_units = Column(String(100), nullable=True)
    curriculum = Column(String(255), nullable=True)
    status = Column(String(50), nullable=True, default="Terbit")


class ProfilSection(Base, OperationalBaseMixin):
    __tablename__ = "profil_section"

    title = Column(String(255), nullable=True)
    judul = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
    kategori = Column(String(100), nullable=True)
    content = Column(Text, nullable=True)
    konten = Column(Text, nullable=True)
    file = Column(String(255), nullable=True)
    urutan = Column(String(20), nullable=True, default="1")
    status = Column(String(50), nullable=True, default="Aktif")


class StatistikItem(Base, OperationalBaseMixin):
    __tablename__ = "statistik_item"

    indicator = Column(String(255), nullable=True)
    indikator = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
    kategori = Column(String(100), nullable=True)
    value = Column(String(100), nullable=True)
    nilai = Column(String(100), nullable=True)
    unit = Column(String(100), nullable=True)
    satuan = Column(String(100), nullable=True)
    period = Column(String(100), nullable=True)
    tahun = Column(String(20), nullable=True)
    trend = Column(String(100), nullable=True)
    keterangan = Column(Text, nullable=True)

