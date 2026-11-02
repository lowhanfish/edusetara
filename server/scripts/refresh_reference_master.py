# ruff: noqa: E501  # Reference labels and descriptions are kept as complete catalogue entries.
"""Replace local lookup masters with reviewed Sikola Pindara reference values.

Run with --apply after the description migration. A JSON backup is written first.
School and authentication tables are fingerprinted and must remain unchanged.
"""

import argparse
import asyncio
import json
from datetime import datetime
from pathlib import Path

from sqlalchemy import MetaData, select

from app.db.connections.edusetara import edusetara_engine

DATA = {}


def add(table, values, descriptions):
    names = values.split("|")
    descs = descriptions.split("|") if isinstance(descriptions, str) else descriptions
    assert len(names) == len(descs), table
    DATA["master_" + table] = [
        {
            "id": f"REF-{table[:30]}-{i:03}",
            "uraian": n,
            "keterangan": d,
            "created_by": "reference_sikola_pindara",
        }
        for i, (n, d) in enumerate(zip(names, descs, strict=True), 1)
    ]


add(
    "usulan_triwulan",
    "Triwulan I|Triwulan II|Triwulan III|Triwulan IV",
    "Periode Januari–Maret untuk pengajuan dan pencatatan tunjangan.|Periode April–Juni untuk pengajuan dan pencatatan tunjangan.|Periode Juli–September untuk pengajuan dan pencatatan tunjangan.|Periode Oktober–Desember untuk pengajuan dan pencatatan tunjangan.",
)
add(
    "usulan_jenis_penerima",
    "Tunjangan Profesi Guru (TPG)|Tunjangan Khusus Guru (TKG)|Tambahan Penghasilan (TAMSIL)|Tamsil Khusus Pendidikan Agama",
    "Jenis usulan tunjangan profesi bagi guru sesuai persyaratan program.|Jenis usulan tunjangan khusus bagi guru sesuai penetapan program.|Jenis usulan tambahan penghasilan guru sesuai persyaratan program.|Jenis usulan tambahan penghasilan untuk guru pendidikan agama.",
)
add(
    "usulan_kelas_penerima",
    "Guru|Kepala Sekolah|Pengawas",
    "Penerima usulan yang bertugas sebagai guru pada satuan pendidikan.|Penerima usulan yang bertugas memimpin satuan pendidikan.|Penerima usulan yang bertugas melakukan pengawasan dan pendampingan satuan pendidikan.",
)
add(
    "jurnal_bahan_ajar",
    "Ceramah/Teori|Diskusi|Praktik|Tugas",
    "Penyampaian konsep atau materi melalui penjelasan guru dalam jurnal pembelajaran.|Pembelajaran melalui pertukaran pendapat dan pembahasan bersama peserta didik.|Pembelajaran melalui latihan atau penerapan langsung keterampilan.|Pembelajaran melalui penugasan individu atau kelompok yang dicatat dalam jurnal.",
)
add(
    "jurnal_materi_ajar",
    "Zoom|Google Meet|Kuis|Tatap Muka",
    "Pelaksanaan pembelajaran daring melalui pertemuan video Zoom.|Pelaksanaan pembelajaran daring melalui pertemuan video Google Meet.|Kegiatan kuis untuk mengecek pemahaman peserta didik.|Pelaksanaan pembelajaran melalui pertemuan langsung guru dan peserta didik.",
)
classes = (
    [str(i) for i in range(1, 7)]
    + [str(i) + s for i in range(7, 10) for s in [""] + list("ABCDEFGHIJ")]
    + ["A", "A1", "A2", "B", "B1", "B2", "B3", "B4", "Lainnya", "TK"]
)
add(
    "jurnal_kelas",
    "|".join(classes),
    [
        f"Kelas {k} untuk pemilihan kelas pada jurnal dan pendataan peserta didik."
        if k not in ["TK", "Lainnya"]
        else (
            "Kelas taman kanak-kanak untuk jurnal pembelajaran anak usia dini."
            if k == "TK"
            else "Pilihan kelas yang belum tercakup dalam daftar kelas utama."
        )
        for k in classes
    ],
)
add(
    "jenjang",
    "|".join(str(i) for i in range(1, 10)),
    [
        f"Tingkat kelas {i} pada jenjang "
        + ("sekolah dasar." if i <= 6 else "sekolah menengah pertama.")
        for i in range(1, 10)
    ],
)
add(
    "ppdb_agama",
    "Islam|Kristen/Protestan|Katolik|Hindu|Buddha|Khonghucu",
    [
        f"Pilihan agama {s} pada pendataan peserta didik dan formulir PPDB."
        for s in ["Islam", "Kristen/Protestan", "Katolik", "Hindu", "Buddha", "Khonghucu"]
    ],
)
add(
    "ppdb_tempat_tinggal",
    "Bersama Orang Tua|Wali|Kos|Asrama|Panti Asuhan|Lainnya",
    "Peserta didik tinggal bersama orang tua.|Peserta didik tinggal bersama wali atau keluarga yang bertanggung jawab.|Peserta didik tinggal di tempat kos.|Peserta didik tinggal di asrama.|Peserta didik tinggal di panti asuhan.|Tempat tinggal peserta didik selain pilihan yang tercantum.",
)
add(
    "ppdb_transportasi",
    "Jalan Kaki|Kendaraan Pribadi|Kendaraan Umum/Angkot|Jemputan Sekolah",
    "Peserta didik berjalan kaki menuju sekolah.|Peserta didik menggunakan kendaraan pribadi atau diantar keluarga.|Peserta didik menggunakan kendaraan umum atau angkutan kota.|Peserta didik menggunakan layanan antar jemput sekolah.",
)
add(
    "ppdb_pendidikan",
    "Tidak Sekolah|Putus SD|SD Sederajat|SMP Sederajat|SMA Sederajat|D1|D2|D3|D4/S1|S2|S3",
    "Orang tua atau wali tidak pernah mengikuti pendidikan sekolah.|Orang tua atau wali pernah mengikuti pendidikan SD tetapi tidak menyelesaikannya.|Pendidikan terakhir orang tua atau wali setara sekolah dasar.|Pendidikan terakhir orang tua atau wali setara sekolah menengah pertama.|Pendidikan terakhir orang tua atau wali setara sekolah menengah atas.|Pendidikan terakhir orang tua atau wali diploma satu.|Pendidikan terakhir orang tua atau wali diploma dua.|Pendidikan terakhir orang tua atau wali diploma tiga.|Pendidikan terakhir orang tua atau wali diploma empat atau sarjana.|Pendidikan terakhir orang tua atau wali magister.|Pendidikan terakhir orang tua atau wali doktor.",
)
jobs = "Tidak Bekerja|Nelayan|Petani|Peternak|PNS/TNI/POLRI|Karyawan Swasta|Pedagang Kecil|Pedagang Besar|Wiraswasta|Wirausaha|Buruh|Pensiunan|Lain-lain"
add(
    "ppdb_pekerjaan",
    jobs,
    [f"Pekerjaan orang tua atau wali: {s.lower()}." for s in jobs.split("|")],
)
incomes = "Kurang dari Rp500.000|Rp500.000–Rp999.999|Rp1.000.000–Rp1.999.999|Rp2.000.000–Rp4.999.999|Rp5.000.000–Rp20.000.000|Lebih dari Rp20.000.000"
add(
    "ppdb_penghasilan",
    incomes,
    [f"Rentang penghasilan bulanan orang tua atau wali: {s}." for s in incomes.split("|")],
)
for table, obj, states in [
    ("sarpras_bangunan", "bangunan", "Baik|Rusak Ringan|Rusak Sedang|Rusak Berat"),
    ("sarpras_kondisi_alat", "peralatan", "Baik|Rusak Ringan|Rusak Berat"),
]:
    meanings = {
        "Baik": "dapat digunakan sesuai fungsi",
        "Rusak Ringan": "memerlukan perbaikan ringan",
        "Rusak Sedang": "memerlukan perbaikan sedang",
        "Rusak Berat": "memerlukan penanganan besar atau penggantian sesuai hasil penilaian",
    }
    add(table, states, [f"Kondisi {obj} {s.lower()}; {meanings[s]}." for s in states.split("|")])
