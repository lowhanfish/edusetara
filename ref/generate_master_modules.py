import os
import json

base_dir = "admin/app/(admin)/admin/master"

# 22 standard master modules configuration
master_modules = [
    # Master Usulan
    {
        "slug": "usulan/jenis-penerima",
        "title": "Jenis Penerima",
        "entity": "JenisPenerima",
        "category": "Master Usulan",
        "category_slug": "usulan",
        "endpoint": "/api/v1/admin/master/usulan/jenis-penerima",
        "query_key": "master-usulan-jenis-penerima",
        "icon": "👥",
        "desc": "Pengelolaan jenis penerimaan tunjangan resmi pendidik (TPG, TKG, Tamsil) sesuai dokumen Arsitektur Sistem Konawe Selatan.",
        "field_title_label": "Nama Penerimaan / Tunjangan (title)",
        "field_title_placeholder": "Contoh: Tunjangan Profesi Guru (TPG)",
        "field_desc_placeholder": "Contoh: Tunjangan yang diberikan kepada guru yang sudah memiliki sertifikat pendidik sebagai penghargaan atas profesionalitasnya.",
        "dummy": [
            {"id": "JP-01", "title": "Tunjangan Profesi Guru (TPG) Sertifikasi", "desc": "Tunjangan bagi guru yang telah memiliki sertifikat pendidik resmi."},
            {"id": "JP-02", "title": "Tunjangan Khusus Guru (TKG)", "desc": "Tunjangan bagi guru yang bertugas di daerah terpencil atau perbatasan."},
            {"id": "JP-03", "title": "Tambahan Penghasilan (Tamsil)", "desc": "Uang tambahan di luar gaji pokok bagi guru ASN non-sertifikasi."}
        ]
    },
    {
        "slug": "usulan/kelas-penerima",
        "title": "Kelas Penerima",
        "entity": "KelasPenerima",
        "category": "Master Usulan",
        "category_slug": "usulan",
        "endpoint": "/api/v1/admin/master/usulan/kelas-penerima",
        "query_key": "master-usulan-kelas-penerima",
        "icon": "🏷️",
        "desc": "Pengelolaan klasifikasi jabatan fungsional atau profesi pendidik yang menjadi sasaran penerima tunjangan.",
        "field_title_label": "Nama Sasaran Penerima (title)",
        "field_title_placeholder": "Contoh: Guru, Kepala Sekolah, Pengawas",
        "field_desc_placeholder": "Contoh: Pendidik profesional yang tugas utamanya mendidik, membimbing, dan mengevaluasi peserta didik di kelas.",
        "dummy": [
            {"id": "KP-01", "title": "Guru", "desc": "Pendidik profesional yang tugas utamanya mendidik, mengajar, dan membimbing siswa di kelas."},
            {"id": "KP-02", "title": "Kepala Sekolah", "desc": "Guru yang diberi tugas tambahan untuk memimpin dan mengelola satuan pendidikan."},
            {"id": "KP-03", "title": "Pengawas", "desc": "Guru ASN yang diangkat untuk melakukan tugas pengawasan akademik dan manajerial pada sekolah binaan."}
        ]
    },
    # Master Jurnal
    {
        "slug": "jurnal/bahan-ajar",
        "title": "Bahan Ajar",
        "entity": "BahanAjar",
        "category": "Master Jurnal",
        "category_slug": "jurnal",
        "endpoint": "/api/v1/admin/master/jurnal/bahan-ajar",
        "query_key": "master-jurnal-bahan-ajar",
        "icon": "📄",
        "desc": "Pengelolaan pilihan metode dan pendekatan pembelajaran yang digunakan guru pada agenda jurnal kelas harian.",
        "field_title_label": "Nama Metode / Bahan Ajar (title)",
        "field_title_placeholder": "Contoh: Ceramah/Teori, Diskusi, Praktek, Tugas",
        "field_desc_placeholder": "Contoh: Metode penyampaian konsep dan prinsip pembelajaran secara terstruktur melalui penjelasan langsung di depan kelas.",
        "dummy": [
            {"id": "MBH-01", "title": "Ceramah/Teori", "desc": "Metode penyampaian materi secara terstruktur oleh guru di depan kelas."},
            {"id": "MBH-02", "title": "Diskusi", "desc": "Metode interaktif berbasis pertukaran ide dan pembahasan studi kasus bersama."},
            {"id": "MBH-03", "title": "Praktek", "desc": "Aktivitas unjuk kerja langsung atau simulasi terpandu di laboratorium."},
            {"id": "MBH-04", "title": "Tugas", "desc": "Instruksi latihan mandiri atau pekerjaan rumah untuk mengukur ketercapaian materi."}
        ]
    },
    {
        "slug": "jurnal/materi-ajar",
        "title": "Materi Ajar",
        "entity": "MateriAjar",
        "category": "Master Jurnal",
        "category_slug": "jurnal",
        "endpoint": "/api/v1/admin/master/jurnal/materi-ajar",
        "query_key": "master-jurnal-materi-ajar",
        "icon": "📚",
        "desc": "Pengelolaan media dan moda pelaksanaan sesi pembelajaran (luring/daring) yang dipilih guru saat mengisi jurnal mengajar.",
        "field_title_label": "Nama Moda / Media Pembelajaran (title)",
        "field_title_placeholder": "Contoh: Tatap Muka, Zoom, Google Meet, Quiz",
        "field_desc_placeholder": "Contoh: Pembelajaran secara langsung (luring) di dalam ruang kelas atau laboratorium sekolah.",
        "dummy": [
            {"id": "MMA-01", "title": "Tatap Muka", "desc": "Pembelajaran langsung di ruang kelas atau laboratorium sekolah."},
            {"id": "MMA-02", "title": "Zoom", "desc": "Pembelajaran tatap maya jarak jauh melalui konferensi video Zoom."},
            {"id": "MMA-03", "title": "Google Meet", "desc": "Pembelajaran tatap maya daring interaktif menggunakan Google Meet."},
            {"id": "MMA-04", "title": "Quiz", "desc": "Asesmen formatif harian atau kuis interaktif berbasis aplikasi."}
        ]
    },
    {
        "slug": "jurnal/kelas",
        "title": "Kelas",
        "entity": "KelasJurnal",
        "category": "Master Jurnal",
        "category_slug": "jurnal",
        "endpoint": "/api/v1/admin/master/jurnal/kelas",
        "query_key": "master-jurnal-kelas",
        "icon": "🏷️",
        "desc": "Pengelolaan tingkat kelas aktif berjalan yang menjadi rujukan kelompok belajar jurnal mengajar guru.",
        "field_title_label": "Nama / Tingkat Kelas (title)",
        "field_title_placeholder": "Contoh: 1, 7, 7A, 8B",
        "field_desc_placeholder": "Contoh: Rombongan belajar tingkat dasar kelas 1 untuk jenjang pendidikan dasar.",
        "dummy": [
            {"id": "KLS-01", "title": "1", "desc": "Rombongan belajar tingkat dasar kelas 1 untuk jenjang SD."},
            {"id": "KLS-02", "title": "7", "desc": "Rombongan belajar umum tingkat kelas 7 jenjang SMP."},
            {"id": "KLS-03", "title": "7A", "desc": "Rombongan belajar spesifik kelas 7 paralel A tahun aktif."}
        ]
    },
    # Master PPDB
    {
        "slug": "ppdb/agama",
        "title": "Agama",
        "entity": "Agama",
        "category": "Master PPDB",
        "category_slug": "ppdb",
        "endpoint": "/api/v1/admin/master/ppdb/agama",
        "query_key": "master-ppdb-agama",
        "icon": "🕌",
        "desc": "Pengelolaan data agama resmi yang diakui negara untuk kelengkapan identitas calon peserta didik baru.",
        "field_title_label": "Nama Agama (title)",
        "field_title_placeholder": "Contoh: Islam, Kristen/Protestan, Katholik, Hindu, Buddha, Konghucu",
        "field_desc_placeholder": "Contoh: Data identitas pemeluk agama resmi bagi calon peserta didik.",
        "dummy": [
            {"id": "AGM-01", "title": "Islam", "desc": "Data identitas pemeluk agama Islam bagi calon peserta didik."},
            {"id": "AGM-02", "title": "Kristen Protestan", "desc": "Data identitas pemeluk agama Kristen Protestan bagi calon peserta didik."},
            {"id": "AGM-03", "title": "Katolik", "desc": "Data identitas pemeluk agama Katolik bagi calon peserta didik."},
            {"id": "AGM-04", "title": "Hindu", "desc": "Data identitas pemeluk agama Hindu bagi calon peserta didik."}
        ]
    },
    {
        "slug": "ppdb/tempat-tinggal",
        "title": "Tempat Tinggal",
        "entity": "TempatTinggal",
        "category": "Master PPDB",
        "category_slug": "ppdb",
        "endpoint": "/api/v1/admin/master/ppdb/tempat-tinggal",
        "query_key": "master-ppdb-tempat-tinggal",
        "icon": "🏠",
        "desc": "Pengelolaan pilihan status kepemilikan atau kondisi hunian tempat tinggal calon peserta didik.",
        "field_title_label": "Status Tempat Tinggal (title)",
        "field_title_placeholder": "Contoh: Bersama Orang Tua, Wali, Kos, Asrama",
        "field_desc_placeholder": "Contoh: Calon peserta didik berdomisili tetap di rumah bersama orang tua kandung.",
        "dummy": [
            {"id": "TTG-01", "title": "Bersama Orang Tua", "desc": "Calon peserta didik berdomisili tetap di rumah bersama orang tua kandung."},
            {"id": "TTG-02", "title": "Wali", "desc": "Calon peserta didik tinggal bersama pihak keluarga wali/pengampu."},
            {"id": "TTG-03", "title": "Kos", "desc": "Calon peserta didik bertempat tinggal di hunian sewa mandiri/kamar kos."},
            {"id": "TTG-04", "title": "Asrama", "desc": "Calon peserta didik bertempat tinggal di asrama naungan yayasan/sekolah."}
        ]
    },
    {
        "slug": "ppdb/transportasi",
        "title": "Mode Transportasi",
        "entity": "Transportasi",
        "category": "Master PPDB",
        "category_slug": "ppdb",
        "endpoint": "/api/v1/admin/master/ppdb/transportasi",
        "query_key": "master-ppdb-transportasi",
        "icon": "🚌",
        "desc": "Pengelolaan pilihan sarana moda transportasi yang digunakan siswa untuk mobilitas berangkat dan pulang sekolah.",
        "field_title_label": "Nama Moda Transportasi (title)",
        "field_title_placeholder": "Contoh: Jalan Kaki, Kendaraan Pribadi, Kendaraan Umum/Angkot, Jemputan Sekolah",
        "field_desc_placeholder": "Contoh: Calon peserta didik menuju ke sekolah dengan berjalan kaki karena jarak dekat.",
        "dummy": [
            {"id": "TRN-01", "title": "Jalan Kaki", "desc": "Calon siswa menuju ke sekolah dengan berjalan kaki karena jarak dekat."},
            {"id": "TRN-02", "title": "Kendaraan Pribadi", "desc": "Penggunaan motor/mobil keluarga secara mandiri atau diantar."},
            {"id": "TRN-03", "title": "Kendaraan Umum/Angkot", "desc": "Penggunaan angkutan kota, bus reguler, atau moda umum lainnya."},
            {"id": "TRN-04", "title": "Jemputan Sekolah", "desc": "Layanan bus atau mobil antar-jemput khusus peserta didik."}
        ]
    },
    {
        "slug": "ppdb/pendidikan",
        "title": "Pendidikan Orang Tua",
        "entity": "Pendidikan",
        "category": "Master PPDB",
        "category_slug": "ppdb",
        "endpoint": "/api/v1/admin/master/ppdb/pendidikan",
        "query_key": "master-ppdb-pendidikan",
        "icon": "🎓",
        "desc": "Pengelolaan pilihan jenjang kualifikasi pendidikan formal terakhir bagi orang tua/wali murid.",
        "field_title_label": "Tingkat Pendidikan (title)",
        "field_title_placeholder": "Contoh: SD Sederajat, SMP Sederajat, SMA Sederajat, D4/S1, S2/S3",
        "field_desc_placeholder": "Contoh: Kualifikasi pendidikan sarjana terapan maupun strata satu perguruan tinggi.",
        "dummy": [
            {"id": "PND-01", "title": "SD Sederajat", "desc": "Kualifikasi tamat pendidikan dasar formal 6 tahun."},
            {"id": "PND-02", "title": "SMP Sederajat", "desc": "Kualifikasi tamat sekolah menengah pertama."},
            {"id": "PND-03", "title": "SMA Sederajat", "desc": "Kualifikasi tamat pendidikan menengah atas atau kejuruan."},
            {"id": "PND-04", "title": "D4/S1", "desc": "Kualifikasi pendidikan sarjana terapan atau strata satu perguruan tinggi."}
        ]
    },
    {
        "slug": "ppdb/pekerjaan",
        "title": "Pekerjaan Orang Tua",
        "entity": "Pekerjaan",
        "category": "Master PPDB",
        "category_slug": "ppdb",
        "endpoint": "/api/v1/admin/master/ppdb/pekerjaan",
        "query_key": "master-ppdb-pekerjaan",
        "icon": "💼",
        "desc": "Pengelolaan klasifikasi mata pencaharian atau sektor profesi orang tua/wali murid.",
        "field_title_label": "Nama Bidang Pekerjaan (title)",
        "field_title_placeholder": "Contoh: Petani, PNS/TNI/POLRI, Karyawan Swasta, Wiraswasta",
        "field_desc_placeholder": "Contoh: Mata pencaharian di sektor agraris dan pengolahan lahan perkebunan/tani.",
        "dummy": [
            {"id": "PKJ-01", "title": "Petani", "desc": "Mata pencaharian di sektor agraris dan pengolahan lahan tani."},
            {"id": "PKJ-02", "title": "PNS/TNI/POLRI", "desc": "Aparatur sipil negara atau personel pertahanan dan keamanan pemerintah."},
            {"id": "PKJ-03", "title": "Karyawan Swasta", "desc": "Tenaga kerja tetap atau kontrak di instansi atau perusahaan swasta."},
            {"id": "PKJ-04", "title": "Wiraswasta", "desc": "Aktivitas perniagaan atau penyedia jasa usaha mandiri."}
        ]
    },
    {
        "slug": "ppdb/penghasilan",
        "title": "Penghasilan Orang Tua",
        "entity": "Penghasilan",
        "category": "Master PPDB",
        "category_slug": "ppdb",
        "endpoint": "/api/v1/admin/master/ppdb/penghasilan",
        "query_key": "master-ppdb-penghasilan",
        "icon": "💵",
        "desc": "Pengelolaan rentang skala pendapatan bulanan orang tua/wali murid untuk kelengkapan administrasi PPDB.",
        "field_title_label": "Rentang Penghasilan (title)",
        "field_title_placeholder": "Contoh: Kurang dari 500.000, 1.000.000 - 1.999.999, 2.000.000 - 4.999.999",
        "field_desc_placeholder": "Contoh: Kelompok rentang penghasilan keluarga kelas upah minimum daerah per bulan.",
        "dummy": [
            {"id": "PHS-01", "title": "Kurang dari 500.000", "desc": "Kelompok rentang penghasilan keluarga di bawah batas lima ratus ribu rupiah per bulan."},
            {"id": "PHS-02", "title": "1.000.000 - 1.999.999", "desc": "Kelompok rentang penghasilan keluarga kelas menengah ke bawah."},
            {"id": "PHS-03", "title": "2.000.000 - 4.999.999", "desc": "Kelompok rentang penghasilan upah minimum rata-rata daerah per bulan."},
            {"id": "PHS-04", "title": "5.000.000 - 20.000.000", "desc": "Kelompok rentang penghasilan keluarga kelas menengah ke atas."}
        ]
    },
    # Master Sarpras
    {
        "slug": "sarpras/bangunan",
        "title": "Kelaikan Bangunan",
        "entity": "KelaikanBangunan",
        "category": "Master Sarpras",
        "category_slug": "sarpras",
        "endpoint": "/api/v1/admin/master/sarpras/bangunan",
        "query_key": "master-sarpras-bangunan",
        "icon": "🏫",
        "desc": "Pengelolaan klasifikasi tingkat kelaikan fisik atau status kondisi infrastruktur gedung sekolah.",
        "field_title_label": "Klasifikasi Bangunan (title)",
        "field_title_placeholder": "Contoh: Baik, Rusak Ringan, Rusak Sedang, Rusak Berat",
        "field_desc_placeholder": "Contoh: Kondisi bangunan layak pakai tanpa kerusakan signifikan pada struktur.",
        "dummy": [
            {"id": "MBN-01", "title": "Baik", "desc": "Kondisi fisik gedung prima dan layak operasional penuh."},
            {"id": "MBN-02", "title": "Rusak Ringan", "desc": "Kerusakan minor pada cat, plesteran dinding, atau penutup lantai."},
            {"id": "MBN-03", "title": "Rusak Sedang", "desc": "Kerusakan sebagian pada komponen non-struktural atau kebocoran atap."},
            {"id": "MBN-04", "title": "Rusak Berat", "desc": "Kerusakan parah pada elemen struktur utama yang memerlukan renovasi total."}
        ]
    },
    {
        "slug": "sarpras/kepemilikan",
        "title": "Kepemilikan Sarpras",
        "entity": "KepemilikanSarpras",
        "category": "Master Sarpras",
        "category_slug": "sarpras",
        "endpoint": "/api/v1/admin/master/sarpras/kepemilikan",
        "query_key": "master-sarpras-kepemilikan",
        "icon": "📜",
        "desc": "Pengelolaan status legalitas hak penguasaan atas tanah, gedung, atau fasilitas fisik yang digunakan satuan pendidikan.",
        "field_title_label": "Status Kepemilikan (title)",
        "field_title_placeholder": "Contoh: Milik Sendiri, Sewa, Pinjam, Hibah",
        "field_desc_placeholder": "Contoh: Fasilitas sarana dan prasarana dimiliki sah secara penuh oleh pemerintah daerah atau satuan pendidikan.",
        "dummy": [
            {"id": "KPM-01", "title": "Milik Sendiri", "desc": "Aset sarana prasarana sah milik pemerintah daerah atau sekolah."},
            {"id": "KPM-02", "title": "Sewa", "desc": "Pemanfaatan aset gedung/lahan melalui perjanjian sewa pihak ketiga."},
            {"id": "KPM-03", "title": "Pinjam", "desc": "Status pinjam pakai dari instansi pemerintah lain tanpa kompensasi sewa."},
            {"id": "KPM-04", "title": "Hibah", "desc": "Penerimaan aset dari masyarakat, yayasan, atau hibah pihak lain."}
        ]
    },
    {
        "slug": "sarpras/sumber-dana",
        "title": "Sumber Dana",
        "entity": "SumberDana",
        "category": "Master Sarpras",
        "category_slug": "sarpras",
        "endpoint": "/api/v1/admin/master/sarpras/sumber-dana",
        "query_key": "master-sarpras-sumber-dana",
        "icon": "💰",
        "desc": "Pengelolaan pos anggaran atau asal pembiayaan pengadaan, pemeliharaan, serta belanja modal sarpras sekolah.",
        "field_title_label": "Nama Sumber Dana (title)",
        "field_title_placeholder": "Contoh: APBD Kabupaten, APBN/DAK, Dana BOS, Komite/CSR, Dana Hibah",
        "field_desc_placeholder": "Contoh: Alokasi anggaran belanja modal yang bersumber dari Anggaran Pendapatan dan Belanja Daerah Kabupaten.",
        "dummy": [
            {"id": "SBD-01", "title": "APBD Kabupaten", "desc": "Alokasi anggaran yang bersumber dari APBD Kabupaten Konawe Selatan."},
            {"id": "SBD-02", "title": "Dana Alokasi Khusus (DAK)", "desc": "Bantuan fisik pemerintah pusat untuk rehabilitasi dan pembangunan ruang baru."},
            {"id": "SBD-03", "title": "Bantuan Operasional Sekolah (BOS)", "desc": "Anggaran operasional reguler untuk belanja alat dan pemeliharaan berkala."},
            {"id": "SBD-04", "title": "Dana Hibah", "desc": "Penerimaan pembiayaan sarpras dari bantuan sukarela pihak ketiga."}
        ]
    },
    {
        "slug": "sarpras/kondisi-alat",
        "title": "Kondisi Alat / Aset",
        "entity": "KondisiAlat",
        "category": "Master Sarpras",
        "category_slug": "sarpras",
        "endpoint": "/api/v1/admin/master/sarpras/kondisi-alat",
        "query_key": "master-sarpras-kondisi-alat",
        "icon": "🔧",
        "desc": "Pengelolaan status kelaikan operasional untuk peralatan TIK, perangkat elektronik, dan mebel kelas.",
        "field_title_label": "Status Kondisi Alat (title)",
        "field_title_placeholder": "Contoh: Baik / Berfungsi Normal, Rusak Ringan, Rusak Berat / Afkir",
        "field_desc_placeholder": "Contoh: Peralatan beroperasi normal tanpa kendala fungsi maupun fisik.",
        "dummy": [
            {"id": "KDA-01", "title": "Baik / Normal", "desc": "Peralatan beroperasi prima tanpa kendala fungsional."},
            {"id": "KDA-02", "title": "Rusak Ringan", "desc": "Peralatan mengalami kendala parsial namun masih dapat diperbaiki cepat."},
            {"id": "KDA-03", "title": "Rusak Berat", "desc": "Malfungsi permanen, komponen hancur, atau masuk usulan penghapusan aset."}
        ]
    },
    {
        "slug": "sarpras/jenis-bantuan",
        "title": "Jenis Bantuan Sarpras",
        "entity": "JenisBantuan",
        "category": "Master Sarpras",
        "category_slug": "sarpras",
        "endpoint": "/api/v1/admin/master/sarpras/jenis-bantuan",
        "query_key": "master-sarpras-jenis-bantuan",
        "icon": "🎁",
        "desc": "Pengelolaan skema program bantuan fisik atau intervensi sarana yang dialokasikan ke satuan pendidikan.",
        "field_title_label": "Nama Program Bantuan (title)",
        "field_title_placeholder": "Contoh: Bantuan TIK / Chromebook, Revitalisasi Ruang Kelas, Pembangunan RKB, BOSP Reguler",
        "field_desc_placeholder": "Contoh: Skema bantuan perangkat komputasi pembelajaran digital bagi siswa dan guru.",
        "dummy": [
            {"id": "JBT-01", "title": "Bantuan TIK Kemendikbudristek", "desc": "Paket pengadaan Chromebook, wireless router, dan proyektor."},
            {"id": "JBT-02", "title": "DAK Fisik Rehabilitasi Ruang", "desc": "Program perbaikan atap, lantai, dan kusen ruang kelas rusak sedang/berat."},
            {"id": "JBT-03", "title": "Bantuan Operasional Sekolah (BOS)", "desc": "Dukungan pengadaan alat penunjang KBM harian rutin."}
        ]
    },
    # Master BK & Lainnya
    {
        "slug": "bk-jenis-layanan",
        "title": "BK Jenis Layanan",
        "entity": "BkJenisLayanan",
        "category": "Master BK",
        "category_slug": "bk",
        "endpoint": "/api/v1/admin/master/bk-jenis-layanan",
        "query_key": "master-bk-jenis-layanan",
        "icon": "🧑‍⚕️",
        "desc": "Pengelolaan klasifikasi bidang bimbingan konseling (pribadi, sosial, belajar, karir) yang dicatat guru BK.",
        "field_title_label": "Nama Bidang Layanan BK (title)",
        "field_title_placeholder": "Contoh: Pribadi, Sosial, Belajar, Karir",
        "field_desc_placeholder": "Contoh: Layanan konseling strategi akademik, motivasi belajar, dan peminatan studi.",
        "dummy": [
            {"id": "BKL-01", "title": "Pribadi", "desc": "Layanan pemahaman diri, pengelolaan emosi, dan kemandirian karakter."},
            {"id": "BKL-02", "title": "Sosial", "desc": "Layanan relasi pertemanan, adaptasi lingkungan sekolah, dan pencegahan perundungan."},
            {"id": "BKL-03", "title": "Belajar", "desc": "Konseling strategi belajar, manajemen waktu, dan tindak lanjut penurunan nilai."},
            {"id": "BKL-04", "title": "Karir", "desc": "Arahan peminatan bakat, perencanaan studi lanjutan, atau persiapan kerja."}
        ]
    },
    {
        "slug": "bk-kegiatan-layanan",
        "title": "BK Kegiatan Layanan",
        "entity": "BkKegiatanLayanan",
        "category": "Master BK",
        "category_slug": "bk",
        "endpoint": "/api/v1/admin/master/bk-kegiatan-layanan",
        "query_key": "master-bk-kegiatan-layanan",
        "icon": "🩺",
        "desc": "Pengelolaan bentuk operasional pemberian layanan bimbingan konseling (konseling individu, kelompok, home visit).",
        "field_title_label": "Bentuk Kegiatan Layanan BK (title)",
        "field_title_placeholder": "Contoh: Konseling Individu, Konseling Kelompok, Home Visit, Alih Tangan Kasus",
        "field_desc_placeholder": "Contoh: Kunjungan langsung guru BK ke tempat tinggal siswa guna koordinasi dengan orang tua.",
        "dummy": [
            {"id": "BKK-01", "title": "Konseling Individu", "desc": "Sesi tatap muka personal satu lawan satu untuk penanganan masalah siswa."},
            {"id": "BKK-02", "title": "Konseling Kelompok", "desc": "Diskusi kelompok terarah guna menelaah dinamika masalah bersama."},
            {"id": "BKK-03", "title": "Home Visit", "desc": "Kunjungan langsung ke rumah orang tua/wali siswa guna investigasi latar belakang."},
            {"id": "BKK-04", "title": "Alih Tangan Kasus (Referral)", "desc": "Pengalihan penanganan ke pihak profesional berwenang (psikolog/ahli)."}
        ]
    },
    {
        "slug": "model-pembelajaran",
        "title": "Model Pembelajaran",
        "entity": "ModelPembelajaran",
        "category": "Master Pedagogi",
        "category_slug": "pedagogi",
        "endpoint": "/api/v1/admin/master/model-pembelajaran",
        "query_key": "master-model-pembelajaran",
        "icon": "💡",
        "desc": "Pengelolaan sintaks kerangka strategi pembelajaran terstruktur (Problem Based Learning, Project Based, dll.) rujukan jurnal guru.",
        "field_title_label": "Nama Model Pembelajaran (title)",
        "field_title_placeholder": "Contoh: Problem Based Learning (PBL), Project Based Learning (PjBL), Discovery Learning, Inquiry",
        "field_desc_placeholder": "Contoh: Model pembelajaran berbasis pemecahan masalah kontekstual yang mengasah daya nalar kritis siswa.",
        "dummy": [
            {"id": "MDL-01", "title": "Problem Based Learning (PBL)", "desc": "Pembelajaran berorientasi pemecahan masalah kontekstual nyata."},
            {"id": "MDL-02", "title": "Project Based Learning (PjBL)", "desc": "Pembelajaran berbasis proyek dan karya unjuk kerja kelompok."},
            {"id": "MDL-03", "title": "Discovery Learning", "desc": "Pembelajaran penemuan terpandu untuk memahami konsep secara mandiri."},
            {"id": "MDL-04", "title": "Inquiry Learning", "desc": "Pembelajaran berbasis penyelidikan ilmiah dan eksperimen terarah."}
        ]
    },
    {
        "slug": "pendampingan",
        "title": "Master Pendampingan",
        "entity": "Pendampingan",
        "category": "Master Kepengawasan",
        "category_slug": "kepengawasan",
        "endpoint": "/api/v1/admin/master/pendampingan",
        "query_key": "master-pendampingan",
        "icon": "🤝",
        "desc": "Pengelolaan tahapan siklus pendampingan manajerial dan supervisi program kerja sekolah oleh pengawas/kepala sekolah.",
        "field_title_label": "Tahap / Jenis Pendampingan (title)",
        "field_title_placeholder": "Contoh: Perencanaan Program, Pendampingan Pelaksanaan, Evaluasi & Refleksi, Pelaporan Bersiklus",
        "field_desc_placeholder": "Contoh: Pengawalan, observasi, dan supervisi langsung terhadap implementasi program kerja di lapangan.",
        "dummy": [
            {"id": "PDP-01", "title": "Perencanaan Program Sekolah", "desc": "Fasilitasi penyusunan Rencana Kerja Tahunan dan instrumen asesmen."},
            {"id": "PDP-02", "title": "Pendampingan Pelaksanaan Program", "desc": "Pengawalan dan supervisi klinis jalannya kegiatan belajar di kelas."},
            {"id": "PDP-03", "title": "Evaluasi dan Refleksi Mutu", "desc": "Analisis capaian kinerja berbasis indikator Rapor Pendidikan."},
            {"id": "PDP-04", "title": "Pelaporan Bersiklus", "desc": "Penyusunan laporan pertanggungjawaban dan rencana tindak lanjut perbaikan."}
        ]
    },
    {
        "slug": "tugas",
        "title": "Master Tugas",
        "entity": "Tugas",
        "category": "Master Kepengawasan",
        "category_slug": "tugas",
        "endpoint": "/api/v1/admin/master/tugas",
        "query_key": "master-tugas",
        "icon": "📌",
        "desc": "Pengelolaan peran atau fungsi penugasan formal pendidik/tendik dalam kegiatan sekolah, asesmen, atau kepengawasan.",
        "field_title_label": "Nama Peran / Tugas (title)",
        "field_title_placeholder": "Contoh: Narasumber, Pendamping Akademik, Verifikator Lapangan, Pengawas Ujian",
        "field_desc_placeholder": "Contoh: Peran penugasan sebagai fasilitator peningkatan mutu pembelajaran pada forum lokakarya sekolah.",
        "dummy": [
            {"id": "TGS-01", "title": "Narasumber", "desc": "Pemberi materi keahlian pada agenda workshop atau lokakarya guru."},
            {"id": "TGS-02", "title": "Pendamping Akademik", "desc": "Fasilitator pendampingan implementasi kurikulum merdeka pada sekolah binaan."},
            {"id": "TGS-03", "title": "Verifikator Berkas", "desc": "Pemeriksa kelengkapan administrasi dan berkas pertanggungjawaban."}
        ]
    },
    {
        "slug": "kategori",
        "title": "Kategori Dokumen SPJ BOSP",
        "entity": "KategoriBosp",
        "category": "Master Keuangan BOSP",
        "category_slug": "kategori",
        "endpoint": "/api/v1/admin/master/kategori",
        "query_key": "master-kategori",
        "icon": "🗂️",
        "desc": "Pengelolaan rujukan 26 klasifikasi berkas pertanggungjawaban (SPJ) dana BOSP saat unggah usulan rekonsiliasi.",
        "field_title_label": "Nama Dokumen / Kategori SPJ (title)",
        "field_title_placeholder": "Contoh: Buku Kas Umum (BKU), Buku Pembantu Pajak, SPTJM Bermaterai, Rekening Koran BOSP",
        "field_desc_placeholder": "Contoh: Rekapitulasi pemotongan dan penyetoran pajak belanja BOSP dengan bukti e-Billing NTPN valid.",
        "dummy": [
            {"id": "KTG-01", "title": "Buku Kas Umum (BKU)", "desc": "Pencatatan seluruh transaksi kas penerimaan dan pengeluaran dana BOSP sah bertandatangan."},
            {"id": "KTG-02", "title": "Buku Pembantu Pajak", "desc": "Rekapitulasi bukti potong dan bukti setor e-Billing NTPN pajak belanja sekolah."},
            {"id": "KTG-03", "title": "Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)", "desc": "Pernyataan keabsahan penggunaan belanja BOSP bermaterai resmi dari Kepala Sekolah."},
            {"id": "KTG-04", "title": "Laporan Realisasi Anggaran (LRA)", "desc": "Rekapitulasi penyerapan anggaran per semester dicocokkan dengan rekening koran bank."}
        ]
    }
]

