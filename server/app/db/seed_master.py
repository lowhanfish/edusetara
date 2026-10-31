"""Seed utility for pre-populating Master Data according to API_CONTRACT_ADMIN.md."""

import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.master import (
    AuthGroup,
    MasterBkJenisLayanan,
    MasterBkKegiatanLayanan,
    MasterJenjang,
    MasterJurnalKelas,
    MasterJurnalMataPelajaran,
    MasterKategori,
    MasterModelPembelajaran,
    MasterPendampingan,
    MasterPpdbAgama,
    MasterPpdbPekerjaan,
    MasterPpdbPendidikan,
    MasterPpdbPenghasilan,
    MasterPpdbTempatTinggal,
    MasterPpdbTransportasi,
    MasterSarprasBangunan,
    MasterSarprasJenisBantuan,
    MasterSarprasKepemilikan,
    MasterSarprasKondisiAlat,
    MasterSarprasSumberDana,
    MasterTugas,
    MasterUsulanJenisPenerima,
    MasterUsulanKelasPenerima,
    MasterUsulanTriwulan,
)

logger = logging.getLogger("edusetara.seed_master")

SEED_DEFINITIONS: list[dict[str, Any]] = [
    # Sarpras
    {
        "model": MasterSarprasBangunan,
        "items": [
            {"id": "KBG-01", "uraian": "Baik"},
            {"id": "KBG-02", "uraian": "Rusak Ringan"},
            {"id": "KBG-03", "uraian": "Rusak Sedang"},
            {"id": "KBG-04", "uraian": "Rusak Berat"},
        ],
    },
    {
        "model": MasterSarprasKepemilikan,
        "items": [
            {"id": "KPM-01", "uraian": "Milik"},
            {"id": "KPM-02", "uraian": "Sewa"},
            {"id": "KPM-03", "uraian": "Pinjam"},
            {"id": "KPM-04", "uraian": "Bukan Milik"},
        ],
    },
    {
        "model": MasterSarprasSumberDana,
        "items": [
            {"id": "SDN-01", "uraian": "DAU"},
            {"id": "SDN-02", "uraian": "DAK"},
            {"id": "SDN-03", "uraian": "APBD"},
            {"id": "SDN-04", "uraian": "APBN"},
            {"id": "SDN-05", "uraian": "BOS"},
            {"id": "SDN-06", "uraian": "Lainnya"},
        ],
    },
    {
        "model": MasterSarprasKondisiAlat,
        "items": [
            {"id": "KDA-01", "uraian": "Baik"},
            {"id": "KDA-02", "uraian": "Rusak Ringan"},
            {"id": "KDA-03", "uraian": "Rusak Sedang"},
            {"id": "KDA-04", "uraian": "Rusak Berat"},
        ],
    },
    {
        "model": MasterSarprasJenisBantuan,
        "items": [
            {"id": "JBT-01", "uraian": "Rehabilitasi Ruang Kelas"},
            {"id": "JBT-02", "uraian": "Pembangunan RKB"},
            {"id": "JBT-03", "uraian": "Bantuan TIK"},
            {"id": "JBT-04", "uraian": "Pengadaan Mobiler"},
        ],
    },
    # Usulan
    {
        "model": MasterUsulanTriwulan,
        "items": [
            {"id": "TW-01", "uraian": "Triwulan I (Januari - Maret)"},
            {"id": "TW-02", "uraian": "Triwulan II (April - Juni)"},
            {"id": "TW-03", "uraian": "Triwulan III (Juli - September)"},
            {"id": "TW-04", "uraian": "Triwulan IV (Oktober - Desember)"},
        ],
    },
    {
        "model": MasterUsulanJenisPenerima,
        "items": [
            {"id": "JP-01", "uraian": "Tunjangan Profesi Guru (TPG) Sertifikasi"},
            {"id": "JP-02", "uraian": "Tunjangan Khusus Guru (TKG)"},
            {"id": "JP-03", "uraian": "Tambahan Penghasilan (Tamsil)"},
        ],
    },
    {
        "model": MasterUsulanKelasPenerima,
        "items": [
            {"id": "KP-01", "uraian": "Golongan IV / Pembina (ASN Senior)"},
            {"id": "KP-02", "uraian": "Golongan III / Penata (ASN Muda)"},
            {"id": "KP-03", "uraian": "Golongan II / Pengatur (Tendik)"},
        ],
    },
    # Jenjang
    {
        "model": MasterJenjang,
        "items": [
            {"id": "JJG-01", "uraian": "PAUD / TK"},
            {"id": "JJG-02", "uraian": "SD (Sekolah Dasar)"},
            {"id": "JJG-03", "uraian": "SMP (Sekolah Menengah Pertama)"},
            {"id": "JJG-04", "uraian": "PKBM / Kesetaraan"},
        ],
    },
    # Jurnal Kelas
    {
        "model": MasterJurnalKelas,
        "items": [
            {"id": "KLS-01", "uraian": "Kelas I (Satu)"},
            {"id": "KLS-02", "uraian": "Kelas II (Dua)"},
            {"id": "KLS-03", "uraian": "Kelas III (Tiga)"},
            {"id": "KLS-04", "uraian": "Kelas IV (Empat)"},
            {"id": "KLS-05", "uraian": "Kelas V (Lima)"},
            {"id": "KLS-06", "uraian": "Kelas VI (Enam)"},
            {"id": "KLS-07", "uraian": "Kelas VII (Tujuh)"},
            {"id": "KLS-08", "uraian": "Kelas VIII (Delapan)"},
            {"id": "KLS-09", "uraian": "Kelas IX (Sembilan)"},
        ],
    },
    # PPDB
    {
        "model": MasterPpdbAgama,
        "items": [
            {"id": "AGM-01", "uraian": "Islam"},
            {"id": "AGM-02", "uraian": "Kristen Protestan"},
            {"id": "AGM-03", "uraian": "Katolik"},
            {"id": "AGM-04", "uraian": "Hindu"},
            {"id": "AGM-05", "uraian": "Buddha"},
            {"id": "AGM-06", "uraian": "Konghucu"},
        ],
    },
    {
        "model": MasterPpdbTempatTinggal,
        "items": [
            {"id": "TTG-01", "uraian": "Bersama Orang Tua"},
            {"id": "TTG-02", "uraian": "Wali / Kerabat"},
            {"id": "TTG-03", "uraian": "Kos / Kontrakan"},
            {"id": "TTG-04", "uraian": "Asrama / Panti Asuhan"},
        ],
    },
    {
        "model": MasterPpdbTransportasi,
        "items": [
            {"id": "TRP-01", "uraian": "Jalan Kaki"},
            {"id": "TRP-02", "uraian": "Sepeda"},
            {"id": "TRP-03", "uraian": "Kendaraan Pribadi / Antar Jemput"},
            {"id": "TRP-04", "uraian": "Angkutan Umum"},
        ],
    },
    {
        "model": MasterPpdbPendidikan,
        "items": [
            {"id": "PDK-01", "uraian": "SD / Sederajat"},
            {"id": "PDK-02", "uraian": "SMP / Sederajat"},
            {"id": "PDK-03", "uraian": "SMA / SMK / Sederajat"},
            {"id": "PDK-04", "uraian": "D3 / D4 / S1"},
            {"id": "PDK-05", "uraian": "S2 / S3"},
        ],
    },
    {
        "model": MasterPpdbPekerjaan,
        "items": [
            {"id": "PKJ-01", "uraian": "PNS / TNI / Polri"},
            {"id": "PKJ-02", "uraian": "Karyawan Swasta"},
            {"id": "PKJ-03", "uraian": "Wiraswasta / Pedagang"},
            {"id": "PKJ-04", "uraian": "Petani / Pekebun"},
            {"id": "PKJ-05", "uraian": "Nelayan"},
        ],
    },
    {
        "model": MasterPpdbPenghasilan,
        "items": [
            {"id": "PHS-01", "uraian": "< Rp 1.000.000"},
            {"id": "PHS-02", "uraian": "Rp 1.000.000 - Rp 2.500.000"},
            {"id": "PHS-03", "uraian": "Rp 2.500.000 - Rp 5.000.000"},
            {"id": "PHS-04", "uraian": "> Rp 5.000.000"},
        ],
    },
    # Pelengkap
    {
        "model": MasterBkJenisLayanan,
        "items": [
            {"id": "BJL-01", "uraian": "Layanan Orientasi"},
            {"id": "BJL-02", "uraian": "Konseling Perorangan"},
            {"id": "BJL-03", "uraian": "Bimbingan Kelompok"},
            {"id": "BJL-04", "uraian": "Layanan Mediasi"},
        ],
    },
    {
        "model": MasterBkKegiatanLayanan,
        "items": [
            {"id": "BKL-01", "uraian": "Asesmen Diagnostik Non-Kognitif"},
            {"id": "BKL-02", "uraian": "Konseling Regulasi Emosi"},
            {"id": "BKL-03", "uraian": "Konsultasi Karir"},
            {"id": "BKL-04", "uraian": "Home Visit"},
        ],
    },
    {
        "model": MasterModelPembelajaran,
        "items": [
            {"id": "MDL-01", "uraian": "Problem Based Learning (PBL)"},
            {"id": "MDL-02", "uraian": "Project Based Learning (PjBL)"},
            {"id": "MDL-03", "uraian": "Discovery Learning"},
            {"id": "MDL-04", "uraian": "Diferensiasi"},
        ],
    },
    {
        "model": MasterPendampingan,
        "items": [
            {"id": "PDP-01", "uraian": "Pendampingan Perencanaan Program"},
            {"id": "PDP-02", "uraian": "Supervisi Akademik"},
            {"id": "PDP-03", "uraian": "Supervisi Manajerial"},
            {"id": "PDP-04", "uraian": "Evaluasi Kinerja"},
        ],
    },
    {
        "model": MasterTugas,
        "items": [
            {"id": "TGS-01", "uraian": "Manajerial Satuan Pendidikan"},
            {"id": "TGS-02", "uraian": "Supervisi Guru dan Tendik"},
            {"id": "TGS-03", "uraian": "Pengembangan Kewirausahaan"},
        ],
    },
    {
        "model": MasterKategori,
        "items": [
            {"id": "KTG-01", "uraian": "Laporan BOSP (BKU & Pajak)"},
            {"id": "KTG-02", "uraian": "SK Pembagian Tugas"},
            {"id": "KTG-03", "uraian": "Sertifikat Pendidik"},
            {"id": "KTG-04", "uraian": "Rekomendasi Dinas"},
        ],
    },
    # RBAC Groups
    {
        "model": AuthGroup,
        "items": [
            {"id": "GRP-001", "title": "Super Admin Dinas", "level": 1},
            {"id": "GRP-002", "title": "Admin Bidang Dinas", "level": 1},
            {"id": "GRP-003", "title": "Kepala Sekolah", "level": 2},
            {"id": "GRP-004", "title": "Guru Kelas / Mata Pelajaran", "level": 2},
            {"id": "GRP-005", "title": "Operator Satuan Pendidikan", "level": 2},
        ],
    },
]


