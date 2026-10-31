"""Database connections module."""

from app.db.connections.edusetara import edusetara_engine, edusetara_session_factory
from app.db.connections.egov import egov_engine, egov_session_factory
from app.db.connections.simpeg import simpeg_engine, simpeg_session_factory

__all__ = [
    "edusetara_engine",
    "edusetara_session_factory",
    "simpeg_engine",
    "simpeg_session_factory",
    "egov_engine",
    "egov_session_factory",
]
