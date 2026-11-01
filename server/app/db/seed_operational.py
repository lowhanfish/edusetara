"""Seed realistic operational data for Konawe Selatan into edusetara database."""

import asyncio
import uuid
from app.db.connections.edusetara import edusetara_engine
from app.db.session import edusetara_session_factory
from app.models.operational import (
    Berita,
    GalleryGuruPenggerak,
    GalleryKegiatanGuruMgmp,
    GalleryKegiatanKepalaSekolah,
    GalleryKegiatanKkgSd,
    GalleryKegiatanPengawas,
    GalleryKegiatanTkPaud,
    GalleryOrganisasiPenggerak,
    GallerySekolahPenggerak,
    GalleryVideoTestimoni,
    GtkModulPelatihan,
    GtkPengumuman,
    GtkRegulasi,
    JurnalBk,
    JurnalGuruKelas,
    JurnalKepalaSekolah,
    JurnalPengawas,
    KegiatanSekolah,
    KomunitasBelajar,
    KuotaPpdb,
    LayananPublik,
    PengumumanPublish,
    PesanKontak,
    PiagamSertifikat,
    PpdbPaud,
    PpdbSd,
    PpdbSmp,
    ProfileRenstra,
    ProfileTugasFungsi,
    ProfileVisiMisi,
    RombelPaud,
    RombelSd,
    RombelSmp,
    SarprasBangunan,
    SarprasPeralatan,
    SarprasRuang,
    SarprasTanah,
    UsulanAssessment,
    UsulanPipPendukung,
    UsulanPipPenerima,
    UsulanRekonsiliasiBosp,
    UsulanTunjanganGuru,
    VerifikasiRekonsiliasiBosp,
    VerifikasiTunjanganGuru,
)
from sqlalchemy import select, func


