# Sumber data publik

Konten yang mempunyai menu pengelolaan admin harus dibaca dari API publik yang menggunakan database admin yang sama. Jangan mengganti respons kosong atau kegagalan API dengan data contoh lokal.

| Konten | Sumber |
| --- | --- |
| Direktori semua bentuk pendidikan | `/api/v1/publish/sekolah`, tabel `master_sekolah`, hanya sekolah aktif |
| Berita, daftar dan detail | `/api/v1/publish/berita` |
| Pengumuman | `/api/v1/publish/pengumuman` |
| Statistik pendidikan dan IKM | `/api/v1/publish/statistik` |
| Kebudayaan | `/api/v1/publish/kebudayaan` |
| Layanan cepat | `/api/v1/publish/layanan` |
| Standar pelayanan | `/api/v1/publish/profil` |
| Banner | `/api/v1/publish/banner` |

## Pengecualian JSON

`app/(publish)/components/home-data.json` hanya menyimpan struktur navigasi, tautan footer, dan pintasan kelompok pengguna (`audiences`). Ini merupakan konfigurasi navigasi situs, bukan salinan konten yang dikelola menu admin. Menu otorisasi admin mengatur akses aplikasi admin dan bukan navigasi situs publik.

File snapshot lama `schools.json` tidak lagi diimpor oleh halaman maupun hook. Dataset berita/pengumuman contoh juga tidak lagi digunakan oleh halaman daftar/detail aktif.

Jalankan `npm run check:publish-data` untuk memeriksa impor JSON dan mencegah konten kelolaan admin dimasukkan kembali ke JSON beranda. Uji integrasi backend `tests/integration/test_public_school_directory.py` memeriksa kesamaan master-publik, sekolah aktif, pagination, validasi batas, dan pengecualian atribut administrasi.