async def seed_all_master_data(session: AsyncSession) -> dict[str, int]:
    """Seed all standard master records if not already present."""
    counts: dict[str, int] = {}

    for group in SEED_DEFINITIONS:
        model = group["model"]
        items = group["items"]
        inserted_for_model = 0

        for item_data in items:
            item_id = item_data["id"]
            existing = await session.scalar(select(model.id).where(model.id == item_id))
            if not existing:
                instance = model(**item_data)
                session.add(instance)
                inserted_for_model += 1

        counts[getattr(model, "__tablename__", str(model))] = inserted_for_model

    # Also seed sample Mata Pelajaran connected to KLS-01 / KLS-04 / KLS-07
    mp_items = [
        {"id": "MP-01", "uraian": "Matematika", "kelas_id": "KLS-01"},
        {"id": "MP-02", "uraian": "Bahasa Indonesia", "kelas_id": "KLS-01"},
        {"id": "MP-03", "uraian": "Pendidikan Pancasila", "kelas_id": "KLS-01"},
        {"id": "MP-04", "uraian": "IPAS (Ilmu Pengetahuan Alam & Sosial)", "kelas_id": "KLS-04"},
        {"id": "MP-05", "uraian": "Bahasa Inggris", "kelas_id": "KLS-07"},
    ]
    mp_count = 0
    for mp_data in mp_items:
        existing = await session.scalar(
            select(MasterJurnalMataPelajaran.id).where(
                MasterJurnalMataPelajaran.id == mp_data["id"]
            )
        )
        if not existing:
            instance = MasterJurnalMataPelajaran(**mp_data)
            session.add(instance)
            mp_count += 1
    counts["master_jurnal_mata_pelajaran"] = mp_count

    await session.commit()
    logger.info(f"Master seed executed. Changes: {counts}")
    return counts
