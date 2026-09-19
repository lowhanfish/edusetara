# Manual Admin Edu Setara

Dokumen ini menjadi acuan utama penyusunan manual penggunaan Portal Admin Edu Setara milik Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan. Isi manual akan dilengkapi bertahap mengikuti modul yang telah selesai dirancang dan diverifikasi pada aplikasi.

## Informasi Dokumen

| Item | Keterangan |
| --- | --- |
| Nama aplikasi | Edu Setara |
| Area | Portal Admin |
| Versi dokumen | 0.1 |
| Pembaruan terakhir | 19 September 2026 |
| Status | Dokumen berkembang |
| Pembaca | Administrator, operator dinas, operator satuan pendidikan, dan pengelola sistem |

## Cara Menggunakan Manual

1. Nomor bagian mengikuti urutan modul pada arsitektur menu admin.
2. Bagian berstatus **Lengkap** telah memiliki rancangan antarmuka dan alur penggunaan yang dapat diuji.
3. Bagian berstatus **Kerangka** baru mencatat ruang lingkup modul dan akan dilengkapi setelah desain modul selesai.
4. Keterangan **Mode desain** berarti aksi berjalan pada state lokal browser dan belum menyimpan data ke backend.
5. Kontrak API pada dokumen ini adalah acuan integrasi. Nama field akhir harus diselaraskan kembali dengan backend sebelum implementasi produksi.

## Daftar Modul

| No. | Modul | Status Dokumentasi |
| ---: | --- | --- |
| 1 | Dashboard | Kerangka |
| 2 | Berita | Kerangka |
| 3 | Sarana dan Prasarana | Kerangka |
| 4 | Usulan Sekolah | Kerangka |
| 5 | Kegiatan Sekolah | Kerangka |
| 6 | Rombel | Kerangka |
| 7 | Komunitas Belajar | Kerangka |
| 8 | Jurnal V2 | Kerangka |
| 9 | Gallery | Kerangka |
| 10 | Piagam Sertifikat | Kerangka |
| 11 | Verifikasi | Kerangka |
| 12 | Regulasi dan Info GTK | Kerangka |
| 13 | PPDB | Kerangka |
| 14 | Kuota PPDB | Kerangka |
| 15 | Profile | Kerangka |
| 16 | Data Master | 16.1 Auth lengkap; lainnya kerangka |
| 17 | Publish | Kerangka |

---

## 1. Dashboard

Status: **Kerangka**

Bagian ini akan menjelaskan ringkasan data, pintasan kerja, publikasi terbaru, pengumuman aktif, dan riwayat aktivitas administrator.

## 2. Berita

Status: **Kerangka**

Bagian ini akan menjelaskan pengelolaan artikel berita, kategori, status publikasi, gambar utama, dan proses penerbitan.

## 3. Sarana dan Prasarana

Status: **Kerangka**

Submodul:

- 3.1 Tanah Sekolah
- 3.2 Bangunan
- 3.3 Ruang
- 3.4 Peralatan atau Aset

## 4. Usulan Sekolah

Status: **Kerangka**

Submodul:

- 4.1 Usulan Tunjangan Guru
- 4.2 Usulan Bantuan PIP
  - 4.2.1 Data Pendukung
  - 4.2.2 Data Penerima
- 4.3 Usulan Data Assessment
- 4.4 Usulan Rekonsiliasi Dana BOSP

## 5. Kegiatan Sekolah

Status: **Kerangka**

Bagian ini akan menjelaskan pencatatan dan pengelolaan kegiatan sekolah.

## 6. Rombel

Status: **Kerangka**

Submodul:

- 6.1 Jenjang PAUD
- 6.2 Jenjang SD
- 6.3 Jenjang SMP

## 7. Komunitas Belajar

Status: **Kerangka**

Bagian ini akan menjelaskan pengelolaan data komunitas belajar.

## 8. Jurnal V2

Status: **Kerangka**

Submodul:

- 8.1 Jurnal Guru Kelas
- 8.2 Jurnal Kepala Sekolah
- 8.3 Jurnal Pengawas
- 8.4 Jurnal BK

## 9. Gallery

Status: **Kerangka**

Submodul:

