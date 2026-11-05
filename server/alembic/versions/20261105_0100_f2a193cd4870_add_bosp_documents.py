"""Store BOSP documents by master category."""
import sqlalchemy as sa
from alembic import op

revision = "f2a193cd4870"
down_revision = "e91c407a6b25"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("usulan_rekonsiliasi_bosp", sa.Column("dokumen_spj", sa.JSON(), nullable=True))


def downgrade():
    op.drop_column("usulan_rekonsiliasi_bosp", "dokumen_spj")
