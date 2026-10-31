"""drop_master_sekolah_meta_table

Revision ID: 6a9ed10854d3
Revises: dddfa4edc7bd
Create Date: 2026-11-01 06:37:35.391010

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6a9ed10854d3'
down_revision: Union[str, None] = 'dddfa4edc7bd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()
    if "master_sekolah_meta" in tables:
        op.drop_table("master_sekolah_meta")


def downgrade() -> None:
    op.create_table(
        "master_sekolah_meta",
        sa.Column("unit_kerja_id", sa.String(50), primary_key=True),
        sa.Column("npsn", sa.String(20), nullable=True),
        sa.Column("jenjang", sa.String(20), nullable=False, default="LAINNYA"),
        sa.Column("status_sekolah", sa.String(20), nullable=False, default="NEGERI"),
        sa.Column("akreditasi", sa.String(10), nullable=True),
        sa.Column("kecamatan_id", sa.Integer(), nullable=True),
        sa.Column("kecamatan", sa.String(100), nullable=True),
        sa.Column("desa_kelurahan_id", sa.Integer(), nullable=True),
        sa.Column("desa_kelurahan", sa.String(100), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, default=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )

