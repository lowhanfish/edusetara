"""Add Master Aset reference tables (kode barang, masa manfaat, metode, kapitalisasi, ...)."""

import sqlalchemy as sa

from alembic import op

revision = "b7c4d1e92f05"
down_revision = "a40b72d19e63"
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
        "master_aset_kode_barang",
        *_audit(),
        sa.Column("kode", sa.String(30), nullable=False, unique=True),
        sa.Column("uraian", sa.String(255), nullable=False),
        sa.Column("keterangan", sa.Text(), nullable=True),
        sa.Column("level", sa.SmallInteger(), nullable=False),
        sa.Column("kode_induk", sa.String(30), nullable=True),
    )
    op.create_index("ix_master_aset_kode_barang_level", "master_aset_kode_barang", ["level"])
    op.create_index(
        "ix_master_aset_kode_barang_kode_induk", "master_aset_kode_barang", ["kode_induk"]
    )

    op.create_table(
        "master_aset_metode_penyusutan",
        *_audit(),
        sa.Column("kode", sa.Integer(), nullable=False, unique=True),
        sa.Column("nama", sa.String(100), nullable=False),
        sa.Column("keterangan", sa.Text(), nullable=True),
    )

    op.create_table(
        "master_aset_masa_manfaat",
        *_audit(),
        sa.Column("tahun_berlaku", sa.Integer(), nullable=False),
        sa.Column("kode_barang", sa.String(30), nullable=False),
        sa.Column("metode_id", sa.Integer(), nullable=False),
        sa.Column("umur_tahun", sa.Integer(), nullable=False),
        sa.Column("dasar_hukum", sa.String(255), nullable=True),
        sa.UniqueConstraint(
            "tahun_berlaku", "kode_barang", "metode_id", name="uq_master_aset_masa_manfaat"
        ),
    )
    op.create_index(
        "ix_master_aset_masa_manfaat_tahun_berlaku", "master_aset_masa_manfaat", ["tahun_berlaku"]
    )
    op.create_index("ix_master_aset_masa_manfaat_kode", "master_aset_masa_manfaat", ["kode_barang"])

    op.create_table(
        "master_aset_kapitalisasi_masa_manfaat",
        *_audit(),
        sa.Column("kode_barang", sa.String(30), nullable=False),
        sa.Column("batas_bawah_persen", sa.Integer(), nullable=False),
        sa.Column("batas_atas_persen", sa.Integer(), nullable=False),
        sa.Column("tambahan_umur_tahun", sa.Integer(), nullable=False),
        sa.Column("jenis_kapitalisasi", sa.Integer(), nullable=False),
        sa.UniqueConstraint(
            "kode_barang",
            "jenis_kapitalisasi",
            "batas_bawah_persen",
            "batas_atas_persen",
            name="uq_master_aset_kapitalisasi",
        ),
    )
    op.create_index(
        "ix_master_aset_kapitalisasi_kode", "master_aset_kapitalisasi_masa_manfaat", ["kode_barang"]
    )

    op.create_table(
        "master_aset_kondisi_barang",
        *_audit(),
        sa.Column("kode", sa.Integer(), nullable=False, unique=True),
        sa.Column("uraian", sa.String(255), nullable=False),
        sa.Column("keterangan", sa.Text(), nullable=True),
    )

    op.create_table(
        "master_aset_status_pemilik",
        *_audit(),
        sa.Column("kode", sa.Integer(), nullable=False, unique=True),
        sa.Column("nama", sa.String(255), nullable=False),
        sa.Column("keterangan", sa.Text(), nullable=True),
    )


def downgrade():
    for table in (
        "master_aset_status_pemilik",
        "master_aset_kondisi_barang",
        "master_aset_kapitalisasi_masa_manfaat",
        "master_aset_masa_manfaat",
        "master_aset_metode_penyusutan",
        "master_aset_kode_barang",
    ):
        op.drop_table(table)
