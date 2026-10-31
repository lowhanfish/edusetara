import re
import json

with open("ref/arsitektur_sistem_extracted.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Define the exact list of modules in order as they appear in arsitektur_sistem_extracted.txt
# Each item: (id_slug, category, title, start_anchor, end_anchor, route, endpoint, db_table)
modules_spec = [
    {
        "num": 1,
        "title": "Berita",
        "category": "Publish & Informasi",
        "route": "/admin/berita",
        "endpoint": "/api/v1/admin/berita",
        "table": "berita",
        "start": "Berita;\nPenjelasan:",
        "end": "Sarana dan Prasarana;"
    },
    {
        "num": 2,
        "title": "Tanah Sekolah",
        "category": "Sarana dan Prasarana",
        "route": "/admin/sarpras/tanah",
        "endpoint": "/api/v1/admin/sarpras/tanah",
        "table": "sarpras_tanah",
        "start": "Tanah Sekolah;\nPenjelasan:",
        "end": "\nBangunan;\nPenjelasan:"
    },
    {
        "num": 3,
        "title": "Bangunan (Fisik Gedung)",
        "category": "Sarana dan Prasarana",
        "route": "/admin/sarpras/bangunan",
        "endpoint": "/api/v1/admin/sarpras/bangunan",
        "table": "sarpras_bangunan",
        "start": "\nBangunan;\nPenjelasan:",
        "end": "\nRuang;\nPenjelasan:"
    },
    {
        "num": 4,
        "title": "Ruang",
        "category": "Sarana dan Prasarana",
        "route": "/admin/sarpras/ruang",
        "endpoint": "/api/v1/admin/sarpras/ruang",
        "table": "sarpras_ruang",
        "start": "\nRuang;\nPenjelasan:",
        "end": "\nPeralatan/Aset;\nPenjelasan:"
    },
    {
        "num": 5,
        "title": "Peralatan/Aset",
        "category": "Sarana dan Prasarana",
        "route": "/admin/sarpras/peralatan",
        "endpoint": "/api/v1/admin/sarpras/peralatan",
        "table": "sarpras_peralatan",
        "start": "\nPeralatan/Aset;\nPenjelasan:",
        "end": "\nUsulan Sekolah;"
    },
    {
        "num": 6,
        "title": "Usulan Tunjangan Guru",
        "category": "Usulan Sekolah",
        "route": "/admin/usulan/tunjangan-guru",
        "endpoint": "/api/v1/admin/usulan/tunjangan-guru",
        "table": "usulan_tunjangan_guru",
        "start": "Usulan Tunjangan Guru;\nPenjelasan:",
        "end": "\nData Pendukung;\nPenjelasan:"
    },
    {
        "num": 7,
        "title": "Data Pendukung (Bantuan PIP)",
        "category": "Usulan Sekolah > Usulan Bantuan PIP",
        "route": "/admin/usulan/pip/data-pendukung",
        "endpoint": "/api/v1/admin/usulan/pip/data-pendukung",
        "table": "usulan_pip_pendukung",
        "start": "Data Pendukung;\nPenjelasan:",
        "end": "\nData Penerima;\nPenjelasan:"
    },
    {
        "num": 8,
        "title": "Data Penerima (Bantuan PIP)",
        "category": "Usulan Sekolah > Usulan Bantuan PIP",
        "route": "/admin/usulan/pip/data-penerima",
        "endpoint": "/api/v1/admin/usulan/pip/data-penerima",
        "table": "usulan_pip_penerima",
        "start": "Data Penerima;\nPenjelasan:",
        "end": "\nUsulan data Asessment;"
    },
    {
        "num": 9,
        "title": "Usulan Data Assessment",
        "category": "Usulan Sekolah",
        "route": "/admin/usulan/assessment",
        "endpoint": "/api/v1/admin/usulan/assessment",
        "table": "usulan_assessment",
        "start": "Usulan data Asessment;\nPenjelasan:",
        "end": "\nUsulan Rekonsiliasi Dana BOSP;"
    },
    {
        "num": 10,
        "title": "Usulan Rekonsiliasi Dana BOSP",
        "category": "Usulan Sekolah",
        "route": "/admin/usulan/rekonsiliasi-bosp",
        "endpoint": "/api/v1/admin/usulan/rekonsiliasi-bosp",
        "table": "usulan_rekonsiliasi_bosp",
        "start": "Usulan Rekonsiliasi Dana BOSP;\nPenjelasan:",
        "end": "\nKegiatan Sekolah;\nPenjelasan:"
    },
    {
        "num": 11,
        "title": "Kegiatan Sekolah",
        "category": "Operasional Sekolah",
        "route": "/admin/kegiatan-sekolah",
        "endpoint": "/api/v1/admin/kegiatan-sekolah",
        "table": "kegiatan_sekolah",
        "start": "Kegiatan Sekolah;\nPenjelasan:",
        "end": "\nRombel;\nJenjang Paud;"
    },
    {
        "num": 12,
        "title": "Rombel Jenjang PAUD",
        "category": "Rombel",
        "route": "/admin/rombel/paud",
        "endpoint": "/api/v1/admin/rombel/paud",
        "table": "rombel_paud",
        "start": "Jenjang Paud;\nPenjelasan:",
        "end": "\nJenjang SD;\nPenjelasan:"
    },
    {
        "num": 13,
        "title": "Rombel Jenjang SD",
        "category": "Rombel",
        "route": "/admin/rombel/sd",
        "endpoint": "/api/v1/admin/rombel/sd",
        "table": "rombel_sd",
        "start": "Jenjang SD;\nPenjelasan:",
        "end": "\nJenjang SMP;\nPenjelasan:"
    },
    {
        "num": 14,
        "title": "Rombel Jenjang SMP",
        "category": "Rombel",
        "route": "/admin/rombel/smp",
        "endpoint": "/api/v1/admin/rombel/smp",
        "table": "rombel_smp",
        "start": "Jenjang SMP;\nPenjelasan:",
        "end": "\nKomuniatas Belajar;\nPenjelasan:"
    },
    {
        "num": 15,
        "title": "Komunitas Belajar",
        "category": "Operasional Sekolah",
        "route": "/admin/komunitas-belajar",
        "endpoint": "/api/v1/admin/komunitas-belajar",
        "table": "komunitas_belajar",
        "start": "Komuniatas Belajar;\nPenjelasan:",
        "end": "\nJurnal V2;\nJurnal Guru Kelas;"
    },
    {
        "num": 16,
        "title": "Jurnal Guru Kelas",
        "category": "Jurnal V2",
        "route": "/admin/jurnal/guru-kelas",
        "endpoint": "/api/v1/admin/jurnal/guru-kelas",
        "table": "jurnal_guru_kelas",
        "start": "Jurnal Guru Kelas;\nPenjelasan:",
        "end": "\nJurnal Kepala Sekolah;\nPenjelasan:"
    },
    {
        "num": 17,
        "title": "Jurnal Kepala Sekolah",
        "category": "Jurnal V2",
        "route": "/admin/jurnal/kepala-sekolah",
        "endpoint": "/api/v1/admin/jurnal/kepala-sekolah",
        "table": "jurnal_kepala_sekolah",
        "start": "Jurnal Kepala Sekolah;\nPenjelasan:",
        "end": "\nJurnal Pengawas;\nPenjelasan:"
    },
    {
        "num": 18,
        "title": "Jurnal Pengawas",
        "category": "Jurnal V2",
        "route": "/admin/jurnal/pengawas",
        "endpoint": "/api/v1/admin/jurnal/pengawas",
        "table": "jurnal_pengawas",
        "start": "Jurnal Pengawas;\nPenjelasan:",
        "end": "\nJurnal BK;\nPenjelasan:"
    },
    {
        "num": 19,
        "title": "Jurnal BK",
        "category": "Jurnal V2",
        "route": "/admin/jurnal/bk",
        "endpoint": "/api/v1/admin/jurnal/bk",
        "table": "jurnal_bk",
        "start": "Jurnal BK;\nPenjelasan:",
        "end": "\nGallery;\nSekolah Penggerak;"
    },
    {
        "num": 20,
        "title": "Sekolah Penggerak",
        "category": "Gallery",
        "route": "/admin/gallery/sekolah-penggerak",
        "endpoint": "/api/v1/admin/gallery/sekolah-penggerak",
        "table": "gallery_sekolah_penggerak",
        "start": "Sekolah Penggerak;\nPenjelasan:",
        "end": "\nGallery Program Guru Penggerak;\nPenjelasan:"
    },
    {
        "num": 21,
        "title": "Gallery Program Guru Penggerak",
        "category": "Gallery",
        "route": "/admin/gallery/guru-penggerak",
        "endpoint": "/api/v1/admin/gallery/guru-penggerak",
        "table": "gallery_guru_penggerak",
        "start": "Gallery Program Guru Penggerak;\nPenjelasan:",
        "end": "\nGallery Program Organisasi Penggerak;\nPenjelasan:"
    },
    {
        "num": 22,
        "title": "Gallery Program Organisasi Penggerak",
        "category": "Gallery",
        "route": "/admin/gallery/organisasi-penggerak",
        "endpoint": "/api/v1/admin/gallery/organisasi-penggerak",
        "table": "gallery_organisasi_penggerak",
        "start": "Gallery Program Organisasi Penggerak;\nPenjelasan:",
        "end": "\nGallery Kegiatan Kepala Sekolah;\nPenjelasan:"
    },
    {
        "num": 23,
        "title": "Gallery Kegiatan Kepala Sekolah",
        "category": "Gallery",
        "route": "/admin/gallery/kegiatan-kepala-sekolah",
        "endpoint": "/api/v1/admin/gallery/kegiatan-kepala-sekolah",
        "table": "gallery_kegiatan_kepala_sekolah",
        "start": "Gallery Kegiatan Kepala Sekolah;\nPenjelasan:",
        "end": "\nGallery Kegiatan KKG SD;\nPenjelasan:"
    },
    {
        "num": 24,
        "title": "Gallery Kegiatan KKG SD",
        "category": "Gallery",
        "route": "/admin/gallery/kegiatan-kkg-sd",
        "endpoint": "/api/v1/admin/gallery/kegiatan-kkg-sd",
        "table": "gallery_kegiatan_kkg_sd",
        "start": "Gallery Kegiatan KKG SD;\nPenjelasan:",
        "end": "\nGallery Kegiatan Guru MGMP;\nPenjelasan:"
    },
    {
        "num": 25,
        "title": "Gallery Kegiatan Guru MGMP",
        "category": "Gallery",
        "route": "/admin/gallery/kegiatan-guru-mgmp",
        "endpoint": "/api/v1/admin/gallery/kegiatan-guru-mgmp",
        "table": "gallery_kegiatan_guru_mgmp",
        "start": "Gallery Kegiatan Guru MGMP;\nPenjelasan:",
        "end": "\nGallery Kegiatan TK & PAUD;\nPenjelasan:"
    },
    {
        "num": 26,
        "title": "Gallery Kegiatan TK & PAUD",
        "category": "Gallery",
        "route": "/admin/gallery/kegiatan-tk-paud",
        "endpoint": "/api/v1/admin/gallery/kegiatan-tk-paud",
        "table": "gallery_kegiatan_tk_paud",
        "start": "Gallery Kegiatan TK & PAUD;\nPenjelasan:",
        "end": "\nGallery Kegiatan Pengawas Satdik;\nPenjelasan:"
    },
    {
        "num": 27,
        "title": "Gallery Kegiatan Pengawas Satdik",
        "category": "Gallery",
        "route": "/admin/gallery/kegiatan-pengawas",
        "endpoint": "/api/v1/admin/gallery/kegiatan-pengawas",
        "table": "gallery_kegiatan_pengawas",
        "start": "Gallery Kegiatan Pengawas Satdik;\nPenjelasan:",
        "end": "\nVideo Testimoni ;\nPenjelasan:"
    },
    {
        "num": 28,
        "title": "Video Testimoni",
        "category": "Gallery",
        "route": "/admin/gallery/video-testimoni",
        "endpoint": "/api/v1/admin/gallery/video-testimoni",
        "table": "gallery_video_testimoni",
        "start": "Video Testimoni ;\nPenjelasan:",
        "end": "\nPiagam Sertifikat;\nPenjelasan:"
    },
    {
        "num": 29,
        "title": "Piagam Sertifikat",
        "category": "Penghargaan",
        "route": "/admin/piagam-sertifikat",
        "endpoint": "/api/v1/admin/piagam-sertifikat",
        "table": "piagam_sertifikat",
        "start": "Piagam Sertifikat;\nPenjelasan:",
        "end": "\nVerifikasi;\nVerifikasi Tunjangan Guru;"
    },
    {
        "num": 30,
        "title": "Verifikasi Tunjangan Guru",
        "category": "Verifikasi",
        "route": "/admin/verifikasi/tunjangan-guru",
        "endpoint": "/api/v1/admin/verifikasi/tunjangan-guru",
        "table": "verifikasi_tunjangan_guru",
        "start": "Verifikasi Tunjangan Guru;\nPenjelasan:",
        "end": "\nVerifikasi Usulan Rekonsiliasi Dana BOSP"
    },
    {
        "num": 31,
        "title": "Verifikasi Usulan Rekonsiliasi Dana BOSP",
        "category": "Verifikasi",
        "route": "/admin/verifikasi/rekonsiliasi-bosp",
        "endpoint": "/api/v1/admin/verifikasi/rekonsiliasi-bosp",
        "table": "verifikasi_rekonsiliasi_bosp",
        "start": "Verifikasi Usulan Rekonsiliasi Dana BOSP",
        "end": "\nRegulasi dan Info GTK\nPengumuman GTK"
    },
    {
        "num": 32,
        "title": "Pengumuman GTK",
        "category": "Regulasi dan Info GTK",
        "route": "/admin/regulasi-gtk/pengumuman",
        "endpoint": "/api/v1/admin/regulasi-gtk/pengumuman",
        "table": "gtk_pengumuman",
        "start": "Pengumuman GTK\nPenjelasan:",
        "end": "\nModul dan Materi Pelatihan\nPenjelasan:"
    },
    {
        "num": 33,
        "title": "Modul dan Materi Pelatihan",
        "category": "Regulasi dan Info GTK",
        "route": "/admin/regulasi-gtk/modul-materi",
        "endpoint": "/api/v1/admin/regulasi-gtk/modul-materi",
        "table": "gtk_modul_pelatihan",
        "start": "Modul dan Materi Pelatihan\nPenjelasan:",
        "end": "\nRegulasi\nPenjelasan:"
    },
    {
        "num": 34,
        "title": "Regulasi GTK",
        "category": "Regulasi dan Info GTK",
        "route": "/admin/regulasi-gtk/regulasi",
        "endpoint": "/api/v1/admin/regulasi-gtk/regulasi",
        "table": "gtk_regulasi",
        "start": "Regulasi\nPenjelasan:",
        "end": "\nPPDB\nPPDB PAUD\nPenjelasan:"
    },
    {
        "num": 35,
        "title": "PPDB PAUD",
        "category": "PPDB",
        "route": "/admin/ppdb/paud",
        "endpoint": "/api/v1/admin/ppdb/paud",
        "table": "ppdb_paud",
        "start": "PPDB PAUD\nPenjelasan:",
        "end": "\nPPDB SD\nPenjelasan:"
    },
    {
        "num": 36,
        "title": "PPDB SD",
        "category": "PPDB",
        "route": "/admin/ppdb/sd",
        "endpoint": "/api/v1/admin/ppdb/sd",
        "table": "ppdb_sd",
        "start": "PPDB SD\nPenjelasan:",
        "end": "\nPPDB SMP\nPenjelasan:"
    },
    {
        "num": 37,
        "title": "PPDB SMP",
        "category": "PPDB",
        "route": "/admin/ppdb/smp",
        "endpoint": "/api/v1/admin/ppdb/smp",
        "table": "ppdb_smp",
        "start": "PPDB SMP\nPenjelasan:",
        "end": "\nKuota PPDB\nPenjelasan:"
    },
    {
        "num": 38,
        "title": "Kuota PPDB",
        "category": "PPDB",
        "route": "/admin/kuota-ppdb",
        "endpoint": "/api/v1/admin/kuota-ppdb",
        "table": "kuota_ppdb",
        "start": "Kuota PPDB\nPenjelasan:",
        "end": "\nProfile\nRenstra\nPenjelasan:"
    },
    {
        "num": 39,
        "title": "Renstra (Rencana Strategis)",
        "category": "Profile",
        "route": "/admin/profile/renstra",
        "endpoint": "/api/v1/admin/profile/renstra",
        "table": "profile_renstra",
        "start": "Renstra\nPenjelasan:",
        "end": "\nTugas Dan Fungsi\nPenjelasan:"
    },
    {
        "num": 40,
        "title": "Tugas Dan Fungsi",
        "category": "Profile",
        "route": "/admin/profile/tugas-fungsi",
        "endpoint": "/api/v1/admin/profile/tugas-fungsi",
        "table": "profile_tugas_fungsi",
        "start": "Tugas Dan Fungsi\nPenjelasan:",
        "end": "\nVisi dan Misi\nPenjelasan:"
    },
    {
        "num": 41,
        "title": "Visi dan Misi",
        "category": "Profile",
        "route": "/admin/profile/visi-misi",
        "endpoint": "/api/v1/admin/profile/visi-misi",
        "table": "profile_visi_misi",
        "start": "Visi dan Misi\nPenjelasan:",
        "end": "\nData Master\nAuth\nMenu\nPenjelasan :"
    },
    {
        "num": 42,
        "title": "Auth Menu",
        "category": "Data Master > Auth",
        "route": "/admin/master/auth/menu",
        "endpoint": "/api/v1/admin/master/auth/menu",
        "table": "auth_menus",
        "start": "Auth\nMenu\nPenjelasan :",
        "end": "\nGroup\nPenjelasan 1:"
    },
    {
        "num": 43,
        "title": "Auth Group (Role & Hak Akses)",
        "category": "Data Master > Auth",
        "route": "/admin/master/auth/group",
        "endpoint": "/api/v1/admin/master/auth/group",
        "table": "auth_groups",
        "start": "Group\nPenjelasan 1:",
        "end": "\nRegistrasi\nPenjelasan:"
    },
    {
        "num": 44,
        "title": "Auth Registrasi ASN",
        "category": "Data Master > Auth",
        "route": "/admin/master/auth/registrasi",
        "endpoint": "/api/v1/admin/master/auth/registrasi",
        "table": "users",
        "start": "Registrasi\nPenjelasan:",
        "end": "\nMaster Siswa\nPenjelasan:"
    },
    {
        "num": 45,
        "title": "Master Siswa",
        "category": "Data Master",
        "route": "/admin/master/siswa",
        "endpoint": "/api/v1/admin/master/siswa",
        "table": "master_siswa",
        "start": "Master Siswa\nPenjelasan:",
        "end": "\nMaster usulan\nTriwulan\nPenjelasan:"
    },
    {
        "num": 46,
        "title": "Master Triwulan",
        "category": "Data Master > Master Usulan",
        "route": "/admin/master/usulan/triwulan",
        "endpoint": "/api/v1/admin/master/usulan/triwulan",
        "table": "master_usulan_triwulan",
        "start": "Master usulan\nTriwulan\nPenjelasan:",
        "end": "\nJenis Penerima\nPenjelasan:"
    },
    {
        "num": 47,
        "title": "Master Jenis Penerima",
        "category": "Data Master > Master Usulan",
        "route": "/admin/master/usulan/jenis-penerima",
        "endpoint": "/api/v1/admin/master/usulan/jenis-penerima",
        "table": "master_usulan_jenis_penerima",
        "start": "Jenis Penerima\nPenjelasan:",
        "end": "\nKelas Penerima\nPenjelasan:"
    },
    {
        "num": 48,
        "title": "Master Kelas Penerima",
        "category": "Data Master > Master Usulan",
        "route": "/admin/master/usulan/kelas-penerima",
        "endpoint": "/api/v1/admin/master/usulan/kelas-penerima",
        "table": "master_usulan_kelas_penerima",
        "start": "Kelas Penerima\nPenjelasan:",
        "end": "\nMaster Jurnal\nBahan Ajar\nPenjelasan:"
    },
    {
        "num": 49,
        "title": "Master Bahan Ajar",
        "category": "Data Master > Master Jurnal",
        "route": "/admin/master/jurnal/bahan-ajar",
        "endpoint": "/api/v1/admin/master/jurnal/bahan-ajar",
        "table": "master_jurnal_bahan_ajar",
        "start": "Master Jurnal\nBahan Ajar\nPenjelasan:",
        "end": "\nMateri Ajar\nPenjelasan :"
    },
    {
        "num": 50,
        "title": "Master Materi Ajar",
        "category": "Data Master > Master Jurnal",
        "route": "/admin/master/jurnal/materi-ajar",
        "endpoint": "/api/v1/admin/master/jurnal/materi-ajar",
        "table": "master_jurnal_materi_ajar",
        "start": "Materi Ajar\nPenjelasan :",
        "end": "\nKelas\nPenjelasan :"
    },
    {
        "num": 51,
        "title": "Master Kelas",
        "category": "Data Master > Master Jurnal",
        "route": "/admin/master/jurnal/kelas",
        "endpoint": "/api/v1/admin/master/jurnal/kelas",
        "table": "master_jurnal_kelas",
        "start": "Kelas\nPenjelasan :",
        "end": "\nMata Pelajaran\nPenjelasan :"
    },
    {
        "num": 52,
        "title": "Master Mata Pelajaran",
        "category": "Data Master > Master Jurnal",
        "route": "/admin/master/jurnal/mata-pelajaran",
        "endpoint": "/api/v1/admin/master/jurnal/mata-pelajaran",
        "table": "master_jurnal_mata_pelajaran",
        "start": "Mata Pelajaran\nPenjelasan :",
        "end": "\nMaster Jenjang\nPenjelasan :"
    },
    {
        "num": 53,
        "title": "Master Jenjang",
        "category": "Data Master",
        "route": "/admin/master/jenjang",
        "endpoint": "/api/v1/admin/master/jenjang",
        "table": "master_jenjang",
        "start": "Master Jenjang\nPenjelasan :",
        "end": "\nMaster PPDB\nAgama\nPenjelasan:"
    },
    {
        "num": 54,
        "title": "Master Agama",
        "category": "Data Master > Master PPDB",
        "route": "/admin/master/ppdb/agama",
        "endpoint": "/api/v1/admin/master/ppdb/agama",
        "table": "master_ppdb_agama",
        "start": "Master PPDB\nAgama\nPenjelasan:",
        "end": "\nTempat Tinggal\nPenjelasan:"
    },
    {
        "num": 55,
        "title": "Master Tempat Tinggal",
        "category": "Data Master > Master PPDB",
        "route": "/admin/master/ppdb/tempat-tinggal",
        "endpoint": "/api/v1/admin/master/ppdb/tempat-tinggal",
        "table": "master_ppdb_tempat_tinggal",
        "start": "Tempat Tinggal\nPenjelasan:",
        "end": "\nMode Transportasi\nPenjelasan:"
    },
    {
        "num": 56,
        "title": "Master Mode Transportasi",
        "category": "Data Master > Master PPDB",
        "route": "/admin/master/ppdb/transportasi",
        "endpoint": "/api/v1/admin/master/ppdb/transportasi",
        "table": "master_ppdb_transportasi",
        "start": "Mode Transportasi\nPenjelasan:",
        "end": "\nPendidikan \nPenjelasan:"
    },
    {
        "num": 57,
        "title": "Master Pendidikan",
        "category": "Data Master > Master PPDB",
        "route": "/admin/master/ppdb/pendidikan",
        "endpoint": "/api/v1/admin/master/ppdb/pendidikan",
        "table": "master_ppdb_pendidikan",
        "start": "Pendidikan \nPenjelasan:",
        "end": "\nPekerjaan\nPenjelasan:"
    },
    {
        "num": 58,
        "title": "Master Pekerjaan",
        "category": "Data Master > Master PPDB",
        "route": "/admin/master/ppdb/pekerjaan",
        "endpoint": "/api/v1/admin/master/ppdb/pekerjaan",
        "table": "master_ppdb_pekerjaan",
        "start": "Pekerjaan\nPenjelasan:",
        "end": "\nPenghasilan\nPenjelasan:"
    },
    {
        "num": 59,
        "title": "Master Penghasilan",
        "category": "Data Master > Master PPDB",
        "route": "/admin/master/ppdb/penghasilan",
        "endpoint": "/api/v1/admin/master/ppdb/penghasilan",
        "table": "master_ppdb_penghasilan",
        "start": "Penghasilan\nPenjelasan:",
        "end": "\nMaster Sarpras\nBangunan\nPenjelasan:"
    },
    {
        "num": 60,
        "title": "Master Bangunan (Kelaikan/Kerusakan)",
        "category": "Data Master > Master Sarpras",
        "route": "/admin/master/sarpras/bangunan",
        "endpoint": "/api/v1/admin/master/sarpras/bangunan",
        "table": "master_sarpras_bangunan",
        "start": "Master Sarpras\nBangunan\nPenjelasan:",
        "end": "\nKepemilikan\nPenjelasan:"
    },
    {
        "num": 61,
        "title": "Master Kepemilikan",
        "category": "Data Master > Master Sarpras",
        "route": "/admin/master/sarpras/kepemilikan",
        "endpoint": "/api/v1/admin/master/sarpras/kepemilikan",
        "table": "master_sarpras_kepemilikan",
        "start": "Kepemilikan\nPenjelasan:",
        "end": "\nSumber Dana\nPenjelasan:"
    },
    {
        "num": 62,
        "title": "Master Sumber Dana",
        "category": "Data Master > Master Sarpras",
        "route": "/admin/master/sarpras/sumber-dana",
        "endpoint": "/api/v1/admin/master/sarpras/sumber-dana",
        "table": "master_sarpras_sumber_dana",
        "start": "Sumber Dana\nPenjelasan:",
        "end": "\nKondisi Alat\nPenjelasan:"
    },
    {
        "num": 63,
        "title": "Master Kondisi Alat",
        "category": "Data Master > Master Sarpras",
        "route": "/admin/master/sarpras/kondisi-alat",
        "endpoint": "/api/v1/admin/master/sarpras/kondisi-alat",
        "table": "master_sarpras_kondisi_alat",
        "start": "Kondisi Alat\nPenjelasan:",
        "end": "\nJenis Bantuan\nPenjelasan:"
    },
    {
        "num": 64,
        "title": "Master Jenis Bantuan",
        "category": "Data Master > Master Sarpras",
        "route": "/admin/master/sarpras/jenis-bantuan",
        "endpoint": "/api/v1/admin/master/sarpras/jenis-bantuan",
        "table": "master_sarpras_jenis_bantuan",
        "start": "Jenis Bantuan\nPenjelasan:",
        "end": "\nMaster BK Jenis Layanan\nPenjelasan:"
    },
    {
        "num": 65,
        "title": "Master BK Jenis Layanan",
        "category": "Data Master",
        "route": "/admin/master/bk-jenis-layanan",
        "endpoint": "/api/v1/admin/master/bk-jenis-layanan",
        "table": "master_bk_jenis_layanan",
        "start": "Master BK Jenis Layanan\nPenjelasan:",
        "end": "\nMaster BK Kegiatan Layanan\nPenjelasan:"
    },
    {
        "num": 66,
        "title": "Master BK Kegiatan Layanan",
        "category": "Data Master",
        "route": "/admin/master/bk-kegiatan-layanan",
        "endpoint": "/api/v1/admin/master/bk-kegiatan-layanan",
        "table": "master_bk_kegiatan_layanan",
        "start": "Master BK Kegiatan Layanan\nPenjelasan:",
        "end": "\nMaster Model Pembelajaran\nPenjelasan:"
    },
    {
        "num": 67,
        "title": "Master Model Pembelajaran",
        "category": "Data Master",
        "route": "/admin/master/model-pembelajaran",
        "endpoint": "/api/v1/admin/master/model-pembelajaran",
        "table": "master_model_pembelajaran",
        "start": "Master Model Pembelajaran\nPenjelasan:",
        "end": "\nMaster Pendampingan\nPenjelasan:"
    },
    {
        "num": 68,
        "title": "Master Pendampingan",
        "category": "Data Master",
        "route": "/admin/master/pendampingan",
        "endpoint": "/api/v1/admin/master/pendampingan",
        "table": "master_pendampingan",
        "start": "Master Pendampingan\nPenjelasan:",
        "end": "\nMaster Tugas\nPenjelasan:"
    },
    {
        "num": 69,
        "title": "Master Tugas",
        "category": "Data Master",
        "route": "/admin/master/tugas",
        "endpoint": "/api/v1/admin/master/tugas",
        "table": "master_tugas",
        "start": "Master Tugas\nPenjelasan:",
        "end": "\nMaster Kategori\nPenjelasan:"
    },
    {
        "num": 70,
        "title": "Master Kategori",
        "category": "Data Master",
        "route": "/admin/master/kategori",
        "endpoint": "/api/v1/admin/master/kategori",
        "table": "master_kategori",
        "start": "Master Kategori\nPenjelasan:",
        "end": None
    }
]

parsed_data = []

for item in modules_spec:
    start_str = item["start"]
    end_str = item["end"]
    
    start_idx = text.find(start_str)
    if start_idx == -1:
        print(f"FAILED TO FIND START FOR: {item['title']} -> {start_str}")
        continue
    
    if end_str:
        end_idx = text.find(end_str, start_idx)
        if end_idx == -1:
            print(f"FAILED TO FIND END FOR: {item['title']} -> {end_str}")
            raw_chunk = text[start_idx:]
        else:
            raw_chunk = text[start_idx:end_idx]
    else:
        raw_chunk = text[start_idx:]
    
    parsed_data.append({
        "num": item["num"],
        "title": item["title"],
        "category": item["category"],
        "route": item["route"],
        "endpoint": item["endpoint"],
        "table": item["table"],
        "raw_text": raw_chunk.strip()
    })

print(f"Successfully matched and isolated {len(parsed_data)} modules out of {len(modules_spec)}!")

with open("ref/clean_parsed_modules.json", "w", encoding="utf-8") as out:
    json.dump(parsed_data, out, indent=2, ensure_ascii=False)
