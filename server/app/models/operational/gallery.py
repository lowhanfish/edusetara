"""Operational models for Gallery and Testimonial."""

from sqlalchemy import Column, String, Text
from app.db.base import Base
from app.models.operational.base import OperationalBaseMixin


class GalleryItemBase(OperationalBaseMixin):
    kategori = Column(String(100), nullable=True)
    judul = Column(String(255), nullable=False)
    tujuan = Column(Text, nullable=True)
    proses = Column(Text, nullable=True)
    hasil = Column(Text, nullable=True)
    link = Column(String(255), nullable=True)
    file = Column(String(255), nullable=True)


class GallerySekolahPenggerak(Base, GalleryItemBase):
    __tablename__ = "gallery_sekolah_penggerak"


class GalleryGuruPenggerak(Base, GalleryItemBase):
    __tablename__ = "gallery_guru_penggerak"


class GalleryOrganisasiPenggerak(Base, GalleryItemBase):
    __tablename__ = "gallery_organisasi_penggerak"


class GalleryKegiatanKepalaSekolah(Base, GalleryItemBase):
    __tablename__ = "gallery_kegiatan_kepala_sekolah"


class GalleryKegiatanKkgSd(Base, GalleryItemBase):
    __tablename__ = "gallery_kegiatan_kkg_sd"


class GalleryKegiatanGuruMgmp(Base, GalleryItemBase):
    __tablename__ = "gallery_kegiatan_guru_mgmp"


class GalleryKegiatanTkPaud(Base, GalleryItemBase):
    __tablename__ = "gallery_kegiatan_tk_paud"


class GalleryKegiatanPengawas(Base, GalleryItemBase):
    __tablename__ = "gallery_kegiatan_pengawas"


class GalleryVideoTestimoni(Base, OperationalBaseMixin):
    __tablename__ = "gallery_video_testimoni"

    judul = Column(String(255), nullable=False)
    file = Column(String(255), nullable=True)
    link = Column(String(255), nullable=True)
