"""Persist descriptions for master data forms.

Revision ID: b72e941f0c83
Revises: a83b7d609bf7
"""

import sqlalchemy as sa

from alembic import op

revision = "b72e941f0c83"
down_revision = "a83b7d609bf7"
branch_labels = None
depends_on = None

TABLES = [
    "master_usulan_triwulan",
    "master_usulan_jenis_penerima",
    "master_usulan_kelas_penerima",
    "master_jurnal_bahan_ajar",
    "master_jurnal_materi_ajar",
    "master_jurnal_kelas",
    "master_jurnal_mata_pelajaran",
    "master_ppdb_agama",
    "master_ppdb_tempat_tinggal",
    "master_ppdb_transportasi",
    "master_ppdb_pendidikan",
    "master_ppdb_pekerjaan",
    "master_ppdb_penghasilan",
    "master_sarpras_bangunan",
    "master_sarpras_kepemilikan",
    "master_sarpras_sumber_dana",
    "master_sarpras_kondisi_alat",
    "master_sarpras_jenis_bantuan",
    "master_bk_jenis_layanan",
    "master_bk_kegiatan_layanan",
    "master_model_pembelajaran",
    "master_pendampingan",
    "master_tugas",
    "master_kategori",
]


def upgrade():
    for table in TABLES:
        op.add_column(table, sa.Column("keterangan", sa.Text(), nullable=True))


def downgrade():
    for table in reversed(TABLES):
        op.drop_column(table, "keterangan")
