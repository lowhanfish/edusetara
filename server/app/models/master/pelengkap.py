"""Master Pelengkap models (BK, Pembelajaran, Pendampingan, Tugas, Kategori Berkas)."""

from app.db.base import Base
from app.models.master.base_master import MasterBaseMixin


class MasterBkJenisLayanan(Base, MasterBaseMixin):
    """Master Jenis Layanan Bimbingan & Konseling."""

    __tablename__ = "master_bk_jenis_layanan"


class MasterBkKegiatanLayanan(Base, MasterBaseMixin):
    """Master Kegiatan Layanan Bimbingan & Konseling."""

    __tablename__ = "master_bk_kegiatan_layanan"


class MasterModelPembelajaran(Base, MasterBaseMixin):
    """Master Model Pembelajaran (PBL, PjBL, Discovery, Diferensiasi)."""

    __tablename__ = "master_model_pembelajaran"


class MasterPendampingan(Base, MasterBaseMixin):
    """Master Jenis Pendampingan Pengawas Sekolah."""

    __tablename__ = "master_pendampingan"


class MasterTugas(Base, MasterBaseMixin):
    """Master Tugas Pokok Kepala Sekolah & Pengawas."""

    __tablename__ = "master_tugas"


class MasterKategori(Base, MasterBaseMixin):
    """Master Kategori Berkas & Arsip."""

    __tablename__ = "master_kategori"
