"""Master Jenjang Pendidikan model."""

from sqlalchemy import Column, Text
from sqlalchemy.orm import synonym

from app.db.base import Base
from app.models.master.base_master import MasterBaseMixin


class MasterJenjang(Base, MasterBaseMixin):
    """Master Jenjang Pendidikan (Kelas 1 SD s/d Kelas 9 SMP)."""

    __tablename__ = "master_jenjang"

    keterangan = Column(Text, nullable=True)

    # Synonyms matching Arsitektur Sistem contract (title & desc)
    title = synonym("uraian")
    desc = synonym("keterangan")


