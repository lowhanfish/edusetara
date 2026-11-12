"""Create individual BMD inventory and condition history."""

import sqlalchemy as sa

from alembic import op

revision = "d9e6f3ab4127"
down_revision = "c8d5e2fa3016"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "inventaris_aset",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column(
            "upb_id",
            sa.String(50),
            sa.ForeignKey("master_aset_unit.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column(
            "kode_barang",
            sa.String(30),
            sa.ForeignKey("master_aset_kode_barang.kode", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("nomor_register", sa.String(50), nullable=False),
        sa.Column("kib", sa.String(1), nullable=False),
        sa.Column("nama", sa.String(255), nullable=False),
        sa.Column("merk", sa.String(150)),
        sa.Column("nomor_seri", sa.String(150)),
        sa.Column("tahun_perolehan", sa.Integer(), nullable=False),
        sa.Column("tanggal_perolehan", sa.Date()),
        sa.Column("nilai_perolehan", sa.Numeric(20, 2), nullable=False),
        sa.Column("lokasi", sa.String(255), nullable=False),
        sa.Column(
            "kondisi_kode",
            sa.Integer(),
            sa.ForeignKey("master_aset_kondisi_barang.kode", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column(
            "sumber_dana_id",
            sa.String(50),
            sa.ForeignKey("master_sarpras_sumber_dana.id", ondelete="RESTRICT"),
        ),
        sa.Column("keterangan", sa.Text()),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("created_by", sa.String(100), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint(
            "upb_id",
            "kode_barang",
            "tahun_perolehan",
            "nomor_register",
            name="uq_inventaris_register",
        ),
    )
    for name in ("upb_id", "kode_barang", "kib", "tahun_perolehan", "kondisi_kode"):
        op.create_index(f"ix_inventaris_aset_{name}", "inventaris_aset", [name])
    op.create_table(
        "inventaris_aset_riwayat_kondisi",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column(
            "aset_id",
            sa.String(50),
            sa.ForeignKey("inventaris_aset.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("kondisi_lama", sa.JSON()),
        sa.Column("kondisi_baru", sa.JSON(), nullable=False),
        sa.Column("catatan", sa.Text(), nullable=False),
        sa.Column("foto_url", sa.String(255)),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("created_by", sa.String(100), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index(
        "ix_inventaris_aset_riwayat_kondisi_aset_id", "inventaris_aset_riwayat_kondisi", ["aset_id"]
    )


def downgrade():
    op.drop_table("inventaris_aset_riwayat_kondisi")
    op.drop_table("inventaris_aset")