print(f"Loaded {len(master_modules)} master modules configuration.")

for cfg in master_modules:
    slug = cfg["slug"]
    title = cfg["title"]
    entity = cfg["entity"]
    category = cfg["category"]
    endpoint = cfg["endpoint"]
    query_key = cfg["query_key"]
    icon = cfg["icon"]
    desc = cfg["desc"]
    f_title_lbl = cfg["field_title_label"]
    f_title_ph = cfg["field_title_placeholder"]
    f_desc_ph = cfg["field_desc_placeholder"]
    dummy_list = cfg["dummy"]
    
    target_dir = os.path.join(base_dir, slug)
    comp_dir = os.path.join(target_dir, "components")
    hooks_dir = os.path.join(target_dir, "hooks")
    os.makedirs(comp_dir, exist_ok=True)
    os.makedirs(hooks_dir, exist_ok=True)
    
    # 1. types.ts
    types_content = f"""export interface CreateInterface {{
  title: string;
  desc?: string | null;
  uraian?: string;
  keterangan?: string | null;
}}

export interface ResponseInterface extends CreateInterface {{
  id: string;
  title: string;
  desc?: string | null;
  uraian?: string;
  keterangan?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}}

export interface ResponseListInterface {{
  skip: number;
  limit: number;
  total: number;
  data: ResponseInterface[];
}}

export type {entity}Record = ResponseInterface;
"""
    with open(os.path.join(target_dir, "types.ts"), "w", encoding="utf-8") as f:
        f.write(types_content)

    # 2. data.ts
    data_content = f"""import {{ {entity}Record }} from "./types";

export const DUMMY_{entity.upper()}: {entity}Record[] = {json.dumps(dummy_list, indent=2, ensure_ascii=False)};
"""
    with open(os.path.join(target_dir, "data.ts"), "w", encoding="utf-8") as f:
        f.write(data_content)

    # 3. hooks/crud.tsx
    hooks_content = f""""use client";

import {{ fetchData }} from "@/lib/api_secure";
import {{ useUrlStore }} from "@/store/useUrlStore";
import {{ useQuery, useMutation, useQueryClient }} from "@tanstack/react-query";
import {{ ResponseListInterface, ResponseInterface }} from "../types";
import {{ swallAlert, showLoadingAlert }} from "@/lib/show_swall";
import {{ ListOptionSchema }} from "@/types/global";

export const useResponseOption = (search: string = "") => {{
  const url = useUrlStore((state) => state.URL.APP);
  const {{ data, isLoading, isError, error }} = useQuery({{
    queryFn: () =>
      fetchData<ResponseInterface[]>(
        `${{url}}{endpoint}/option?search=${{encodeURIComponent(search)}}`
      ),
    queryKey: ["{query_key}-option", search],
  }});

  let result: ListOptionSchema = [];
  if (data) {{
    result = (data as ResponseInterface[])?.map((item: ResponseInterface) => ({{
      id: item.id,
      value: item.title || item.uraian,
    }}));
  }}

  return {{
    List: result,
    isLoading,
    isError,
    error,
  }};
}};

export const useResponseListMaster = (
  skip: number,
  limit: number,
  search: string = ""
) => {{
  const url = useUrlStore((state) => state.URL.APP);
  const {{ data: List, isLoading, isError, error, refetch }} = useQuery({{
    queryFn: () =>
      fetchData<ResponseListInterface>(
        `${{url}}{endpoint}/read?skip=${{(skip - 1) * limit}}&limit=${{limit}}&search=${{encodeURIComponent(search)}}`
      ),
    queryKey: ["{query_key}", skip, limit, search],
  }});
  return {{ List, isLoading, isError, error, refetch }};
}};

export const useDeleteMaster = () => {{
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({{
    mutationFn: (id: string) =>
      fetchData(`${{url}}{endpoint}/delete/${{id}}`, {{
        method: "DELETE",
      }}),
    onSuccess: () => {{
      queryClient.invalidateQueries({{
        queryKey: ["{query_key}"],
      }});
      swallAlert("sukses dihapus", "success");
    }},
    onError: (err: any) => {{
      swallAlert(`gagal dihapus: ${{err?.message || err}}`, "error");
    }},
  }});

  if (deleteMutation.isPending) {{
    showLoadingAlert();
  }}
  return deleteMutation;
}};

export const useCreateMaster = () => {{
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();

  const createMutation = useMutation({{
    mutationFn: (body: Partial<ResponseInterface>) =>
      fetchData(`${{url}}{endpoint}/create`, {{
        method: "POST",
        body: JSON.stringify(body),
        headers: {{
          "Content-Type": "application/json",
        }},
      }}),
    onSuccess: () => {{
      queryClient.invalidateQueries({{
        queryKey: ["{query_key}"],
      }});
      swallAlert("sukses ditambahkan", "success");
    }},
    onError: (err: any) => {{
      swallAlert(`gagal ditambahkan : ${{err?.message || err}}`, "error");
    }},
  }});

  return createMutation;
}};

export const useUpdateMaster = () => {{
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({{
    mutationFn: ({{ body, id }}: {{ body: Partial<ResponseInterface>; id: string }}) =>
      fetchData(`${{url}}{endpoint}/update/${{id}}`, {{
        method: "PUT",
        body: JSON.stringify(body),
        headers: {{
          "Content-Type": "application/json",
        }},
      }}),
    onSuccess: () => {{
      queryClient.invalidateQueries({{ queryKey: ["{query_key}"] }});
      swallAlert("sukses diubah", "success");
    }},
    onError: (err: any) => {{
      swallAlert(`gagal diubah : ${{err?.message || err}}`, "error");
    }},
  }});

  return updateMutation;
}};
"""
    with open(os.path.join(hooks_dir, "crud.tsx"), "w", encoding="utf-8") as f:
        f.write(hooks_content)

    # 4. components/FormModal.tsx
    form_modal_content = f"""import React from "react";
import {{ Button, Input, Modal, Textarea }} from "../../../../../_components/ui";
import {{ ResponseInterface }} from "../types";

interface Form{entity}ModalProps {{
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}}

export default function Form{entity}Modal({{
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}}: Form{entity}ModalProps) {{
  return (
    <Modal
      isOpen={{isOpen}}
      onClose={{onClose}}
      title={{
        formMode === "add"
          ? "+ Tambah Master {title}"
          : "✎ Edit Master {title}"
      }}
      description="Sesuai dokumen Arsitektur Sistem: nama data (title) dan penjelasan singkat (desc)."
      maxWidth="md"
      footer={{
        <>
          <Button variant="outline" type="button" onClick={{onClose}} disabled={{isLoading}}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-{slug.replace('/', '-')}" disabled={{isLoading}}>
            {{isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan {title}"
              : "Perbarui {title}"}}
          </Button>
        </>
      }}
    >
      <form id="form-master-{slug.replace('/', '-')}" onSubmit={{onSubmit}} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            {f_title_lbl} <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={{formData.title || formData.uraian || ""}}
            onChange={{(e) =>
              setFormData({{
                ...formData,
                title: e.target.value,
                uraian: e.target.value,
              }})
            }}
            placeholder="{f_title_ph}"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Penjelasan Singkat (desc)
          </label>
          <Textarea
            rows={{3}}
            value={{formData.desc || formData.keterangan || ""}}
            onChange={{(e) =>
              setFormData({{
                ...formData,
                desc: e.target.value,
                keterangan: e.target.value,
              }})
            }}
            placeholder="{f_desc_ph}"
          />
        </div>
      </form>
    </Modal>
  );
}}
"""
    # handle relative path depth for UI components
    depth_prefix = "../../../../../_components/ui" if "/" in slug else "../../../../_components/ui"
    form_modal_content = form_modal_content.replace("../../../../../_components/ui", depth_prefix)
    
    with open(os.path.join(comp_dir, f"Form{entity}Modal.tsx"), "w", encoding="utf-8") as f:
        f.write(form_modal_content)

    # 5. components/DetailModal.tsx
    detail_modal_content = f"""import React from "react";
import {{ Button, Modal }} from "../../../../../_components/ui";
import {{ ResponseInterface }} from "../types";

interface Detail{entity}ModalProps {{
  isOpen: boolean;
  onClose: () => void;
  record: ResponseInterface | null;
}}

export default function Detail{entity}Modal({{
  isOpen,
  onClose,
  record,
}}: Detail{entity}ModalProps) {{
  return (
    <Modal
      isOpen={{isOpen && Boolean(record)}}
      onClose={{onClose}}
      title="Lembar Data Master {title}"
      description="Sesuai dokumen spesifikasi Arsitektur Sistem EduSetara"
      maxWidth="md"
      footer={{
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#7d7152]">
            Pencatat: {{record?.created_by || "Administrator"}}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={{onClose}}>
              Tutup
            </Button>
            <Button variant="gold" onClick={{() => window.print()}}>
              🖨 Cetak Berkas
            </Button>
          </div>
        </div>
      }}
    >
      {{record && (
        <div className="space-y-4 text-xs text-[#2d2410]">
          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-3">
            <div>
              <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                Nama / Nilai (title)
              </span>
              <h3 className="font-extrabold text-[#2d2410] text-xl mt-0.5">
                {{record.title || record.uraian}}
              </h3>
            </div>

            <div className="pt-2 border-t border-white/60">
              <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                Penjelasan Singkat (desc)
              </span>
              <p className="text-[#5e5133] mt-1 leading-relaxed">
                {{record.desc || record.keterangan || "-"}}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/30 border border-white/50 text-[11px] text-[#7d7152] flex items-center justify-between">
            <span>
              Waktu Pencatatan:{{" "}}
              <strong className="text-[#2d2410]">
                {{record.created_at
                  ? new Intl.DateTimeFormat("id-ID", {{
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }}).format(new Date(record.created_at))
                  : "-"}}
              </strong>
            </span>
            <span className="text-[10px] text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 truncate max-w-[120px]">
              ID: {{record.id}}
            </span>
          </div>
        </div>
      )}}
    </Modal>
  );
}}
"""
    detail_modal_content = detail_modal_content.replace("../../../../../_components/ui", depth_prefix)
    with open(os.path.join(comp_dir, f"Detail{entity}Modal.tsx"), "w", encoding="utf-8") as f:
        f.write(detail_modal_content)

    # 6. page.tsx
    page_depth = "../../../../_components/ui" if "/" in slug else "../../../_components/ui"
    
    breadcrumbs_json = json.dumps([
        {"label": "Dashboard", "href": "/admin"},
        {"label": "Data Master", "href": "/admin/master"},
        {"label": category, "href": f"/admin/master/{slug.split('/')[0]}" if "/" in slug else "/admin/master"},
        {"label": title}
    ], ensure_ascii=False)
    
    page_content = f""""use client";

import React, {{ useEffect, useMemo, useState }} from "react";
import Swal from "sweetalert2";
import {{
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
}} from "{page_depth}";

import {{ ResponseInterface, {entity}Record }} from "./types";
import Form{entity}Modal from "./components/Form{entity}Modal";
import Detail{entity}Modal from "./components/Detail{entity}Modal";
import {{
  useResponseListMaster,
  useDeleteMaster,
  useCreateMaster,
  useUpdateMaster,
}} from "./hooks/crud";
import {{ listindex }} from "@/utilities/pagination";

export default function Master{entity}Page() {{
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {{
    const handler = setTimeout(() => {{
      setDebouncedSearch(search);
      setPage(1);
    }}, 400);

    return () => {{
      clearTimeout(handler);
    }};
  }}, [search]);

  const {{ List, isLoading, isError, error, refetch }} = useResponseListMaster(
    page,
    pageSize,
    debouncedSearch
  );
  const deleteMutation = useDeleteMaster();
  const createMutation = useCreateMaster();
  const updateMutation = useUpdateMaster();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<{entity}Record | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  const initialForm: Partial<ResponseInterface> = {{
    title: "",
    desc: "",
  }};

  const [formData, setFormData] = useState<Partial<ResponseInterface>>(initialForm);

  const emptyForm = () => {{
    setFormData(initialForm);
  }};

  const rawList: {entity}Record[] = useMemo(() => {{
    if (!List?.data || !Array.isArray(List.data)) return [];
    return List.data;
  }}, [List]);

  const totalItems = List?.total ?? rawList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const handleOpenAdd = () => {{
    setFormMode("add");
    emptyForm();
    setIsFormOpen(true);
  }};

  const handleOpenEdit = (record: {entity}Record) => {{
    setFormMode("edit");
    setFormData({{
      id: record.id,
      title: record.title || record.uraian || "",
      desc: record.desc || record.keterangan || "",
      uraian: record.title || record.uraian || "",
      keterangan: record.desc || record.keterangan || "",
    }});
    setIsFormOpen(true);
  }};

  const handleOpenDetail = (record: {entity}Record) => {{
    setSelectedRecord(record);
    setIsDetailOpen(true);
  }};

  const handleDelete = (record: {entity}Record) => {{
    Swal.fire({{
      title: "Hapus Master {title}?",
      text: `Apakah Anda yakin ingin menghapus "${{record.title || record.uraian}}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2410c",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus Data",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }}).then((result) => {{
      if (result.isConfirmed) {{
        deleteMutation.mutate(record.id);
      }}
    }});
  }};

  const handleSubmitForm = (e: React.FormEvent) => {{
    e.preventDefault();

    if (!formData.title?.trim() && !formData.uraian?.trim()) {{
      Swal.fire("Perhatian", "Nama data (title) wajib diisi.", "warning");
      return;
    }}

    const payload: Partial<ResponseInterface> = {{
      title: formData.title?.trim(),
      desc: formData.desc?.trim() || null,
      uraian: formData.title?.trim(),
      keterangan: formData.desc?.trim() || null,
    }};

    if (formMode === "add") {{
      createMutation.mutate(payload, {{
        onSuccess: () => {{
          setIsFormOpen(false);
          emptyForm();
        }},
      }});
    }} else {{
      if (!formData.id) return;
      updateMutation.mutate(
        {{ body: payload, id: formData.id }},
        {{
          onSuccess: () => {{
            setIsFormOpen(false);
            emptyForm();
          }},
        }}
      );
    }}
  }};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master {title}"
        breadcrumbs={{{breadcrumbs_json}}}
        description="{desc}"
        action={{
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={{() => refetch()}}
              disabled={{isLoading}}
              className="hidden sm:inline-flex"
            >
              🔄 Refresh
            </Button>
            <Button variant="gold" size="sm" onClick={{handleOpenAdd}}>
              + Tambah {title}
            </Button>
          </div>
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Total Data</p>
              <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{{totalItems}}</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">Master Terdaftar</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              {icon}
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Kategori</p>
              <h4 className="text-lg font-bold text-amber-700 mt-1 truncate max-w-[140px]">{category}</h4>
              <p className="text-[11px] text-[#7d7152] mt-0.5">Sikola Pindara</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              📁
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Status API</p>
              <h4 className="text-2xl font-bold text-emerald-700 mt-1">Terhubung</h4>
              <p className="text-[11px] text-emerald-600 mt-0.5">FastAPI & MySQL</p>
            </div>
            <span className="text-3xl p-3 bg-emerald-50 rounded-2xl border border-emerald-200/50">
              ⚡
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Standar Data</p>
              <h4 className="text-2xl font-bold text-[#2d2410] mt-1">Arsitektur</h4>
              <p className="text-[11px] text-blue-700 mt-0.5">title & desc</p>
            </div>
            <span className="text-3xl p-3 bg-blue-50 rounded-2xl border border-blue-200/50">
              📋
            </span>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border-white/80 bg-white/70 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#e2d9c8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              type="text"
              placeholder="Cari data {title.lower()} / keterangan..."
              value={{search}}
              onChange={{(e) => setSearch(e.target.value)}}
              className="w-full text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7d7152]">Tampilkan:</span>
            <select
              value={{pageSize}}
              onChange={{(e) => {{
                setPageSize(Number(e.target.value));
                setPage(1);
              }}}}
              aria-label="Jumlah data per halaman"
              className="text-xs bg-white border border-[#d5cbba] rounded-lg px-2 py-1.5 text-[#2d2410] focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value={{5}}>5 baris</option>
              <option value={{10}}>10 baris</option>
              <option value={{20}}>20 baris</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e2d9c8] bg-[#fbf9f4]/80 text-[#7d7152] font-semibold">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama {title} (title)</th>
                <th className="py-3 px-4">Penjelasan Singkat (desc)</th>
                <th className="py-3 px-4 w-32">Waktu Catat</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece5d8]">
              {{isLoading ? (
                <tr>
                  <td colSpan={{5}} className="py-12 text-center text-[#7d7152]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat data dari server...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={{5}} className="py-12 text-center text-rose-700">
                    <p className="font-semibold">Gagal memuat data master {title.lower()}</p>
                    <p className="text-[11px] mt-1 text-[#7d7152]">
                      {{error?.message || "Terjadi kesalahan koneksi ke server."}}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={{() => refetch()}}
                    >
                      Coba Lagi
                    </Button>
                  </td>
                </tr>
              ) : rawList.length === 0 ? (
                <tr>
                  <td colSpan={{5}} className="py-12 text-center text-[#7d7152]">
                    <span className="text-3xl block mb-2">{icon}</span>
                    <p className="font-semibold text-sm text-[#2d2410]">
                      Belum ada data Master {title}
                    </p>
                    <p className="text-xs text-[#9c8e6b] mt-0.5">
                      {{debouncedSearch
                        ? `Tidak ada data yang cocok dengan "${{debouncedSearch}}"`
                        : "Klik tombol '+ Tambah {title}' untuk menambahkan data baru."}}
                    </p>
                  </td>
                </tr>
              ) : (
                rawList.map((item, index) => {{
                  const no = listindex(page, pageSize, index);
                  const displayTitle = item.title || item.uraian || "-";
                  const displayDesc = item.desc || item.keterangan || "-";

                  return (
                    <tr
                      key={{item.id}}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-medium text-[#7d7152]">
                        {{no}}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#2d2410] flex items-center gap-2">
                          <span>{{displayTitle}}</span>
                          <Badge variant="gold" className="text-[10px] px-1.5 py-0.2">
                            {{item.id}}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#5e5133] max-w-md">
                        <span className="line-clamp-2">{{displayDesc}}</span>
                      </td>
                      <td className="py-3 px-4 text-[#7d7152] text-[11px]">
                        {{item.created_at
                          ? new Intl.DateTimeFormat("id-ID", {{
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }}).format(new Date(item.created_at))
                          : "-"}}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={{() => handleOpenDetail(item)}}
                            title="Lihat Detail"
                            className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            👁️
                          </button>
                          <button
                            type="button"
                            onClick={{() => handleOpenEdit(item)}}
                            title="Ubah Data"
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={{() => handleDelete(item)}}
                            title="Hapus Data"
                            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }})
              )}}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#e2d9c8] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fbf9f4]/40">
          <span className="text-xs text-[#7d7152]">
            Menampilkan{{" "}}
            <strong className="text-[#2d2410]">
              {{rawList.length > 0 ? (page - 1) * pageSize + 1 : 0}}
            </strong>{{" "}}
            sampai{{" "}}
            <strong className="text-[#2d2410]">
              {{Math.min(page * pageSize, totalItems)}}
            </strong>{{" "}}
            dari <strong className="text-[#2d2410]">{{totalItems}}</strong> data
          </span>

          {{totalPages > 1 && (
            <Pagination
              currentPage={{page}}
              totalPages={{totalPages}}
              onPageChange={{(p) => setPage(p)}}
            />
          )}}
        </div>
      </Card>

      <Form{entity}Modal
        isOpen={{isFormOpen}}
        onClose={{() => setIsFormOpen(false)}}
        formMode={{formMode}}
        formData={{formData}}
        setFormData={{setFormData}}
        onSubmit={{handleSubmitForm}}
        isLoading={{createMutation.isPending || updateMutation.isPending}}
      />

      <Detail{entity}Modal
        isOpen={{isDetailOpen}}
        onClose={{() => setIsDetailOpen(false)}}
        record={{selectedRecord}}
      />
    </div>
  );
}}
"""
    with open(os.path.join(target_dir, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(page_content)

print(f"Successfully generated all {len(master_modules)} master modules!")
