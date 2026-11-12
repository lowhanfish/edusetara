# Inventaris Aset Sekolah — tahap awal

Menu: **Sarana dan Prasarana → Inventaris Aset BMD** (`/admin/inventaris-aset`).
Akses API tahap ini dibatasi pada role `admin` dan `superadmin` Dinas.

## Mengaktifkan

Dari direktori `server`, jalankan `.venv/bin/alembic upgrade head` melalui terminal
lokal yang dapat mengakses database aplikasi. Migrasi: `d9e6f3ab4127` (tabel)
`e1a7c4b95238` (kolom `simda_id`) dan `f2b8d5c06349` (kolom penempatan). Modul tidak mengubah database SQL Server, SIMPEG, atau egov.
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
| `GET /` | Daftar, jumlah, dan `nilai_total`; filter `sekolah_id` dan `sub_unit_id` mencakup UPB pembukuan maupun penempatan; `search` mencari di nama, kode barang, register, dan keterangan; filter `sekolah_id`, `sub_unit_id`, `search`, `kib`, `kondisi_kode`, `skip`, `limit` |
| `GET /pilihan-sub-unit` | Pilihan semua Sub Unit/UPT, urut kode SIMDA; memakai ID referensi |
| `GET /pilihan-kode-barang` | Pencarian `search` khusus kode barang level 7 aset tetap KIB A–F, maksimal 50 hasil |
| `POST /` | Pencatatan awal, JSON sesuai `AsetCreate` |
| `GET /{id}` | Detail dan seluruh riwayat kondisi, terbaru dahulu |
| `GET /pilihan-upb` | Pencarian UPB sekolah (bukan Dinas/UPT) untuk penempatan, maksimal 50 hasil |
| `PUT /{id}/penempatan` | Tetapkan atau kosongkan sekolah penempatan: `{"upb_id": "..." atau null}` |
| `PUT /{id}` | Koreksi data, JSON sesuai `AsetUpdate` (kolom barang + `version` + `alasan`) |
| `POST /{id}/kondisi` | Multipart: `kondisi_kode`, `version`, `catatan`, `foto` |

Foto: JPG/JPEG, PNG, atau WebP; maksimum 10 MB, diperiksa berdasarkan signature
berkas, nama penyimpanan UUID. Disimpan melalui mekanisme folder uploads aplikasi.
Foto dan kondisi disimpan bersama secara transaksional; berkas dibersihkan jika commit gagal.

Respons penting: 401 belum login, 403 role tidak sesuai, 404 tidak ditemukan,
409 duplikasi/konflik versi, 413 foto terlalu besar, 422 input/referensi tidak sesuai.

## Impor barang dari SIMDA

Skrip: `scripts/import_simda_inventaris.py` (hanya membaca SQL Server, menulis ke MySQL).
Lingkup: `Ta_KIB_A`–`Ta_KIB_E` milik UPB yang ada di Referensi Unit & UPB SIMDA
(Dinas Pendidikan, `Kd_Bidang` 8, `Kd_Unit` 1). `Ta_KIB_F` kosong untuk lingkup ini.

    python scripts/import_simda_inventaris.py --dry-run                      # hitung saja
    python scripts/import_simda_inventaris.py --dry-run --upb 08.01.002.002  # pratinjau satu UPB
    python scripts/import_simda_inventaris.py --rejects penolakan.csv        # impor

| Inventaris | Sumber SIMDA |
|---|---|
| `simda_id` | `IDPemda` (unik per tabel KIB; kunci pencocokan saat impor ulang) |
| `upb_id` | `Kd_Sub` + `Kd_UPB` → `master_aset_unit` |
| `kode_barang` | `Kd_Aset8`, `80`–`85` (Permendagri 108), dua digit per tingkat |
| `nomor_register` | `No_Reg8`, enam digit |
| `tahun_perolehan`, `tanggal_perolehan` | `Tgl_Perolehan` (kolom `Tahun` kosong di sumber) |
| `nilai_perolehan` | `Harga`, dibulatkan ke dua desimal |
| `kondisi_kode` | `Kondisi`; KIB A tidak punya kondisi sehingga diisi 1 (Baik) |
| `nama` | `Judul` (KIB E) bila ada, selain itu uraian kode barang |
| `merk`, `nomor_seri` | KIB B: `Merk` + `Type`, `Nomor_Pabrik` |
| `lokasi` | KIB A `Alamat`, KIB C/D `Lokasi`; kosong menjadi "Belum dicatat" |
| `keterangan` | `Keterangan` + "Asal-usul: `Asal_usul`"; `sumber_dana_id` tidak diisi |

