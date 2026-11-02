"""Preserve unknown student status instead of assuming active."""

import sqlalchemy as sa

from alembic import op

revision = "e91c407a6b25"
down_revision = "d84af610e972"
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column("master_siswa", "is_active", existing_type=sa.Boolean(), nullable=True)


def downgrade():
    op.alter_column("master_siswa", "is_active", existing_type=sa.Boolean(), nullable=False)
