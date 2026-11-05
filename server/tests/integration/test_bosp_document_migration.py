"""Preserve old attachments when migrating to individual document rows."""

import importlib.util
import json
from pathlib import Path

import sqlalchemy as sa
from alembic.migration import MigrationContext
from alembic.operations import Operations


def test_backfill_preserves_multiple_and_unclassified_files(monkeypatch):
    path = (
        Path(__file__).parents[2]
        / "alembic/versions/20261105_0200_a40b72d19e63_bosp_document_details.py"
    )
    spec = importlib.util.spec_from_file_location("bosp_migration", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    engine = sa.create_engine("sqlite://")
    with engine.begin() as connection:
        connection.exec_driver_sql("PRAGMA foreign_keys=ON")
        connection.exec_driver_sql(
            "CREATE TABLE master_kategori (id VARCHAR(50) PRIMARY KEY, uraian VARCHAR(255))"
        )
        connection.exec_driver_sql(
            "CREATE TABLE usulan_rekonsiliasi_bosp (id VARCHAR(50) PRIMARY KEY, "
            "dokumen_spj JSON, file_bku VARCHAR(255), file_rekening VARCHAR(255), "
            "file_sptjm VARCHAR(255), created_by VARCHAR(100))"
        )
        connection.exec_driver_sql("INSERT INTO master_kategori VALUES ('bku', 'BKU')")
        connection.execute(
            sa.text(
                "INSERT INTO usulan_rekonsiliasi_bosp VALUES "
                "('usulan', :documents, 'old-bku.pdf', NULL, NULL, 'operator')"
            ),
            {
                "documents": json.dumps(
                    [
                        {"kategori_id": "bku", "nama": "BKU", "file": "bku.pdf"},
                        {"kategori_id": "bku", "nama": "BKU", "file": "bku.xlsx"},
                        {"kategori_id": "deleted", "nama": "Kategori Lama", "file": "lama.pdf"},
                        {"kategori_id": "bku", "nama": "BKU", "file": ""},
                    ]
                )
            },
        )
        monkeypatch.setattr(migration, "op", Operations(MigrationContext.configure(connection)))
        migration.upgrade()
        rows = (
            connection.execute(sa.text("SELECT * FROM usulan_rekonsiliasi_bosp_dokumen"))
            .mappings()
            .all()
        )
        assert len(rows) == 4
        assert sum(row["kategori_id"] == "bku" for row in rows) == 2
        assert {row["file"] for row in rows} == {"old-bku.pdf", "bku.pdf", "bku.xlsx", "lama.pdf"}
        assert (
            next(row for row in rows if row["file"] == "lama.pdf")["kategori_nama"]
            == "Kategori Lama"
        )
        connection.exec_driver_sql("DELETE FROM master_kategori WHERE id = 'bku'")
        assert (
            connection.execute(
                sa.text(
                    "SELECT COUNT(*) FROM usulan_rekonsiliasi_bosp_dokumen "
                    "WHERE kategori_id IS NOT NULL"
                )
            ).scalar_one()
            == 0
        )
        migration.downgrade()
        stored = json.loads(
            connection.execute(
                sa.text("SELECT dokumen_spj FROM usulan_rekonsiliasi_bosp")
            ).scalar_one()
        )
        assert len(stored) == 4
        migration.upgrade()
        connection.exec_driver_sql("DELETE FROM usulan_rekonsiliasi_bosp WHERE id = 'usulan'")
        assert (
            connection.execute(
                sa.text("SELECT COUNT(*) FROM usulan_rekonsiliasi_bosp_dokumen")
            ).scalar_one()
            == 0
        )
