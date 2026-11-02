"""Import student details read through the authorized reference UI.

Source JSON is private and intentionally kept outside the repository.
"""

import argparse
import asyncio
import json
import re
from collections import Counter
from datetime import date, datetime
from pathlib import Path

from sqlalchemy import JSON, MetaData, select

from app.db.connections.edusetara import edusetara_engine


def prepare(source, schools):
    records = []

    def normalize(s):
        s = s.upper().replace("(SWASTA)", "").replace("(NEGERI)", "")
        s = re.sub(r"\bSDN\b", "SD NEGERI", s)
        s = re.sub(r"\bSMPN\b", "SMP NEGERI", s)
        return re.sub(r"[^A-Z0-9]", "", s)

    grouped = {}
    for school in schools:
        grouped.setdefault(normalize(school["nama_sekolah"]), []).append(school["id"])
    school_map = {name: ids[0] for name, ids in grouped.items() if len(ids) == 1}
    for row in source:
        values = dict(row["detail"])
        name = values.get("Nama Lengkap")
        if not name:
            name = re.sub(r"(Tidak Aktif|Aktif)$", "", row["summary"][0]).strip()
        school = row["summary"][1].replace("\u200c", "").strip()
        raw_date = values.get("Tanggal Lahir")
        try:
            birth = date.fromisoformat(raw_date) if raw_date else None
        except ValueError:
            birth = None

        # Keep unknown/placeholder identifiers in source_data, never invent replacements.
        def identifier(key, length, values=values):
            value = values.get(key, "").strip()
            return (
                value if value.isdigit() and len(value) == length and len(set(value)) > 1 else None
            )

        address = (
            ", ".join(
                values[k]
                for k in ["Alamat Jalan", "Dusun", "Desa / Kelurahan", "Kode Pos"]
                if values.get(k)
            )
            or None
        )
        records.append(
            {
                "id": f"REF-SISWA-{row['ordinal']:04}",
                "nama": name,
                "nisn": identifier("NISN", 10),
                "nik": identifier("NIK", 16),
                "jns_kelamin": values.get("Jenis Kelamin"),
                "tmp_lahir": values.get("Tempat Lahir"),
                "tgl_lahir": birth,
                "agama": values.get("Agama"),
                "alamat": address,
                "nama_ayah": values.get("Nama Ayah Kandung"),
                "nama_ibu": values.get("Nama Ibu Kandung"),
                "nama_wali": values.get("Nama Wali"),
                "unit_kerja": school,
                "unit_kerja_id": school_map.get(normalize(school)),
                "is_active": (
                    False
                    if "Tidak Aktif" in row["summary"][0]
                    else True
                    if "Aktif" in row["summary"][0]
                    else None
                ),
                "source_data": {
                    "source": "https://sikola-pindara.konaweselatankab.go.id/#/masterSiswa",
                    **row,
                },
                "created_by": "reference_sikola_pindara",
            }
        )
    for field in ["nisn", "nik"]:
        counts = Counter(r[field] for r in records if r[field])
        for r in records:
            if r[field] and counts[r[field]] > 1:
                r[field] = None
    return records


async def main(path, apply):
    source = json.loads(Path(path).read_text())
    ordinals = [r["ordinal"] for r in source]
    assert len(set(ordinals)) == len(ordinals)
    assert sorted(ordinals) == list(range(1, max(ordinals) + 1)), "Missing source pages"
    assert all(
        re.sub(r"\s+", " ", dict(r["detail"]).get("Nama Lengkap", "")).strip()
        in re.sub(r"\s+", " ", r["summary"][0]).strip()
        for r in source
    ), "Student detail mismatch"
    async with edusetara_engine.begin() as c:
        metadata = MetaData()
        await c.run_sync(metadata.reflect)
        protected = [
            n
            for n in metadata.tables
            if n.startswith("auth_") or n in ["users", "roles", "user_roles", "master_sekolah"]
        ]

        async def dump(names):
            return {
                n: [dict(r) for r in (await c.execute(select(metadata.tables[n]))).mappings()]
                for n in names
            }

        before = await dump(protected)
        schools = before["master_sekolah"]
        records = prepare(source, schools)
        print(
            json.dumps(
                {
                    "students": len(records),
                    "missing_nisn": sum(r["nisn"] is None for r in records),
                    "missing_nik": sum(r["nik"] is None for r in records),
                    "matched_school": sum(r["unit_kerja_id"] is not None for r in records),
                    "inactive": sum(r["is_active"] is False for r in records),
                    "unknown_status": sum(r["is_active"] is None for r in records),
                }
            )
        )
        if not apply:
            return
        backup = Path("backups") / f"students_before_reference_{datetime.now():%Y%m%d_%H%M%S}.json"
        backup.parent.mkdir(exist_ok=True)
        old = await dump(["master_siswa"])
        backup.write_text(json.dumps(old, default=str, ensure_ascii=False, indent=2))
        backup.chmod(0o600)
        source_backup = backup.with_name(backup.stem + "_source.json")
        source_backup.write_text(json.dumps(source, ensure_ascii=False))
        source_backup.chmod(0o600)
        table = metadata.tables["master_siswa"]
        # MariaDB reflects JSON as LONGTEXT with a JSON_VALID check constraint.
        if not isinstance(table.c.source_data.type, JSON):
            records = [
                {**r, "source_data": json.dumps(r["source_data"], ensure_ascii=False)}
                for r in records
            ]
        await c.execute(table.delete())
        await c.execute(table.insert(), records)
        assert before == await dump(protected), "Protected tables changed"
        stored = await dump(["master_siswa"])
        assert len(stored["master_siswa"]) == len(source)
        assert all(r["source_data"] for r in stored["master_siswa"])
        print(f"Import verified; backup: {backup}")
    await edusetara_engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    asyncio.run(main(args.source, args.apply))
