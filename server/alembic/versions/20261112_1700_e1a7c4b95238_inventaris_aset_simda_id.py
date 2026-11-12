"""Track the SIMDA source row of imported inventory."""

import sqlalchemy as sa

from alembic import op

revision = "e1a7c4b95238"
down_revision = "d9e6f3ab4127"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("inventaris_aset", sa.Column("simda_id", sa.String(30), nullable=True))
    op.create_unique_constraint("uq_inventaris_simda", "inventaris_aset", ["kib", "simda_id"])


def downgrade():
    op.drop_constraint("uq_inventaris_simda", "inventaris_aset", type_="unique")
    op.drop_column("inventaris_aset", "simda_id")
