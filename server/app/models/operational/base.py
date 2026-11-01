"""Base mixin and common columns for Operational models."""

import uuid
from sqlalchemy import Column, DateTime, String
from sqlalchemy.sql import func


class OperationalBaseMixin:
    """Standard audit and identification columns for Operational tables."""

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    nip = Column(String(50), nullable=True, index=True)
    unit_kerja = Column(String(150), nullable=True, index=True)
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
