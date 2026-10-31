"""add_simpeg_unit_kerja_nama_to_master_sekolah

Revision ID: a83b7d609bf7
Revises: 6a9ed10854d3
Create Date: 2026-11-01 06:57:24.640373

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a83b7d609bf7'
down_revision: Union[str, None] = '6a9ed10854d3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("master_sekolah", sa.Column("simpeg_unit_kerja_nama", sa.String(255), nullable=True))


def downgrade() -> None:
    op.drop_column("master_sekolah", "simpeg_unit_kerja_nama")