async def seed_operational():
    async with edusetara_session_factory() as session:
        # Check if already seeded
        count_tanah = await session.scalar(select(func.count(SarprasTanah.id)))
        if count_tanah and count_tanah > 0:
            print(f"Operational data already present ({count_tanah} sarpras tanah records).")
            return

        print("Seeding operational data...")

        # 1. Sarpras
        tanah_items = [
            SarprasTanah(id=str(uuid.uuid4()), title="3.300 m²", file="sertifikat_sdn5_kolono.pdf", file_type="pdf", unit_kerja="SDN 5 KOLONO", created_by="admin"),
            SarprasTanah(id=str(uuid.uuid4()), title="2.400 m²", file="sertifikat_satap16.pdf", file_type="pdf", unit_kerja="SD-SMPN SATAP 16 KONSEL", created_by="admin"),
            SarprasTanah(id=str(uuid.uuid4()), title="9.375 m²", file="akta_hibah_sdn6_lainea.pdf", file_type="pdf", unit_kerja="SD NEGERI 6 LAINEA", created_by="admin"),
            SarprasTanah(id=str(uuid.uuid4()), title="11.900 m²", file="sertifikat_sdn7_buke.pdf", file_type="pdf", unit_kerja="SDN 7 BUKE", created_by="admin"),
        ]
        session.add_all(tanah_items)

        bangunan_items = [
            SarprasBangunan(id=str(uuid.uuid4()), nama="Gedung Kelas 1", luas="800 m²", kepemilikan_id="Milik Sendiri", tahun="2018", persentase=0, kondisi_id="Baik", jns_bantuan_id="DAK Fisik", sumber_id="APBN", unit_kerja="SDN 2 BUKE", created_by="admin"),
            SarprasBangunan(id=str(uuid.uuid4()), nama="Gedung Kelas 2", luas="800 m²", kepemilikan_id="Pinjam", tahun="2019", persentase=5, kondisi_id="Baik", jns_bantuan_id="Reguler", sumber_id="APBD", unit_kerja="SDN 2 BUKE", created_by="admin"),
            SarprasBangunan(id=str(uuid.uuid4()), nama="RKB Unit 1", luas="144 m²", kepemilikan_id="Milik Sendiri", tahun="2021", persentase=0, kondisi_id="Baik", jns_bantuan_id="RKB", sumber_id="APBD", unit_kerja="SDN 5 PALANGGA SELATAN", created_by="admin"),
            SarprasBangunan(id=str(uuid.uuid4()), nama="Gedung Laboratorium Komputer", luas="120 m²", kepemilikan_id="Milik Sendiri", tahun="2022", persentase=10, kondisi_id="Baik", jns_bantuan_id="DAK Digital", sumber_id="APBN", unit_kerja="SMPN 1 ANDOOLO", created_by="admin"),
        ]
        session.add_all(bangunan_items)

        ruang_items = [
            SarprasRuang(id=str(uuid.uuid4()), nama="Ruangan Kelas 1A", luas="56 m²", kondisi_id="Baik", unit_kerja="SDN 2 BUKE", created_by="admin"),
            SarprasRuang(id=str(uuid.uuid4()), nama="Ruang Belajar Kelas 1", luas="56 m²", kondisi_id="Baik", unit_kerja="SDN 5 KOLONO", created_by="admin"),
            SarprasRuang(id=str(uuid.uuid4()), nama="Ruang Perpustakaan Digital", luas="72 m²", kondisi_id="Baik", unit_kerja="SMPN 1 ANDOOLO", created_by="admin"),
        ]
        session.add_all(ruang_items)

        peralatan_items = [
            SarprasPeralatan(id=str(uuid.uuid4()), nama="Chromebook Asus C214", jml_alat=15, kondisi_id="Baik", tahun=2023, sumber_id="DAK Fisik", unit_kerja="SDN 2 BUKE", created_by="admin"),
            SarprasPeralatan(id=str(uuid.uuid4()), nama="Printer All-in-One Epson L3110", jml_alat=2, kondisi_id="Baik", tahun=2022, sumber_id="Dana BOSP", unit_kerja="SDN 2 BUKE", created_by="admin"),
            SarprasPeralatan(id=str(uuid.uuid4()), nama="Smart Board Interaktif 65 Inci", jml_alat=1, kondisi_id="Baik", tahun=2024, sumber_id="APBD", unit_kerja="SMPN 1 ANDOOLO", created_by="admin"),
        ]
        session.add_all(peralatan_items)

        # 2. Usulan
        usulan_items = [
            UsulanTunjanganGuru(id=str(uuid.uuid4()), triwulan_id="Triwulan III", jenis_id="Tunjangan Profesi Guru (TPG)", kelas_id="Guru", jml_guru=12, nominal=144000000, file="berkas_tpg_tw3.pdf", file_type="pdf", unit_kerja="SDN 2 BUKE", created_by="admin"),
            UsulanTunjanganGuru(id=str(uuid.uuid4()), triwulan_id="Triwulan III", jenis_id="Tunjangan Khusus Guru (TKG)", kelas_id="Guru", jml_guru=8, nominal=96000000, file="berkas_tkg_tw3.pdf", file_type="pdf", unit_kerja="SD-SMPN SATAP 16 KONSEL", created_by="admin"),
            UsulanPipPendukung(id=str(uuid.uuid4()), uraian="SK Rekomendasi Alokasi Bantuan PIP Tahap 2", jenjang_id="SD", nominal=45000000, tahun="2026", file="sk_pip_tahap2.pdf", unit_kerja="SDN 2 BUKE", created_by="admin"),
            UsulanAssessment(id=str(uuid.uuid4()), status_sekolah_id="Mandiri", jml_siswa=45, jml_laki=22, jml_perempuan=23, kurikulum_k13="Tidak", kurikulum_kurmer="Ya", file="kesiapan_anbk_2026.pdf", unit_kerja="SMPN 1 ANDOOLO", created_by="admin"),
            UsulanRekonsiliasiBosp(id=str(uuid.uuid4()), tahun="2026", semester_id="Semester 1", file="spj_bosp_sem1.pdf", unit_kerja="SDN 2 BUKE", created_by="admin"),
        ]
        session.add_all(usulan_items)

        # 3. Rombel
        rombel_items = [
            RombelPaud(id=str(uuid.uuid4()), kategori="Formal", jns_rombel="Kelompok B", tgkt_pendidikan="TK B", kurikulum="Kurikulum Merdeka", nama="Kelompok Belajar Bintang", wali_kelas="Hasnawati, S.Pd", ruang_kelas="Ruang Melati", unit_kerja="TK Negeri Pembina Andoolo", created_by="admin"),
            RombelSd(id=str(uuid.uuid4()), kategori="Reguler", jns_rombel="Kelas 1", tgkt_pendidikan="Kelas 1", kurikulum="Kurikulum Merdeka", nama="Kelas 1A", wali_kelas="Sri Wahyuni, S.Pd", ruang_kelas="Ruangan Kelas 1A", unit_kerja="SDN 2 BUKE", created_by="admin"),
            RombelSmp(id=str(uuid.uuid4()), kategori="Reguler", jns_rombel="Kelas 7", tgkt_pendidikan="Kelas 7", kurikulum="Kurikulum Merdeka", nama="Kelas 7-1", wali_kelas="Ahmad Yani, M.Pd", ruang_kelas="Ruang 7A", unit_kerja="SMPN 1 ANDOOLO", created_by="admin"),
        ]
        session.add_all(rombel_items)

        # 4. Kegiatan & Komunitas & Piagam
        kegiatan_items = [
            KegiatanSekolah(id=str(uuid.uuid4()), judul="Simulasi dan Gladi Bersih ANBK Jenjang SMP Tahun 2026", deskripsi="Pelaksanaan simulasi teknis sinkronisasi server dan tes gladi bersih Asesmen Nasional.", tanggal="2026-09-15", tahun="2026", link="https://dikbud.konaweselatankab.go.id", unit_kerja="SMPN 1 ANDOOLO", created_by="admin"),
            KegiatanSekolah(id=str(uuid.uuid4()), judul="Festival Seni Tari Lulo dan Lagu Tradisional Tolaki Pelajar", deskripsi="Ajang apresiasi budaya dan kearifan lokal suku Tolaki bagi peserta didik SD dan SMP.", tanggal="2026-10-02", tahun="2026", unit_kerja="Dinas Pendidikan dan Kebudayaan", created_by="admin"),
            KomunitasBelajar(id=str(uuid.uuid4()), uraian="Kombel Cerdas Berbagi SDN 2 BUKE", jns_kegiatan="Berbagi Praktik Baik", deskripsi="Sesi diskusi mingguan antar pendidik mengenai diferensiasi konten dan asesmen formatif.", type="Internal", unit_kerja="SDN 2 BUKE", created_by="admin"),
            KomunitasBelajar(id=str(uuid.uuid4()), uraian="MGMP IPA SMP Kabupaten Konawe Selatan", jns_kegiatan="Bedah Modul Ajar", deskripsi="Penyelarasan alur tujuan pembelajaran sains berbasis eksperimen sederhana.", type="Daerah", unit_kerja="SMPN 1 ANDOOLO", created_by="admin"),
            PiagamSertifikat(id=str(uuid.uuid4()), kegiatan="Olimpiade Sains Nasional Tingkat Kabupaten", penyelenggara="Dinas Dikbud Konsel", tahun="2026", tempat_pelaksana="Andoolo", sebagai="Juara 1", file="sertifikat_osn_2026.pdf", unit_kerja="SDN 1 RANOMEETO", created_by="admin"),
        ]
        session.add_all(kegiatan_items)

        # 5. Jurnal
        jurnal_items = [
            JurnalGuruKelas(id=str(uuid.uuid4()), sekolah="SDN 2 BUKE", tema="Kegemaranku", materi_pokok="Mengenal Bunyi Alam dan Buatan", pertemuan_ke=1, tgl="2026-10-28", model_pembelajaran="Discovery Learning", metode_pembelajaran="Ceramah & Tanya Jawab", kegiatan="Siswa mengamati dan mendengarkan rekaman suara alam di lingkungan sekolah.", penilaian="Penilaian Sikap & Formatif Lisan", siswa_hadir=28, siswa_izin=1, siswa_sakit=0, siswa_alpa=0, persentase=96, keterangan="KBM berjalan sangat kondusif.", unit_kerja="SDN 2 BUKE", created_by="admin"),
            JurnalKepalaSekolah(id=str(uuid.uuid4()), uraian="Supervisi Akademik Guru Kelas Rendah", target="Guru Kelas 1, 2, dan 3", hasil="Pendidik telah mengintegrasikan modul ajar dengan media audiovisual.", keterlibatan="Kepala Sekolah dan Dewan Guru", tgl="2026-10-25", keterangan="Tindak lanjut berupa pendampingan refleksi.", unit_kerja="SDN 2 BUKE", created_by="admin"),
            JurnalPengawas(id=str(uuid.uuid4()), kepsek="Drs. H. Mursalin", pendampingan_id="Manajerial", temuan_akademik="Capaian literasi siswa menunjukkan peningkatan signifikan.", temuan_manajerial="Pengelolaan inventaris sarpras dan pembukuan BOSP tertib administrasi.", tindak_lanjut="Pertahankan ritme evaluasi berkala.", tugas_id="Pengawasan Reguler", tgl="2026-10-20", unit_kerja="Pengawas Wilayah 1", created_by="admin"),
            JurnalBk(id=str(uuid.uuid4()), nm_siswa="Andi Pratama", kelas_id="7-1", tgl="2026-10-22", materi_layanan="Bimbingan Pribadi & Motivasi Belajar", permasalahan="Penurunan konsentrasi belajar saat jam pelajaran siang.", mdl_kegiatan_id="Konseling Individu", jns_layanan_id="Layanan Bimbingan Konseling", hasil="Siswa berkomitmen mengatur pola tidur dan jadwal belajar mandiri.", rnc_tindak_lanjut="Pemantauan berkala bersama wali kelas.", unit_kerja="SMPN 1 ANDOOLO", created_by="admin"),
        ]
        session.add_all(jurnal_items)

        # 6. Gallery
        gallery_items = [
            GallerySekolahPenggerak(id=str(uuid.uuid4()), kategori="Inovasi Belajar", judul="Transformasi Pembelajaran Berbasis Proyek (P5) Gaya Hidup Berkelanjutan", tujuan="Menumbuhkan kepedulian lingkungan melalui pemilahan sampah organik dan kompos.", proses="Peserta didik bersama fasilitator membuat bank sampah mini di sekolah.", hasil="Tercipta 50 kantong pupuk kompos siap pakai.", link="https://youtube.com/watch?v=sample1", unit_kerja="SDN 2 BUKE", created_by="admin"),
            GalleryGuruPenggerak(id=str(uuid.uuid4()), kategori="Kepemimpinan Murid", judul="Lokakarya 4 Program Guru Penggerak Angkatan 10 Konawe Selatan", tujuan="Penguatan kompetensi coaching bagi pendidik penggerak.", proses="Simulasi coaching akademik antar rekan sejawat.", hasil="Penyusunan Rencana Aksi Nyata di masing-masing satuan pendidikan.", link="https://youtube.com/watch?v=sample2", unit_kerja="Dinas Dikbud Konsel", created_by="admin"),
            GalleryVideoTestimoni(id=str(uuid.uuid4()), judul="Testimoni Guru Mengenai Dampak Digitalisasi Pendidikan di Konawe Selatan", link="https://youtube.com/watch?v=testimoni1", unit_kerja="Dinas Dikbud Konsel", created_by="admin"),
        ]
        session.add_all(gallery_items)

        # 7. Verifikasi
        verifikasi_items = [
            VerifikasiTunjanganGuru(id=str(uuid.uuid4()), status="Disetujui", pesan="Berkas SKMT dan absensi kepegawaian valid serta memenuhi beban mengajar minimal 24 jam.", usulan_id="TPG-2026-TW3", unit_kerja="Dinas Dikbud Konsel", created_by="admin"),
            VerifikasiRekonsiliasiBosp(id=str(uuid.uuid4()), status_1="Disetujui", pesan_1="Laporan SPJ Tahap 1 sesuai bukti belanja modal dan operasional.", usulan_id="BOSP-2026-SEM1", unit_kerja="Dinas Dikbud Konsel", created_by="admin"),
        ]
        session.add_all(verifikasi_items)

        # 8. Regulasi GTK
        gtk_items = [
            GtkPengumuman(id=str(uuid.uuid4()), judul="Pemberkasan Usulan Sertifikasi Pendidik Periode Triwulan IV", deskripsi="Diimbau kepada seluruh guru penerima TPG untuk mengunggah SPTJM dan rekapitulasi kehadiran sebelum 15 November 2026.", file="juknis_pemberkasan.pdf", file_type="pdf", unit_kerja="Bidang GTK", created_by="admin"),
            GtkModulPelatihan(id=str(uuid.uuid4()), judul="Modul Pelatihan Pemanfaatan Canva for Education & Chromebook", deskripsi="Buku panduan praktis pembuatan infografis edukatif dan presentasi interaktif.", file="modul_canva_edu.pdf", file_type="pdf", unit_kerja="Bidang GTK", created_by="admin"),
            GtkRegulasi(id=str(uuid.uuid4()), judul="Peraturan Bupati Konawe Selatan tentang Petunjuk Teknis Tambahan Penghasilan Guru", deskripsi="Regulasi resmi mengenai penyaluran Tamsil ASN daerah bagi guru non-sertifikasi.", tahun="2026", file="perbup_tamsil_2026.pdf", file_type="pdf", unit_kerja="Bagian Hukum & GTK", created_by="admin"),
        ]
        session.add_all(gtk_items)

        # 9. PPDB & Kuota
        ppdb_items = [
            PpdbSd(id=str(uuid.uuid4()), nama="Muh. Alif Pratama", nm_panggilan="Alif", jns_kelamin="Laki-laki", nisn="3165892102", nik="7405011204180002", tmp_lahir="Andoolo", tgl_lahir="2018-04-12", agama="Islam", anak_keberapa=1, jml_saudara=2, alamat="Jl. Poros Andoolo Utama No. 14", tmp_tinggal="Bersama Orang Tua", moda_transportasi="Jalan Kaki", nama_ayah="Baharuddin", nama_ibu="Siti Rahma", unit_kerja="SDN 2 BUKE", created_by="admin"),
            PpdbSmp(id=str(uuid.uuid4()), nama="Nurul Azizah", nm_panggilan="Azizah", jns_kelamin="Perempuan", nisn="3147820194", nik="7405025508120001", tmp_lahir="Ranomeeto", tgl_lahir="2012-08-15", agama="Islam", anak_keberapa=2, jml_saudara=3, alamat="Desa Ranooha Lainea", tmp_tinggal="Bersama Orang Tua", moda_transportasi="Sepeda Motor", nama_ayah="Sukirman", nama_ibu="Hamsiah", unit_kerja="SMPN 1 ANDOOLO", created_by="admin"),
            KuotaPpdb(id=str(uuid.uuid4()), nama_sekolah="SDN 2 BUKE", jenjang="SD", jml_ruang_tersedia=6, standar_maks_rombel=28, total_daya_tampung=168, siswa_terdaftar=142, sisa_kuota=26, status_kuota="Tersedia", unit_kerja="SDN 2 BUKE", created_by="admin"),
            KuotaPpdb(id=str(uuid.uuid4()), nama_sekolah="SMPN 1 ANDOOLO", jenjang="SMP", jml_ruang_tersedia=8, standar_maks_rombel=32, total_daya_tampung=256, siswa_terdaftar=250, sisa_kuota=6, status_kuota="Hampir Penuh", unit_kerja="SMPN 1 ANDOOLO", created_by="admin"),
        ]
        session.add_all(ppdb_items)

        # 10. Profile
        profile_items = [
            ProfileRenstra(id=str(uuid.uuid4()), isi="Rencana Strategis (Renstra) Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan 2026-2030 memprioritaskan peningkatan aksesibilitas pendidikan bermutu, pemerataan sarana digital, dan pelestarian budaya lokal Tolaki.", file="renstra_dikbud_2026_2030.pdf", created_by="admin"),
            ProfileTugasFungsi(id=str(uuid.uuid4()), isi="Dinas Pendidikan dan Kebudayaan bertugas melaksanakan urusan pemerintahan konkuren di bidang pendidikan anak usia dini, pendidikan dasar, pendidikan nonformal, serta kebudayaan daerah.", created_by="admin"),
            ProfileVisiMisi(id=str(uuid.uuid4()), isi="Visi: Terwujudnya Layanan Pendidikan Konawe Selatan yang Setara, Unggul, Berkarakter, dan Berdaya Saing Global Berlandaskan Nilai Budaya Luhur.", created_by="admin"),
        ]
        session.add_all(profile_items)

        # 11. Berita
        berita_items = [
            Berita(id=str(uuid.uuid4()), judul="Dikbud Konsel Dorong Pemanfaatan Teknologi & Perangkat Digital dalam Pembelajaran di Sekolah", slug="teknologi-pembelajaran-sekolah", sumber="Humas Dikbud Konsel", kategori="Pendidikan", author="Tim Publikasi & Media", deskripsi="Pemerintah Kabupaten Konawe Selatan melalui Dinas Pendidikan mempercepat digitalisasi ruang kelas dan pemanfaatan Chromebook.", isi="<p>Pemerintah Kabupaten Konawe Selatan melalui Dinas Pendidikan dan Kebudayaan terus mendorong integrasi teknologi informasi dan komunikasi ke dalam aktivitas belajar mengajar di seluruh satuan pendidikan jenjang SD dan SMP.</p>", foto="/img/pendidikan-jenjang.jpg", status="Terbit", featured=True, created_by="admin"),
            Berita(id=str(uuid.uuid4()), judul="Pelestarian Seni Musik Tradisional Tolaki Melalui Pembinaan Ekstrakurikuler Sekolah", slug="pelestarian-seni-musik-tolaki", sumber="Bidang Kebudayaan", kategori="Kebudayaan", author="Bidang Kebudayaan", deskripsi="Gamelan bambu dan tarian lulo khas Tolaki kini masuk sebagai muatan lokal unggulan sekolah dasar di Konawe Selatan.", isi="<p>Dinas Pendidikan dan Kebudayaan Konawe Selatan meluncurkan program pembinaan seni tradisi suku Tolaki di lingkungan satuan pendidikan dasar.</p>", foto="/img/kebudayaan-sanggar.jpg", status="Terbit", featured=False, created_by="admin"),
        ]
        session.add_all(berita_items)

        await session.commit()
        print("Operational data successfully seeded!")


if __name__ == "__main__":
    asyncio.run(seed_operational())
