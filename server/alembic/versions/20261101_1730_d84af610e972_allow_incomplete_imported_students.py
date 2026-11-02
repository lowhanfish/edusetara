"""Allow missing student identifiers without inventing personal information."""

import sqlalchemy as sa

from alembic import op

revision = "d84af610e972"
down_revision = "b72e941f0c83"
branch_labels = None
depends_on = None


def upgrade():
    for name, kind in [
        ("nisn", sa.String(20)),
        ("nik", sa.String(20)),
        ("jns_kelamin", sa.String(20)),
        ("tgl_lahir", sa.Date()),
        ("alamat", sa.Text()),
    ]:
        op.alter_column("master_siswa", name, existing_type=kind, nullable=True)
    op.add_column(
        "master_siswa", sa.Column("is_active", sa.Boolean(), nullable=False, server_default="1")
    )
    op.add_column("master_siswa", sa.Column("source_data", sa.JSON(), nullable=True))


def downgrade():
    # Reject downgrade if incomplete records exist rather than fabricate values.
    for name, kind in [
        ("nisn", sa.String(20)),
        ("nik", sa.String(20)),
        ("jns_kelamin", sa.String(20)),
        ("tgl_lahir", sa.Date()),
        ("alamat", sa.Text()),
    ]:
        op.alter_column("master_siswa", name, existing_type=kind, nullable=False)
    op.drop_column("master_siswa", "source_data")
    op.drop_column("master_siswa", "is_active")