add(
    "sarpras_kepemilikan",
    "Milik Sendiri|Sewa|Pinjam",
    "Sarana atau prasarana berstatus milik satuan pendidikan atau penyelenggara.|Sarana atau prasarana digunakan berdasarkan perjanjian sewa.|Sarana atau prasarana digunakan berdasarkan izin pinjam pakai.",
)
for t in ["sarpras_sumber_dana", "sarpras_jenis_bantuan"]:
    names = ["Dana Alokasi Khusus (DAK)", "Bantuan Operasional Sekolah (BOS)"] + (
        ["Dana Hibah"] if t.endswith("sumber_dana") else []
    )
    add(
        t,
        "|".join(names),
        [
            f"{'Sumber pendanaan' if t.endswith('sumber_dana') else 'Jenis bantuan'} sarana dan prasarana melalui {n}."
            for n in names
        ],
    )
add(
    "bk_jenis_layanan",
    "Pribadi|Sosial|Belajar|Karier",
    "Bidang layanan BK untuk pengembangan diri dan penanganan permasalahan pribadi peserta didik.|Bidang layanan BK untuk hubungan sosial dan interaksi peserta didik.|Bidang layanan BK untuk kebiasaan belajar dan hambatan pembelajaran.|Bidang layanan BK untuk pengenalan potensi serta perencanaan pendidikan dan karier.",
)
bk = "Bimbingan Klasikal|Bimbingan Kelas Besar|Konseling Individu|Konseling Kelompok|Bimbingan Kelompok|Konferensi Kasus|Home Visit|Referal/Alih Tangan Kasus|Konsultasi"
bk_desc = "Layanan bimbingan terencana untuk peserta didik dalam satu kelas.|Layanan bimbingan yang melibatkan peserta didik dari beberapa kelas.|Layanan konseling secara perorangan sesuai kebutuhan peserta didik.|Layanan konseling dalam kelompok untuk membahas permasalahan anggota.|Layanan bimbingan melalui kegiatan kelompok untuk pengembangan peserta didik.|Pertemuan pihak terkait untuk membahas dan menyepakati penanganan kasus.|Kunjungan rumah untuk memahami kondisi dan mendukung penanganan peserta didik.|Pengalihan penanganan kasus kepada pihak yang memiliki kewenangan atau keahlian sesuai kebutuhan.|Pemberian konsultasi kepada peserta didik, orang tua, guru, atau pihak terkait."
add("bk_kegiatan_layanan", bk, bk_desc)
# Reference uses these same nine choices for Model Pembelajaran.
add("model_pembelajaran", bk, bk_desc)
add(
    "pendampingan",
    "Pendampingan Perencanaan Kerja|Pendampingan Perencanaan Program Sekolah|Pendampingan Pelaksanaan Program Sekolah|Pelaporan Kinerja yang Bersiklus",
    "Pendampingan penyusunan rencana kerja berdasarkan kebutuhan satuan pendidikan.|Pendampingan penyusunan tujuan, kegiatan, indikator, dan jadwal program sekolah.|Pendampingan pelaksanaan dan pemantauan program sekolah.|Pendampingan pelaporan dan refleksi hasil kinerja untuk perbaikan siklus berikutnya.",
)
add(
    "tugas",
    "Asesor|Evaluator|Fasilitator|Informan",
    "Melakukan asesmen dan penilaian berdasarkan instrumen yang digunakan.|Mengevaluasi pelaksanaan program dan menyusun masukan perbaikan.|Memfasilitasi diskusi, pembelajaran, dan penyelesaian kebutuhan pendampingan.|Menyampaikan informasi yang relevan untuk pelaksanaan tugas dan program pendidikan.",
)
add(
    "kategori",
    "Buku Kas Umum|Buku Kas Umum Tunai|Buku Pembantu Pajak|Rekapitulasi Pemungutan dan Penyetoran Pajak Tahun Berjalan|Rekapitulasi Pemungutan dan Penyetoran Pajak Tahun Sebelumnya|Buku Bank|Buku Pembantu Rincian Objek Belanja (Pegawai, Barang/Jasa, dan Modal)|Laporan Realisasi Penerimaan dan Belanja BOSP (LRA)|Rekapitulasi Realisasi Penggunaan Dana BOS (Form K.7A)|Rekapitulasi Penerimaan dan Pengeluaran BOSP|Rekapitulasi Pembelian Barang/Aset/Inventaris/Buku dari BOSP|Surat Pengesahan Pendapatan Transfer (SP2T)|SP2B dan Lampiran|Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)|Laporan Persediaan|Kartu Persediaan|BAP Fisik (Stock Opname) Persediaan|Scan Setoran Pajak|Scan Rekening Koran (Januari–Desember)|Scan Belanja SIPLah Satuan Pendidikan|BAP dan Checklist Verifikasi Rekon (Dinas Pendidikan)|Checklist Verifikasi Rekon (BPKAD)|Dokumentasi Transisi PAUD ke SD (Khusus SD)|SPJ Semester 1 dan Semester 2|Rencana Kegiatan dan Anggaran Sekolah (RKAS)|Bantuan Dana Hibah",
    "Catatan seluruh transaksi penerimaan dan pengeluaran kas.|Catatan transaksi penerimaan dan pengeluaran uang tunai.|Catatan pemungutan, pemotongan, dan penyetoran pajak.|Ringkasan pemungutan dan penyetoran pajak pada tahun pelaporan.|Ringkasan pemungutan dan penyetoran pajak tahun sebelum tahun pelaporan.|Catatan transaksi melalui rekening bank.|Rincian belanja menurut objek pegawai, barang/jasa, dan modal.|Laporan realisasi penerimaan dan belanja dana BOSP.|Rekapitulasi penggunaan dana BOS dalam format K.7A.|Ringkasan penerimaan dan pengeluaran dana BOSP.|Ringkasan pembelian barang, aset, inventaris, dan buku dari dana BOSP.|Dokumen pengesahan pendapatan transfer satuan pendidikan.|Dokumen SP2B beserta lampiran pendukungnya.|Pernyataan tanggung jawab mutlak atas pengelolaan dana atau laporan.|Laporan jumlah dan nilai persediaan pada periode pelaporan.|Catatan mutasi masuk, keluar, dan saldo tiap jenis persediaan.|Berita acara pemeriksaan fisik dan pencocokan persediaan.|Salinan bukti penyetoran pajak.|Salinan rekening koran bank untuk periode Januari sampai Desember.|Salinan dokumen belanja melalui SIPLah.|Berita acara dan daftar periksa verifikasi rekonsiliasi oleh Dinas Pendidikan.|Daftar periksa verifikasi rekonsiliasi oleh BPKAD.|Dokumentasi kegiatan transisi PAUD ke SD untuk satuan pendidikan SD.|Dokumen pertanggungjawaban semester pertama dan kedua.|Dokumen rencana kegiatan serta alokasi anggaran sekolah.|Dokumen bantuan dana hibah dan pertanggungjawabannya.",
)

