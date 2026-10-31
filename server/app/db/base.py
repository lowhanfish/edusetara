"""Database Base and Declarative Metadata configuration."""

from sqlalchemy.orm import declarative_base

# Primary declarative base for the edusetara database (Managed by Alembic)
Base = declarative_base()

# External read-only databases have isolated Base definitions to prevent Alembic schema pollution
SimpegBase = declarative_base()
EgovBase = declarative_base()