- 9.1 Sekolah Penggerak
- 9.2 Program Guru Penggerak
- 9.3 Program Organisasi Penggerak
- 9.4 Kegiatan Kepala Sekolah
- 9.5 Kegiatan KKG SD
- 9.6 Kegiatan Guru MGMP
- 9.7 Kegiatan TK dan PAUD
- 9.8 Kegiatan Pengawas Satuan Pendidikan
- 9.9 Video Testimoni

## 10. Piagam Sertifikat

Status: **Kerangka**

Bagian ini akan menjelaskan pengelolaan piagam dan sertifikat.

## 11. Verifikasi

Status: **Kerangka**

Submodul:

- 11.1 Verifikasi Tunjangan Guru
- 11.2 Verifikasi Usulan Rekonsiliasi Dana BOSP

## 12. Regulasi dan Info GTK

Status: **Kerangka**

Submodul:

- 12.1 Pengumuman GTK
- 12.2 Modul dan Materi Pelatihan
- 12.3 Regulasi

## 13. PPDB

Status: **Kerangka**

Submodul:

- 13.1 PPDB PAUD
- 13.2 PPDB SD
- 13.3 PPDB SMP

## 14. Kuota PPDB

Status: **Kerangka**

Bagian ini akan menjelaskan pengaturan kuota PPDB berdasarkan jenjang dan satuan pendidikan.

## 15. Profile

Status: **Kerangka**

Submodul:

- 15.1 Renstra
- 15.2 Tugas dan Fungsi
- 15.3 Visi dan Misi

---

## 16. Data Master

Data Master menampung data acuan yang digunakan oleh modul lain. Perubahan pada Data Master dapat memengaruhi pilihan, struktur, dan hak akses pada seluruh Portal Admin. Akses ke bagian ini harus diberikan secara terbatas.

### 16.1 Auth

Status: **Lengkap untuk rancangan antarmuka**

Auth terdiri dari tiga modul yang saling berurutan:

```text
Menu → Group dan Hak Akses → Registrasi ASN
```

1. **Menu** menentukan halaman yang tersedia pada sidebar admin.
2. **Group** menentukan role, cakupan data, dan tindakan yang diizinkan pada setiap menu.
3. **Registrasi** memasangkan akun ASN dari SIMPEG dengan Group yang sesuai.

Urutan konfigurasi yang disarankan adalah menyelesaikan Menu terlebih dahulu, lalu Group, kemudian Registrasi.

#### 16.1.1 Menu

Status: **Lengkap**

##### Tujuan

Modul Menu digunakan untuk menambahkan dan mengatur menu atau submenu yang tampil pada sidebar versi admin. Sebuah menu dapat memiliki `children`, dan setiap child dapat kembali memiliki children sehingga struktur dapat dibuat bertingkat.

##### Lokasi

`Data Master → Auth → Menu`

##### Informasi pada Halaman

Halaman menampilkan:

- Total seluruh menu.
- Jumlah menu utama.
- Jumlah submenu.
- Kedalaman maksimum struktur menu.
- Daftar menu berbentuk tree.
- Nama, ID, jumlah submenu, path, index, dan level setiap menu.
- Tombol pencarian, buka semua, dan tutup semua.
- Aksi tambah submenu, edit, dan hapus pada setiap baris.

##### Kontrak Data

```ts
{
  id: string;       // dibuat otomatis oleh backend
  title: string;    // nama menu atau submenu
  icon: string;     // icon, emoji, atau kode icon
  path: string;     // rute halaman; boleh kosong untuk menu induk
  index: number;    // urutan tampil di antara menu satu level
  children: Menu[]; // default kosong atau null, menggunakan struktur yang sama
}
```

##### Menambah Menu Utama

1. Buka `Data Master → Auth → Menu`.
2. Tekan **Tambah Menu Utama**.
3. Isi **Nama menu atau submenu**.
4. Isi **Icon**.
5. Isi **Path** jika menu membuka halaman. Kosongkan jika menu hanya menjadi wadah submenu.
6. Isi **Index** untuk menentukan urutan tampil.
7. Biarkan **Menu induk** pada pilihan `Tanpa induk`.
8. Tekan **Tambahkan Menu**.