smp = [str(i) + s for i in range(7, 10) for s in [""] + list("ABCDEFGHIJ")]
subjects = "Agama Buddha|Agama Hindu|Agama Islam|Agama Khonghucu|Agama Kristen|Bahasa Indonesia|Bahasa Inggris|Bimbingan Konseling|Informatika|IPA|IPS|Matematika|Mulok Daerah|Mulok Pertanian|Penjaskes|PKN|Prakarya|Seni Budaya|Seni Musik|Seni Rupa|Seni Tari|Seni Teater|TIK".split(
    "|"
)
pairs = [(k, s) for s in ["Guru Kelas SD", "Tematik SD"] for k in classes[:6]] + [
    (k, s) for s in subjects for k in smp
]
pairs += [
    ("TK", s)
    for s in "Air, Udara, Api|Alam Semesta|Alat Komunikasi|Binatang|Diri Sendiri|Kebutuhanku|Kendaraan|Lingkunganku|Pekerjaan|Rekreasi|Tanah Airku|Tanaman".split(
        "|"
    )
]
pairs += [(k, s) for s in ["Pendidikan Agama", "PJOK"] for k in classes[:6]] + [
    (str(k), "Informatika") for k in range(1, 6)
]
class_ids = {r["uraian"]: r["id"] for r in DATA["master_jurnal_kelas"]}
DATA["master_jurnal_mata_pelajaran"] = [
    {
        "id": f"REF-MAPEL-{i:04}",
        "uraian": s,
        "kelas_id": class_ids[k],
        "keterangan": f"{'Tema pembelajaran' if k == 'TK' else 'Mata pelajaran'} {s} untuk kelas {k}; digunakan dalam pencatatan jurnal pembelajaran.",
        "created_by": "reference_sikola_pindara",
    }
    for i, (k, s) in enumerate(pairs, 1)
]


