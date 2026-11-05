"""Separate BOSP proposals from their categorized document details."""

import json
import uuid

import sqlalchemy as sa

from alembic import op

revision = "a40b72d19e63"
down_revision = "f2a193cd4870"
branch_labels = None
depends_on = None


def upgrade():
    documents = op.create_table(
        "usulan_rekonsiliasi_bosp_dokumen",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column(
            "usulan_id",
            sa.String(50),
            sa.ForeignKey("usulan_rekonsiliasi_bosp.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "kategori_id",
            sa.String(50),
            sa.ForeignKey("master_kategori.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("kategori_nama", sa.String(255), nullable=False),
        sa.Column("uraian", sa.Text(), nullable=False),
        sa.Column("file", sa.String(255), nullable=False),
        sa.Column("cek_benar", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("cek_lengkap", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("nip", sa.String(50), nullable=True),
        sa.Column("unit_kerja", sa.String(150), nullable=True),
        sa.Column("created_by", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    for field in ("usulan_id", "kategori_id", "nip", "unit_kerja"):
        op.create_index(f"ix_usulan_rekonsiliasi_bosp_dokumen_{field}", documents.name, [field])

    connection = op.get_bind()
    categories = (
        connection.execute(sa.text("SELECT id, uraian FROM master_kategori")).mappings().all()
    )
    names = {row["id"]: row["uraian"] for row in categories}
    by_name = {row["uraian"].strip().casefold(): row["id"] for row in categories}
    proposals = (
        connection.execute(sa.text("SELECT * FROM usulan_rekonsiliasi_bosp")).mappings().all()
    )
    for proposal in proposals:
        stored = proposal["dokumen_spj"] or []
        if isinstance(stored, str):
            stored = json.loads(stored)
        entries = list(stored)
        # Preserve old fixed-field attachments as separate details, including unclassified files.
        for field, label in (
            ("file_bku", "Buku Kas Umum / BKU"),
            ("file_rekening", "Rekening Koran"),
            ("file_sptjm", "SPTJM"),
        ):
            if proposal[field] and not any(item.get("file") == proposal[field] for item in entries):
                entries.append({"nama": label, "file": proposal[field]})
        for item in entries:
            if not item.get("file"):
                continue
            name = item.get("nama") or item.get("kategori_nama") or "Dokumen sebelumnya"
            category_id = item.get("kategori_id")
            if category_id not in names:
                category_id = by_name.get(name.strip().casefold())
            connection.execute(
                documents.insert().values(
                    id=str(uuid.uuid4()),
                    usulan_id=proposal["id"],
                    kategori_id=category_id,
                    kategori_nama=names.get(category_id, name),
                    uraian=item.get("uraian") or name,
                    file=item["file"],
                    cek_benar=item.get("cek_benar", False),
                    cek_lengkap=item.get("cek_lengkap", False),
                    created_by=proposal["created_by"],
                )
            )


def downgrade():
    connection = op.get_bind()
    rows = (
        connection.execute(sa.text("SELECT * FROM usulan_rekonsiliasi_bosp_dokumen"))
        .mappings()
        .all()
    )
    grouped = {}
    for row in rows:
        grouped.setdefault(row["usulan_id"], []).append(
            {
                "kategori_id": row["kategori_id"] or "",
                "nama": row["kategori_nama"],
                "uraian": row["uraian"],
                "file": row["file"],
                "cek_benar": bool(row["cek_benar"]),
                "cek_lengkap": bool(row["cek_lengkap"]),
            }
        )
    for proposal_id, documents in grouped.items():
        connection.execute(
            sa.text("UPDATE usulan_rekonsiliasi_bosp SET dokumen_spj = :documents WHERE id = :id"),
            {"documents": json.dumps(documents), "id": proposal_id},
        )
    op.drop_table("usulan_rekonsiliasi_bosp_dokumen")