ID dibuat otomatis. Children dimulai dalam keadaan kosong.

##### Menambah Submenu

Ada dua cara:

1. Tekan tombol **＋** pada baris menu yang akan dijadikan induk. Form akan memilih menu induk secara otomatis.
2. Tekan **Tambah Menu Utama**, lalu pilih induk pada field **Menu induk**.

Setelah disimpan, submenu muncul di dalam tree induknya. Proses ini dapat diulangi untuk membuat level berikutnya.

##### Mengedit Menu

1. Temukan menu melalui tree atau pencarian.
2. Tekan tombol **Edit** pada baris menu.
3. Ubah title, icon, path, atau index.
4. Tekan **Simpan Perubahan**.

Pada rancangan saat ini, menu induk dikunci ketika mengedit untuk mencegah struktur children rusak atau membentuk siklus.

##### Menghapus Menu

1. Tekan tombol **Hapus** pada baris menu.
2. Baca informasi jumlah submenu yang ikut terhapus.
3. Konfirmasi penghapusan.

Penghapusan menu induk juga menghapus seluruh children di bawahnya. Backend perlu menerapkan validasi relasi dan audit log sebelum fitur ini digunakan pada produksi.

##### Pencarian dan Navigasi Tree

- Pencarian menerima nama menu, path, atau ID.
- Hasil pencarian tetap mempertahankan induk agar posisi menu dapat dipahami.
- **Buka Semua** menampilkan seluruh child.
- **Tutup Semua** hanya menampilkan menu utama.
- Tombol panah pada setiap induk membuka atau menutup children miliknya.

##### Validasi yang Disarankan

- Title wajib diisi.
- Index harus berupa bilangan bulat positif.
- Path halaman harus unik jika diisi.
- Menu induk tidak boleh menjadi child dari dirinya sendiri.
- ID harus dibuat backend dan tidak dapat diedit pengguna.
- Penghapusan induk dengan children memerlukan konfirmasi tambahan.

#### 16.1.2 Group

Status: **Lengkap**

##### Tujuan

Group menentukan role pengguna berdasarkan struktur Menu pada bagian 16.1.1. Setiap Group memiliki cakupan data dan matriks izin CRUD untuk setiap menu atau submenu.

##### Lokasi

`Data Master → Auth → Group`

##### Level Akses

| Level | Nama Cakupan | Penjelasan |
| ---: | --- | --- |
| 1 | Semua Satuan Pendidikan | Pengguna dapat mengakses data seluruh satuan pendidikan sesuai izin menu. |
| 2 | Unit Pendidikan Pengguna | Pengguna hanya dapat mengakses data satuan pendidikan yang terhubung ke akun ASN. |

Level membatasi cakupan data. Checkbox CRUD membatasi tindakan pada menu. Keduanya harus diperiksa oleh backend pada setiap request.

##### Kontrak Data Group

```ts
{
  id: string;    // dibuat otomatis oleh backend
  title: string; // nama role
  level: number; // 1 atau 2
}
```

##### Kontrak Data Hak Akses

```ts
{
  id: string;       // dibuat otomatis oleh backend
  group_id: string; // ID Group, unik dalam relasi yang ditetapkan backend
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}
```

Kontrak awal belum mencantumkan field penghubung ke menu. Sebelum integrasi, backend perlu memastikan apakah hubungan menu ditentukan oleh posisi data dalam struktur nested atau memerlukan field tambahan seperti `menu_id`. Matriks pada antarmuka menggunakan identitas menu agar setiap set izin tetap terikat pada menu yang tepat.

##### Informasi pada Halaman

Halaman menampilkan:

- Total Group.
- Jumlah Group level 1.
- Jumlah Group level 2.
- Nama dan ID Group.
- Level akses.
- Jumlah serta persentase izin aktif.
- Aksi mengatur akses dan menghapus Group.

##### Menambah Group

1. Buka `Data Master → Auth → Group`.
2. Tekan **Tambah Group**.
3. Isi **Nama Role**.
4. Pilih **Level Akses**.
5. Atur checkbox Create, Read, Update, dan Delete pada matriks menu.
6. Gunakan pencarian jika daftar menu panjang.
7. Tekan **Tambahkan Group**.

