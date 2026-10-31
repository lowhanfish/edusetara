"""Master Jenjang Pendidikan model."""

from app.db.base import Base
from app.models.master.base_master import MasterBaseMixin


class MasterJenjang(Base, MasterBaseMixin):
    """Master Jenjang Pendidikan (PAUD/TK, SD, SMP, PKBM)."""

    __tablename__ = "master_jenjang"
