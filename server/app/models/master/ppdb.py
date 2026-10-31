"""Master PPDB models (Agama, Tempat Tinggal, Transportasi, Pendidikan, Pekerjaan, Penghasilan)."""

from app.db.base import Base
from app.models.master.base_master import MasterBaseMixin


class MasterPpdbAgama(Base, MasterBaseMixin):
    """Master Agama untuk formulir PPDB."""

    __tablename__ = "master_ppdb_agama"


class MasterPpdbTempatTinggal(Base, MasterBaseMixin):
    """Master Status Tempat Tinggal calon siswa PPDB."""

    __tablename__ = "master_ppdb_tempat_tinggal"


class MasterPpdbTransportasi(Base, MasterBaseMixin):
    """Master Moda Transportasi calon siswa PPDB."""

    __tablename__ = "master_ppdb_transportasi"


class MasterPpdbPendidikan(Base, MasterBaseMixin):
    """Master Jenjang Pendidikan Orang Tua / Wali."""

    __tablename__ = "master_ppdb_pendidikan"


class MasterPpdbPekerjaan(Base, MasterBaseMixin):
    """Master Pekerjaan Orang Tua / Wali."""

    __tablename__ = "master_ppdb_pekerjaan"


class MasterPpdbPenghasilan(Base, MasterBaseMixin):
    """Master Rentang Penghasilan Orang Tua / Wali."""

    __tablename__ = "master_ppdb_penghasilan"