Form identitas Group dan matriks izin ditampilkan serta disimpan sebagai satu kesatuan.

##### Mengatur Matriks Hak Akses

| Hak | Fungsi |
| --- | --- |
| Create | Membuat data baru pada menu terkait. |
| Read | Melihat daftar dan detail data. |
| Update | Mengubah data yang sudah ada. |
| Delete | Menghapus data. |

- **Pilih Semua** mengaktifkan seluruh izin pada seluruh menu.
- **Kosongkan** menonaktifkan seluruh izin.
- Tombol panah membuka atau menutup submenu.
- Pencarian memfilter menu tanpa menghilangkan konteks induknya.

Untuk penggunaan produksi, izin parent dan child harus memiliki kebijakan yang jelas. Contoh: mengaktifkan izin child dapat secara otomatis memberikan minimal hak Read pada parent agar navigasi dapat ditampilkan.

##### Mengedit Group

1. Tekan **Atur Akses** pada Group.
2. Ubah nama role atau level akses bila diperlukan.
3. Sesuaikan checkbox pada matriks menu.
4. Tekan **Simpan Perubahan**.

##### Menghapus Group

Sebelum Group dihapus, backend harus memeriksa apakah masih ada ASN yang menggunakannya. Group yang masih dipakai sebaiknya tidak dapat dihapus sampai seluruh pengguna dipindahkan ke Group lain.

##### Validasi yang Disarankan

- Nama role wajib diisi dan sebaiknya unik.
- Level hanya menerima nilai 1 atau 2.
- Group minimal memiliki hak Read pada satu menu.
- Delete sebaiknya tidak aktif tanpa Read.
- Perubahan hak akses harus dicatat dalam audit log.
- Perubahan izin pengguna yang sedang login harus berlaku setelah token atau sesi diperbarui.

#### 16.1.3 Registrasi

Status: **Lengkap**

##### Tujuan

Registrasi digunakan untuk memasangkan data ASN dari SIMPEG dengan Group pada bagian 16.1.2. Modul ini tidak membuat akun, mengubah password, atau mengelola identitas ASN. Seluruh ASN diasumsikan sudah memiliki akun dari sistem sumber.

##### Lokasi

`Data Master → Auth → Registrasi`

##### Sumber Data

- Nama lengkap, NIP, jabatan, dan satuan pendidikan berasal dari SIMPEG.
- Role Group berasal dari Data Master Auth Group.
- Aplikasi hanya menyimpan relasi NIP dengan `group_id`.

Data yang tampil pada rancangan saat ini adalah data contoh untuk keperluan antarmuka dan belum terhubung ke SIMPEG.

##### Kontrak Data

```ts
{
  id: string;       // dibuat otomatis oleh backend
  nip: string;      // unik dan dipilih otomatis dari data ASN
  group_id: string; // dipilih dari daftar Group
}
```

##### Informasi pada Halaman

Halaman menampilkan:

- Total ASN.
- Jumlah ASN yang sudah memiliki Group.
- Jumlah ASN yang belum diatur.
- Jumlah satuan pendidikan pada hasil data.
- Nama lengkap dan jabatan.
- NIP.
- Satuan pendidikan.
- Title Role Group dan levelnya.
- Tombol **Atur Akses** dan **Lihat**.

##### Mencari dan Memfilter ASN

1. Gunakan kotak pencarian untuk mencari nama, NIP, jabatan, atau satuan pendidikan.
2. Gunakan filter Group untuk menampilkan role tertentu.
3. Pilih **Belum Diatur** untuk menemukan ASN yang belum memiliki hak akses.

##### Mengatur Akses ASN

1. Temukan ASN pada daftar.
2. Tekan **Atur Akses**.
3. Pastikan nama, NIP, dan satuan pendidikan sesuai.
4. Pilih **Role Group**.
5. Periksa keterangan cakupan:
   - Level 1 berlaku untuk semua satuan pendidikan.
   - Level 2 berlaku hanya untuk unit pendidikan ASN tersebut.
6. Tekan **Simpan Akses**.

NIP dipilih otomatis dari baris ASN dan tidak dapat diketik atau diganti pada form.

