"""Master Sarana & Prasarana models."""

from app.db.base import Base
from app.models.master.base_master import MasterBaseMixin


class MasterSarprasBangunan(Base, MasterBaseMixin):
    """Master Kondisi Bangunan (Baik, Rusak Ringan, Rusak Sedang, Rusak Berat)."""

    __tablename__ = "master_sarpras_bangunan"


class MasterSarprasKepemilikan(Base, MasterBaseMixin):
    """Master Status Kepemilikan (Milik, Sewa, Pinjam, Bukan Milik)."""

    __tablename__ = "master_sarpras_kepemilikan"


class MasterSarprasSumberDana(Base, MasterBaseMixin):
    """Master Sumber Pendanaan (DAU, DAK, APBD, APBN, BOS, Lainnya)."""

    __tablename__ = "master_sarpras_sumber_dana"


class MasterSarprasKondisiAlat(Base, MasterBaseMixin):
    """Master Kondisi Peralatan / Aset."""

    __tablename__ = "master_sarpras_kondisi_alat"


class MasterSarprasJenisBantuan(Base, MasterBaseMixin):
    """Master Jenis Program Bantuan Fisik & Pengadaan."""

    __tablename__ = "master_sarpras_jenis_bantuan"
