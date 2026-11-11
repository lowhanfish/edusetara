"""Add Master Aset tahap 2 (unit & sekolah, alasan penghapusan, nilai minimum kapitalisasi)."""

import sqlalchemy as sa

from alembic import op

revision = "c8d5e2fa3016"
down_revision = "b7c4d1e92f05"
branch_labels = None
depends_on = None


def _audit() -> list[sa.Column]:
    return [
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column("created_by", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
            nullable=False,
        ),
    ]


def upgrade():
    op.create_table(
        "master_aset_alasan_penghapusan",
        *_audit(),
        sa.Column("kode", sa.Integer(), nullable=False, unique=True),
        sa.Column("uraian", sa.String(255), nullable=False),
        sa.Column("keterangan", sa.Text(), nullable=True),
    )

    op.create_table(
        "master_aset_nilai_minimum_kapitalisasi",
        *_audit(),
        sa.Column("tahun_berlaku", sa.Integer(), nullable=False),
        sa.Column("kode_barang", sa.String(30), nullable=False),
        sa.Column("nilai_minimum_satuan", sa.BigInteger(), nullable=False),
        sa.Column("nilai_minimum_total", sa.BigInteger(), nullable=False, server_default="0"),
        sa.Column("dasar_hukum", sa.String(255), nullable=True),
        sa.UniqueConstraint("tahun_berlaku", "kode_barang", name="uq_master_aset_nilai_min_kap"),
    )
    op.create_index(
        "ix_master_aset_nilai_minimum_kapitalisasi_tahun_berlaku",
        "master_aset_nilai_minimum_kapitalisasi",
        ["tahun_berlaku"],
    )
    op.create_index(
        "ix_master_aset_nilai_min_kap_kode",
        "master_aset_nilai_minimum_kapitalisasi",
        ["kode_barang"],
    )

    op.create_table(
        "master_aset_unit",
        *_audit(),
        sa.Column("kode", sa.String(20), nullable=False, unique=True),
        sa.Column("tingkat", sa.String(10), nullable=False),
        sa.Column("kode_induk", sa.String(20), nullable=True),
        sa.Column("kd_bidang", sa.Integer(), nullable=False),
        sa.Column("kd_unit", sa.Integer(), nullable=False),
        sa.Column("kd_sub", sa.Integer(), nullable=True),
        sa.Column("kd_upb", sa.Integer(), nullable=True),
        sa.Column("jenis", sa.String(10), nullable=False),
        sa.Column("nama", sa.String(255), nullable=False),
        sa.Column("nama_lama", sa.String(255), nullable=True),
        sa.Column("nama_simda", sa.String(255), nullable=True),
        sa.Column("tahun_perubahan", sa.Integer(), nullable=True),
        sa.Column("sekolah_id", sa.String(50), nullable=True),
        sa.Column("sekolah_kedua_id", sa.String(50), nullable=True),
        sa.Column("status_pencocokan", sa.String(20), nullable=False, server_default="belum"),
        sa.Column("catatan_pencocokan", sa.String(255), nullable=True),
        sa.Column("keterangan", sa.Text(), nullable=True),
    )
    for column in (
        "tingkat",
        "kode_induk",
        "jenis",
        "sekolah_id",
        "sekolah_kedua_id",
        "status_pencocokan",
    ):
        op.create_index(f"ix_master_aset_unit_{column}", "master_aset_unit", [column])
    op.create_index(
        "ix_master_aset_unit_kunci",
        "master_aset_unit",
        ["kd_bidang", "kd_unit", "kd_sub", "kd_upb"],
    )


def downgrade():
    for table in (
        "master_aset_unit",
        "master_aset_nilai_minimum_kapitalisasi",
        "master_aset_alasan_penghapusan",
    ):
        op.drop_table(table)