##### Melihat Detail ASN

Tekan **Lihat** untuk menampilkan nama, jabatan, NIP, ID registrasi, satuan pendidikan, dan Group aktif tanpa membuka form pengaturan.

##### Perubahan Satuan Pendidikan

Jika ASN berpindah unit, data satuan pendidikan harus diperbarui dari SIMPEG. Untuk Group level 2, cakupan akses harus mengikuti unit terbaru setelah sinkronisasi berhasil.

##### Validasi yang Disarankan

- NIP wajib berasal dari SIMPEG dan bersifat unik.
- Group harus masih aktif dan tersedia.
- Satu ASN hanya memiliki satu Group aktif kecuali backend mendukung banyak role.
- Pengguna tidak boleh menaikkan hak akses di atas kewenangannya sendiri.
- Perubahan Group harus dicatat dalam audit log.
- Data ASN yang sudah tidak aktif tidak boleh memperoleh akses baru.

##### Kondisi Kosong dan Gangguan Integrasi

- Jika SIMPEG tidak mengembalikan data, tampilkan status gangguan sumber data, bukan pesan bahwa ASN belum terdaftar.
- Jika daftar Group kosong, arahkan administrator untuk membuat Group terlebih dahulu.
- Jika ASN belum memiliki Group, tampilkan status **Belum diatur**.

### 16.2 Master Siswa

Status: **Kerangka**

### 16.3 Master Sekolah

Status: **Kerangka**

- 16.3.1 Master SD
- 16.3.2 Master SMP
- 16.3.3 Master TK
- 16.3.4 Master PKBM

### 16.4 Master Usulan

Status: **Kerangka**

- 16.4.1 Triwulan
- 16.4.2 Jenis Penerima
- 16.4.3 Kelas Penerima

### 16.5 Master Jurnal

Status: **Kerangka**

- 16.5.1 Bahan Ajar
- 16.5.2 Materi Ajar
- 16.5.3 Kelas
- 16.5.4 Mata Pelajaran

### 16.6 Master Jenjang

Status: **Kerangka**

### 16.7 Master PPDB

Status: **Kerangka**

- 16.7.1 Agama
- 16.7.2 Tempat Tinggal
- 16.7.3 Mode Transportasi
- 16.7.4 Pendidikan
- 16.7.5 Pekerjaan
- 16.7.6 Penghasilan

### 16.8 Master Sarpras

Status: **Kerangka**

- 16.8.1 Bangunan
- 16.8.2 Kepemilikan
- 16.8.3 Sumber Dana
- 16.8.4 Kondisi Alat
- 16.8.5 Jenis Bantuan

### 16.9 Master BK Jenis Layanan

Status: **Kerangka**

### 16.10 Master BK Kegiatan Layanan

Status: **Kerangka**

### 16.11 Master Model Pembelajaran

Status: **Kerangka**

### 16.12 Master Pendampingan

Status: **Kerangka**

### 16.13 Master Tugas

Status: **Kerangka**

### 16.14 Master Kategori

Status: **Kerangka**

## 17. Publish

Status: **Kerangka**

Submodul:

- 17.1 Berita
- 17.2 Pengumuman
- 17.3 Pendidikan
- 17.4 Data Sekolah
- 17.5 Kebudayaan
- 17.6 Layanan Publik
- 17.7 Data dan Statistik
- 17.8 Profil dan Standar Layanan
- 17.9 Banner dan Slider
- 17.10 Pesan dan Kontak Masuk

---

## Pedoman Pemeliharaan Dokumen

Setiap kali sebuah modul selesai dirancang:

1. Ubah status bagian dari **Kerangka** menjadi **Lengkap untuk rancangan antarmuka**.
2. Tambahkan tujuan, lokasi menu, sumber data, kontrak data, elemen halaman, dan langkah penggunaan.
3. Jelaskan perbedaan antara perilaku mode desain dan integrasi produksi.
4. Tambahkan validasi, kondisi kosong, kesalahan integrasi, dan dampak penghapusan.
5. Verifikasi istilah tombol dan label terhadap tampilan aplikasi terbaru.
6. Perbarui versi serta tanggal dokumen.