async def main(apply):
    metadata = MetaData()
    async with edusetara_engine.begin() as c:
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
        old = await dump(DATA)
        print(
            json.dumps(
                {n: {"before": len(old[n]), "after": len(v)} for n, v in DATA.items()}, indent=2
            )
        )
        if not apply:
            return
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup = Path("backups") / f"master_before_reference_{stamp}.json"
        backup.parent.mkdir(exist_ok=True)
        backup.write_text(json.dumps(old, default=str, ensure_ascii=False, indent=2))
        backup.chmod(0o600)
        # Student class references must survive replacing the class lookup.
        student_table = metadata.tables["master_siswa"]
        student_classes = (
            await c.execute(select(student_table.c.id, student_table.c.kelas_id))
        ).all()
        old_class = {r["id"]: r["uraian"] for r in old["master_jurnal_kelas"]}
        await c.execute(student_table.update().values(kelas_id=None))
        order = ["master_jurnal_mata_pelajaran"] + [
            n for n in DATA if n != "master_jurnal_mata_pelajaran"
        ]
        for n in order:
            await c.execute(metadata.tables[n].delete())
        for n, rows in DATA.items():
            await c.execute(metadata.tables[n].insert(), rows)
        for sid, kid in student_classes:
            label = old_class.get(kid, "")
            if label.startswith("Kelas "):
                roman = {
                    "I": "1",
                    "II": "2",
                    "III": "3",
                    "IV": "4",
                    "V": "5",
                    "VI": "6",
                    "VII": "7",
                    "VIII": "8",
                    "IX": "9",
                }
                label = roman.get(label.split()[1], label)
            if label in class_ids:
                await c.execute(
                    student_table.update()
                    .where(student_table.c.id == sid)
                    .values(kelas_id=class_ids[label])
                )
        assert before == await dump(protected), "Protected tables changed"
        for n, rows in DATA.items():
            result = (await c.execute(select(metadata.tables[n]))).mappings().all()
            assert len(result) == len(rows), n
            assert all(r["keterangan"] for r in result), n
        print(
            f"Verified {sum(map(len, DATA.values()))} records in {len(DATA)} masters. Backup: {backup}"
        )
    await edusetara_engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    asyncio.run(main(parser.parse_args().apply))