Aturan impor ulang: barang baru ditambah bersama riwayat kondisi awal; barang impor yang masih
versi 1 mengikuti SIMDA; barang yang sudah dikoreksi atau diperiksa di aplikasi tidak disentuh;
tidak ada yang dihapus. Baris ditolak bila ditandai hapus (`Kd_Hapus`), register ganda pada
UPB + kode barang + tahun yang sama, atau referensinya tidak ada di master.

Belum diimpor karena inventaris belum punya kolomnya: `Masa_Manfaat`, `Nilai_Sisa`,
`Kd_Pemilik`, `Kd_KA`, `Kd_Data`, luas/ukuran, dokumen dan sertifikat. Data ini diperlukan
modul penyusutan dan dapat disusulkan lewat `simda_id`.

Hasil impor 12 November 2026 (database SIMDA pelatihan): 280.800 barang, nilai perolehan
Rp 732.453.308.630,61; 13 baris ditolak (daftar di `docs/penolakan_impor_simda_inventaris.csv`).
**Hampir seluruh barang dibukukan SIMDA pada UPB `08.01.001.001` (Dinas), bukan per sekolah**;
nama sekolah hanya muncul sebagai teks bebas di `Keterangan`.

## Sekolah penempatan

UPB pembukuan (`upb_id`) mengikuti SIMDA dan tidak diubah. Sekolah tempat barang berada dicatat
terpisah di `upb_penempatan_id` dengan `status_penempatan`:

- `otomatis`: diisi `scripts/match_penempatan_inventaris.py` dari teks keterangan. Skrip
  mencocokkan nama sekarang dan nama lama UPB sekolah serta nama sekolah yang terhubung, dan
  hanya mengisi bila teks menunjuk tepat satu UPB. Pencocokan bertumpu pada nama, jadi barang
  lama yang ditulis dengan nama yang kemudian dipakai sekolah lain bisa salah alamat.
- `manual`: ditetapkan atau dikonfirmasi admin lewat detail aset; tercatat di riwayat barang.

Penempatan tidak menaikkan versi barang, sehingga impor ulang SIMDA tetap memperbarui datanya
dan tidak menyentuh penempatan. Skrip hanya mengisi barang di UPB Dinas/UPT yang penempatannya
masih kosong; aman dijalankan berulang.

Hasil 12 November 2026 dari 280.798 barang di UPB Dinas:

| Kelompok | Barang | Nilai perolehan |
|---|---|---|
| Diisi otomatis (394 UPB sekolah) | 48.943 | Rp 270.912.670.307,30 |
| Nama dipakai lebih dari satu UPB (dibiarkan kosong) | 1.977 | Rp 19.132.004.811,93 |
| Menyebut sekolah di luar referensi (dibiarkan kosong) | 2.298 | Rp 63.515.541.269,32 |
| Tidak menyebut sekolah | 227.580 | Rp 378.893.092.241,06 |

Referensi UPB: `Ref_UPB` Dinas Pendidikan berisi 521 baris, 469 di antaranya diimpor. Sebanyak
52 baris dilewati karena tidak bernama (kosong atau `.`); pada pemeriksaan 12 November 2026
tidak satu pun dari 52 baris itu mempunyai barang di `Ta_KIB_A`–`Ta_KIB_E`.

Penyusutan, mutasi, penghapusan, rekonsiliasi SIMDA dan laporan ekspor merupakan
modul lanjutan, tidak diasumsikan selesai oleh tahap ini.

## Validasi

`python -m pytest tests/integration/test_inventaris_aset.py tests/integration/test_master_aset.py tests/integration/test_sekolah_simda.py tests/integration/test_sekolah_endpoints.py -q`

Pengujian otomatis memakai SQLite terisolasi dan direktori foto sementara. SQL migrasi juga
dapat diperiksa tanpa koneksi database menggunakan:
`alembic upgrade c8d5e2fa3016:d9e6f3ab4127 --sql`.
