"""Record the school UPB where an asset booked elsewhere is actually placed."""

import sqlalchemy as sa

from alembic import op

revision = "f2b8d5c06349"
down_revision = "e1a7c4b95238"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("inventaris_aset", sa.Column("upb_penempatan_id", sa.String(50), nullable=True))
    op.add_column("inventaris_aset", sa.Column("status_penempatan", sa.String(10), nullable=True))
    op.create_foreign_key(
        "fk_inventaris_penempatan",
        "inventaris_aset",
        "master_aset_unit",
        ["upb_penempatan_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_index(
        "ix_inventaris_aset_upb_penempatan_id", "inventaris_aset", ["upb_penempatan_id"]
    )


def downgrade():
    op.drop_constraint("fk_inventaris_penempatan", "inventaris_aset", type_="foreignkey")
    op.drop_index("ix_inventaris_aset_upb_penempatan_id", "inventaris_aset")
    op.drop_column("inventaris_aset", "status_penempatan")
    op.drop_column("inventaris_aset", "upb_penempatan_id")
