"""Base class and mixins for Master Data models."""

import uuid

from sqlalchemy import Column, DateTime, String, Text
from sqlalchemy.orm import declared_attr, synonym
from sqlalchemy.sql import func


class MasterBaseMixin:
    """Standard audit and descriptor columns for Master Data tables."""

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    uraian = Column(String(255), nullable=False)
    keterangan = Column(Text, nullable=True)
    nip = Column(String(50), nullable=True, index=True)
    unit_kerja = Column(String(150), nullable=True, index=True)
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    @declared_attr
    def title(cls):
        """Synonym so models transparently support title <-> uraian."""
        return synonym("uraian")

    @declared_attr
    def desc(cls):
        """Persist the description used by master forms and API responses."""
        return synonym("keterangan")
