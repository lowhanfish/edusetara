# Inventaris Aset Sekolah — tahap awal

Menu: **Sarana dan Prasarana → Inventaris Aset BMD** (`/admin/inventaris-aset`).
Akses API tahap ini dibatasi pada role `admin` dan `superadmin` Dinas.

## Mengaktifkan

Dari direktori `server`, jalankan `.venv/bin/alembic upgrade head` melalui terminal
lokal yang dapat mengakses database aplikasi. Migrasi baru: `d9e6f3ab4127`;
pendahulu: `c8d5e2fa3016`. Modul tidak mengubah database SQL Server, SIMPEG, atau egov.
Migrasi ini menambah dua tabel; tidak menyalin ringkasan `sarpras_peralatan` menjadi
barang individual karena ringkasan tersebut belum mempunyai register atau nilai per barang.

## Alur percontohan

1. Pilih satu sekolah yang padanan UPB-nya sudah diverifikasi (`manual`). Untuk SATAP,
   verifikasi kedua sekolah pada referensi UPB terlebih dahulu.
2. Buka menu inventaris atau tombol **Lihat inventaris** di detail Master Sekolah.
3. Pilih **Catat aset**. Satu entri mewakili satu barang dengan nomor register.
4. Pilih kode barang level 7; kelompok KIB mengikuti kode itu secara otomatis. Isi nama,
   register, lokasi, tahun, nilai, dan kondisi.
   Tanggal, merk, nomor seri, sumber dana, dan keterangan bersifat opsional.
5. Buka detail → **Perbarui kondisi**. Isi kondisi hasil pemeriksaan, catatan, dan foto.
6. Periksa riwayat kondisi, pencatat, tanggal, serta bukti foto yang tersimpan.
7. Bila ada salah catat, buka detail → **Koreksi data**, perbaiki, dan isi alasan koreksi.

Nilai total adalah nilai perolehan semua barang sesuai filter, bukan hanya halaman
aktif dan bukan nilai buku setelah penyusutan. Mata uang dikirim API sebagai string
Decimal dan diformat tanpa konversi ke floating point pada frontend.

## Struktur data

| Data | Penyimpanan / aturan |
|---|---|
| Pemegang inventaris | `inventaris_aset.upb_id` merujuk `master_aset_unit.id` |
| Sekolah | Ditelusuri dari relasi utama / kedua pada UPB; tidak disalin ke barang |
| Identitas barang | UPB + kode barang + tahun perolehan + nomor register harus unik |
| Klasifikasi | Kode barang rinci level 7; KIB wajib sesuai kode: `01.03.01`–`01.03.06` = A–F. Kode di luar itu (persediaan, akumulasi penyusutan, aset lainnya) ditolak |
| Perolehan | Tahun, tanggal opsional, nilai `NUMERIC(20,2)`, sumber dana opsional |
| Fisik | Nama, merk, nomor seri, lokasi, kondisi master |
| Kondisi awal | Dicatat sebagai riwayat pertama bersama pembuatan barang |
| Pemeriksaan | Snapshot kondisi lama/baru, catatan, foto, pencatat, waktu, versi |
| Koreksi data | Semua kolom kecuali UPB dan kondisi; alasan wajib. Perubahan (lama → baru), alasan, pengoreksi, dan waktu masuk ke riwayat tanpa foto |
| Konflik perubahan | Versi wajib cocok; perubahan dari detail lama ditolak dengan 409 |

Dua sekolah dalam UPB SATAP melihat inventaris yang sama. Barang tidak digandakan.
Tidak ada endpoint penghapusan barang/riwayat atau mutasi pada tahap ini. Koreksi data hanya
untuk salah catat; perubahan nilai karena kapitalisasi atau penilaian ulang bukan lingkupnya.
Referensi kode barang, UPB, dan kondisi yang masih dipakai inventaris tidak dapat dihapus.

## Kontrak API

Seluruh endpoint berikut berawalan `/api/v1/admin/inventaris-aset`.

| Metode / path | Fungsi |
|---|---|
| `GET /` | Daftar, jumlah, dan `nilai_total`; filter `sekolah_id`, `sub_unit_id`, `search`, `kib`, `kondisi_kode`, `skip`, `limit` |
| `GET /pilihan-sub-unit` | Pilihan semua Sub Unit/UPT, urut kode SIMDA; memakai ID referensi |
| `GET /pilihan-kode-barang` | Pencarian `search` khusus kode barang level 7 aset tetap KIB A–F, maksimal 50 hasil |
| `POST /` | Pencatatan awal, JSON sesuai `AsetCreate` |
| `GET /{id}` | Detail dan seluruh riwayat kondisi, terbaru dahulu |
| `PUT /{id}` | Koreksi data, JSON sesuai `AsetUpdate` (kolom barang + `version` + `alasan`) |
| `POST /{id}/kondisi` | Multipart: `kondisi_kode`, `version`, `catatan`, `foto` |

Foto: JPG/JPEG, PNG, atau WebP; maksimum 10 MB, diperiksa berdasarkan signature
berkas, nama penyimpanan UUID. Disimpan melalui mekanisme folder uploads aplikasi.
Foto dan kondisi disimpan bersama secara transaksional; berkas dibersihkan jika commit gagal.

Respons penting: 401 belum login, 403 role tidak sesuai, 404 tidak ditemukan,
409 duplikasi/konflik versi, 413 foto terlalu besar, 422 input/referensi tidak sesuai.

## Persiapan impor SIMDA

Impor barang aktual **belum dijalankan atau diimplementasikan**. Struktur `Ta_KIB_A`–`Ta_KIB_E`
harus diperiksa langsung di SQL Server sebelum menulis importer; jangan menebaknya dari
tabel referensi yang sudah diimpor.

Referensi UPB: `Ref_UPB` Dinas Pendidikan berisi 521 baris, 469 di antaranya diimpor. Sebanyak
52 baris dilewati karena tidak bernama (kosong atau `.`); pada pemeriksaan 12 November 2026
tidak satu pun dari 52 baris itu mempunyai barang di `Ta_KIB_A`–`Ta_KIB_E`.

Saat sumber tersedia, petakan identitas UPB (bidang/unit/subunit/UPB), kode barang
rinci, kelompok KIB, register, tahun/tanggal perolehan, nama/spesifikasi, nilai,
kondisi, lokasi dan sumber perolehan. Gunakan kunci bisnis inventaris untuk pemeriksaan
duplikasi. Siapkan preview satu UPB, daftar penolakan, serta identitas sumber sebelum
menulis importernya. Impor tidak boleh menimpa riwayat kondisi pemeriksaan lokal.

Penyusutan, mutasi, penghapusan, rekonsiliasi SIMDA dan laporan ekspor merupakan
modul lanjutan, tidak diasumsikan selesai oleh tahap pencatatan awal ini.

## Validasi

`python -m pytest tests/integration/test_inventaris_aset.py tests/integration/test_master_aset.py tests/integration/test_sekolah_simda.py tests/integration/test_sekolah_endpoints.py -q`

Pengujian otomatis memakai SQLite terisolasi dan direktori foto sementara. SQL migrasi juga
dapat diperiksa tanpa koneksi database menggunakan:
`alembic upgrade c8d5e2fa3016:d9e6f3ab4127 --sql`.
