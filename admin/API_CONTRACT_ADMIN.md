# Single Source of Truth (SSOT) Kontrak API & Arsitektur Admin EduSetara
**Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan**

> [!IMPORTANT]
> Dokumen ini diselaraskan 100% secara langsung dengan dokumen spesifikasi resmi **`ref/Arsitektur Sistem (1).docx`** dan struktur rute menu aktif **`admin/app/(admin)/_data/admin-menu.json`**.
> Dokumen ini mengatur seluruh kontrak API antara Frontend Next.js Admin (`http://localhost:3000/admin/*`) dan Backend FastAPI (`http://localhost:8000/api/v1/*`).
> **Dilarang keras mengarang atau menambahkan field, relasi, maupun enum di luar ketentuan dokumen resmi ini.**

---

## 1. Prinsip Utama & Standar Arsitektur

### 1.1 Standar Data Master (Master Lookup Tables)
Berdasarkan spesifikasi resmi `Arsitektur Sistem (1).docx`, seluruh tabel Data Master (seperti *Master Jenjang, Triwulan, Jenis Penerima, Kelas Penerima, Bahan Ajar, Materi Ajar, Kelas, Agama, Tempat Tinggal, Transportasi, Pendidikan, Pekerjaan, Penghasilan, Bangunan, Kepemilikan, Sumber Dana, Kondisi Alat, Jenis Bantuan, BK Jenis Layanan, BK Kegiatan Layanan, Model Pembelajaran, Pendampingan, Tugas, Kategori*) menggunakan skema standar:
```json
{
  "id": "string, <generate otomatis | backend>",
  "title": "string <input>",
  "desc": "string <input>",
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```
* **Kesesuaian Database MySQL**: Pada basis data MySQL `edusetara`, field `title` berkorespondensi dengan kolom `uraian`, dan `desc` berkorespondensi dengan kolom `keterangan`. Backend FastAPI menggunakan SQLAlchemy `synonym` sehingga endpoint secara transparan menerima dan menghasilkan format JSON resmi `title` & `desc`.
* **Field Terlarang / Halusinasi**: Tidak ada kolom `kode`, `nip_pembina`, `bidang_pembina`, maupun kategori buatan di tabel Master Lookup ini.

### 1.2 Penanganan Field Otomatis Backend vs Input Pengguna
Field yang diberi penanda `<generate otomatis | backend>` seperti:
* `id`: Dihasilkan otomatis oleh database / backend (UUID / autoincrement).
* `nip` & `unit_kerja`: Untuk modul operasional (Sarpras, Jurnal, Usulan, Rombel, dll.), field ini **TIDAK DIINPUT OLEH PENGGUNA**. Backend menginjeksi nilainya secara otomatis dari token sesi ASN yang sedang login (`get_current_active_user`).
* `created_at` & `created_by`: Diisi otomatis oleh sistem backend.

### 1.3 Format Standar Respons API
Semua endpoint REST API FastAPI menggunakan format envelope standar:

**Daftar Data (List / Query):**
```json
{
  "status": "success",
  "message": "Data berhasil diambil",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_items": 45,
    "total_pages": 5
  }
}
```

**Operasi Tunggal / Mutasi (Create / Update / Delete):**
```json
{
  "status": "success",
  "message": "Data berhasil disimpan",
  "data": { ... }
}
```

**Respons Galat (Error):**
```json
{
  "status": "error",
  "message": "Rincian pesan validasi atau alasan kegagalan",
  "code": 400,
  "details": null
}
```

---

### 1.4 Pola Arsitektur Frontend (Hooks, TanStack Query, & Fetch Data)
Seluruh modul admin (termasuk Data Master) wajib mengadopsi pola arsitektur yang konsisten sesuai standar `guru-kelas` dan implementasi referensi `master-ref-taspen`:

1. **Struktur Direktori Komponen Modul**:
   ```
   app/(admin)/admin/[kategori]/[modul]/
   ├── page.tsx                 # Halaman utama (PageHeader, MetricStatCards, Table, Filter)
   ├── types.ts                 # Definisi tipe TypeScript (Item, FormInput, ApiResponse)
   ├── data.ts                  # Mock data fallback & definisi kolom tabel
   ├── Form[Modul]Modal.tsx     # Modal Tambah & Ubah (Form handling)
   ├── Detail[Modul]Modal.tsx   # Modal Detail (Read-only viewer)
   ├── DeleteConfirmModal.tsx   # Modal konfirmasi hapus data
   └── hooks/
       └── crud.tsx             # Custom React Hook TanStack Query (CRUD operations)
   ```

2. **Pola Custom Hook TanStack Query (`hooks/crud.tsx`)**:
   Setiap modul menyediakan custom hook yang merangkum:
   * `useQuery`: Mengambil data dengan cache key spesifik (e.g., `["master-jenjang", params]`), pagination, dan debounced search.
   * `useMutation` (Create, Update, Delete): Melakukan mutasi via API client `fetchData` dan otomatis menjalankan `queryClient.invalidateQueries({ queryKey: [...] })` saat mutasi berhasil.

3. **Penanganan Autentikasi & Token**:
   Panggilan API menggunakan token JWT Bearer yang tersimpan di cookies/session. Jika sesi kedaluwarsa atau tidak valid, sistem secara otomatis mengarahkan pengguna ke halaman login publik (`http://localhost:3000/login` atau `http://localhost:3000/`).

---

## 2. Tabel Ringkasan Rute & Modul Admin EduSetara

| No | Modul | Kategori | Route Frontend | Endpoint Backend | Tabel Database |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Berita** | Publish & Informasi | `/admin/publish/berita` | `/api/v1/admin/berita` | `berita` |
| 2 | **Tanah Sekolah** | Sarana dan Prasarana | `/admin/sarpras/tanah` | `/api/v1/admin/sarpras/tanah` | `sarpras_tanah` |
| 3 | **Bangunan (Fisik Gedung)** | Sarana dan Prasarana | `/admin/sarpras/bangunan` | `/api/v1/admin/sarpras/bangunan` | `sarpras_bangunan` |
| 4 | **Ruang** | Sarana dan Prasarana | `/admin/sarpras/ruang` | `/api/v1/admin/sarpras/ruang` | `sarpras_ruang` |
| 5 | **Peralatan/Aset** | Sarana dan Prasarana | `/admin/sarpras/peralatan` | `/api/v1/admin/sarpras/peralatan` | `sarpras_peralatan` |
| 6 | **Usulan Tunjangan Guru** | Usulan Sekolah | `/admin/usulan/tunjangan-guru` | `/api/v1/admin/usulan/tunjangan-guru` | `usulan_tunjangan_guru` |
| 7 | **Data Pendukung (Bantuan PIP)** | Usulan Sekolah > Usulan Bantuan PIP | `/admin/usulan/pip/data-pendukung` | `/api/v1/admin/usulan/pip/data-pendukung` | `usulan_pip_pendukung` |
| 8 | **Data Penerima (Bantuan PIP)** | Usulan Sekolah > Usulan Bantuan PIP | `/admin/usulan/pip/data-penerima` | `/api/v1/admin/usulan/pip/data-penerima` | `usulan_pip_penerima` |
| 9 | **Usulan Data Assessment** | Usulan Sekolah | `/admin/usulan/assessment` | `/api/v1/admin/usulan/assessment` | `usulan_assessment` |
| 10 | **Usulan Rekonsiliasi Dana BOSP** | Usulan Sekolah | `/admin/usulan/rekonsiliasi-bosp` | `/api/v1/admin/usulan/rekonsiliasi-bosp` | `usulan_rekonsiliasi_bosp` |
| 11 | **Kegiatan Sekolah** | Operasional Sekolah | `/admin/kegiatan-sekolah` | `/api/v1/admin/kegiatan-sekolah` | `kegiatan_sekolah` |
| 12 | **Rombel Jenjang PAUD** | Rombel | `/admin/rombel/paud` | `/api/v1/admin/rombel/paud` | `rombel_paud` |
| 13 | **Rombel Jenjang SD** | Rombel | `/admin/rombel/sd` | `/api/v1/admin/rombel/sd` | `rombel_sd` |
| 14 | **Rombel Jenjang SMP** | Rombel | `/admin/rombel/smp` | `/api/v1/admin/rombel/smp` | `rombel_smp` |
| 15 | **Komunitas Belajar** | Operasional Sekolah | `/admin/komunitas-belajar` | `/api/v1/admin/komunitas-belajar` | `komunitas_belajar` |
| 16 | **Jurnal Guru Kelas** | Jurnal V2 | `/admin/jurnal/guru-kelas` | `/api/v1/admin/jurnal/guru-kelas` | `jurnal_guru_kelas` |
| 17 | **Jurnal Kepala Sekolah** | Jurnal V2 | `/admin/jurnal/kepala-sekolah` | `/api/v1/admin/jurnal/kepala-sekolah` | `jurnal_kepala_sekolah` |
| 18 | **Jurnal Pengawas** | Jurnal V2 | `/admin/jurnal/pengawas` | `/api/v1/admin/jurnal/pengawas` | `jurnal_pengawas` |
| 19 | **Jurnal BK** | Jurnal V2 | `/admin/jurnal/bk` | `/api/v1/admin/jurnal/bk` | `jurnal_bk` |
| 20 | **Sekolah Penggerak** | Gallery | `/admin/gallery/sekolah-penggerak` | `/api/v1/admin/gallery/sekolah-penggerak` | `gallery_sekolah_penggerak` |
| 21 | **Gallery Program Guru Penggerak** | Gallery | `/admin/gallery/guru-penggerak` | `/api/v1/admin/gallery/guru-penggerak` | `gallery_guru_penggerak` |
| 22 | **Gallery Program Organisasi Penggerak** | Gallery | `/admin/gallery/organisasi-penggerak` | `/api/v1/admin/gallery/organisasi-penggerak` | `gallery_organisasi_penggerak` |
| 23 | **Gallery Kegiatan Kepala Sekolah** | Gallery | `/admin/gallery/kegiatan-kepala-sekolah` | `/api/v1/admin/gallery/kegiatan-kepala-sekolah` | `gallery_kegiatan_kepala_sekolah` |
| 24 | **Gallery Kegiatan KKG SD** | Gallery | `/admin/gallery/kegiatan-kkg-sd` | `/api/v1/admin/gallery/kegiatan-kkg-sd` | `gallery_kegiatan_kkg_sd` |
| 25 | **Gallery Kegiatan Guru MGMP** | Gallery | `/admin/gallery/kegiatan-guru-mgmp` | `/api/v1/admin/gallery/kegiatan-guru-mgmp` | `gallery_kegiatan_guru_mgmp` |
| 26 | **Gallery Kegiatan TK & PAUD** | Gallery | `/admin/gallery/kegiatan-tk-paud` | `/api/v1/admin/gallery/kegiatan-tk-paud` | `gallery_kegiatan_tk_paud` |
| 27 | **Gallery Kegiatan Pengawas Satdik** | Gallery | `/admin/gallery/kegiatan-pengawas` | `/api/v1/admin/gallery/kegiatan-pengawas` | `gallery_kegiatan_pengawas` |
| 28 | **Video Testimoni** | Gallery | `/admin/gallery/video-testimoni` | `/api/v1/admin/gallery/video-testimoni` | `gallery_video_testimoni` |
| 29 | **Piagam Sertifikat** | Penghargaan | `/admin/piagam-sertifikat` | `/api/v1/admin/piagam-sertifikat` | `piagam_sertifikat` |
| 30 | **Verifikasi Tunjangan Guru** | Verifikasi | `/admin/verifikasi/tunjangan-guru` | `/api/v1/admin/verifikasi/tunjangan-guru` | `verifikasi_tunjangan_guru` |
| 31 | **Verifikasi Usulan Rekonsiliasi Dana BOSP** | Verifikasi | `/admin/verifikasi/rekonsiliasi-bosp` | `/api/v1/admin/verifikasi/rekonsiliasi-bosp` | `verifikasi_rekonsiliasi_bosp` |
| 32 | **Pengumuman GTK** | Regulasi dan Info GTK | `/admin/regulasi-gtk/pengumuman` | `/api/v1/admin/regulasi-gtk/pengumuman` | `gtk_pengumuman` |
| 33 | **Modul dan Materi Pelatihan** | Regulasi dan Info GTK | `/admin/regulasi-gtk/modul-materi` | `/api/v1/admin/regulasi-gtk/modul-materi` | `gtk_modul_pelatihan` |
| 34 | **Regulasi GTK** | Regulasi dan Info GTK | `/admin/regulasi-gtk/regulasi` | `/api/v1/admin/regulasi-gtk/regulasi` | `gtk_regulasi` |
| 35 | **PPDB PAUD** | PPDB | `/admin/ppdb/paud` | `/api/v1/admin/ppdb/paud` | `ppdb_paud` |
| 36 | **PPDB SD** | PPDB | `/admin/ppdb/sd` | `/api/v1/admin/ppdb/sd` | `ppdb_sd` |
| 37 | **PPDB SMP** | PPDB | `/admin/ppdb/smp` | `/api/v1/admin/ppdb/smp` | `ppdb_smp` |
| 38 | **Kuota PPDB** | PPDB | `/admin/kuota-ppdb` | `/api/v1/admin/kuota-ppdb` | `kuota_ppdb` |
| 39 | **Renstra (Rencana Strategis)** | Profile | `/admin/profile/renstra` | `/api/v1/admin/profile/renstra` | `profile_renstra` |
| 40 | **Tugas Dan Fungsi** | Profile | `/admin/profile/tugas-fungsi` | `/api/v1/admin/profile/tugas-fungsi` | `profile_tugas_fungsi` |
| 41 | **Visi dan Misi** | Profile | `/admin/profile/visi-misi` | `/api/v1/admin/profile/visi-misi` | `profile_visi_misi` |
| 42 | **Auth Menu** | Data Master > Auth | `/admin/master/auth/menu` | `/api/v1/admin/master/auth/menu` | `auth_menus` |
| 43 | **Auth Group (Role & Hak Akses)** | Data Master > Auth | `/admin/master/auth/group` | `/api/v1/admin/master/auth/group` | `auth_groups` |
| 44 | **Auth Registrasi ASN** | Data Master > Auth | `/admin/master/auth/registrasi` | `/api/v1/admin/master/auth/registrasi` | `users` |
| 45 | **Master Siswa** | Data Master | `/admin/master/siswa` | `/api/v1/admin/master/siswa` | `master_siswa` |
| 46 | **Master Triwulan** | Data Master > Master Usulan | `/admin/master/usulan/triwulan` | `/api/v1/admin/master/usulan/triwulan` | `master_usulan_triwulan` |
| 47 | **Master Jenis Penerima** | Data Master > Master Usulan | `/admin/master/usulan/jenis-penerima` | `/api/v1/admin/master/usulan/jenis-penerima` | `master_usulan_jenis_penerima` |
| 48 | **Master Kelas Penerima** | Data Master > Master Usulan | `/admin/master/usulan/kelas-penerima` | `/api/v1/admin/master/usulan/kelas-penerima` | `master_usulan_kelas_penerima` |
| 49 | **Master Bahan Ajar** | Data Master > Master Jurnal | `/admin/master/jurnal/bahan-ajar` | `/api/v1/admin/master/jurnal/bahan-ajar` | `master_jurnal_bahan_ajar` |
| 50 | **Master Materi Ajar** | Data Master > Master Jurnal | `/admin/master/jurnal/materi-ajar` | `/api/v1/admin/master/jurnal/materi-ajar` | `master_jurnal_materi_ajar` |
| 51 | **Master Kelas** | Data Master > Master Jurnal | `/admin/master/jurnal/kelas` | `/api/v1/admin/master/jurnal/kelas` | `master_jurnal_kelas` |
| 52 | **Master Mata Pelajaran** | Data Master > Master Jurnal | `/admin/master/jurnal/mata-pelajaran` | `/api/v1/admin/master/jurnal/mata-pelajaran` | `master_jurnal_mata_pelajaran` |
| 53 | **Master Jenjang** | Data Master | `/admin/master/jenjang` | `/api/v1/admin/master/jenjang` | `master_jenjang` |
| 54 | **Master Agama** | Data Master > Master PPDB | `/admin/master/ppdb/agama` | `/api/v1/admin/master/ppdb/agama` | `master_ppdb_agama` |
| 55 | **Master Tempat Tinggal** | Data Master > Master PPDB | `/admin/master/ppdb/tempat-tinggal` | `/api/v1/admin/master/ppdb/tempat-tinggal` | `master_ppdb_tempat_tinggal` |
| 56 | **Master Mode Transportasi** | Data Master > Master PPDB | `/admin/master/ppdb/transportasi` | `/api/v1/admin/master/ppdb/transportasi` | `master_ppdb_transportasi` |
| 57 | **Master Pendidikan** | Data Master > Master PPDB | `/admin/master/ppdb/pendidikan` | `/api/v1/admin/master/ppdb/pendidikan` | `master_ppdb_pendidikan` |
| 58 | **Master Pekerjaan** | Data Master > Master PPDB | `/admin/master/ppdb/pekerjaan` | `/api/v1/admin/master/ppdb/pekerjaan` | `master_ppdb_pekerjaan` |
| 59 | **Master Penghasilan** | Data Master > Master PPDB | `/admin/master/ppdb/penghasilan` | `/api/v1/admin/master/ppdb/penghasilan` | `master_ppdb_penghasilan` |
| 60 | **Master Bangunan (Kelaikan/Kerusakan)** | Data Master > Master Sarpras | `/admin/master/sarpras/bangunan` | `/api/v1/admin/master/sarpras/bangunan` | `master_sarpras_bangunan` |
| 61 | **Master Kepemilikan** | Data Master > Master Sarpras | `/admin/master/sarpras/kepemilikan` | `/api/v1/admin/master/sarpras/kepemilikan` | `master_sarpras_kepemilikan` |
| 62 | **Master Sumber Dana** | Data Master > Master Sarpras | `/admin/master/sarpras/sumber-dana` | `/api/v1/admin/master/sarpras/sumber-dana` | `master_sarpras_sumber_dana` |
| 63 | **Master Kondisi Alat** | Data Master > Master Sarpras | `/admin/master/sarpras/kondisi-alat` | `/api/v1/admin/master/sarpras/kondisi-alat` | `master_sarpras_kondisi_alat` |
| 64 | **Master Jenis Bantuan** | Data Master > Master Sarpras | `/admin/master/sarpras/jenis-bantuan` | `/api/v1/admin/master/sarpras/jenis-bantuan` | `master_sarpras_jenis_bantuan` |
| 65 | **Master BK Jenis Layanan** | Data Master | `/admin/master/bk-jenis-layanan` | `/api/v1/admin/master/bk-jenis-layanan` | `master_bk_jenis_layanan` |
| 66 | **Master BK Kegiatan Layanan** | Data Master | `/admin/master/bk-kegiatan-layanan` | `/api/v1/admin/master/bk-kegiatan-layanan` | `master_bk_kegiatan_layanan` |
| 67 | **Master Model Pembelajaran** | Data Master | `/admin/master/model-pembelajaran` | `/api/v1/admin/master/model-pembelajaran` | `master_model_pembelajaran` |
| 68 | **Master Pendampingan** | Data Master | `/admin/master/pendampingan` | `/api/v1/admin/master/pendampingan` | `master_pendampingan` |
| 69 | **Master Tugas** | Data Master | `/admin/master/tugas` | `/api/v1/admin/master/tugas` | `master_tugas` |
| 71 | **Master Sekolah** | Data Master > Master Sekolah | `/admin/master/sekolah/{sd,smp,tk,pkbm}` | `/api/v1/admin/master/sekolah` | `edusetara.master_sekolah` |
| 72 | **Master Wilayah** | Data Master > Referensi Wilayah | `/admin/master/sekolah` (Dropdown) | `/api/v1/admin/master/wilayah` | `egov.master_kecamatan` + `egov.master_des_kel` |

---

## 3. Spesifikasi Lengkap Modul (1 s/d 72)

### 1. Berita
**Kategori:** `Publish & Informasi`  
**Route Frontend:** [`/admin/publish/berita`](http://localhost:3000/admin/publish/berita)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/berita`  
**Tabel Database:** `berita`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan pengelolaan informasi dan publikasi kegiatan/berita seputar kegiatan sekolah.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "judul": "string <input>, (Judul utama artikel/berita)",
  "sumber": "string <input>, (misal: 'Humas Sekolah', 'Dinas Pendidikan')",
  "deskripsi": "string <input>, (Ringkasan/lead singkat berita untuk cuplikan thumbnail)",
  "isi": "string <input>, (Konten lengkap berita dalam format teks panjang / HTML WYSIWYG)",
  "foto": "string <input>, (Berkas gambar banner/thumbnail berita / URL foto)",
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Judul: Siswa SD Negeri 1 Ranomeeto Raih Juara 1 Olimpiade Sains Tingkat Kabupaten
Sumber: Tim Humas SD Negeri 1 Ranomeeto
Deskripsi: Prestasi membanggakan kembali ditorehkan oleh siswa SD Negeri 1 Ranomeeto dalam ajang Olimpiade Sains tingkat kabupaten.
Isi Berita: Siswa perwakilan sekolah berhasil menyabet medali emas setelah melalui serangkaian babak penyisihan dan final praktik eksperimen sains yang digelar secara serentak... (konten lengkap artikel).
Foto: prestasi_olimpiade_sains_2026.jpg
```

---
### 2. Tanah Sekolah
**Kategori:** `Sarana dan Prasarana`  
**Route Frontend:** [`/admin/sarpras/tanah`](http://localhost:3000/admin/sarpras/tanah)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/sarpras/tanah`  
**Tabel Database:** `sarpras_tanah`  

#### Deskripsi & Bisnis Logika
> Pada modul ini kita disajikan daftar data bidang tanah yang dimiliki atau dikuasai oleh satuan pendidikan, mencakup identitas sekolah pemilik hak dan total luasan area tanah.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "title": "number <input>, (Luas tanah sekolah)",
"file": "string <input>, (Berkas dokumen bukti kepemilikan/sertifikat tanah atau path URL file)",
"file_type": "string <generate otomatis | backend>, (Tipe atau ekstensi berkas, misal: 'pdf', 'jpg', 'png')",
  "nip ": "string, <generate otomatis | backend>"
  "unit_kerja ": "string, <generate otomatis | backend>"
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
SDN 5 KOLONO: Bidang lahan sekolah dengan total luasan area 3.300 m².
SD-SMPN SATAP 16 KONSEL: Bidang lahan sekolah dengan luas area 2.400 m².
SD NEGERI 6 LAINEA: Bidang lahan sekolah dengan ukuran dimensi panjang 125 m dan lebar 75 m.
SDN 7 BUKE: Bidang lahan kawasan persekolahan dengan luas area 1,19 ha.
```

---
### 3. Bangunan (Fisik Gedung)
**Kategori:** `Sarana dan Prasarana`  
**Route Frontend:** [`/admin/sarpras/bangunan`](http://localhost:3000/admin/sarpras/bangunan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/sarpras/bangunan`  
**Tabel Database:** `sarpras_bangunan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini list data fisik gedung atau unit bangunan yang berdiri di atas lahan sekolah, mencakup nama unit gedung, luasan tapak bangunan, serta status hak kepemilikan/penguasaan fisik.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "nama": "string <input>, (nama bangunan sekolah)",
  "luas": "string <input>, (luas bangunan sekolah)",
" kepemilikan_id ": "string  <option>, (di pilih dari list kepemilikan yang sudah kita buat sebelumnya <16.6.2>)",
  "tahun": "string <input>, (tahun bangunan sekolah)",
  "persentase": "number <input>, (persentase kerusakan bangunan sekolah)",
" kondisi_id ": "string  <option>, (di pilih dari list kondisi yang sudah kita buat sebelumnya <16.6.4>)",
" jns_bantuan_id ": "string  <option>, (di pilih dari list jenis bantuan yang sudah kita buat sebelumnya <16.6.5>)",
" sumber _id ": "string  <option>, (di pilih dari list sumber dana yang sudah kita buat sebelumnya <16.6.3>)",
  "nip ": "string, <generate otomatis | backend>"
  "unit_kerja ": "string, <generate otomatis | backend>"
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Gedung Kelas 1 (SDN 2 BUKE): Unit gedung seluas 800 m² dengan status kepemilikan Milik Sendiri.
Gedung Kelas 2 (SDN 2 BUKE): Unit gedung seluas 800 m² dengan status kepemilikan Pinjam.
RKB UNIT 1 (SDN 5 PALANGGA SELATAN): Bangunan Ruang Kelas Baru seluas 144 m² berstatus Milik Sendiri.
BANGUNAN SMPN SATAP 16 KONAWE SELATAN (SD-SMPN SATAP 16 KONSEL): Unit fasilitas gedung seluas 2.400 m² berstatus Milik Sendiri.
```

---
### 4. Ruang
**Kategori:** `Sarana dan Prasarana`  
**Route Frontend:** [`/admin/sarpras/ruang`](http://localhost:3000/admin/sarpras/ruang)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/sarpras/ruang`  
**Tabel Database:** `sarpras_ruang`  

#### Deskripsi & Bisnis Logika
> Pada modul ini berisikan list data pemetaan unit ruangan spesifik yang berada di dalam bangunan yang telauh inputkan pada menu bangunan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "bangunan_id": "string <option>, (di pilih dari list bangunan yang sudah kita buat sebelumnya <3.2>)",
" kelas_id ": "string  <option>, (di pilih dari list kelas yang sudah kita buat sebelumnya <16.4.3>)",
  "nama ": "string <input>, (nama ruangan)",
  "luas ": "string <input>, (luas ruangan)",
" kondisi_id ": "string  <option>, (di pilih dari list kondisi yang sudah kita buat sebelumnya <16.6.4>)",
  "nip ": "string, <generate otomatis | backend>"
  "unit_kerja ": "string, <generate otomatis | backend>"
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Contoh Ruangan Kelas 1A (SDN 2 BUKE): Ruangan belajar seluas 400 m² pada unit Gedung Kelas 1.
Kelas 1 (SDN 5 KOLONO): Ruang belajar kelas dasar seluas 9 m² pada unit gedung SD Negeri 5 Kolono.
RUANG KELAS 3 (SDN 3 MORAMO): Ruang kelas seluas 56 m² pada unit fasilitas BANGUNAN GEDUNG 1.
Ruang kelas 1 (SDN 5 PALANGGA SELATAN): Ruangan belajar seluas 56 m² pada unit RKB UNIT 1.
```

---
### 5. Peralatan/Aset
**Kategori:** `Sarana dan Prasarana`  
**Route Frontend:** [`/admin/sarpras/peralatan`](http://localhost:3000/admin/sarpras/peralatan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/sarpras/peralatan`  
**Tabel Database:** `sarpras_peralatan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data inventaris barang berupa, perangkat TIK, alat elektronik, dan furnitur penunjang kegiatan operasional yang ditempatkan pada masing-masing unit ruangan sekolah beserta kuantitas peralatan/aset.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "ruang_id": "string <option>, (di pilih dari list ruangan yang sudah kita buat sebelumnya <3.3>)",
  "nama ": "string <input>, (nama peralatan/aset)",
  "jml_alat ": "number <input>, (jumlat peralatan/aset)",
" kondisi_id ": "string  <option>, (di pilih dari list kondisi yang sudah kita buat sebelumnya <16.6.4>)",
  "tahun ": "number <input>, (tahun pengadaan peralatan/aset)",
" sumber _id ": "string  <option>, (di pilih dari list sumber dana yang sudah kita buat sebelumnya <16.6.3>)",
  "nip ": "string, <generate otomatis | backend>"
  "unit_kerja ": "string, <generate otomatis | backend>"
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Komputer Asus (SDN 2 BUKE): Perangkat komputer sebanyak 2 unit yang terinventarisir di Ruangan Kelas 1A.
Printer Epson L300 (SDN 2 BUKE): Perangkat cetak dokumen sebanyak 5 unit yang dialokasikan di Ruangan Kelas 1A.
Speaker Kecil (SD NEGERI 2 MOWILA): Fasilitas pengeras suara sebanyak 1 unit yang ditempatkan di Ruang kelas 1.
Kursi Futura Biru (SD NEGERI 2 MOWILA): Perabot kursi duduk sebanyak 5 unit yang ditempatkan di Ruang kelas 1.
```

---
### 6. Usulan Tunjangan Guru
**Kategori:** `Usulan Sekolah`  
**Route Frontend:** [`/admin/usulan/tunjangan-guru`](http://localhost:3000/admin/usulan/tunjangan-guru)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/usulan/tunjangan-guru`  
**Tabel Database:** `usulan_tunjangan_guru`  

#### Deskripsi & Bisnis Logika
> Modul ini digunakan oleh guru maupun operator sekolah untuk mengajukan permohonan aneka tunjangan pendidik (Tunjangan Profesi Guru/TPG sertifikasi, Tambahan Penghasilan/Tamsil non-sertifikasi, maupun Tunjangan Khusus Guru/TKG daerah terpencil) ke Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan. Pengusul memilih periode tahun anggaran, triwulan pengajuan, jenis tunjangan, dan kelas penerima, kemudian mengunggah dokumen digital prasyarat (seperti SKTP, SPTJM bermaterai, SK Pembagian Tugas Mengajar 24 jam tatap muka, dan buku rekening aktif) untuk diverifikasi oleh tim dinas.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "tahun": "string <option>, (dipilih dari list tahun anggaran: '2025', '2026')",
  "triwulan_id": "string <option>, (dipilih dari list triwulan: 1 = 'Triwulan I', 2 = 'Triwulan II', 3 = 'Triwulan III', 4 = 'Triwulan IV')",
  "jns_penerimaan_id": "string <option>, (dipilih dari list jenis penerima: TPG PNS, TPG PPPK, Tamsil PNS, Tamsil PPPK, Tunjangan Khusus)",
  "kelas_penerima_id": "string <option>, (dipilih dari list kelas penerima: Guru Kelas TK, Guru Kelas SD, Guru Mapel SMP, Guru BK, Kepala Sekolah)",
  "nama": "string <readonly / auto-fill>, (nama lengkap pengusul beserta gelar dari profil SIMPEG)",
  "nip": "string <readonly / auto-fill>, (NIP/NIPPPK pengusul)"
}
```

**Form Lampiran Berkas Usulan**
```json
{
  "id": "string, <generate otomatis | backend>",
  "usulan_id": "string <relation: usulan.id>",
  "uraian": "string <input>, (nama dokumen: misal 'SK Beban Mengajar 24 Jam', 'SPTJM Bermaterai', 'Rekening Bank Sultra')",
  "file": "file (PDF), (berkas digital dokumen usulan)"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Usulan TPG Guru Mapel SMPN 22 Konawe Selatan:
{
  "id": "usul-tpg-2026-001",
  "tahun": "2026",
  "triwulan_id": "1",
  "jns_penerimaan_id": "jns-tpg-pns",
  "kelas_penerima_id": "kls-guru-mapel-smp",
  "nama": "Nurul Hidayah, S.Pd., M.Pd.",
  "nip": "198405122009032008"
}
Usulan Tambahan Penghasilan (Tamsil) Guru Kelas SDN 4 Ranomeeto:
{
  "id": "usul-tamsil-2026-015",
  "tahun": "2026",
  "triwulan_id": "1",
  "jns_penerimaan_id": "jns-tamsil-pppk",
  "kelas_penerima_id": "kls-guru-kelas-sd",
  "nama": "La Ode Muh. Ridwan, S.Pd.",
  "nip": "199108152024211012"
}
Usulan TPG Kepala Sekolah SMP Satap 16 Konawe Selatan:
{
  "id": "usul-tamsil-2026-015",
  "tahun": "2026",
  "triwulan_id": "1",
  "jns_penerimaan_id": "jns-tamsil-pppk",
  "kelas_penerima_id": "kls-guru-kelas-sd",
  "nama": "La Ode Muh. Ridwan, S.Pd.",
  "nip": "199108152024211012"
}
Usulan Bantuan PIP;
```

---
### 7. Data Pendukung (Bantuan PIP)
**Kategori:** `Usulan Sekolah > Usulan Bantuan PIP`  
**Route Frontend:** [`/admin/usulan/pip/data-pendukung`](http://localhost:3000/admin/usulan/pip/data-pendukung)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/usulan/pip/data-pendukung`  
**Tabel Database:** `usulan_pip_pendukung`  

#### Deskripsi & Bisnis Logika
> Modul ini digunakan oleh satuan pendidikan untuk mendokumentasikan alokasi program bantuan PIP, seperti Surat Rekomendasi/Pengantar Dinas Pendidikan, atau Berita Acara Rapat Penetapan Siswa Layak PIP. Sekolah menginput nama uraian SK, jenjang pendidikan, besaran pagu nominal per siswa, tahun penetapan, serta melampirkan berkas dokumen digital (PDF). Data ini menjadi induk rujukan sebelum sekolah menentukan daftar siswa penerima bantuan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "uraian": "string <input>, (nama dokumen pendukung: misal nomor SK Nominasi/Pemberian PIP Kemendikbudristek atau Surat Pengantar)",
  "jenjang_id": "string <option>, (dipilih dari list jenjang yang telah kita buat sebelumnya <16.6>)",
  "nominal": "string/number <input>, (besaran nominal bantuan)",
  "tahun": "number <input>, (tahun anggaran penyaluran PIP)",
  "file": "string <string>, (lampiran dokumen SK / Berita Acara penetapan dalam format)"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
SK Pemberian PIP SD Tahap I T.A 2026:
{
  "id": "pip-dukung-2026-sd-01",
  "uraian": "SK Puslapdik Kemendikbudristek No. 0412/P3/PIP/2026 tentang Penetapan Siswa Penerima PIP SD Tahap I",
  "jenjang_id": "2",
  "nominal": 450000,
  "tahun": 2026,
  "file": "sk_pemberian_pip_sd_tahap1_2026.pdf"
}
SK Pemberian PIP SMP Tahap I T.A 2026:
{
  "id": "pip-dukung-2026-smp-01",
  "uraian": "SK Penetapan Penerima Program Indonesia Pintar (PIP) Jenjang SMP Kelas VII-IX Tahap I Tahun 2026",
  "jenjang_id": "3",
  "nominal": 750000,
  "tahun": 2026,
  "file": "sk_penetapan_pip_smp_tahap1_2026.pdf"
}
Berita Acara Penetapan Siswa Kurang Mampu Layak PIP SDN 2 Buke:
{
  "id": "pip-dukung-2026-sd-02",
  "uraian": "Berita Acara Rapat Dewan Guru & Komite Sekolah Usulan Nominasi Tambahan PIP Afirmasi 2026",
  "jenjang_id": "2",
  "nominal": 450000,
  "tahun": 2026,
  "file": "ba_usulan_afirmasi_pip_sdn2buke_2026.pdf"
}
SK Pemberian PIP Tahap II Relaksasi SMPN Satap 16 Konsel:
{
  "id": "pip-dukung-2026-smp-02",
  "uraian": "SK Kuota Penerima PIP Jenjang SMP Jalur DTKS dan Rekomendasi Pemda Tahap II Tahun 2026",
  "jenjang_id": "3",
  "nominal": 750000,
  "tahun": 2026,
  "file": "sk_kuota_pip_smp_satap16_tahap2.pdf"
}
```

---
### 8. Data Penerima (Bantuan PIP)
**Kategori:** `Usulan Sekolah > Usulan Bantuan PIP`  
**Route Frontend:** [`/admin/usulan/pip/data-penerima`](http://localhost:3000/admin/usulan/pip/data-penerima)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/usulan/pip/data-penerima`  
**Tabel Database:** `usulan_pip_penerima`  

#### Deskripsi & Bisnis Logika
> Modul ini digunakan untuk memetakan dan menetapkan peserta didik aktif yang berhak menerima penyaluran dana bantuan PIP berdasarkan induk dokumen data pendukung yang telah diinput sebelumnya. Operator sekolah memilih program data pendukung PIP terkait, kemudian mencentang nama-nama siswa (terintegrasi dari database master siswa sekolah) yang terdaftar pada rekening SimPel (Simpanan Pelajar) BRI/BNI untuk didaftarkan sebagai penerima bantuan tunai.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "pendukung_id": "string <option>, (dipilih dari list data pendukung PIP yang telah dibuat sebelumnya <4.2.1>)",
  "siswa_id": "string <option> (di pilih dari list siswa yang sudah kita buat sebelumnya <16.2>)"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Penetapan Siswa Penerima PIP SDN 4 Ranomeeto:
{
  "form": {
    "pendukung_id": "pip-dukung-2026-sd-01"
  },
  "lokasi": [
    {
      "id": "siswa-sd-0101",
      "nama": "Aditya Pratama Saputra",
      "nisn": "0145892301",
      "kelas": "Kelas IV A"
    },
    {
      "id": "siswa-sd-0102",
      "nama": "Siti Nur Halizah",
      "nisn": "0152489104",
      "kelas": "Kelas IV A"
    }
  ]
}
Penetapan Siswa Penerima PIP SMPN 22 Konawe Selatan:
{
  "form": {
    "pendukung_id": "pip-dukung-2026-smp-01"
  },
  "lokasi": [
    {
      "id": "siswa-smp-0205",
      "nama": "Fahri Alamsyah",
      "nisn": "0104889211",
      "kelas": "Kelas VIII B"
    },
    {
      "id": "siswa-smp-0206",
      "nama": "Aisyah Putri Rahmadani",
      "nisn": "0112456782",
      "kelas": "Kelas VIII C"
    }
  ]
}
Penetapan Siswa Tambahan PIP Afirmasi SDN 2 Buke:
{
  "form": {
    "pendukung_id": "pip-dukung-2026-sd-02"
  },
  "lokasi": [
    {
      "id": "siswa-sd-0312",
      "nama": "Muhamad Rizky Kurniawan",
      "nisn": "0167812903",
      "kelas": "Kelas V"
    }
  ]
}
Penetapan Siswa PIP SMP Satap 16 Konawe Selatan:
{
  "form": {
    "pendukung_id": "pip-dukung-2026-smp-02"
  },
  "lokasi": [
    {
      "id": "siswa-smp-0401",
      "nama": "Rian Hidayatullah",
      "nisn": "0098471205",
      "kelas": "Kelas IX A"
    },
    {
      "id": "siswa-smp-0402",
      "nama": "Dewi Sartika",
      "nisn": "0097612984",
      "kelas": "Kelas IX B"
    }
  ]
}
```

---
### 9. Usulan Data Assessment
**Kategori:** `Usulan Sekolah`  
**Route Frontend:** [`/admin/usulan/assessment`](http://localhost:3000/admin/usulan/assessment)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/usulan/assessment`  
**Tabel Database:** `usulan_assessment`  

#### Deskripsi & Bisnis Logika
> Modul ini digunakan oleh satuan pendidikan untuk menginput status moda pelaksanaan sekolah (Mandiri atau Menumpang pada sekolah lain), jumlah siswa peserta asesmen (siswa kelas 6 untuk jenjang SD, atau siswa kelas 7/8 untuk jenjang SMP), rincian gender peserta (Laki-laki dan Perempuan), jumlah peserta berdasarkan implementasi kurikulum (K-13 atau Kurikulum Merdeka).

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "status_sekolah_id": "string <option>, (dipilih dari list status pelaksanaan: 0 = 'Negeri', 1 = Swasta, 2 = Satuan Pendidikan Kerjasama)",
  "jml_siswa": "number <input>, (total jumlah siswa peserta asesmen; kelas 6 untuk SD / kelas 7 untuk SMP)",
  "jml_laki": "number <input>, (jumlah peserta asesmen berjenis kelamin laki-laki)",
  "jml_perempuan": "number <input>, (jumlah peserta asesmen berjenis kelamin perempuan)",
  "kurikulum_k13": "number <input>, (jumlah siswa yang mengikuti asesmen dengan acuan Kurikulum 2013)",
  "kurikulum_kurmer": "number <input>, (jumlah siswa yang mengikuti asesmen dengan acuan Kurikulum Merdeka)",
  "file": "string <input>, (lampiran file excel data nominasi dan kesiapan peserta asesmen)"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Kesiapan ANBK Mandiri SMPN 22 Konawe Selatan:
{
  "id": "asesmen-smp22-2026",
  "status_sekolah_id": "1",
  "jml_siswa": 50,
  "jml_laki": 24,
  "jml_perempuan": 26,
  "kurikulum_k13": 0,
  "kurikulum_kurmer": 50,
  "file": "dnt_peserta_anbk_smpn22_konsel_2026.xlsx"
}
Kesiapan Asesmen Mandiri SDN 4 Ranomeeto:
{
  "id": "asesmen-sd4-2026",
  "status_sekolah_id": "1",
  "jml_siswa": 35,
  "jml_laki": 18,
  "jml_perempuan": 17,
  "kurikulum_k13": 0,
  "kurikulum_kurmer": 35,
  "file": "dnt_nominasi_anbk_sdn4_ranomeeto.xlsx"
}
Kesiapan Asesmen Menumpang SMP Satap 16 Konawe Selatan:
{
  "id": "asesmen-satap16-2026",
  "status_sekolah_id": "2",
  "jml_siswa": 22,
  "jml_laki": 12,
  "jml_perempuan": 10,
  "kurikulum_k13": 0,
  "kurikulum_kurmer": 22,
  "file": "data_peserta_anbk_menumpang_satap16.xlsx"
}
Kesiapan ANBK Mandiri SDN 2 Buke:
{
  "id": "asesmen-sd2buke-2026",
  "status_sekolah_id": "1",
  "jml_siswa": 30,
  "jml_laki": 14,
  "jml_perempuan": 16,
  "kurikulum_k13": 0,
  "kurikulum_kurmer": 30,
  "file": "form_peserta_asesmen_sdn2buke_2026.xlsx"
}
```

---
### 10. Usulan Rekonsiliasi Dana BOSP
**Kategori:** `Usulan Sekolah`  
**Route Frontend:** [`/admin/usulan/rekonsiliasi-bosp`](http://localhost:3000/admin/usulan/rekonsiliasi-bosp)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/usulan/rekonsiliasi-bosp`  
**Tabel Database:** `usulan_rekonsiliasi_bosp`  

#### Deskripsi & Bisnis Logika
> Modul ini digunakan oleh Kepala Satuan Pendidikan sekolah untuk mengajukan rekonsiliasi laporan pertanggungjawaban (SPJ) keuangan dan aset BOSP ke Dinas Pendidikan dan Kebudayaan. Pengusul membuat usulan per semester dan tahun anggaran berjalan, kemudian mengunggah 25-26 rincian kategori dokumen fisik pertanggungjawaban (Buku Kas Umum, Buku Kas Pembantu Pajak, Rekening Koran Giro Bank Sultra, SPTJM BOSP bermaterai, Kuitansi/Nota SIPLah, Berita Acara Rekonsiliasi Aset, dan dokumen perubahan RKAS). Modul ini juga memfasilitasi monitoring hasil koreksi verifikator dinas (tahap Cek Benar dan Cek Lengkap) serta pengunduhan Surat Rekomendasi Bebas Rekonsiliasi setelah seluruh dokumen dinyatakan valid.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "tahun": "string <option>, (dipilih dari list tahun anggaran: '2025', '2026')",
  "semester_id": "string <option>, (dipilih dari list semester: '1' = 'Semester I (Januari - Juni)', '2' = 'Semester II (Juli - Desember)')"
}
```

**Form Unggah Lampiran Kategori Rekonsiliasi (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "usulan_id": "string <relation: usulan_rekon.id>",
  "kategori_id": "string <option>, (di pilih dari list kategori yang sudah kita buat sebelumnya <16.13>)",
  "uraian": "string <input>, (keterangan nama dokumen yang diunggah)",
  "file": "string <input>, (lampiran dokumen digital laporan BOSP)"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Usulan Rekonsiliasi BOSP Semester I - SDN 4 Ranomeeto:
Sekolah / Unit Kerja: SD Negeri 4 Ranomeeto
Tahun Anggaran: 2026
Semester: Semester I (Januari - Juni)
Status Usulan: Sedang Diproses Verifikasi
Rincian Dokumen Lampiran yang Diunggah:
Kategori 1 (Buku Kas Umum): Buku Kas Umum (BKU) Periode Januari - Juni 2026 SDN 4 Ranomeeto (File: bku_sdn4_ranomeeto_sem1_2026.pdf)
Kategori 3 (Buku Pembantu Bank): Rekening Koran Giro BOSP Bank Sultra Cap Asli Semester I (File: rekening_koran_bank_sultra_sdn4.pdf)
Kategori 4 (Buku Pembantu Pajak): Rekapitulasi Pajak PPh 21, PPh 23, dan PPN beserta Bukti Setor NTPN (File: pajak_bosp_sem1_sdn4.pdf)
Kategori 6 (SPTJM): Surat Pernyataan Tanggung Jawab Mutlak Belanja BOSP Bermaterai Rp 10.000,- (File: sptjm_bosp_sdn4_sem1.pdf)
Usulan Rekonsiliasi BOSP Semester I - SMPN 22 Konawe Selatan
Sekolah / Unit Kerja: SMP Negeri 22 Konawe Selatan
Tahun Anggaran: 2026
Semester: Semester I (Januari - Juni)
Status Usulan: Sedang Diproses Verifikasi
Rincian Dokumen Lampiran yang Diunggah:
Kategori 1 (Buku Kas Umum): Buku Kas Umum (BKU) Penutupan Semester I Tahun 2026 (File: bku_smpn22_konsel_sem1.pdf)
Kategori 4 (Buku Pembantu Pajak): Buku Pembantu Pajak dan Bukti Transaksi e-Billing (File: buku_pembantu_pajak_smpn22.pdf)
Kategori 7 (Rincian Objek Belanja): Kuitansi Pembayaran Honor GTT/PTT dan Langganan Daya & Jasa Internet (File: spj_belanja_pegawai_jasa_smpn22.pdf)
Kategori 8 (LRA BOSP): Laporan Realisasi Penyerapan Dana BOS Reguler Tahap 1 (File: lra_bos_reguler_tahap1_smpn22.pdf)
Usulan Rekonsiliasi BOSP Semester II - SDN 2 Buke
Sekolah / Unit Kerja: SD Negeri 2 Buke
Tahun Anggaran: 2026
Semester: Semester II (Juli - Desember)
Status Usulan: Sedang Diproses Verifikasi
Rincian Dokumen Lampiran yang Diunggah:
Kategori 1 (Buku Kas Umum): Buku Kas Umum (BKU) Akhir Tahun Anggaran 2026 (File: bku_tahunan_sdn2buke_2026.pdf)
Kategori 8 (LRA BOSP): Laporan Realisasi Anggaran (LRA) Penyerapan Dana BOS Reguler Semester II (File: lra_bosp_sem2_sdn2buke_2026.pdf)
Kategori 11 (Belanja Modal): Faktur Pembelian Buku Teks Utama Kurikulum Merdeka via SIPLah (File: faktur_siplah_buku_sdn2buke.pdf)
Kategori 25 (RKAS): Dokumen Kertas Kerja RKAS Perubahan Tahun Anggaran 2026 (File: rkas_perubahan_2026_sdn2buke.pdf)
Usulan Rekonsiliasi BOSP Semester II - SMP Satap 16 Konawe Selatan
Sekolah / Unit Kerja: SMP Satap 16 Konawe Selatan
Tahun Anggaran: 2026
Semester: Semester II (Juli - Desember)
Status Usulan: Sedang Diproses Verifikasi
Rincian Dokumen Lampiran yang Diunggah:
Kategori 1 (Buku Kas Umum): BKU Periode Juli sampai Desember 2026 SMP Satap 16 (File: bku_sem2_smp_satap16.pdf)
Kategori 3 (Buku Pembantu Bank): Saldo Kas Bank Sultra per 31 Desember 2026 (File: buku_bank_desember_satap16.pdf)
Kategori 14 (Aset/Inventaris): Berita Acara Rekonsiliasi Aset Peralatan TIK Chromebook BOSP Kinerja (File: ba_rekonsiliasi_aset_chromebook.pdf)
Kategori 26 (Dana Hibah): Laporan Pertanggungjawaban Bantuan Dana Hibah Operasional Sekolah (File: spj_dana_hibah_satap16_2026.pdf)
```

---
### 11. Kegiatan Sekolah
**Kategori:** `Operasional Sekolah`  
**Route Frontend:** [`/admin/kegiatan-sekolah`](http://localhost:3000/admin/kegiatan-sekolah)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/kegiatan-sekolah`  
**Tabel Database:** `kegiatan_sekolah`  

#### Deskripsi & Bisnis Logika
> Pada modul ini menampilkan dokumentasi dan pelaporan aktivitas sekolah di mana seluruh guru dapat mengunggah bukti pelaksanaan kegiatan belajar, ekstrakurikuler, workshop, maupun peringatan hari besar ke dalam sistem.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "judul ": "string <input>, (judul kegiatan)",
  "deskripsi ": "string <input>, (deskripsi kegiatan)",
  "tanggal ": "date <input>, (tanggal kegiatan)",
  "tahun ": "number <input>, (tahun pengadaan peralatan/aset)",
"file": "string <input>, (Berkas dokumen bukti kepemilikan/sertifikat tanah atau path URL file)",
  "link ": "string <input>, (link youtube)",
  "nip ": "string, <generate otomatis | backend>"
  "unit_kerja ": "string, <generate otomatis | backend>"
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Nama Kegiatan: Upacara Peringatan Hari Pendidikan Nasional dan Pentas Seni Siswa
Deskripsi Kegiatan: Pelaksanaan upacara bendera bersama seluruh staf dewan guru dan murid yang dilanjutkan dengan penampilan bakat seni tari daerah serta pembagian apresiasi siswa berprestasi.
Tanggal Kegiatan: 2026-05-02
Foto: dokumentasi_hardiknas_2026.jpg
Link YouTube: [https://www.youtube.com/watch?v=kEg123XYZ01](https://www.youtube.com/watch?v=kEg123XYZ01)
```

---
### 12. Rombel Jenjang PAUD
**Kategori:** `Rombel`  
**Route Frontend:** [`/admin/rombel/paud`](http://localhost:3000/admin/rombel/paud)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/rombel/paud`  
**Tabel Database:** `rombel_paud`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar rombongan belajar khusus kelompok bermain dan pendidikan anak usia dini (PAUD/TK/KB) sebagai acuan pengelompokan usia perkembangan dan penugasan guru pendamping.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend: 'Jenjang PAUD'>",
  "jns_rombel": "number <option>, (dipilih dari list jenis rombel [0: 'Kelas', 1: 'Kelas Jauh/Kecil', 2: 'Kelas Terbuka'])",
  "tgkt_pendidikan": "string <option>, (di pilih dari list jenjang yang sudah kita buat sebelumnya <16.5>)",
  "kurikulum": "string <input>, (kurikulum pembelajaran)",
  "nama": "string <input>, (nama rombongan belajar)",
  "wali_kelas": "string <option>, (dipilih dari list guru/pegawai sebagai wali kelas yang namanya ada pada simpeg)",
  "ruang_kelas": "string <option>, (di pilih dari list ruang yang sudah kita buat sebelumnya <3.3>)",
  "unit_kerja": "string, <generate otomatis | backend>",
  "nip": "string, <generate otomatis | backend>",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Kelompok Bermain Kasih Ibu: Rombel kelompok bermain (KB) untuk rentang usia 3–4 tahun.
TK-A Melati: Rombel tingkat TK-A untuk anak usia 4–5 tahun pada semester aktif.
TK-B Bintang: Rombel tingkat TK-B persiapan masuk jenjang pendidikan dasar.
```

---
### 13. Rombel Jenjang SD
**Kategori:** `Rombel`  
**Route Frontend:** [`/admin/rombel/sd`](http://localhost:3000/admin/rombel/sd)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/rombel/sd`  
**Tabel Database:** `rombel_sd`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar rombongan belajar tingkat sekolah dasar sebagai acuan pengelompokan usia perkembangan dan penugasan guru pendamping.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend: 'Jenjang SD>",
  "jns_rombel": "number <option>, (dipilih dari list jenis rombel [0: 'Kelas', 1: 'Kelas Jauh/Kecil', 2: 'Kelas Terbuka'])",
  "tgkt_pendidikan": "string <option>, (di pilih dari list jenjang yang sudah kita buat sebelumnya <16.5>)",
  "kurikulum": "string <input>, (kurikulum pembelajaran)",
  "nama": "string <input>, (nama rombongan belajar)",
  "wali_kelas": "string <option>, (dipilih dari list guru/pegawai sebagai wali kelas yang namanya ada pada simpeg)",
  "ruang_kelas": "string <option>, (di pilih dari list ruang yang sudah kita buat sebelumnya <3.3>)",
  "unit_kerja": "string, <generate otomatis | backend>",
  "nip": "string, <generate otomatis | backend>",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Kelas 1A: Rombel fase A tingkat awal untuk siswa kelas 1 paralel A di SDN 1 Ranomeeto.
Kelas 3: Rombel tingkat 3 tunggal untuk kegiatan pembelajaran tematik terpadu di SDN 5 Kolono.
Kelas 6B: Rombel tingkat akhir fase C persiapan kelulusan di SDN 3 Konda.
```

---
### 14. Rombel Jenjang SMP
**Kategori:** `Rombel`  
**Route Frontend:** [`/admin/rombel/smp`](http://localhost:3000/admin/rombel/smp)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/rombel/smp`  
**Tabel Database:** `rombel_smp`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar rombongan belajar tingkat Sekolah Menengah Pertama (kelas 7 hingga kelas 9) untuk memetakan penugasan guru mata pelajaran, wali kelas, serta pembagian jadwal jurnal mengajar per rombel.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend: 'Jenjang SMP>",
  "jns_rombel": "number <option>, (dipilih dari list jenis rombel [0: 'Kelas', 1: 'Kelas Jauh/Kecil', 2: 'Kelas Terbuka'])",
  "tgkt_pendidikan": "string <option>, (di pilih dari list jenjang yang sudah kita buat sebelumnya <16.5>)",
  "kurikulum": "string <input>, (kurikulum pembelajaran)",
  "nama": "string <input>, (nama rombongan belajar)",
  "wali_kelas": "string <option>, (dipilih dari list guru/pegawai sebagai wali kelas yang namanya ada pada simpeg)",
  "ruang_kelas": "string <option>, (di pilih dari list ruang yang sudah kita buat sebelumnya <3.3>)",
  "unit_kerja": "string, <generate otomatis | backend>",
  "nip": "string, <generate otomatis | backend>",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Kelas 7A: Rombel fase D tingkat awal kelas 7 paralel A di SMPN Satap 16 Konsel.
Kelas 8B: Rombel tingkat menengah kelas 8 paralel B untuk distribusi jadwal guru mapel.
Kelas 9A: Rombel tingkat akhir kelas 9 persiapan asesmen akhir jenjang pendidikan menengah pertama.
```

---
### 15. Komunitas Belajar
**Kategori:** `Operasional Sekolah`  
**Route Frontend:** [`/admin/komunitas-belajar`](http://localhost:3000/admin/komunitas-belajar)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/komunitas-belajar`  
**Tabel Database:** `komunitas_belajar`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan pengelolaan kelompok komunitas belajar pendidik di satuan pendidikan, mencakup identitas komunitas serta struktur kepengurusan guru penggerak yang dapat ditambahkan secara fleksibel sesuai peran dan fungsi jabatan masing-masing.

#### Kontrak Payload JSON (API Contract)
**Form Komunitas Belajar (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "uraian": "string <input>, (nama komunitas belajar)",
  "jns_kegiatan": "string <option>, (dipilih dari list jenis kegiatan: 0 = 'Siklus Refleksi Awal', 1 = 'Siklus Perencanaan', 2 = 'Siklus Implementasi', 3 = 'Siklus Evaluasi')",
  "deskripsi": "string (HTML/Text) <input: q-editor>, (deskripsi kegiatan komunitas belajar)",
  "file": "file/binary <upload>, (lampiran dokumen foto kegiatan atau berkas PDF)",
  "type": "string, <generate otomatis | backend>",
  "unit_kerja": "string, <generate otomatis | backend>",
  "nip": "string, <generate otomatis | backend>",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

**Form Komunitas Belajar (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kombel_id": "string, <di pilih dari kombel yang sudah kita buat sebelumnya)",
  "nama_id": "string <option>, (dipilih dari list guru/pegawai yang namanya ada pada simpeg)",
  "jabatan": "string <option>, (dipilih dari list jabatan: 'Ketua', 'Wakil', 'Sekretaris', 'Koordinator')",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Ketua: Pendidik yang bertindak sebagai penanggung jawab utama dan pengarah agenda kegiatan komunitas belajar.
Wakil: Pendidik yang mendampingi ketua dalam koordinasi teknis pelaksanaan program kombel.
Sekretaris: Pendidik yang bertugas mendokumentasikan notula diskusi, daftar hadir, serta administrasi pelaporan kombel.
Koordinator: Pendidik yang memimpin bidang atau kelompok kerja teknis spesifik dalam forum kombel.
```

---
### 16. Jurnal Guru Kelas
**Kategori:** `Jurnal V2`  
**Route Frontend:** [`/admin/jurnal/guru-kelas`](http://localhost:3000/admin/jurnal/guru-kelas)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/jurnal/guru-kelas`  
**Tabel Database:** `jurnal_guru_kelas`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan pencatatan aktivitas harian pembelajaran tematik terpadu oleh Guru Kelas, mencakup tema dan materi pokok, nomor pertemuan, integrasi model dan metode pembelajaran, catatan sintaks kegiatan belajar, instrumen penilaian, rekapitulasi kehadiran peserta didik secara terperinci (hadir, izin, sakit, alpa, beserta persentasenya), hingga dokumentasi foto kegiatan kelas.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "tema": "string <input>, (tema pembelajaran yang diajarkan)",
  "materi_pokok": "string <input>, (materi pokok atau subtema pembelajaran)",
  "pertemuan_ke": "number <input>, (nomor urut pertemuan pembelajaran)",
  "tgl": "date <input>, (tanggal pelaksanaan pembelajaran)",
  "model_pembelajaran": "array/string <option: multiple>, (di pilih dari list model pembelajaran yang sudah kita buat sebelumnya <16.10>)",
  "metode_pembelajaran": "array/string <option: multiple>, (dipilih dari list metode pembelajaran: 'Ceramah', 'Diskusi', 'Tanya Jawab', 'Demonstrasi', 'Penugasan')",
  "kegiatan": "string (HTML/Text) <input: q-editor>, (uraian tahapan kegiatan belajar mengajar)",
  "penilaian": "array/string <option: multiple>, (dipilih dari list penilaian pembelajaran: 'Penilaian Sikap', 'Penilaian Pengetahuan', 'Penilaian Keterampilan')",
  "siswa_hadir": "number <input>, (jumlah peserta didik yang hadir)",
  "siswa_izin": "number <input>, (jumlah peserta didik yang izin)",
  "siswa_sakit": "number <input>, (jumlah peserta didik yang sakit)",
  "siswa_alpa": "number <input>, (jumlah peserta didik tanpa keterangan)",
  "persentase": "number <input>, (persentase kehadiran siswa, contoh: 95)",
  "keterangan": "string <input>, (catatan refleksi atau kendala saat pembelajaran berlangsung)",
  "file": "file/binary <upload>, (lampiran foto dokumentasi suasana kegiatan belajar di kelas)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
a. Tema 1 Diriku (SDN 2 BUKE): Pertemuan ke-1 materi "Aku dan Teman Baru" menggunakan model Problem Based Learning dan metode Diskusi, dengan tingkat kehadiran 100%.
b. Tema 2 Kegemaranku (SDN 5 PALANGGA SELATAN): Pertemuan ke-3 materi "Gemar Berolahraga dan Pola Hidup Sehat" menggunakan metode Demonstrasi dan Praktik, dengan tingkat kehadiran 96%.
c. Tema Indahnya Kebersamaan (SDN 1 BAULA): Pertemuan ke-4 materi "Keberagaman Budaya Bangsaku" menerapkan model Project Based Learning membuat kliping rumah adat, dengan kehadiran 93%.
d. Tema Lingkungan Bersih dan Sehat (SDN 3 LAEYA): Pertemuan ke-2 materi "Menjaga Kebersihan Lingkungan Sekolah" dengan model Discovery Learning dan penilaian sikap observasi, kehadiran 95%.
```

---
### 17. Jurnal Kepala Sekolah
**Kategori:** `Jurnal V2`  
**Route Frontend:** [`/admin/jurnal/kepala-sekolah`](http://localhost:3000/admin/jurnal/kepala-sekolah)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/jurnal/kepala-sekolah`  
**Tabel Database:** `jurnal_kepala_sekolah`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan rekaman jurnal tugas kepemimpinan dan manajerial Kepala Sekolah, mencakup uraian agenda manajerial maupun supervisi, target capaian yang ditetapkan, hasil/output yang terealisasi, stakeholder yang dilibatkan dalam kegiatan, uraian catatan evaluasi pelaksanaan, serta bukti fisik dokumentasi.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "uraian": "string <input>, (uraian tugas atau kegiatan kepala sekolah)",
  "target": "string <input>, (target atau sasaran yang ingin dicapai dari kegiatan)",
  "hasil": "string <input>, (hasil atau output nyata yang berhasil dicapai)",
  "keterlibatan": "string <input>, (pihak-pihak terkait yang dilibatkan, contoh: 'Dewan Guru', 'Pengawas Sekolah', 'Komite')",
  "tgl": "date <input>, (tanggal pelaksanaan kegiatan kepala sekolah)",
  "keterangan": "string (HTML/Text) <input: q-editor>, (catatan detail, evaluasi manajerial, atau arahan tindak lanjut)",
  "file": "file/binary <upload>, (lampiran foto kegiatan, notula rapat dinas, atau berkas pendukung)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Supervisi Akademik Guru (SMPN SATAP 16 KONSEL): Penilaian KBM pada 3 guru mata pelajaran dengan target kesiapan modul ajar berdiferensiasi, hasil terlaksana 100% melibatkan pengawas sekolah.
Rapat Pleno Komite Sekolah (SDN 2 BUKE): Pembahasan program penguatan literasi dan sarpras pendukung bersama seluruh pengurus komite dan perwakilan orang tua murid.
Evaluasi Penggunaan Anggaran BOS (SDN 5 PALANGGA SELATAN): Verifikasi berkas SPJ belanja operasional triwulan berjalan bersama tim pengelola BOS dengan hasil dokumen lengkap dan akuntabel.
Pembinaan Disiplin dan Kinerja Guru (SDN 1 BAULA): Briefing rutin mingguan terkait ketertiban administrasi mengajar dan presensi ASN/P3K dengan hasil kesepakatan target administrasi tepat waktu.
```

---
### 18. Jurnal Pengawas
**Kategori:** `Jurnal V2`  
**Route Frontend:** [`/admin/jurnal/pengawas`](http://localhost:3000/admin/jurnal/pengawas)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/jurnal/pengawas`  
**Tabel Database:** `jurnal_pengawas`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan laporan kegiatan visitasi, pembinaan, pemantauan standar nasional pendidikan, dan evaluasi oleh Pengawas Sekolah terhadap sekolah binaan, mencakup identitas sekolah tujuan, kepala sekolah yang didampingi, jenis pendampingan, temuan akademik, temuan manajerial, rumusan tindak lanjut pembinaan, dan tugas kepengawasan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "unit_kerja": "string <option>, (dipilih dari list sekolah binaan yang dikunjungi pengawas, untuk data unit kerja diambil dari simpeg)",
  "kepsek": "string <option>, (dipilih dari list kepala sekolah / biodata PTK penanggung jawab sekolah)",
  "pendampingan_id": "string <option>, (di pilih dari list master pendampingan yang sudah kita buat sebelumnya <16.11>)",
  "temuan_akademik": "string <input>, (poin temuan pengawasan pada aspek proses kegiatan belajar mengajar dan perangkat guru)",
  "temuan_manajerial": "string <input>, (poin temuan pengawasan pada aspek administrasi, sarpras, dan tata kelola)",
  "tindak_lanjut": "string <input: textarea>, (arahan rekomendasi dan tindak lanjut perbaikan untuk sekolah)",
  "tugas_id": "string <option>, (di pilih dari list master tugas yang sudah kita buat sebelumnya <16.12>)",
  "tgl": "date <input>, (tanggal pelaksanaan visitasi pengawas)",
  "file": "file/binary <upload>, (lampiran foto visitasi atau lembar instrumen hasil pengawasan)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Pendampingan Implementasi Kurikulum Merdeka (SDN 2 BUKE): Temuan akademik perangkat ajar Fase B masih menggunakan pola lama; tindak lanjut berupa bimbingan teknis penyusunan modul ajar berbasis asesmen awal.
Monitoring Asesmen Nasional Berbasis Komputer (SMPN SATAP 16 KONSEL): Temuan manajerial berupa keterbatasan bandwidth internet; tindak lanjut berupa rekomendasi koordinasi penyedia jaringan dan penyiapan cadangan tethering modem.
Supervisi Tata Kelola Dokumen KOSP (SDN 5 PALANGGA SELATAN): Evaluasi keselarasan kurikulum operasional satuan pendidikan dengan karakteristik lokal sekolah; tindak lanjut revisi pengesahan KOSP tahun ajaran berjalan.
Evaluasi Standar Sarana dan Prasarana (SDN 3 LAEYA): Temuan kondisi ruang kelas yang membutuhkan perbaikan plafon; tindak lanjut verifikasi pengajuan usulan rehabilitasi melalui sistem Sikola Pindara.
```

---
### 19. Jurnal BK
**Kategori:** `Jurnal V2`  
**Route Frontend:** [`/admin/jurnal/bk`](http://localhost:3000/admin/jurnal/bk)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/jurnal/bk`  
**Tabel Database:** `jurnal_bk`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan rekam jejak penyelenggaraan layanan Bimbingan dan Konseling bagi peserta didik, mencakup nama peserta didik, kelas, topik materi bimbingan, identifikasi permasalahan, model kegiatan layanan (individual/kelompok), jenis bidang layanan BK (pribadi, sosial, belajar, karir), hasil konseling yang dicapai, rencana tindak lanjut penanganan, serta dokumen bukti penanganan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "nm_siswa": "string <input>, (nama lengkap siswa yang menerima layanan BK || mengambil dari data master siswa yang telah di buat sebelumnya <16.2>)",
  "kelas_id": "string <option>, (di pilih dari list master kelas yang sudah kita buat sebelumnya <16.4.3>)",
  "tgl": "date <input>, (tanggal pelaksanaan sesi layanan bimbingan konseling)",
  "materi_layanan": "string <input: textarea>, (topik atau materi bimbingan yang diberikan)",
  "permasalahan": "string <input: textarea>, (uraian gejala atau latar belakang masalah yang dihadapi siswa)",
  "mdl_kegiatan_id": "string <option>, (di pilih dari list BK kegiatan layanan yang sudah kita buat sebelumnya <16.9>)",
  "jns_layanan_id": "string <option>, (di pilih dari list BK jenis layanan yang sudah kita buat sebelumnya <16.8>)",
  "hasil": "string <input: textarea>, (hasil capaian atau kesepakatan komitmen solusi setelah sesi konseling)",
  "rnc_tindak_lanjut": "string <input: textarea>, (rencana tindak lanjut)",
  "keterangan": "string <input: textarea>, (catatan perkembangan kondisi siswa atau status kasus)",
  "file": "file/binary <upload>, (lampiran foto sesi saat bimbingan konseling)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Konseling Individual Penanganan Kedisiplinan (SMPN SATAP 16 KONSEL): Kasus sering terlambat pada siswa Kelas VIII A dengan jenis Layanan Pribadi, hasil berupa komitmen jadwal bangun pagi dan tindak lanjut pemantauan buku monitoring harian.
Bimbingan Kelompok Peningkatan Motivasi Belajar (SMPN SATAP 16 KONSEL): Sesi Layanan Belajar bagi 5 peserta didik Kelas IX B yang mengalami kejenuhan belajar menjelang ujian akhir, menghasilkan kesepakatan kelompok belajar terpadu.
Mediasi Hubungan Sosial Antar Peserta Didik (SMPN 2 KONSEL): Penyelesaian perselisihan kesalahpahaman pergaulan di Kelas VII C melalui Layanan Sosial, menghasilkan penandatanganan kesepakatan damai dan saling menghargai.
Bimbingan Karir Peminatan Studi Lanjutan (SMPN 1 PALANGGA): Pendampingan penjajakan minat dan potensi akademis bagi siswa Kelas IX A melalui Layanan Karir, untuk persiapan pemilihan jurusan jenjang SMA/SMK.
```

---
### 20. Sekolah Penggerak
**Kategori:** `Gallery`  
**Route Frontend:** [`/admin/gallery/sekolah-penggerak`](http://localhost:3000/admin/gallery/sekolah-penggerak)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/gallery/sekolah-penggerak`  
**Tabel Database:** `gallery_sekolah_penggerak`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan dokumentasi publikasi program dan kegiatan Program Sekolah Penggerak di satuan pendidikan, mencakup nama kegiatan, tujuan pelaksanaan, tahapan/proses kegiatan, hasil capaian transformasi sekolah, tautan video YouTube kegiatan, serta lampiran foto dokumentasi.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend/backend: 'Program Sekolah Penggerak'>",
  "judul": "string <input>, (nama kegiatan Program Sekolah Penggerak)",
"tujuan": "string <input: textarea>, (maksud dan tujuan pelaksanaan kegiatan)",
  "tujuan": "string <input: textarea>, (penjelasan singkat pelaksanaan kegiatan)",
  "proses": "string <input: textarea>, (tahapan alur atau proses pelaksanaan kegiatan)",
  "hasil": "string <input: textarea>, (capaian atau dampak positif yang diraih sekolah)",
  "link": "string <input: optional>, (tautan/link video kegiatan di YouTube jika ada)",
  "file": "file/binary <upload>, (lampiran foto dokumentasi kegiatan)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Lokakarya Penguatan Komite Pembelajaran (SDN 2 BUKE): Peningkatan kapasitas guru dalam merancang modul ajar berbasis diferensiasi dengan hasil 100% guru menyusun perangkat ajar mandiri.
Gelar Karya P5 Kewirausahaan (SMPN SATAP 16 KONSEL): Pameran hasil karya olahan pangan lokal siswa sebagai implementasi Projek Profil Pelajar Pancasila.
Refleksi dan Evaluasi Implementasi Kurikulum Merdeka (SDN 5 PALANGGA SELATAN): Forum evaluasi berkala capaian numerasi dan literasi bersama fasilitator sekolah penggerak.
Desiminasi Praktik Baik Digitalisasi Pembelajaran (SMPN 2 KONSEL): Pemanfaatan akun belajar.id dan Chromebook dalam asesmen formatif harian kelas.
```

---
### 21. Gallery Program Guru Penggerak
**Kategori:** `Gallery`  
**Route Frontend:** [`/admin/gallery/guru-penggerak`](http://localhost:3000/admin/gallery/guru-penggerak)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/gallery/guru-penggerak`  
**Tabel Database:** `gallery_guru_penggerak`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan portofolio kegiatan aksi nyata dan karya kepemimpinan pembelajaran oleh Calon Guru Penggerak maupun Guru Penggerak, mencakup deskripsi prakarsa perubahan, tujuan pembelajaran berpusat pada murid, proses implementasi di kelas/sekolah, hasil refleksi, tautan video, dan dokumentasi visual.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend/backend: 'Program Guru Penggerak'>",
  "judul": "string <input>, (nama aksi nyata/kegiatan guru penggerak)",
  "tujuan": "string <input: textarea>, (tujuan aksi nyata bagi murid dan ekosistem sekolah)",
  "proses": "string <input: textarea>, (langkah pelaksanaan menggunakan alur BAGJA/metode aksi nyata)",
  "hasil": "string <input: textarea>, (perubahan budaya positif dan capaian karakter peserta didik)",
  "link": "string <input: optional>, (tautan video aksi nyata di YouTube)",
  "file": "file/binary <upload>, (lampiran foto dokumentasi pelaksanaan aksi nyata)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Aksi Nyata Modul 1.4 Budaya Positif (SDN 2 BUKE): Pembentukan keyakinan kelas dan penerapan segitiga restitusi dalam mendisiplinkan murid tanpa hukuman fisik.
Pendampingan Individu Praktik Coaching (SMPN SATAP 16 KONSEL): Sesi coaching rekan sejawat untuk mengidentifikasi potensi dan hambatan belajar siswa.
Berbagi Praktik Baik Pemetaan Aset Sekolah Modul 3.2 (SDN 3 LAEYA): Pemanfaatan 7 modal aset utama lingkungan sekolah guna mendukung pembelajaran intrakurikuler.
```

---
### 22. Gallery Program Organisasi Penggerak
**Kategori:** `Gallery`  
**Route Frontend:** [`/admin/gallery/organisasi-penggerak`](http://localhost:3000/admin/gallery/organisasi-penggerak)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/gallery/organisasi-penggerak`  
**Tabel Database:** `gallery_organisasi_penggerak`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan dokumentasi pelaksanaan kegiatan program pendampingan dari Organisasi dalam upaya peningkatan kompetensi literasi, numerasi, dan penguatan karakter pendidik di sekolah sasaran.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend/backend: 'Program Organisasi Penggerak'>",
  "judul": "string <input>, (nama kegiatan kemitraan POP)",
  "tujuan": "string <input: textarea>, (tujuan program kemitraan organisasi penggerak)",
  "proses": "string <input: textarea>, (metode pendampingan, bimtek, atau workshop yang diselenggarakan)",
  "hasil": "string <input: textarea>, (peningkatan skor kompetensi pedagogik dan mutu pembelajaran)",
  "link": "string <input: optional>, (tautan video dokumentasi di YouTube)",
  "file": "file/binary <upload>, (lampiran foto kegiatan kemitraan)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Pelatihan Pembelajaran Berbasis Numerasi Kontekstual (SDN 2 BUKE): Workshop penerapan media matematika realistik bekerja sama dengan yayasan mitra POP.
Penguatan Literasi Awal Kelas Bawah (SDN 5 PALANGGA SELATAN): Bimbingan teknis membaca terbimbing menggunakan buku bacaan berjenjang.
Workshop Manajemen Berbasis Sekolah Ramah Anak (SMPN SATAP 16 KONSEL): Pelatihan tata kelola lingkungan belajar aman dan bebas dari perundungan.
Pendampingan Model Asesmen Diagnostik Cepat (SDN 1 BAULA): Evaluasi baseline kemampuan calistung siswa pasca-pandemi bersama fasilitator organisasi mitra.
```

---
### 23. Gallery Kegiatan Kepala Sekolah
**Kategori:** `Gallery`  
**Route Frontend:** [`/admin/gallery/kegiatan-kepala-sekolah`](http://localhost:3000/admin/gallery/kegiatan-kepala-sekolah)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/gallery/kegiatan-kepala-sekolah`  
**Tabel Database:** `gallery_kegiatan_kepala_sekolah`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan dokumentasi kegiatan manajerial, supervisi akademik, dan forum Kelompok Kerja Kepala Sekolah, mencakup tajuk kegiatan kepemimpinan, target peningkatan tata kelola sekolah, rangkaian jalannya kegiatan, hasil evaluasi, link tayangan, serta berkas foto kegiatan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend/backend: 'Kegiatan Kepala Sekolah'>",
  "judul": "string <input>, (nama agenda/kegiatan kepala sekolah atau MKKS)",
  "tujuan": "string <input: textarea>, (tujuan kegiatan manajerial atau rapat koordinasi)",
  "proses": "string <input: textarea>, (tahapan jalannya musyawarah, supervisi, atau lokakarya kepsek)",
  "hasil": "string <input: textarea>, (keputusan manajerial, kesepakatan tata kelola, atau tindak lanjut supervisi)",
  "link": "string <input: optional>, (tautan video dokumentasi di YouTube)",
  "file": "file/binary <upload>, (lampiran foto kegiatan)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Rapat Koordinasi MKKS SMP Se-Konawe Selatan (SMPN SATAP 16 KONSEL): Pembahasan kesiapan teknis pelaksanaan Asesmen Sumatif Akhir Jenjang berbasis aplikasi digital.
Workshop Perencanaan Berbasis Data (PBD) Melalui Rapor Pendidikan (SDN 2 BUKE): Penyusunan Rencana Kerja Tahunan (RKT) dan RKAS berdasarkan rekomendasi indikator prioritas.
Supervisi Klinis Tata Kelola Administrasi Pembelajaran (SDN 5 PALANGGA SELATAN): Evaluasi berkala dokumen perangkat ajar dan instrumen penilaian guru kelas.
Focus Group Discussion (FGD) Manajemen Pengelolaan Dana BOS (SDN 3 LAEYA): Sosialisasi kepatuhan pelaporan pertanggungjawaban belanja operasional melalui ARKAS.
```

---
### 24. Gallery Kegiatan KKG SD
**Kategori:** `Gallery`  
**Route Frontend:** [`/admin/gallery/kegiatan-kkg-sd`](http://localhost:3000/admin/gallery/kegiatan-kkg-sd)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/gallery/kegiatan-kkg-sd`  
**Tabel Database:** `gallery_kegiatan_kkg_sd`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan dokumentasi forum Kelompok Kerja Guru Sekolah Dasar (KKG SD) tingkat gugus atau kecamatan, memuat agenda peningkatan kompetensi keprofesian berkelanjutan, pembuatan perangkat ajar bersama, proses diskusi/bedah modul, hasil rekomendasi pembelajaran, serta dokumentasi foto.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend/backend: 'Kegiatan KKG SD'>",
  "judul": "string <input>, (nama kegiatan)",
  "tujuan": "string <input: textarea>, (tujuan kegiatan)",
  "proses": "string <input: textarea>, (proses pembahasan materi, microteaching, atau bedah kisi-kisi)",
  "hasil": "string <input: textarea>, (produk ajar bersama, bank soal, atau peningkatan wawasan)",
  "link": "string <input: optional>, (tautan video YouTube kegiatan KKG)",
  "file": "file/binary <upload>, (lampiran foto pelaksanaan KKG SD)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Bedah CP dan Penyusunan Alur Tujuan Pembelajaran Fase C (Gugus I Buke): Penyelarasan capaian pembelajaran Matematika dan Bahasa Indonesia untuk Kelas 5 dan 6.
Workshop Pembuatan Alat Peraga Edukatif Sederhana (Gugus Palangga Selatan): Pelatihan merakit media pecahan dan jaring-jaring bangun ruang dari bahan daur ulang.
Bimbingan Teknis Penyusunan Asesmen Formatif & Sumatif (Gugus Laeya): Perumusan rubrik penilaian performa dan portofolio siswa kelas rendah.
Simulasi Pembelajaran Berdiferensiasi Produk (Gugus Baula): Praktik microteaching strategi penugasan bertingkat berdasarkan tingkat kesiapan belajar siswa.
```

---
### 25. Gallery Kegiatan Guru MGMP
**Kategori:** `Gallery`  
**Route Frontend:** [`/admin/gallery/kegiatan-guru-mgmp`](http://localhost:3000/admin/gallery/kegiatan-guru-mgmp)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/gallery/kegiatan-guru-mgmp`  
**Tabel Database:** `gallery_kegiatan_guru_mgmp`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan dokumentasi kegiatan Musyawarah Guru Mata Pelajaran (MGMP) jenjang SMP tingkat subrayon atau kabupaten, mencakup peningkatan kompetensi bidang studi, pembedahan materi esensial, proses lokakarya instrumen soal, output perangkat ajar, dan lampiran dokumentasi.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend/backend: 'Kegiatan Guru MGMP'>",
  "judul": "string <input>, (nama kegiatan forum MGMP mapel)",
  "tujuan": "string <input: textarea>, (tujuan kegiatan peningkatan kompetensi guru mapel)",
  "proses": "string <input: textarea>, (jalannya diskusi materi pelajaran, simulasi lab, atau bedah modul)",
  "hasil": "string <input: textarea>, (kesepakatan modul ajar, instrumen ujian, atau karya inovasi mapel)",
  "link": "string <input: optional>, (tautan video dokumentasi di YouTube)",
  "file": "file/binary <upload>, (lampiran foto kegiatan MGMP)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Musyawarah Kerja MGMP IPA SMP (Subrayon Konsel): Pelatihan praktikum virtual lab materi sistem peredaran darah manusia bagi guru IPA.
Penyusunan Kisi-Kisi Asesmen Sumatif Akhir Semester MGMP Matematika (SMPN 2 KONSEL): Pembuatan paket instrumen soal pilihan ganda kompleks berbasis penalaran numerasi.
Workshop Pengajaran Bahasa Inggris Komunikatif (MGMP Bahasa Inggris Konsel): Penerapan teknik Role Play dan Storytelling untuk meningkatkan kepercayaan diri berbicara siswa.
```

---
### 26. Gallery Kegiatan TK & PAUD
**Kategori:** `Gallery`  
**Route Frontend:** [`/admin/gallery/kegiatan-tk-paud`](http://localhost:3000/admin/gallery/kegiatan-tk-paud)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/gallery/kegiatan-tk-paud`  
**Tabel Database:** `gallery_kegiatan_tk_paud`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan dokumentasi ragam kegiatan belajar sambil bermain dan penguatan karakter anak usia dini pada jenjang TK/PAUD, mencakup stimulasi motorik, proses pengenalan lingkungan, capaian tumbuh kembang anak, video YouTube, serta foto kegiatan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend/backend: 'Kegiatan TK & PAUD'>",
  "judul": "string <input>, (nama kegiatan pembelajaran atau festival anak PAUD)",
  "tujuan": "string <input: textarea>, (tujuan stimulasi aspek perkembangan motorik, kognitif, atau sosio-emosional)",
  "proses": "string <input: textarea>, (proses aktivitas bermain peran, eksplorasi alam, atau sentra kreasi)",
  "hasil": "string <input: textarea>, (perkembangan kemandirian anak dan kebiasaan positif yang terbangun)",
  "link": "string <input: optional>, (tautan video kegiatan di YouTube)",
  "file": "file/binary <upload>, (lampiran foto dokumentasi kegiatan anak TK/PAUD)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Kegiatan Berkebun dan Mengenal Tanaman Obat Keluarga (TK NEGERI 1 PALANGGA): Pengenalan jenis tanaman herbal melalui sentra alam untuk melatih sensori dan motorik halus anak.
Peringatan Hari Kartini dengan Parade Busana Adat Nusantara (PAUD MELATI BUKE): Penanaman rasa cinta tanah air dan keberagaman budaya sejak usia dini.
Praktik Cuci Tangan Pakai Sabun dan Gosok Gigi Bersama (TK KARTIKA KONSEL): Pembiasaan pola hidup bersih dan sehat (PHBS) melalui demonstrasi interaktif.
Outing Class Pengenalan Profesi ke Pemadam Kebakaran (PAUD CEMPAKA LAEYA): Edukasi pengenalan mitigasi keselamatan bahaya api dan tugas mulia petugas pemadam kebakaran.
```

---
### 27. Gallery Kegiatan Pengawas Satdik
**Kategori:** `Gallery`  
**Route Frontend:** [`/admin/gallery/kegiatan-pengawas`](http://localhost:3000/admin/gallery/kegiatan-pengawas)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/gallery/kegiatan-pengawas`  
**Tabel Database:** `gallery_kegiatan_pengawas`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan dokumentasi forum pembinaan, rapat koordinasi asosiasi pengawas dan workshop peningkatan profesionalisme Pengawas Satuan Pendidikan, mencakup tema pembinaan manajerial, sasaran pendampingan, proses diseminasi kebijakan, hasil pengawasan, tautan video, serta dokumentasi foto.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "kategori": "string, <generate otomatis | frontend/backend: 'Kegiatan Pengawas'>",
  "judul": "string <input>, (nama forum atau kegiatan pengawas sekolah)",
  "tujuan": "string <input: textarea>, (tujuan kegiatan pembinaan kepengawasan satuan pendidikan)",
  "proses": "string <input: textarea>, (alur pemaparan instrumen evaluasi atau diskusi kelompok terpumpun)",
  "hasil": "string <input: textarea>, (rekomendasi peta mutu sekolah binaan dan program tindak lanjut pembinaan)",
  "link": "string <input: optional>, (tautan video pengawasan di YouTube)",
  "file": "file/binary <upload>, (lampiran foto kegiatan kepengawasan)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Rapat Koordinasi Kelompok Kerja Pengawas Sekolah (Korwas Konsel): Penyusunan program pengawasan tahunan berbasis Rapor Pendidikan sekolah binaan.
Workshop Pemanfaatan Platform Rapor Pendidikan dalam Supervisi (Dinas Dikbud Konsel): Pelatihan integrasi analisis data mutu sekolah ke dalam instrumen pembinaan manajerial.
Diseminasi Transformasi Peran Pengawas Sekolah Sebagai Pendamping (Konawe Selatan): Sosialisasi Perdirjen GTK No. 4831 tentang peran baru pengawas sekolah sebagai coach dan fasilitator.
Evaluasi Hasil Uji Coba Asesmen Nasional Jenjang SD (Korwas Palangga): Pemetaan kendala sarana Chromebook dan rekomendasi sharing sumber daya antar-sekolah berdekatan.
```

---
### 28. Video Testimoni
**Kategori:** `Gallery`  
**Route Frontend:** [`/admin/gallery/video-testimoni`](http://localhost:3000/admin/gallery/video-testimoni)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/gallery/video-testimoni`  
**Tabel Database:** `gallery_video_testimoni`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan unggahan video testimoni, apresiasi, serta ulasan dampak dari para pemangku kepentingan pendidikan (Bupati/Pimpinan Daerah, Kepala Dinas, Kepala Sekolah, Guru, Orang Tua, dan Murid) terkait kebermanfaatan implementasi program Sikola Pindara di Kabupaten Konawe Selatan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "judul": "string <input>, (judul atau narasi pokok video testimoni,)",
  "file": "file/video <upload: mp4/webm>, (berkas rekaman video testimoni langsung yang diunggah ke server)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Testimoni Bupati Konawe Selatan: Apresiasi atas peluncuran portal digital Sikola Pindara sebagai langkah terobosan percepatan digitalisasi pendidikan daerah.
Ulasan Kepala Sekolah SDN 2 BUKE: Pengalaman kemudahan dalam menginventarisasi kondisi sarpras gedung dan pelaporan KBM secara real-time.
Pengakuan Guru Penggerak SMPN SATAP 16 KONSEL: Manfaat fitur jurnal pembelajaran dan komunitas belajar dalam meningkatkan budaya kolaborasi guru.
Testimoni Pengawas Pembina Kecamatan Palangga: Efisiensi pemantauan mutu sekolah binaan dan rekapitulasi data akreditasi sekolah secara terpusat.
```

---
### 29. Piagam Sertifikat
**Kategori:** `Penghargaan`  
**Route Frontend:** [`/admin/piagam-sertifikat`](http://localhost:3000/admin/piagam-sertifikat)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/piagam-sertifikat`  
**Tabel Database:** `piagam_sertifikat`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan pengelolaan portofolio dokumen piagam penghargaan, sertifikat bimbingan teknis (Bimtek), pelatihan keprofesian berkelanjutan, seminar/lokakarya, maupun apresiasi prestasi yang diraih oleh Pendidik dan Tenaga Kependidikan (PTK). Modul ini mendata nama kegiatan yang diikuti, lembaga penyelenggara, tahun pelaksanaan, lokasi kegiatan, peran keikutsertaan (sebagai peserta, narasumber, juri, atau pemenang lomba), serta arsip digital berkas sertifikat dalam format PDF.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend: uniqid()>",
  "kegiatan": "string <input: textarea>, (nama pelatihan, workshop, bimtek, seminar, atau lomba yang diikuti)",
  "penyelenggara": "string <input: textarea>, (nama instansi, kementerian, dinas, atau organisasi penyelenggara)",
  "tahun": "number <input>, (tahun perolehan sertifikat atau pelaksanaan kegiatan)",
  "tempat_pelaksana": "string <input>, (lokasi pelaksanaan kegiatan)",
  "sebagai": "string <input>, (peran/status dalam kegiatan)",
  "file": "file/binary <upload: pdf>, (berkas digital scan piagam/sertifikat dalam format PDF)",
  "createdBy": "string, <generate otomatis | backend >",
  "createdAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Bimbingan Teknis Implementasi Kurikulum Merdeka (SDN 2 BUKE): Pelatihan penyusunan Modul Ajar dan KOSP yang diselenggarakan oleh Balai Guru Penggerak (BGP) Provinsi Sulawesi Tenggara Tahun 2023 bertempat di Kendari dengan peran sebagai Peserta.
Piagam Penghargaan Kelulusan Program Pendidikan Guru Penggerak Angkatan 7 (SMPN SATAP 16 KONSEL): Diterbitkan oleh Ditjen GTK Kemendikbudristek RI Tahun 2023 atas penuntasan masa pendidikan kepemimpinan pembelajaran selama 6 bulan sebagai Peserta / Guru Penggerak.
Workshop Penguatan Komunitas Belajar Sekolah Penggerak (SDN 5 PALANGGA SELATAN): Kegiatan peningkatan mutu pembelajaran yang diselenggarakan oleh Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan Tahun 2024 bertempat di Aula Dinas dengan peran sebagai Narasumber.
Piagam Apresiasi Guru Berprestasi dan Berdedikasi Jenjang SD (SDN 1 BAULA): Penganugerahan penghargaan Hari Guru Nasional oleh Pemerintah Daerah Kabupaten Konawe Selatan Tahun 2023 sebagai Juara 1 Lomba Inovasi Pembelajaran.
```

---
### 30. Verifikasi Tunjangan Guru
**Kategori:** `Verifikasi`  
**Route Frontend:** [`/admin/verifikasi/tunjangan-guru`](http://localhost:3000/admin/verifikasi/tunjangan-guru)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/verifikasi/tunjangan-guru`  
**Tabel Database:** `verifikasi_tunjangan_guru`  

#### Deskripsi & Bisnis Logika
> Modul ini digunakan oleh verifikator untuk memvalidasi kelengkapan berkas digital (PDF), serta menentukan status usulan tunjangan guru (seperti Tunjangan Profesi Guru/TPG sertifikasi, Tambahan Penghasilan/Tamsil non-sertifikasi, maupun Tunjangan Khusus Guru. Verifikator dapat memeriksa kelengkapan bukti pendukung (SKTP, SPTJM bermaterai, SK Pembagian Tugas Mengajar, rekening aktif, dan rekap presensi), memberikan persetujuan berkas (status = 1 / Diterima), atau menolak berkas dengan menyertakan catatan/alasan perbaikan (status = 2 / Dikembalikan) agar segera diperbaiki oleh guru/sekolah yang bersangkutan. Modul ini juga dilengkapi fitur cetak lembar rekapitulasi verifikasi usulan per unit kerja dan triwulan berjalan.

#### Kontrak Payload JSON (API Contract)
**Form Aksi Verifikasi Berkas (Contract API)**
```json
{
  "id": "string <relation: usulan.id, diambil dari baris data usulan yang diverifikasi>",
  "status": "number <system/action>, (1 = 'Diterima / Disetujui', 2 = 'Dikembalikan / Ditolak')",
  "pesan": "string <input: textarea>, (catatan verifikasi, catatan kelengkapan dokumen, atau rincian alasan pengembalian berkas usulan)"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Usulan Tunjangan Profesi Guru (TPG) Sertifikasi PNS Triwulan I - Diterima:
{
"id": "usul-tpg-2026-001",
"status": 1,
"pesan": "Berkas lengkap dan sah. SKTP nomor: 0142.0824/B5.2/GT.01.03/2026 telah valid, beban kerja linier 24 jam tatap muka terpenuhi, dan SPTJM telah ditandatangani Kepala Sekolah. Berkas disetujui untuk diteruskan ke SPM pencairan."
}
Usulan Tambahan Penghasilan (Tamsil) Guru Non-Sertifikasi PPPK Triwulan I - Dikembalikan:
{
  "id": "usul-tamsil-2026-042",
  "status": 2,
  "pesan": "Berkas dikembalikan. Surat Pertanggungjawaban Mutlak (SPTJM) belum berstempel basah sekolah dan nomor rekening Bank Sultra yang dilampirkan tidak sesuai dengan nama pada KTP. Silakan perbarui dokumen lampiran paling lambat 20 April 2026."
}
Usulan Tunjangan Profesi Guru (TPG) PPPK Triwulan II - Diterima:
{
  "id": "usul-tpg-2026-088",
  "status": 1,
  "pesan": "Dokumen digital lengkap dan telah diverifikasi. Rekapitulasi absensi kehadiran aplikasi Si-Hadir bulan Januari-Maret 2026 di atas 95% dan rekening gaji aktif. Usulan diterima."
}
```

---
### 31. Verifikasi Usulan Rekonsiliasi Dana BOSP
**Kategori:** `Verifikasi`  
**Route Frontend:** [`/admin/verifikasi/rekonsiliasi-bosp`](http://localhost:3000/admin/verifikasi/rekonsiliasi-bosp)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/verifikasi/rekonsiliasi-bosp`  
**Tabel Database:** `verifikasi_rekonsiliasi_bosp`  

#### Deskripsi & Bisnis Logika
> Verifikasi Usulan Rekonsiliasi Dana BOSP

Modul ini digunakan oleh Tim Manajemen BOSP (Bantuan Operasional Satuan Pendidikan) Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan untuk memverifikasi laporan pertanggungjawaban (SPJ) realisasi belanja dana BOSP satuan pendidikan tingkat PAUD, SD, dan SMP per semester dan tahun anggaran. Modul ini menerapkan mekanisme Verifikasi Berjenjang 2 Tahap (Dual Verification):

Tahap 1 (Cek Benar): Verifikasi keabsahan fisik bukti transaksi, kuitansi, nota/faktur, cap perpajakan, dan kesesuaian nominal rincian belanja (status_1 dan pesan_1).

Tahap 2 (Cek Lengkap): Verifikasi kelengkapan administrasi pembukuan dan instrumen pelaporan akuntansi, meliputi 26 rincian dokumen wajib rekonsiliasi seperti Buku Kas Umum (BKU), Buku Pembantu Pajak beserta bukti setor NTPN e-Billing, Buku Pembantu Kas & Bank, Rekening Koran, LRA BOSP, Berita Acara Rekonsiliasi Aset, dan dokumen RKAS perubahan (status_2 dan pesan_2).

Satuan pendidikan yang telah lolos kedua tahap verifikasi (Cek Benar & Cek Lengkap) akan diterbitkan Surat Rekomendasi Hasil Rekonsiliasi Dana BOSP dari dinas sebagai syarat utama penyaluran dana BOSP tahap/semester berikutnya.

#### Kontrak Payload JSON (API Contract)
**Form Verifikasi Tahap 1 - Cek Benar (Contract API)**
```json
{
  "id": "string <relation: lampiran_rekon.id, diambil dari baris berkas instrumen rekonsiliasi yang diperiksa>",
  "status_1": "number <system/action>, (1 = 'Terverifikasi / Benar', 2 = 'Penolakan / Perbaikan')",
  "pesan_1": "string <input: textarea>, (catatan koreksi kebenaran transaksi, nota, rincian kuitansi, atau faktur belanja)"
}
```

**Form Verifikasi Tahap 2 - Cek Lengkap (Contract API)**
```json
{
  "id": "string <relation: lampiran_rekon.id, diambil dari baris berkas instrumen rekonsiliasi yang diperiksa>",
  "status_2": "number <system/action>, (1 = 'Terverifikasi / Lengkap', 2 = 'Penolakan / Belum Lengkap')",
  "pesan_2": "string <input: textarea>, (catatan kelengkapan dokumen pendukung pelaporan, SPTJM, buku pembantu, dan lembar pengesahan)"
}
```

**Form Tambah Surat Rekomendasi BOSP (Contract API - Post Verification)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "rekon_id": "string <relation: rekon.id, ID usulan rekonsiliasi sekolah>",
  "uraian": "string <input>, (nama / perihal nomor surat rekomendasi bebas rekon BOSP)",
  "file": "file (PDF) <upload: q-file>, (dokumen surat rekomendasi hasil rekonsiliasi BOSP bertanda tangan pejabat dinas)"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Verifikasi Buku Kas Umum (BKU) Semester I - SDN 4 Ranomeeto (Tahap 1 & Tahap 2 Diterima):
{
  "id": "rekon-lamp-2026-0012",
  "status_1": 1,
  "pesan_1": "Cek Benar: Saldo akhir BKU per 30 Juni 2026 cocok dan sesuai dengan fisik kas tunai dan saldo pada rekening koran Giro BOSP Bank Sultra.",
  "status_2": 1,
  "pesan_2": "Cek Lengkap: BKU telah ditutup dan ditandatangani lengkap oleh Kepala Sekolah dan Bendahara BOSP beserta cap stempel resmi sekolah."
}
Verifikasi Buku Pembantu Pajak Semester I - SMPN 22 Konawe Selatan (Tahap 1 Ditolak / Perbaikan):
{
  "id": "rekon-lamp-2026-0045",
  "status_1": 2,
  "pesan_1": "Cek Benar Ditolak: Terdapat selisih pemotongan PPh Pasal 21 dan PPN atas belanja ATK bulan Mei sebesar Rp 425.000,- yang bukti Nomor Transaksi Penerimaan Negara (NTPN) e-Billing belum terlampir jelas.",
  "status_2": 1,
  "pesan_2": "Cek Lengkap: Format Buku Pembantu Pajak lengkap sesuai juknis BOS Kemendikbudristek."
}
Verifikasi Buku Pembantu Rincian Obyek Belanja Modal Semester II - SDN 9 Buke (Tahap 2 Ditolak / Belum Lengkap):
{
  "id": "rekon-lamp-2026-0089",
  "status_1": 1,
  "pesan_1": "Cek Benar: Nilai perolehan belanja modal perangkat Chromebook dan proyektor telah sesuai dengan faktur SIPLah Kemendikbudristek.",
  "status_2": 2,
  "pesan_2": "Cek Lengkap Ditolak: Berita Acara Serah Terima (BAST) Barang dan Berita Acara Pemeriksaan Barang Milik Daerah belum diunggah. Wajib melampirkan lembar inventarisasi aset KIB B."
}
Penerbitan Surat Rekomendasi Hasil Rekonsiliasi Dana BOSP Semester II - SMP Satap 16 Konawe Selatan (Selesai Diverifikasi):
{
  "id": "rekom-bosp-2026-007",
  "rekon_id": "rekon-smp-satap-16-2026-s2",
  "uraian": "Surat Rekomendasi Bebas Temuan Rekonsiliasi BOSP Semester II T.A 2026 No. 421/782/DISDIKBUD/2026",
  "file": "rekomendasi_rekon_bosp_smp_satap_16_konsel_sem2.pdf"
}
```

---
### 32. Pengumuman GTK
**Kategori:** `Regulasi dan Info GTK`  
**Route Frontend:** [`/admin/regulasi-gtk/pengumuman`](http://localhost:3000/admin/regulasi-gtk/pengumuman)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/regulasi-gtk/pengumuman`  
**Tabel Database:** `gtk_pengumuman`  

#### Deskripsi & Bisnis Logika
> Modul ini digunakan oleh Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan untuk mempublikasikan surat edaran resmi, informasi pemutakhiran data Info GTK, jadwal verifikasi validasi aneka tunjangan, serta pengumuman penting lainnya bagi Guru dan Tenaga Kependidikan (GTK). Setiap rilis pengumuman memuat judul pengumuman.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "judul": "string <input>, (judul pengumuman informasi GTK)",
  "deskripsi": "string <input>, (isi uraian lengkap surat edaran/pengumuman GTK)",
  "file": "string <input>, (lampiran berkas surat edaran)",
  "file_type": "string, <generate otomatis | backend>",
  "unit_kerja": "string, <generate otomatis | backend>",
  "nip": "string, <generate otomatis | backend>",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Pemberitahuan Batas Waktu Sinkronisasi Dapodik untuk Penerbitan SKTP Semester I: Edaran batas akhir pemutakhiran data rombel dan jam mengajar linier 24 jam bagi calon penerima Tunjangan Profesi Guru (TPG) tahun anggaran berjalan.
Jadwal Verifikasi dan Validasi Tambahan Penghasilan (Tamsil) Guru Non-Sertifikasi: Pengumuman jadwal pengumpulan berkas fisik dan digital usulan tamsil bagi pendidik berstatus ASN dan PPPK yang belum bersertifikat pendidik.
Panggilan Mengikuti Uji Kompetensi Kenaikan Jabatan Fungsional Guru (UKKJ): Pengumuman daftar nama peserta seleksi kenaikan jenjang jabatan fungsional Guru Pertama ke Guru Muda dan Guru Muda ke Guru Madya se-Kabupaten Konawe Selatan.
Instruksi Pemutakhiran Rekening Gaji dan Tunjangan Bank Sultra: Surat edaran terkait validasi nomor rekening aktif guru penerima aneka tunjangan daerah tertinggal dan terpencil (TKG) untuk mengantisipasi retur dana SP2D.
```

---
### 33. Modul dan Materi Pelatihan
**Kategori:** `Regulasi dan Info GTK`  
**Route Frontend:** [`/admin/regulasi-gtk/modul-materi`](http://localhost:3000/admin/regulasi-gtk/modul-materi)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/regulasi-gtk/modul-materi`  
**Tabel Database:** `gtk_modul_pelatihan`  

#### Deskripsi & Bisnis Logika
> Modul ini digunakan sebagai repositori digital sumber belajar dan pengembangan keprofesian berkelanjutan bagi pendidik dan tenaga kependidikan. Pengelola dinas mengunggah modul pelatihan, panduan teknis implementasi kurikulum, pedoman penyusunan perangkat ajar, materi lokakarya, hingga bahan bimtek peningkatan kompetensi literasi dan numerasi yang dapat diunduh dan dipelajari mandiri oleh guru dan kepala sekolah.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "judul": "string <input>, (nama judul modul atau materi pelatihan keprofesian)",
  "deskripsi": "string <input>, (ringkasan kompetensi, silabus, atau deskripsi modul pembelajaran)",
  "file": "string <input >, (lampiran dokumen modul / handout pelatihan)",
  "file_type": "string, <generate otomatis | backend>",
  "unit_kerja": "string, <generate otomatis | backend>",
  "nip": "string, <generate otomatis | backend>",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Modul Panduan Pengembangan Pembelajaran Berdiferensiasi Kurikulum Merdeka: Materi strategi merancang asesmen diagnostik dan diferensiasi konten, proses, serta produk di jenjang SD dan SMP.
Handout Bimbingan Teknis Penguatan Komunitas Belajar (Kombel) Ramah Guru: Panduan fasilitasi siklus inkuiri (refleksi awal, perencanaan, implementasi, dan evaluasi) dalam kelompok kerja guru.
Buku Saku Pengelolaan Kinerja Guru dan Kepala Sekolah di PMM: Panduan teknis penetapan target Rencana Hasil Kerja (RHK) serta pelaksanaan observasi kelas pada Platform Merdeka Mengajar.
Materi Pelatihan Pembelajaran Coding dan Kecerdasan Artifisial Tingkat Dasar: Modul bimtek pengenalan computational thinking bagi guru matematika dan IPA jenjang sekolah dasar dan menengah.
```

---
### 34. Regulasi GTK
**Kategori:** `Regulasi dan Info GTK`  
**Route Frontend:** [`/admin/regulasi-gtk/regulasi`](http://localhost:3000/admin/regulasi-gtk/regulasi)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/regulasi-gtk/regulasi`  
**Tabel Database:** `gtk_regulasi`  

#### Deskripsi & Bisnis Logika
> Modul ini berfungsi sebagai pusat dokumentasi produk hukum dan peraturan perundang-undangan di bidang pendidikan, mencakup Undang-Undang, Peraturan Menteri (Permendikbudristek), Keputusan Bersama, Peraturan Daerah (Perda), Peraturan Bupati (Perbup), hingga Surat Keputusan Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "judul": "string <input>, (nama dan nomor peraturan / keputusan resmi)",
  "deskripsi": "string <input>  (tentang / konsideran ringkas isi regulasi hukum)",
  "tahun": "number <input>, (tahun penerbitan / penetapan regulasi)",
  "file": "string <input>, (salinan lembaran hukum peraturan)",
  "file_type": "string, <generate otomatis | backend>",
  "unit_kerja": "string, <generate otomatis | backend>",
  "nip": "string, <generate otomatis | backend>",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Peraturan Bupati Konawe Selatan tentang Petunjuk Teknis Penerimaan Peserta Didik Baru: Regulasi penataan jalur zonasi, afirmasi, perpindahan tugas orang tua, dan prestasi untuk jenjang TK, SD, dan SMP (Tahun 2026).
Keputusan Kepala Dinas tentang Kalender Pendidikan Kabupaten Konawe Selatan: Pedoman hari efektif belajar mengajar, jadwal asesmen, dan libur semester satuan pendidikan (Tahun 2026).
Permendikbudristek tentang Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan (BOSP): Regulasi pedoman perencanaan, penganggaran, pelaksanaan, dan pelaporan pertanggungjawaban dana BOS (Tahun 2025).
Peraturan Bupati tentang Pemberian Tambahan Penghasilan Pegawai bagi Guru ASN Daerah: Kebijakan pemerintah daerah terkait alokasi dan syarat penyaluran tambahan kesejahteraan bagi aparatur sipil negara di lingkungan dinas pendidikan (Tahun 2025).
```

---
### 35. PPDB PAUD
**Kategori:** `PPDB`  
**Route Frontend:** [`/admin/ppdb/paud`](http://localhost:3000/admin/ppdb/paud)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/ppdb/paud`  
**Tabel Database:** `ppdb_paud`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan pengelolaan pendaftaran calon peserta didik baru jenjang Pendidikan Anak Usia Dini (PAUD/TK/Kelompok Bermain) di berbagai satuan pendidikan yang dientri langsung operator sekolah, mencakup identitas diri anak usia dini, status tempat tinggal, kepemilikan dokumen kelahiran, serta kelengkapan data orang tua/wali sebagai pemenuhan syarat awal masuk sekolah.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "nama": "string <input>, (Nama lengkap calon siswa PAUD/TK)",
  "nm_panggilan": "string <input>, (Nama panggilan)",
  "jns_kelamin": "string <option>, (Laki-laki, Perempuan)",
  "nisn": "number <input>, (Nomor Induk Siswa Nasional, opsional jika belum terbit)",
  "nik": "number <input>, (Nomor Induk Kependudukan anak tercantum di Kartu Keluarga)",
  "tmp_lahir": "string <input>, (Tempat lahir anak)",
  "tgl_lahir": "string <input>, (Format tanggal: 'YYYY-MM-DD')",
  "agama": "string <option>, (dipilih dari list agama yang sudah dibuat sebelumnya <16.6.1>)",
  "anak_keberapa": "string <input>, (Urutan kelahiran anak dalam keluarga)",
  "jml_saudara": "string <input>, (Jumlah saudara kandung)",
  "kecamatan_id": "string <option>, (ID wilayah kecamatan)",
  "des_kel_id": "string <option>, (ID wilayah desa/kelurahan)",
  "alamat": "string <input>, (Alamat jalan / tempat tinggal calon siswa)",
  "rt_rw": "string <input>, (Nomor RT/RW)",
  "dusun": "string <input>, (Nama dusun / lingkungan)",
  "kode_pos": "string <input>, (Kode pos wilayah)",
  "tmp_tinggal": "string <option>, (dipilih dari list tempat tinggal yang sudah dibuat sebelumnya <16.6.2>)",
  "lainnya": "string <input>, (Keterangan jika tmp_tinggal bernilai '9' / Lainnya)",
  "moda_transportasi": "string <option>, (dipilih dari list moda transportasi yang sudah dibuat sebelumnya <16.6.3>)",
  "file": "file | string <input>, (File lampiran pasfoto resmi calon siswa / multipart form-data)",
  "nama_ayah": "string <input>, (Nama lengkap ayah kandung)",
  "nik_ayah": "number <input>, (NIK ayah kandung)",
  "thn_lahir_ayah": "number <input>, (Tahun lahir ayah, misal: 1988)",
  "pendidikan_ayah": "string <option>, (dipilih dari list pendidikan yang sudah dibuat sebelumnya <16.6.4>)",
  "pekerjaan_ayah": "string <option>, (dipilih dari list pekerjaan yang sudah dibuat sebelumnya <16.6.5>)",
  "penghasilan_ayah": "string <option>, (dipilih dari list penghasilan yang sudah dibuat sebelumnya <16.6.6>)",
  "nama_ibu": "string <input>, (Nama lengkap ibu kandung)",
  "nik_ibu": "number <input>, (NIK ibu kandung)",
  "thn_lahir_ibu": "number <input>, (Tahun lahir ibu, misal: 1992)",
  "pendidikan_ibu": "string <option>, (dipilih dari list pendidikan yang sudah dibuat sebelumnya <16.6.4>)",
  "pekerjaan_ibu": "string <option>, (dipilih dari list pekerjaan yang sudah dibuat sebelumnya <16.6.5>)",
  "penghasilan_ibu": "string <option>, (dipilih dari list penghasilan yang sudah dibuat sebelumnya <16.6.6>)",
  "nama_wali": "string <input>, (Nama lengkap wali murid jika diasuh wali)",
  "nik_wali": "number <input>, (NIK wali murid)",
  "thn_lahir_wali": "number <input>, (Tahun lahir wali, misal: 1970)",
  "pendidikan_wali": "string <option>, (dipilih dari list pendidikan yang sudah dibuat sebelumnya <16.6.4>)",
  "pekerjaan_wali": "string <option>, (dipilih dari list pekerjaan yang sudah dibuat sebelumnya <16.6.5>)",
  "penghasilan_wali": "string <option>, (dipilih dari list penghasilan yang sudah dibuat sebelumnya <16.6.6>)",
  "kategori": "string, <generate otomatis | backend: 'PPDB PAUD'>",
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
a. AQILA KHAIRUNNISA: Calon peserta didik baru usia 5 tahun yang mendaftar pada TK NEGERI PEMBINA RANOMEETO.
b. MUHAMMAD ARKAN AL-FARIZI: Calon peserta didik baru usia 4 tahun yang mendaftar pada PAUD TERPADU ANDOOLO.
c. NAUFAL ATHALLAH SAPUTRA: Calon peserta didik baru usia 5,5 tahun yang mendaftar pada TK TUNAS HARAPAN KONDA.
d. ALULA SALSABILA AZZAHRA: Calon peserta didik baru usia 4,5 tahun yang mendaftar pada PAUD AL-FALAH BUKE.
```

---
### 36. PPDB SD
**Kategori:** `PPDB`  
**Route Frontend:** [`/admin/ppdb/sd`](http://localhost:3000/admin/ppdb/sd)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/ppdb/sd`  
**Tabel Database:** `ppdb_sd`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan pengelolaan pendaftaran calon peserta didik baru jenjang Sekolah Dasar (SD) yang dientri dan diverifikasi langsung oleh operator sekolah dasar tujuan, mencakup data identitas anak, verifikasi batas usia masuk sekolah dasar (prioritas 7 tahun atau minimal 6 tahun), titik koordinat domisili zonasi tempat tinggal, serta data sosial ekonomi orang tua/wali calon murid.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "nama": "string <input>, (Nama lengkap calon siswa SD)",
  "nm_panggilan": "string <input>, (Nama panggilan)",
  "jns_kelamin": "string <option>, (Laki-laki, Perempuan)",
  "nisn": "number <input>, (Nomor Induk Siswa Nasional dari jenjang TK/PAUD)",
  "nik": "number <input>, (Nomor Induk Kependudukan calon siswa)",
  "tmp_lahir": "string <input>, (Tempat lahir calon siswa)",
  "tgl_lahir": "string <input>, (Format tanggal: 'YYYY-MM-DD')",
  "agama": "string <option>, (dipilih dari list agama yang sudah dibuat sebelumnya <16.6.1>)",
  "anak_keberapa": "string <input>, (Urutan anak dalam keluarga)",
  "jml_saudara": "string <input>, (Jumlah saudara kandung)",
  "kecamatan_id": "string <option>, (ID wilayah kecamatan domisili zonasi)",
  "des_kel_id": "string <option>, (ID wilayah desa/kelurahan domisili zonasi)",
  "alamat": "string <input>, (Alamat jalan / tempat tinggal sesuai Kartu Keluarga)",
  "rt_rw": "string <input>, (Nomor RT/RW)",
  "dusun": "string <input>, (Nama dusun / lingkungan)",
  "kode_pos": "string <input>, (Kode pos wilayah)",
  "tmp_tinggal": "string <option>, (dipilih dari list tempat tinggal yang sudah dibuat sebelumnya <16.6.2>)",
  "lainnya": "string <input>, (Keterangan jika tmp_tinggal bernilai '9' / Lainnya)",
  "moda_transportasi": "string <option>, (dipilih dari list moda transportasi yang sudah dibuat sebelumnya <16.6.3>)",
  "file": "file | string <input>, (File lampiran pasfoto resmi calon siswa / multipart form-data)",
  "nama_ayah": "string <input>, (Nama lengkap ayah kandung)",
  "nik_ayah": "number <input>, (NIK ayah kandung)",
  "thn_lahir_ayah": "number <input>, (Tahun lahir ayah, misal: 1982)",
  "pendidikan_ayah": "string <option>, (dipilih dari list pendidikan yang sudah dibuat sebelumnya <16.6.4>)",
  "pekerjaan_ayah": "string <option>, (dipilih dari list pekerjaan yang sudah dibuat sebelumnya <16.6.5>)",
  "penghasilan_ayah": "string <option>, (dipilih dari list penghasilan yang sudah dibuat sebelumnya <16.6.6>)",
  "nama_ibu": "string <input>, (Nama lengkap ibu kandung)",
  "nik_ibu": "number <input>, (NIK ibu kandung)",
  "thn_lahir_ibu": "number <input>, (Tahun lahir ibu, misal: 1986)",
  "pendidikan_ibu": "string <option>, (dipilih dari list pendidikan yang sudah dibuat sebelumnya <16.6.4>)",
  "pekerjaan_ibu": "string <option>, (dipilih dari list pekerjaan yang sudah dibuat sebelumnya <16.6.5>)",
  "penghasilan_ibu": "string <option>, (dipilih dari list penghasilan yang sudah dibuat sebelumnya <16.6.6>)",
  "nama_wali": "string <input>, (Nama lengkap wali murid jika bersama wali)",
  "nik_wali": "number <input>, (NIK wali murid)",
  "thn_lahir_wali": "number <input>, (Tahun lahir wali, misal: 1968)",
  "pendidikan_wali": "string <option>, (dipilih dari list pendidikan yang sudah dibuat sebelumnya <16.6.4>)",
  "pekerjaan_wali": "string <option>, (dipilih dari list pekerjaan yang sudah dibuat sebelumnya <16.6.5>)",
  "penghasilan_wali": "string <option>, (dipilih dari list penghasilan yang sudah dibuat sebelumnya <16.6.6>)",
  "kategori": "string, <generate otomatis | backend: 'PPDB SD'>",
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
FAHRI KURNIAWAN SAPUTRA: Calon peserta didik baru yang mendaftar pada jalur zonasi di SD NEGERI 4 RANOMEETO.
ANDI AHMAD FADIL: Calon peserta didik baru yang mendaftar pada jalur zonasi di SD NEGERI 2 BUKE.
CITRA LESTARI DEWI: Calon peserta didik baru yang mendaftar pada jalur afirmasi keluarga kurang mampu di SD NEGERI 9 LAEYA.
MUHAMMAD ILHAM RAMADHAN: Calon peserta didik baru yang mendaftar pada jalur perpindahan orang tua di SD NEGERI 1 ANDOOLO.
```

---
### 37. PPDB SMP
**Kategori:** `PPDB`  
**Route Frontend:** [`/admin/ppdb/smp`](http://localhost:3000/admin/ppdb/smp)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/ppdb/smp`  
**Tabel Database:** `ppdb_smp`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan pengelolaan pendaftaran calon peserta didik baru jenjang Sekolah Menengah Pertama (SMP) yang dientri dan diverifikasi oleh panitia PPDB sekolah menengah, mencakup biodata lulusan SD/MI, kepemilikan NISN terdaftar di Dapodik pusat, validasi Kartu Keluarga untuk jalur zonasi, serta data penunjang orang tua/wali murid guna pemenuhan kuota seleksi penerimaan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "nama": "string <input>, (Nama lengkap calon siswa SMP)",
  "nm_panggilan": "string <input>, (Nama panggilan)",
  "jns_kelamin": "string <option>, (Laki-laki, Perempuan)",
  "nisn": "number <input>, (Nomor Induk Siswa Nasional aktif dari Dapodik SD)",
  "nik": "number <input>, (Nomor Induk Kependudukan calon siswa)",
  "tmp_lahir": "string <input>, (Tempat lahir calon siswa)",
  "tgl_lahir": "string <input>, (Format tanggal: 'YYYY-MM-DD')",
  "agama": "string <option>, (dipilih dari list agama yang sudah dibuat sebelumnya <16.6.1>)",
  "anak_keberapa": "string <input>, (Urutan anak dalam keluarga)",
  "jml_saudara": "string <input>, (Jumlah saudara kandung)",
  "kecamatan_id": "string <option>, (ID wilayah kecamatan domisili zonasi)",
  "des_kel_id": "string <option>, (ID wilayah desa/kelurahan domisili zonasi)",
  "alamat": "string <input>, (Alamat jalan / tempat tinggal sesuai Kartu Keluarga)",
  "rt_rw": "string <input>, (Nomor RT/RW)",
  "dusun": "string <input>, (Nama dusun / lingkungan)",
  "kode_pos": "string <input>, (Kode pos wilayah)",
  "tmp_tinggal": "string <option>, (dipilih dari list tempat tinggal yang sudah dibuat sebelumnya <16.6.2>)",
  "lainnya": "string <input>, (Keterangan jika tmp_tinggal bernilai '9' / Lainnya)",
  "moda_transportasi": "string <option>, (dipilih dari list moda transportasi yang sudah dibuat sebelumnya <16.6.3>)",
  "file": "file | string <input>, (File lampiran pasfoto calon siswa / multipart form-data)",
  "nama_ayah": "string <input>, (Nama lengkap ayah kandung)",
  "nik_ayah": "number <input>, (NIK ayah kandung)",
  "thn_lahir_ayah": "number <input>, (Tahun lahir ayah, misal: 1978)",
  "pendidikan_ayah": "string <option>, (dipilih dari list pendidikan yang sudah dibuat sebelumnya <16.6.4>)",
  "pekerjaan_ayah": "string <option>, (dipilih dari list pekerjaan yang sudah dibuat sebelumnya <16.6.5>)",
  "penghasilan_ayah": "string <option>, (dipilih dari list penghasilan yang sudah dibuat sebelumnya <16.6.6>)",
  "nama_ibu": "string <input>, (Nama lengkap ibu kandung)",
  "nik_ibu": "number <input>, (NIK ibu kandung)",
  "thn_lahir_ibu": "number <input>, (Tahun lahir ibu, misal: 1982)",
  "pendidikan_ibu": "string <option>, (dipilih dari list pendidikan yang sudah dibuat sebelumnya <16.6.4>)",
  "pekerjaan_ibu": "string <option>, (dipilih dari list pekerjaan yang sudah dibuat sebelumnya <16.6.5>)",
  "penghasilan_ibu": "string <option>, (dipilih dari list penghasilan yang sudah dibuat sebelumnya <16.6.6>)",
  "nama_wali": "string <input>, (Nama lengkap wali murid jika bersama wali)",
  "nik_wali": "number <input>, (NIK wali murid)",
  "thn_lahir_wali": "number <input>, (Tahun lahir wali, misal: 1965)",
  "pendidikan_wali": "string <option>, (dipilih dari list pendidikan yang sudah dibuat sebelumnya <16.6.4>)",
  "pekerjaan_wali": "string <option>, (dipilih dari list pekerjaan yang sudah dibuat sebelumnya <16.6.5>)",
  "penghasilan_wali": "string <option>, (dipilih dari list penghasilan yang sudah dibuat sebelumnya <16.6.6>)",
  "kategori": "string, <generate otomatis | backend: 'PPDB SMP'>",
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
DIMAS ADITYA NUGRAHA: Calon peserta didik baru yang mendaftar pada jalur prestasi akademik di SMP NEGERI 22 KONAWE SELATAN.
SITI AISYAH NUR CAHYANI: Calon peserta didik baru yang mendaftar pada jalur zonasi di SMP SATAP 16 KONAWE SELATAN.
REVALDO PRATAMA: Calon peserta didik baru yang mendaftar pada jalur afirmasi KIP di SMP NEGERI 2 KONAWE SELATAN.
ZAHRA AULIA RAHMADANI: Calon peserta didik baru yang mendaftar pada jalur perpindahan tugas orang tua di SMP NEGERI 5 KONAWE SELATAN.
```

---
### 38. Kuota PPDB
**Kategori:** `PPDB`  
**Route Frontend:** [`/admin/kuota-ppdb`](http://localhost:3000/admin/kuota-ppdb)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/kuota-ppdb`  
**Tabel Database:** `kuota_ppdb`  

#### Deskripsi & Bisnis Logika
> Modul ini merupakan panel pemantauan dan kalkulasi daya tampung peserta didik baru secara otomatis berbasis integrasi data Sarana Prasarana (Sarpras) dan Rombel. Sistem menghitung kuota maksimal penerimaan dengan mengalikan Jumlah Ruang Kelas Fisik yang Tersedia dengan Standar Rasio Maksimal Siswa per Rombel sesuai Permendikbudristek:

Jenjang TK/PAUD: Maksimal 22 siswa per rombel

Jenjang SD: Maksimal 28 siswa per rombel

Jenjang SMP: Maksimal 32 siswa per rombel

Panel ini menyajikan perbandingan real-time antara jumlah pendaftar yang telah diverifikasi dengan kapasitas pagu, lengkap dengan indikator warna status keterisian:

Hijau: Daya tampung masih tersedia (pendaftar < kuota maksimal)

Oranye: Daya tampung telah terisi penuh (pendaftar = kuota maksimal)

Merah: Melebihi kapasitas tampung (over-kuota / pendaftar > kuota)

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "unit_kerja_id": "string <simpeg.unit_kerja.id>",
  "nama_sekolah": "string, (nama satuan pendidikan)",
  "jenjang": "string, (PAUD / SD / SMP)",
  "jml_ruang_tersedia": "number <ruang.total>, (total ruang kelas siap pakai di sekolah)",
  "standar_maks_rombel": "number, (standar kapasitas: PAUD=22, SD=28, SMP=32)",
  "total_daya_tampung": "number, (kalkulasi: jml_ruang_tersedia * standar_maks_rombel)",
  "siswa_terdaftar": "number <ppdb.total>, (jumlah calon siswa yang telah mendaftar)",
  "sisa_kuota": "number, (kalkulasi: total_daya_tampung - siswa_terdaftar)",
  "status_kuota": "string, ('Tersedia' [Hijau] | 'Penuh' [Oranye] | 'Melebihi Kuota' [Merah])"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
SMP Negeri 22 Konawe Selatan (Kuota Tersedia / Hijau): Memiliki 4 ruang kelas baru (standar 32 siswa/rombel = total daya tampung 128 siswa), jumlah pendaftar masuk 102 siswa, sisa kuota tersedia 26 kursi.
SD Negeri 4 Ranomeeto (Kuota Penuh / Oranye): Memiliki 2 ruang kelas 1 (standar 28 siswa/rombel = total daya tampung 56 siswa), jumlah pendaftar tepat 56 siswa, pendaftaran otomatis ditutup.
SMP Negeri 2 Konawe Selatan (Melebihi Kuota / Merah): Memiliki 5 ruang kelas (kapasitas 160 siswa), jumlah pendaftar mencapai 184 calon siswa, memicu sistem perangkingan seleksi jarak zonasi dan nilai prestasi.
TK Negeri Pembina Ranomeeto (Kuota Tersedia / Hijau): Memiliki 3 ruang belajar (standar 22 siswa/rombel = kapasitas 66 anak), jumlah murid terdaftar 48 anak, sisa kuota tersedia 18 anak.
```

---
### 39. Renstra (Rencana Strategis)
**Kategori:** `Profile`  
**Route Frontend:** [`/admin/profile/renstra`](http://localhost:3000/admin/profile/renstra)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/profile/renstra`  
**Tabel Database:** `profile_renstra`  

#### Deskripsi & Bisnis Logika
> Modul ini digunakan untuk mengelola dan mempublikasikan Rencana Strategis (Renstra) Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan periode 5 tahunan. Berisi arah kebijakan pembangunan sektor pendidikan daerah, sasaran strategis peningkatan mutu, rencana perluasan akses belajar merata, pemerataan sarana prasarana sekolah di wilayah terpencil, serta target indikator kinerja utama (IKU).

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "isi": "string  <input>, (uraian lengkap)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Program Peningkatan Kualitas dan Pemerataan Sarana Prasarana Sekolah: Target pemenuhan ruang kelas layak, laboratorium komputer, dan sanitasi sehat di seluruh satuan pendidikan 3T Kabupaten Konawe Selatan.
Kebijakan Peningkatan Angka Partisipasi Kasar (APK) dan Murni (APM): Rencana strategis penuntasan program wajib belajar 12 tahun dan pencegahan anak putus sekolah melalui intervensi beasiswa daerah.
Peningkatan Kualifikasi, Kompetensi, dan Distribusi Tenaga Pendidik: Program pemenuhan kuota guru penggerak, sertifikasi pendidik, serta redistribusi guru ASN merata ke seluruh kecamatan.
Digitalisasi Tata Kelola Ekosistem Pendidikan Berbasis Sikola Pindara: Sasaran integrasi satu data pendidikan daerah (profil sekolah, rekonsiliasi BOSP, verval GTK, dan layanan publik PPDB terpusat).
```

---
### 40. Tugas Dan Fungsi
**Kategori:** `Profile`  
**Route Frontend:** [`/admin/profile/tugas-fungsi`](http://localhost:3000/admin/profile/tugas-fungsi)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/profile/tugas-fungsi`  
**Tabel Database:** `profile_tugas_fungsi`  

#### Deskripsi & Bisnis Logika
> Modul ini mendokumentasikan kedudukan hukum, tugas pokok, dan fungsi struktural organisasi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan sebagaimana diatur dalam Peraturan Bupati tentang Struktur Organisasi dan Tata Kerja (SOTK). Menjelaskan uraian tugas Kepala Dinas, Sekretariat, Bidang Pembinaan PAUD dan Pendidikan Non-

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "isi": "string  <input>, (uraian lengkap)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Tugas Pokok dan Fungsi Kepala Dinas Pendidikan dan Kebudayaan: Memimpin, merumuskan kebijakan teknis, mengoordinasikan pembinaan, serta mengevaluasi penyelenggaraan urusan pemerintahan di bidang pendidikan dan kebudayaan daerah.
Fungsi Bidang Pembinaan Ketenagaan (GTK): Penyiapan bahan perumusan kebijakan, pembinaan profesi, pemetaan kebutuhan, peningkatan kualifikasi, serta fasilitasi verifikasi kesejahteraan dan aneka tunjangan guru.
Fungsi Bidang Pembinaan Pendidikan Dasar (Dikdas): Pengelolaan operasional kurikulum, kelembagaan sekolah, pemantauan akreditasi, serta pengendalian pelaksanaan asesmen nasional jenjang SD dan SMP.
Fungsi Sekretariat Dinas: Pengoordinasian perencanaan program kerja, penatausahaan keuangan dan aset (termasuk verifikasi rekonsiliasi BOSP), administrasi kepegawaian, dan pelayanan umum.
```

---
### 41. Visi dan Misi
**Kategori:** `Profile`  
**Route Frontend:** [`/admin/profile/visi-misi`](http://localhost:3000/admin/profile/visi-misi)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/profile/visi-misi`  
**Tabel Database:** `profile_visi_misi`  

#### Deskripsi & Bisnis Logika
> Modul ini digunakan untuk menampilkan rumusan Visi dan Misi pembangunan pendidikan Pemerintah Kabupaten Konawe Selatan. Konten ini menjadi landasan filosofis dan pedoman moral bagi seluruh insan pendidik, aparatur sipil negara di lingkungan dinas, pengawas sekolah, dan pemangku kepentingan dalam mewujudkan pelayanan pendidikan yang berkualitas, berkarakter, dan berdaya saing.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "isi": "string  <input>, (uraian lengkap)",
  "createBy": "string, <generate otomatis | backend>",
  "createAt": "date, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Rumusan Visi Pendidikan Daerah: "Terwujudnya Generasi Emas Konawe Selatan yang Cerdas, Berkarakter, Berakhlak Mulia, dan Unggul Menuju Masyarakat Sejahtera dan Berdaya Saing."
Misi Perluasan Akses Layanan Pendidikan Berkualitas: Memperluas keterjangkauan layanan pendidikan bermutu dan berkeadilan bagi seluruh lapisan masyarakat hingga ke pelosok desa.
Misi Peningkatan Profesionalisme Pendidik dan Tenaga Kependidikan: Mewujudkan guru dan tenaga kependidikan yang berintegritas, kompeten, sejahtera, dan adaptif terhadap transformasi digital pembelajaran.
Misi Tata Kelola Pendidikan Transparan dan Akuntabel: Mengembangkan tata kelola birokrasi pendidikan yang bersih, inovatif, melayani, dan berbasis pemanfaatan teknologi informasi terpadu.
```

---
### 42. Auth Menu
**Kategori:** `Data Master > Auth`  
**Route Frontend:** [`/admin/master/auth/menu`](http://localhost:3000/admin/master/auth/menu)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/auth/menu`  
**Tabel Database:** `auth_menus`  

#### Deskripsi & Bisnis Logika
> Menu Merupakan modul untuk menambahkan menu/sub-menu yang nampak pada sidemenu versi admin. Setelah kita menambahkan data menu, kita boleh menambahkan sub-menu dan seterusnya dari menu/sub-menu yang baru saja kita tambahkan sebelumnya.

#### Kontrak Payload JSON (API Contract)
**Form**
```json
{
Id : string, <generate otomatis>
title : string (Nama menu/sub-menu), <input>
Icon : string <input>
Path : string, <input>
Index : number, <input>
Children : []<default null.nested dengan key yang sama seperti induknya >,
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

---
### 43. Auth Group (Role & Hak Akses)
**Kategori:** `Data Master > Auth`  
**Route Frontend:** [`/admin/master/auth/group`](http://localhost:3000/admin/master/auth/group)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/auth/group`  
**Tabel Database:** `auth_groups`  

#### Deskripsi & Bisnis Logika
> Group merupkan modul untuk menentukan role pengguna berdasarkan menu/sub-menu yang sudah kita tambahkan sebelumnya <16.1.1>.

#### Kontrak Payload JSON (API Contract)
**Form 1 (contract API)**
```json
{
Id : string, <generate otomatis | backend>
title : string <input> (Nama Role)
level : number <option> (Level akses. 1 = Semua Satuan Pendidikan, 2 = Unit pendidikan user),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

**Form 2 (Contract API)**
```json
{
Id : string, <generate otomatis  | backend >
group_id : string <input> (di ambil dari id form 1 dan sifatnya unique | backend)
create : boolean <checkbox>,
read : boolean <checkbox>,
update : boolean <checkbox>,
delete : boolean <checkbox>,
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

---
### 44. Auth Registrasi ASN
**Kategori:** `Data Master > Auth`  
**Route Frontend:** [`/admin/master/auth/registrasi`](http://localhost:3000/admin/master/auth/registrasi)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/auth/registrasi`  
**Tabel Database:** `users`  

#### Deskripsi & Bisnis Logika
> Pada modul ini kita akan disajikan semua list data ASN untuk Semua Satuan Pendidikan. Ada beberapa yang di sajikan yaitu :- nama lengkap,

Nip;

Satuan Pendidikan;

Role Group <6.1.2> (ditampilkan hanya title saja);

Button untuk pengaturan level akses/group/role dan view;

Pada dasarnya data-data ASN yang ditampilkan bersumber dari data lain di aplikasi yang berbeda (SIMPEG). Jadi sebenarnya semua ASN telah memiliki akun masing, kita gak perlu regis atau pengaturan akun lainnya lagi dan hanya sekedar mengatur level aksesnya.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
nip : string, (sifatnya unique dan dipilih otomatis ketika kita menekan button pengaturan level akses),
group_id : string <option> (di pilih dari list Group yang sudah kita buat sebelumnya <6.1.2>),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

---
### 45. Master Siswa
**Kategori:** `Data Master`  
**Route Frontend:** [`/admin/master/siswa`](http://localhost:3000/admin/master/siswa)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/siswa`  
**Tabel Database:** `master_siswa`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data profil peserta didik dari berbagai satuan pendidikan yang dientri dan dikelola langsung oleh operator masing-masing sekolah, mencakup informasi identitas siswa dan status keaktifan siswa

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
  "id": "string, <generate otomatis | backend>",
  "nama": "string <input>, (Nama lengkap siswa)",
  "nm_panggilan": "string <input>, (Nama panggilan)",
  "jns_kelamin": "string <option>, (1. Laki-laki, 2. Perempuan)",
  "nisn": "number <input>, (Nomor Induk Siswa Nasional)",
  "nik": "number <input>, (Nomor Induk Kependudukan siswa)",
  "tmp_lahir": "string <input>, (Tempat lahir)",
  "tgl_lahir": "string <input>, (Format tanggal: 'YYYY-MM-DD')",
  "agama": "string  <option>, (di pilih dari list agama yang sudah kita buat sebelumnya <16.6.1>)",
  "anak_keberapa": "string <input>, (Urutan anak)",
  "jml_saudara": "string <input>, (Jumlah saudara kandung)",
  "kecamatan_id": "string < option >, (ID wilayah kecamatan)",
  "des_kel_id": "string < option >, (ID wilayah desa/kelurahan)",
  "alamat": "string <input>, (Alamat jalan / tempat tinggal)",
  "rt_rw": "string <input>, (Nomor RT/RW)",
  "dusun": "string <input>, (Nama dusun / lingkungan)",
  "kode_pos": "string <input>, (Kode pos wilayah)",
  "tmp_tinggal": "string < option >, (di pilih dari list tempat tinggal yang sudah kita buat sebelumnya <16.6.2>)",
  "lainnya": "string <input>, (Keterangan jika tmp_tinggal bernilai '9' / Lainnya)",
  "moda_transportasi": "string <option>, (di pilih dari list mode transportasi yang sudah kita buat sebelumnya <16.6.3>)",
  "file": "file | string <input>, (File lampiran foto siswa / multipart form-data)",
  "nama_ayah": "string <input>, (Nama lengkap ayah kandung)",
  "nik_ayah": "number <input>, (NIK ayah kandung)",
  "thn_lahir_ayah": "number <input>, (Tahun lahir ayah, misal: 1980)",
  "pendidikan_ayah": "string <option>, (di pilih dari list pendidikan yang sudah kita buat sebelumnya <16.6.4>)",
  "pekerjaan_ayah": "string <option>, (di pilih dari list pekerjaan yang sudah kita buat sebelumnya <16.6.5)>)",
  "penghasilan_ayah": "string <option>, (di pilih dari list penghasilan yang sudah kita buat sebelumnya <16.6.6>)",
  "nama_ibu": "string <input>, (Nama lengkap ibu kandung)",
  "nik_ibu": "number <input>, (NIK ibu kandung)",
  "thn_lahir_ibu": "number <input>, (Tahun lahir ibu, misal: 1985)",
  "pendidikan_ibu": "string <option>, (di pilih dari list pendidikan yang sudah kita buat sebelumnya <16.6.4>)",
  "pekerjaan_ibu": "string <option>, (di pilih dari list pekerjaan yang sudah kita buat sebelumnya <16.6.5>)",
  "penghasilan_ibu": "string <option>, (di pilih dari list penghasilan yang sudah kita buat sebelumnya <16.6.6>)",
  "nama_wali": "string <input>, (Nama lengkap wali murid)",
  "nik_wali": "number <input>, (NIK wali murid)",
  "thn_lahir_wali": "number <input>, (Tahun lahir wali, misal: 1975)",
  "pendidikan_wali": "string <option>, (di pilih dari list pendidikan yang sudah kita buat sebelumnya <16.6.4>)",)",
  "pekerjaan_wali": "string <option>, (di pilih dari list pekerjaan yang sudah kita buat sebelumnya <16.6.5>)",
  "penghasilan_wali": "string <option>, (di pilih dari list penghasilan yang sudah kita buat sebelumnya <16.6.6>)",)",
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
ADHITAMA ELVAN SYAHREZA MUSLIH: Peserta didik dengan status aktif terdaftar pada pangkalan data SD NEGERI 1 RANOMEETO.
ALVARO GAVRIEL TAPAHING: Peserta didik dengan status aktif terdaftar pada pangkalan data SD NEGERI 1 RANOMEETO.
NUR TSANIAH: Peserta didik dengan status aktif terdaftar pada pangkalan data SDN 3 KONDA.
Muhamad Wahyu Saputra: Peserta didik dengan status aktif terdaftar pada pangkalan data SDN 3 KONDA.
```

---
### 46. Master Triwulan
**Kategori:** `Data Master > Master Usulan`  
**Route Frontend:** [`/admin/master/usulan/triwulan`](http://localhost:3000/admin/master/usulan/triwulan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/usulan/triwulan`  
**Tabel Database:** `master_usulan_triwulan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini kita akan disajikan semua list data jadwal periodisasi pencairan atau penyaluran tunjangan guru dalam satu tahun anggaran yang dibagi setiap 3 bulan sekali

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
 title : string <input>, (nama periodisasi),
desc : string <input>, (Penjelasan singkat terkait periodisasi),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Triwulan I: Periode pembayaran untuk bulan Januari, Februari, dan Maret (Pencairan biasanya dimulai sekitar bulan Maret).
Triwulan II: Periode pembayaran untuk bulan April, Mei, dan Juni (Pencairan biasanya dimulai sekitar bulan Juni).
Triwulan III: Periode pembayaran untuk bulan Juli, Agustus, dan September (Pencairan biasanya dimulai sekitar bulan September).
Triwulan IV: Periode pembayaran untuk bulan Oktober, November, dan Desember (Pencairan biasanya dimulai sekitar bulan November).
```

---
### 47. Master Jenis Penerima
**Kategori:** `Data Master > Master Usulan`  
**Route Frontend:** [`/admin/master/usulan/jenis-penerima`](http://localhost:3000/admin/master/usulan/jenis-penerima)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/usulan/jenis-penerima`  
**Tabel Database:** `master_usulan_jenis_penerima`  

#### Deskripsi & Bisnis Logika
> Pada modul ini kita akan disajikan semua list data jenis penerimaan tunjangan atau tambahan penghasilan resmi bagi guru di Indonesia, baik dari jalur Kemendikdasmen maupun Kementerian Agama;

Contoh :

Tunjangan Profesi Guru (TPG)

Definisi: Tunjangan yang diberikan kepada guru yang sudah memiliki sertifikat pendidik sebagai penghargaan atas profesionalitasnya.

Sasaran: Guru ASN maupun Non-ASN yang telah lulus sertifikasi.

Tunjangan Khusus Guru (TKG)

Definisi: Tunjangan yang diberikan kepada guru yang bertugas di daerah khusus (seperti daerah terpencil, tertinggal, terluar, atau perbatasan).

Sasaran: Guru yang menjalankan tugas pada kondisi geografis atau sosial yang menantang.

Tambahan Penghasilan (TAMSIL)

Definisi: Uang tambahan penghasilan di luar gaji pokok bagi guru ASN yang belum memiliki sertifikat pendidik.

Besaran: Umumnya diberikan untuk membantu kesejahteraan guru yang belum sertifikasi sebelum mereka mengikuti atau lulus program pendidik.

Tamsil Khusus Pendidikan Agama / Bantuan Insentif Guru Agama

Definisi: Tambahan atau insentif khusus yang dialokasikan bagi guru pendidikan agama (seperti Guru PAI atau guru madrasah di bawah naungan Kementerian Agama) yang statusnya Non-ASN dan belum bersertifikasi.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
 title : string <input>, (nama penerimaan),
desc : string <input>, (Penjelasan singkat terkait penerimaan),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Tunjangan Profesi Guru (TPG)
Definisi: Tunjangan yang diberikan kepada guru yang sudah memiliki sertifikat pendidik sebagai penghargaan atas profesionalitasnya.
Sasaran: Guru ASN maupun Non-ASN yang telah lulus sertifikasi.
Tunjangan Khusus Guru (TKG)
Definisi: Tunjangan yang diberikan kepada guru yang bertugas di daerah khusus (seperti daerah terpencil, tertinggal, terluar, atau perbatasan).
Sasaran: Guru yang menjalankan tugas pada kondisi geografis atau sosial yang menantang.
Tambahan Penghasilan (TAMSIL)
Definisi: Uang tambahan penghasilan di luar gaji pokok bagi guru ASN yang belum memiliki sertifikat pendidik.
Besaran: Umumnya diberikan untuk membantu kesejahteraan guru yang belum sertifikasi sebelum mereka mengikuti atau lulus program pendidik.
Tamsil Khusus Pendidikan Agama / Bantuan Insentif Guru Agama
Definisi: Tambahan atau insentif khusus yang dialokasikan bagi guru pendidikan agama (seperti Guru PAI atau guru madrasah di bawah naungan Kementerian Agama) yang statusnya Non-ASN dan belum bersertifikasi.
Form (Contract API):{
Id : string, <generate otomatis | backend>,
 title : string <input>, (nama penerimaan),
desc : string <input>, (Penjelasan singkat terkait penerimaan),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}.
```

---
### 48. Master Kelas Penerima
**Kategori:** `Data Master > Master Usulan`  
**Route Frontend:** [`/admin/master/usulan/kelas-penerima`](http://localhost:3000/admin/master/usulan/kelas-penerima)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/usulan/kelas-penerima`  
**Tabel Database:** `master_usulan_kelas_penerima`  

#### Deskripsi & Bisnis Logika
> Pada modul ini kita akan disajikan semua list data jabatan fungsional atau profesi pendidik yang menjadi sasaran penerima tunjangan dan tambahan penghasilan dalam dunia pendidikan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
 title : string <input>, (nama sasaran penerima),
desc : string <input>, (Penjelasan singkat terkait sasaran penerima),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Guru: Pendidik profesional yang tugas utamanya mendidik, mengajar, membimbing, dan mengevaluasi peserta didik di kelas.
Kepala Sekolah: Guru yang diberi tugas tambahan untuk memimpin, mengelola, dan mengawasi jalannya seluruh kegiatan di satuan pendidikan (sekolah).
Pengawas: Guru ASN yang diangkat dalam jabatan fungsional untuk melakukan tugas pengawasan akademik dan manajerial pada satuan pendidikan yang menjadi binaannya.
```

---
### 49. Master Bahan Ajar
**Kategori:** `Data Master > Master Jurnal`  
**Route Frontend:** [`/admin/master/jurnal/bahan-ajar`](http://localhost:3000/admin/master/jurnal/bahan-ajar)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/jurnal/bahan-ajar`  
**Tabel Database:** `master_jurnal_bahan_ajar`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar pilihan metode, pendekatan, atau aktivitas instruksional (bentuk pembelajaran) yang digunakan guru saat melaksanakan kegiatan belajar mengajar di kelas, yang nantinya dipilih saat pengisian agenda jurnal harian.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
 title : string <input>, (nama bahan ajar),
desc : string <input>, (penjelasan singkat bahan ajar),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Ceramah/Teori: Metode penyampaian konsep, fakta, dan prinsip pembelajaran secara terstruktur oleh guru melalui penjelasan langsung di depan kelas.
Diskusi: Metode interaktif yang melibatkan pertukaran gagasan, tanya jawab, atau pembahasan studi kasus secara kolaboratif antarpeserta didik.
Praktek: Aktivitas unjuk kerja langsung atau simulasi terpandu di laboratorium/bengkel untuk menguji dan menerapkan pemahaman teori ke keterampilan riil.
Tugas: Instruksi pengerjaan latihan mandiri atau kelompok, baik berupa lembar kerja di kelas maupun pekerjaan rumah (PR) untuk mengukur ketercapaian materi.
```

---
### 50. Master Materi Ajar
**Kategori:** `Data Master > Master Jurnal`  
**Route Frontend:** [`/admin/master/jurnal/materi-ajar`](http://localhost:3000/admin/master/jurnal/materi-ajar)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/jurnal/materi-ajar`  
**Tabel Database:** `master_jurnal_materi_ajar`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar media atau moda pelaksanaan (sarana/platform penyampaian) yang digunakan guru dalam berinteraksi dengan siswa pada sesi pembelajaran jurnal tersebut.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
 title : string <input>, (nama materi ajar),
desc : string <input>, (penjelasan singkat bahan ajar),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Tatap Muka: Pembelajaran secara langsung (luring) di dalam ruang kelas atau laboratorium sekolah.
Zoom: Pembelajaran tatap maya jarak jauh (daring sync) melalui konferensi video Zoom.
Google Meet: Pembelajaran tatap maya daring interaktif menggunakan Google Workspace / Meet.
Quiz: Pelaksanaan evaluasi pemahaman, asesmen formatif harian, atau tes interaktif berbasis web/aplikasi.
```

---
### 51. Master Kelas
**Kategori:** `Data Master > Master Jurnal`  
**Route Frontend:** [`/admin/master/jurnal/kelas`](http://localhost:3000/admin/master/jurnal/kelas)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/jurnal/kelas`  
**Tabel Database:** `master_jurnal_kelas`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar seluruh tingkat kelas yang aktif dalam periode akademik berjalan sebagai sasaran pelaksanaan jurnal mengajar guru.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
 title : string <input>, (nama kelas),
desc : string <input>, (penjelasan singkat kelas),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
1: Rombongan belajar tingkat dasar kelas 1 untuk jenjang pendidikan dasar.
7: Rombongan belajar umum tingkat kelas 7 untuk jenjang sekolah menengah pertama.
7A: Rombongan belajar spesifik kelas 7 paralel A pada tahun ajaran aktif.
8B: Rombongan belajar spesifik kelas 8 paralel B pada tahun ajaran aktif.
```

---
### 52. Master Mata Pelajaran
**Kategori:** `Data Master > Master Jurnal`  
**Route Frontend:** [`/admin/master/jurnal/mata-pelajaran`](http://localhost:3000/admin/master/jurnal/mata-pelajaran)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/jurnal/mata-pelajaran`  
**Tabel Database:** `master_jurnal_mata_pelajaran`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar seluruh mata pelajaran yang masuk ke dalam struktur kurikulum yang menjadi rujukan materi pelajaran guru pada agenda jurnal kelas.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
kelas_id : string <option> (di pilih dari list kelas yang sudah kita buat sebelumnya <16.4.3>),
 title : string <input>, (nama mata pelajaran),
desc : string <input>, (keterangan mata pelajaran),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
1 - Guru Kelas SD: Mata pelajaran pengajaran umum wali kelas untuk tingkat 1 sekolah dasar.
1 - Tematik SD: Pembelajaran tematik terpadu kurikulum dasar untuk siswa tingkat 1 sekolah dasar.
7 - Agama Budha: Mata pelajaran pendidikan agama Buddha umum untuk tingkatan kelas 7.
7A - Agama Budha: Mata pelajaran pendidikan agama Buddha khusus untuk rombongan belajar kelas 7A.
```

---
### 53. Master Jenjang
**Kategori:** `Data Master`  
**Route Frontend:** [`/admin/master/jenjang`](http://localhost:3000/admin/master/jenjang)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/jenjang`  
**Tabel Database:** `master_jenjang`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar data tingkat jenjang pendidikan mulai dari kelas 1 Sekolah Dasar hingga kelas 9 Sekolah Menengah Pertama.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama jenjang),
desc : string <input>, (penjelasan singkat jenjang),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
1: Tingkatan jenjang awal kelas 1 pada jenjang Sekolah Dasar (SD).
6: Tingkatan jenjang akhir kelas 6 pada jenjang Sekolah Dasar (SD).
7: Tingkatan jenjang awal kelas 7 pada jenjang Sekolah Menengah Pertama (SMP).
9: Tingkatan jenjang akhir kelas 9 pada jenjang Sekolah Menengah Pertama (SMP).
```

---
### 54. Master Agama
**Kategori:** `Data Master > Master PPDB`  
**Route Frontend:** [`/admin/master/ppdb/agama`](http://localhost:3000/admin/master/ppdb/agama)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/ppdb/agama`  
**Tabel Database:** `master_ppdb_agama`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data agama resmi yang diakui oleh negara untuk melengkapi data profil dan identitas keagamaan calon peserta didik pada formulir pendaftaran PPDB.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama agama),
desc : string <input>, (penjelasan singkat agama),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Islam: Data identitas pemeluk agama Islam bagi calon peserta didik.
Kristen/Protestan: Data identitas pemeluk agama Kristen/Protestan bagi calon peserta didik.
Katholik: Data identitas pemeluk agama Katholik bagi calon peserta didik.
Hindu: Data identitas pemeluk agama Hindu bagi calon peserta didik.
```

---
### 55. Master Tempat Tinggal
**Kategori:** `Data Master > Master PPDB`  
**Route Frontend:** [`/admin/master/ppdb/tempat-tinggal`](http://localhost:3000/admin/master/ppdb/tempat-tinggal)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/ppdb/tempat-tinggal`  
**Tabel Database:** `master_ppdb_tempat_tinggal`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data pilihan status kepemilikan atau kondisi tempat tinggal calon peserta didik selama menempuh masa studi guna pemetaan domisili dan pengawasan siswa.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama tempat tinggal),
desc : string <input>, (penjelasan singkat tempat tinggal),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Bersama Orang Tua: Calon peserta didik berdomisili tetap di rumah bersama orang tua kandung.
Wali: Calon peserta didik tinggal bersama pihak keluarga wali/pengampu.
Kos: Calon peserta didik bertempat tinggal di hunian sewa mandiri/kamar kos.
Asrama: Calon peserta didik bertempat tinggal di asrama resmi naungan yayasan/sekolah.
```

---
### 56. Master Mode Transportasi
**Kategori:** `Data Master > Master PPDB`  
**Route Frontend:** [`/admin/master/ppdb/transportasi`](http://localhost:3000/admin/master/ppdb/transportasi)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/ppdb/transportasi`  
**Tabel Database:** `master_ppdb_transportasi`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data pilihan sarana transportasi yang digunakan oleh calon peserta didik untuk mobilitas harian berangkat dan pulang sekolah.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama mode transportasi),
desc : string <input>, (penjelasan singkat mode transportasi),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Jalan Kaki: Calon peserta didik menuju ke sekolah dengan berjalan kaki karena jarak dekat.
Kendaraan Pribadi: Penggunaan kendaraan milik keluarga (motor/mobil) secara mandiri atau diantar.
Kendaraan Umum/Angkot: Penggunaan angkutan kota, bus kota, atau moda umum reguler.
Jemputan Sekolah: Layanan mobil atau bus antar-jemput khusus peserta didik.
```

---
### 57. Master Pendidikan
**Kategori:** `Data Master > Master PPDB`  
**Route Frontend:** [`/admin/master/ppdb/pendidikan`](http://localhost:3000/admin/master/ppdb/pendidikan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/ppdb/pendidikan`  
**Tabel Database:** `master_ppdb_pendidikan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data tingkatan kualifikasi jenjang pendidikan formal terakhir bagi orang tua/wali.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama pendidikan),
desc : string <input>, (penjelasan singkat pendidikan),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
SD Sederajat: Kualifikasi tamat pendidikan dasar formal 6 tahun.
SMP Sederajat: Kualifikasi tamat sekolah menengah pertama.
SMA Sederajat: Kualifikasi tamat pendidikan menengah atas atau juruan.
D4/S1: Kualifikasi pendidikan sarjana terapan maupun strata satu perguruan tinggi.
```

---
### 58. Master Pekerjaan
**Kategori:** `Data Master > Master PPDB`  
**Route Frontend:** [`/admin/master/ppdb/pekerjaan`](http://localhost:3000/admin/master/ppdb/pekerjaan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/ppdb/pekerjaan`  
**Tabel Database:** `master_ppdb_pekerjaan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data klasifikasi bidang pekerjaan atau mata pencaharian orang tua/wali murid untuk kelengkapan data administratif.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama pekerjaan),
desc : string <input>, (penjelasan singkat pekerjaan),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Petani: Mata pencaharian di sektor agraris dan pengolahan lahan tani.
PNS/TNI/POLRI: Aparatur sipil negara atau personel pertahanan dan keamanan pemerintah.
Karyawan Swasta: Tenaga kerja tetap maupun kontrak di instansi atau perusahaan komersial.
Wiraswasta: Aktivitas perniagaan atau penyedia jasa usaha mandiri.
```

---
### 59. Master Penghasilan
**Kategori:** `Data Master > Master PPDB`  
**Route Frontend:** [`/admin/master/ppdb/penghasilan`](http://localhost:3000/admin/master/ppdb/penghasilan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/ppdb/penghasilan`  
**Tabel Database:** `master_ppdb_penghasilan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data rentang skala pendapatan bulanan orang tua/wali murid.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama penghasilan),
desc : string <input>, (penjelasan singkat penghasilan),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Kurang dari 500.000: Kelompok rentang penghasilan keluarga di bawah batas lima ratus ribu rupiah per bulan.
1.000.000 - 1.999.999: Kelompok rentang penghasilan keluarga kelas menengah ke bawah.
2.000.000 - 4.999.999: Kelompok rentang penghasilan upah minimum rata-rata daerah per bulan.
5.000.000 - 20.000.000: Kelompok rentang penghasilan menengah ke atas.
```

---
### 60. Master Bangunan (Kelaikan/Kerusakan)
**Kategori:** `Data Master > Master Sarpras`  
**Route Frontend:** [`/admin/master/sarpras/bangunan`](http://localhost:3000/admin/master/sarpras/bangunan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/sarpras/bangunan`  
**Tabel Database:** `master_sarpras_bangunan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data klasifikasi tingkat kelaikan fisik atau kerusakan infrastruktur gedung/ruangan sekolah.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama bangunan),
desc : string <input>, (penjelasan singkat bangunan),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Baik: Kondisi fisik gedung/ruangan utuh tanpa kerusakan struktural maupun non-struktural sehingga laik fungsi optimal.
Rusak Ringan: Kondisi bangunan mengalami kerusakan non-struktural minor (seperti cat mengelupas, plafon retak, atau daun pintu rusak) tanpa mengganggu keamanan.
Rusak Sedang: Kondisi bangunan mengalami kerusakan pada sebagian komponen non-struktural dan/atau sebagian kecil struktural (seperti kebocoran atap signifikan atau dinding retak parsial).
Rusak Berat: Kondisi bangunan mengalami kerusakan parah pada elemen struktur utama (pondasi, kolom, rangka atap) sehingga membahayakan dan memerlukan renovasi total.
```

---
### 61. Master Kepemilikan
**Kategori:** `Data Master > Master Sarpras`  
**Route Frontend:** [`/admin/master/sarpras/kepemilikan`](http://localhost:3000/admin/master/sarpras/kepemilikan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/sarpras/kepemilikan`  
**Tabel Database:** `master_sarpras_kepemilikan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data status legalitas hak penguasaan atau pemanfaatan atas tanah, gedung, maupun fasilitas sarana prasarana yang digunakan oleh satuan pendidikan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama kepemilikan),
desc : string <input>, (penjelasan singkat kepemilikan),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Milik Sendiri: Aset tanah atau sarana prasarana sepenuhnya merupakan aset tetap milik sah lembaga/pemerintah daerah.
Sewa: Aset sarana prasarana dimanfaatkan melalui mekanisme perjanjian sewa berjangka dengan pihak ketiga.
Pinjam: Pemanfaatan fasilitas sarana/gedung melalui status pinjam pakai dari instansi pemerintah lain atau hibah pihak lain tanpa kompensasi sewa.
```

---
### 62. Master Sumber Dana
**Kategori:** `Data Master > Master Sarpras`  
**Route Frontend:** [`/admin/master/sarpras/sumber-dana`](http://localhost:3000/admin/master/sarpras/sumber-dana)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/sarpras/sumber-dana`  
**Tabel Database:** `master_sarpras_sumber_dana`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data referensi asal alokasi anggaran atau pos pembiayaan yang digunakan untuk pengadaan, pembangunan, pemeliharaan, serta belanja modal sarana prasarana sekolah.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama sumber dana),
desc : string <input>, (penjelasan singkat sumber dana),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Dana Alokasi Khusus (DAK): Anggaran transfer pemerintah pusat yang dialokasikan khusus untuk mendanai kegiatan fisik/sarana pendidikan.
Bantuan Operasional Sekolah (BOS): Anggaran operasional reguler yang dapat digunakan untuk belanja alat, pemeliharaan berkala, dan bahan ajar sekolah.
Dana Hibah: Penerimaan pembiayaan sarana prasarana yang bersumber dari bantuan pihak ketiga/yayasan/CSR yang tidak mengikat.
```

---
### 63. Master Kondisi Alat
**Kategori:** `Data Master > Master Sarpras`  
**Route Frontend:** [`/admin/master/sarpras/kondisi-alat`](http://localhost:3000/admin/master/sarpras/kondisi-alat)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/sarpras/kondisi-alat`  
**Tabel Database:** `master_sarpras_kondisi_alat`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data status kelaikan operasional untuk peralatan penunjang belajar, instrumen laboratorium, perangkat TIK, maupun perabot kelas.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama kondisi alat),
desc : string <input>, (penjelasan singkat kondisi alat),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Baik: Peralatan berfungsi normal, utuh, dan siap digunakan untuk kegiatan operasional/praktikum harian.
Rusak Ringan: Peralatan mengalami penurunan fungsi parsial atau cacat fisik minor namun masih dapat diperbaiki secara cepat.
Rusak Berat: Peralatan mengalami malfungsi permanen, komponen utama hancur, atau tidak bernilai ekonomis untuk diperbaiki sehingga masuk usulan afkir/penghapusan.
```

---
### 64. Master Jenis Bantuan
**Kategori:** `Data Master > Master Sarpras`  
**Route Frontend:** [`/admin/master/sarpras/jenis-bantuan`](http://localhost:3000/admin/master/sarpras/jenis-bantuan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/sarpras/jenis-bantuan`  
**Tabel Database:** `master_sarpras_jenis_bantuan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data klasifikasi skema intervensi atau program bantuan formal yang diterima oleh satuan pendidikan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama jenis bantuan),
desc : string <input>, (penjelasan singkat jenis bantuan),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Dana Alokasi Khusus (DAK): Skema program bantuan fisik untuk rehabilitasi ruang kelas, pembangunan lab baru, atau pengadaan TIK terpusat.
Bantuan Operasional Sekolah (BOS): Skema bantuan operasional yang mendukung pengadaan fasilitas penunjang KBM harian dan perlengkapan sarana rutin sekolah.
```

---
### 65. Master BK Jenis Layanan
**Kategori:** `Data Master`  
**Route Frontend:** [`/admin/master/bk-jenis-layanan`](http://localhost:3000/admin/master/bk-jenis-layanan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/bk-jenis-layanan`  
**Tabel Database:** `master_bk_jenis_layanan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data klasifikasi bidang atau ranah bimbingan konseling yang menjadi rujukan guru BK saat mencatat intervensi, konseling individu/kelompok, maupun penanganan kasus.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama jenis layanan bimbingan konseling),
desc : string <input>, (penjelasan singkat jenis layanan bimbingan konseling),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Pribadi: Layanan pendampingan terkait pemahaman diri, manajemen emosi, pembentukan karakter, moral, atau permasalahan internal peserta didik.
Sosial: Layanan bimbingan interaksi antarteman sebaya, adaptasi lingkungan sekolah, dinamika pergaulan, serta mediasi konflik antarsiswa.
Belajar: Layanan konseling strategi akademik, penanganan kesulitan belajar, motivasi belajar, manajemen waktu belajar, atau tindak lanjut penurunan nilai.
Karir: Layanan arahan peminatan jurusan, eksplorasi potensi bakat/profesi, serta perencanaan studi lanjutan atau persiapan dunia kerja.
```

---
### 66. Master BK Kegiatan Layanan
**Kategori:** `Data Master`  
**Route Frontend:** [`/admin/master/bk-kegiatan-layanan`](http://localhost:3000/admin/master/bk-kegiatan-layanan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/bk-kegiatan-layanan`  
**Tabel Database:** `master_bk_kegiatan_layanan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar bentuk atau metode operasional pemberian layanan Bimbingan dan Konseling oleh guru BK kepada peserta didik, baik yang bersifat preventif, kuratif.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama jenis kegiatan layanan),
desc : string <input>, (penjelasan singkat jenis kegiatan layanan),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Bimbingan Klasikal: Kegiatan layanan bimbingan yang dilaksanakan langsung di dalam ruang kelas terjadwal untuk seluruh siswa dalam satu rombongan belajar.
Konseling Individu: Sesi tatap muka tatap pribadi interaktif antara guru BK dan seorang konseli untuk membantu menuntaskan masalah pribadi/khusus.
Home Visit: Kunjungan langsung guru BK ke tempat tinggal orang tua/wali murid guna konfirmasi, investigasi latar belakang, atau membangun komitmen penanganan siswa.
Referal/Alih Tangan Kasus: Pengalihan penanganan masalah peserta didik kepada pihak ahli atau profesional lain yang lebih berkompeten (seperti psikolog, psikiater, atau aparat kepolisian) karena berada di luar kewenangan guru BK.
```

---
### 67. Master Model Pembelajaran
**Kategori:** `Data Master`  
**Route Frontend:** [`/admin/master/model-pembelajaran`](http://localhost:3000/admin/master/model-pembelajaran)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/model-pembelajaran`  
**Tabel Database:** `master_model_pembelajaran`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan kerangka konseptual atau sintaks strategi pembelajaran terstruktur (pedagogi) yang diterapkan oleh guru saat merancang modul ajar (RPP).

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama jenis model pembelajaran),
desc : string <input>, (penjelasan singkat jenis model pembelajaran),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Bimbingan Klasikal: Format pembelajaran atau penyampaian materi tatap muka secara terstruktur yang dilakukan di dalam ruang kelas untuk satu rombongan belajar reguler.
Bimbingan Kelas Besar: Kegiatan pembelajaran terpadu atau pengarahan bersama yang melibatkan gabungan beberapa rombel atau satu angkatan sekaligus di ruang serbaguna/aula.
Konseling Individu: Sesi tatap muka pembelajaran mandiri atau pendampingan personal satu lawan satu guna menuntaskan kendala pemahaman peserta didik secara intensif.
Konseling Kelompok: Sesi diskusi terarah berbasis kelompok kecil untuk menelaah topik atau menyelesaikan problematika tugas bersama dengan dinamika kelompok.
```

---
### 68. Master Pendampingan
**Kategori:** `Data Master`  
**Route Frontend:** [`/admin/master/pendampingan`](http://localhost:3000/admin/master/pendampingan)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/pendampingan`  
**Tabel Database:** `master_pendampingan`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan list data tahapan siklus pendampingan manajerial dan supervisi program kerja sekolah (seperti pendampingan oleh pengawas sekolah, kepala sekolah, atau tim penjamin mutu).

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama pendampingan),
desc : string <input>, (penjelasan singkat pendampingan),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Pendampingan Perencanaan Kerja: Bimbingan dan penyelarasan target kinerja individu maupun tim pendidik sebelum tahun ajaran atau periode program dimulai.
Pendampingan Perencanaan Program Sekolah: Asistensi penyusunan dokumen Rencana Kerja Sekolah (RKS) serta Rencana Kegiatan dan Anggaran Sekolah (RKAS).
Pendampingan Pelaksana Program Sekolah: Pengawalan, observasi, dan supervisi gsung terhadap implementasi program kerja yang sedang berjalan di lapangan.
Pelaporan Kinerja Yang Bersiklus: Pembinaan rekapitulasi capaian, refleksi berbasis data, penyusunan laporan pertanggungjawaban program, serta rencana tindak lanjut perbaikan berkelanjutan.
```

---
### 69. Master Tugas
**Kategori:** `Data Master`  
**Route Frontend:** [`/admin/master/tugas`](http://localhost:3000/admin/master/tugas)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/tugas`  
**Tabel Database:** `master_tugas`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar peran atau fungsi penugasan formal yang diemban oleh pendidik, tenaga kependidikan, maupun pihak eksternal saat terlibat dalam suatu agenda kegiatan sekolah, asesmen, atau program pendampingan.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama jenis tugas),
desc : string <input>, (penjelasan singkat jenis tugas),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
Pendampingan Perencanaan Kerja: Bimbingan dan penyelarasan target kinerja individu maupun tim pendidik sebelum tahun ajaran atau periode program dimulai.
Pendampingan Perencanaan Program Sekolah: Asistensi penyusunan dokumen Rencana Kerja Sekolah (RKS) serta Rencana Kegiatan dan Anggaran Sekolah (RKAS).
Pendampingan Pelaksana Program Sekolah: Pengawalan, observasi, dan supervisi gsung terhadap implementasi program kerja yang sedang berjalan di lapangan.
Pelaporan Kinerja Yang Bersiklus: Pembinaan rekapitulasi capaian, refleksi berbasis data, penyusunan laporan pertanggungjawaban program, serta rencana tindak lanjut perbaikan berkelanjutan.
```

---
### 70. Master Kategori
**Kategori:** `Data Master`  
**Route Frontend:** [`/admin/master/kategori`](http://localhost:3000/admin/master/kategori)  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/kategori`  
**Tabel Database:** `master_kategori`  

#### Deskripsi & Bisnis Logika
> Pada modul ini disajikan daftar klasifikasi instrumen berkas dan dokumen pertanggungjawaban (SPJ) dana BOSP yang menjadi data rujukan utama bagi sekolah saat mengunggah lampiran usulan rekonsiliasi dan bagi dinas saat melakukan verifikasi.

#### Kontrak Payload JSON (API Contract)
**Form (Contract API)**
```json
{
Id : string, <generate otomatis | backend>,
title : string <input>, (nama jenis tugas),
desc : string <input>, (penjelasan singkat jenis tugas),
created_at : date, <generate otomatis | backend>,
created_by : string, <generate otomatis | backend>,
}
```

#### Contoh Data Riil (Konawe Selatan)
```text
seluruh transaksi penerimaan dan pengeluaran kas dana BOSP yang telah ditutup dan disahkan Kepala Sekolah serta Bendahara.
Buku Pembantu Pajak: Rekapitulasi pemotongan dan penyetoran kewajiban perpajakan belanja BOSP yang dilengkapi bukti NTPN/e-Billing yang sah.
Surat Pernyataan Tanggung Jawab Mutlak (SPTJM): Surat pernyataan keabsahan dan kebenaran penggunaan belanja dana BOSP bermaterai resmi dari Kepala Satuan Pendidikan.
Laporan Realisasi Anggaran (LRA): Rekapitulasi penyerapan dan sisa saldo anggaran dana BOSP per semester yang dicocokkan dengan rekening koran bank.
```

---
### 71. Master Sekolah (SD, SMP, TK, PKBM, dll.)
**Kategori:** `Data Master > Master Sekolah`  
**Route Frontend:** 
- [`/admin/master/sekolah/sd`](http://localhost:3000/admin/master/sekolah/sd) (Master SD)
- [`/admin/master/sekolah/smp`](http://localhost:3000/admin/master/sekolah/smp) (Master SMP)
- [`/admin/master/sekolah/tk`](http://localhost:3000/admin/master/sekolah/tk) (Master TK & PAUD)
- [`/admin/master/sekolah/pkbm`](http://localhost:3000/admin/master/sekolah/pkbm) (Master PKBM / SKB)
- [`/admin/sekolah`](http://localhost:3000/admin/sekolah) (Direktori Seluruh Satuan Pendidikan)

**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/sekolah`  
**Tabel Database:** `edusetara.master_sekolah` (Master Mandiri Berbasis Dapodik Konawe Selatan)

#### Deskripsi & Bisnis Logika
> Modul ini mengelola data induk master sekolah mandiri Kabupaten Konawe Selatan sebanyak **870 satuan pendidikan** yang bersumber resmi dari Dapodik Kemendikdasmen (SD, SMP, TK, KB, PKBM, SMA, SMK, dll). Data telah diselaraskan dengan referensi kewilayahan `egov.master_kecamatan` dan `egov.master_des_kel`, serta dilengkapi dengan koordinat spasial (`latitude`, `longitude`) dan alamat riil.  
> Sesuai arsitektur kemandirian data, tabel ini juga dilengkapi dengan kolom **`simpeg_unit_kerja_id`** (`VARCHAR(50) DEFAULT NULL`) yang disiapkan untuk rekonsiliasi dan *matching* masa depan dengan unit kerja SIMPEG BKPSDM.

#### Parameter Query (Filter & Pencarian)
- `jenjang` (opsional): `SD` | `SMP` | `TK` | `PAUD` | `SATAP` | `PKBM` | `SMA` | `SMK`
- `status_sekolah` (opsional): `NEGERI` | `SWASTA`
- `kecamatan` (opsional): Filter per nama kecamatan (Andoolo, Ranomeeto, Konda, dll.)
- `search` (opsional): Pencarian nama sekolah, NPSN, kecamatan, atau alamat
- `skip` & `limit`: Standar paginasi data
- `include_satap` (default: `true`): Otomatis menyertakan sekolah SATAP jika filter jenjang SD atau SMP

#### Kontrak Payload JSON (API Contract)
**Response List (`GET /api/v1/admin/master/sekolah`)**
```json
{
  "total": 870,
  "skip": 0,
  "limit": 50,
  "data": [
    {
      "id": "1",
      "npsn": "40402064",
      "nama_sekolah": "SD-SMPN SATAP 2 KONSEL",
      "bentuk_pendidikan": "SMP",
      "status_sekolah": "NEGERI",
      "jenjang": "SATAP",
      "alamat": "Jl. Poros Desa Sindangkasih",
      "rt": "00",
      "rw": "00",
      "kode_pos": "93385",
      "kecamatan_id": 7405091,
      "kecamatan": "Ranomeeto Barat",
      "desa_kelurahan_id": 68962,
      "desa_kelurahan": "SINDANGKASIH",
      "latitude": "-4.0536",
      "longitude": "122.3812",
      "akreditasi": "B",
      "is_active": true,
      "simpeg_unit_kerja_id": "2bm7ule1ag5clatt2xxl",
      "simpeg_unit_kerja_nama": "SD-SMPN SATAP 2 KONSEL",
      "url": "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/40402064",
      "unit_kerja_id": "2bm7ule1ag5clatt2xxl",
      "name": "SD-SMPN SATAP 2 KONSEL",
      "address": "Jl. Poros Desa Sindangkasih",
      "level": "SATAP",
      "status": "NEGERI",
      "district": "Ranomeeto Barat",
      "village": "SINDANGKASIH",
      "created_at": "2026-11-01T06:23:45",
      "updated_at": "2026-11-01T06:23:45"
    }
  ]
}
```

**Form Update Metadata (`PUT /api/v1/admin/master/sekolah/{id}`)**
```json
{
  "jenjang": "SMP",
  "bentuk_pendidikan": "SMP",
  "status_sekolah": "NEGERI",
  "npsn": "40402064",
  "akreditasi": "A",
  "kecamatan_id": 7405091,
  "kecamatan": "Ranomeeto Barat",
  "desa_kelurahan_id": 68962,
  "desa_kelurahan": "SINDANGKASIH",
  "latitude": "-4.0536",
  "longitude": "122.3812",
  "simpeg_unit_kerja_id": "2bm7ule1ag5clatt2xxl",
  "simpeg_unit_kerja_nama": "SD-SMPN SATAP 2 KONSEL",
  "is_active": true
}
```

**Dropdown Lookup (`GET /api/v1/admin/master/sekolah/lookup?jenjang=SMP`)**
```json
[
  {
    "id": "1",
    "unit_kerja_id": "1",
    "nama": "SMPN 36 KONAWE SELATAN",
    "jenjang": "SMP",
    "status": "NEGERI",
    "kecamatan": "Motaha"
  }
]
```

---

### 72. Master Wilayah (E-Gov Reference)
**Kategori:** `Data Master > Referensi Wilayah`  
**Route Frontend:** Digunakan pada Select Dropdown di Modal Edit & Filter Sekolah  
**Endpoint Backend:** `http://localhost:8000/api/v1/admin/master/wilayah`  
**Tabel Database:** `egov.master_kecamatan` & `egov.master_des_kel` (Read-Only)  
**Tipe Modul:** `Hierarchical Regional Lookup Options`

**Operasi & Method:**
- `GET /api/v1/admin/master/wilayah/kecamatan` : Daftar 25 kecamatan resmi di Kab. Konawe Selatan (`kabupaten_id = 7405`).
- `GET /api/v1/admin/master/wilayah/desa-kelurahan?kecamatan_id={id}` : Daftar 359 desa/kelurahan resmi di Kab. Konawe Selatan (dapat difilter per kecamatan).

**Contoh Response Kecamatan (`GET /api/v1/admin/master/wilayah/kecamatan`):**
```json
[
  {
    "id": 7405020,
    "kode": null,
    "nama": "ANDOOLO",
    "label": "Andoolo"
  },
  {
    "id": 7405022,
    "kode": null,
    "nama": "ANDOOLO BARAT",
    "label": "Andoolo Barat"
  }
]
```

**Contoh Response Desa/Kelurahan (`GET /api/v1/admin/master/wilayah/desa-kelurahan?kecamatan_id=7405020`):**
```json
[
  {
    "id": 68747,
    "kecamatan_id": 7405020,
    "kode": null,
    "nama": "ALANGGA",
    "label": "Alangga"
  },
  {
    "id": 68746,
    "kecamatan_id": 7405020,
    "kode": null,
    "nama": "ANDOOLO",
    "label": "Andoolo"
  }
]
```

---

## 4. Master Aset (`/admin/master/master_aset/*`)

Data rujukan aset untuk Dinas Pendidikan (sebelum dan sesudah perubahan nomenklatur) beserta sekolahnya. Struktur mengikuti SIMDA BMD (SQL Server) dan aplikasi manual penyusutan; implementasi frontend ada di `app/(admin)/admin/master/master_aset/`.

**Endpoint seragam** untuk setiap slug, dengan prefix `/api/v1/admin/master/master_aset/<slug>`:

| Aksi | Method & path | Keterangan |
|---|---|---|
| Daftar | `GET /read?skip=&limit=&search=&<filter>=` | Respons `{ skip, limit, total, data[] }` |
| Pilihan | `GET /option?search=` | Respons `[{ "id": "<kode bisnis>", "value": "<label>" }]`; `id` berisi kode master, bukan UUID |
| Tambah | `POST /create` | Body sesuai field slug |
| Ubah | `PUT /update/{id}` | Field bertanda *kunci* tidak boleh diubah |
| Hapus | `DELETE /delete/{id}` | Ditolak bila kode masih dipakai master/aset lain |

Setiap baris selalu memuat `id` (UUID), `created_by`, `created_at`, `updated_at` yang dibuat backend.

| Slug | Sumber SIMDA | Field (kunci = tidak dapat diubah) | Filter `read` |
|---|---|---|---|
| `kode-barang` | `Ref_Rek5_108` | `kode` *(kunci, mis. 01.03.02.05.01.05.12)*, `uraian`, `keterangan` | `level` 1–7 (jumlah segmen kode) |
| `masa-manfaat` | `Ref_Penyusutan` | `tahun_berlaku`, `kode_barang` *(kunci, 6 segmen)*, `metode_id` (kode metode), `umur_tahun`, `dasar_hukum`; respons tambahan: `uraian_barang`, `metode_nama` | `tahun_berlaku` |
| `metode-penyusutan` | `Ref_Metode` | `kode` *(kunci)*, `nama`, `keterangan` | - |
| `kapitalisasi-masa-manfaat` | `Ref_Kap_Umur` | `kode_barang` (3–6 segmen), `batas_bawah_persen`, `batas_atas_persen`, `tambahan_umur_tahun`, `jenis_kapitalisasi` (1/2); respons tambahan: `uraian_barang` | - |
| `kondisi-barang` | `Ref_Kondisi` | `kode` *(kunci)*, `uraian`, `keterangan` | - |
| `status-pemilik` | `Ref_Pemilik` | `kode` *(kunci, 0 = Pemerintah Pusat)*, `nama`, `keterangan` | - |
| `alasan-penghapusan` | `Ref_Alasan` | `kode` *(kunci, 1–255; SIMDA memakai 1–6 dan 101–105)*, `uraian`, `keterangan` | - |
| `nilai-minimum-kapitalisasi` | `Ta_KA` | `tahun_berlaku`, `kode_barang` *(kunci, 3–6 segmen; SIMDA 5 segmen)*, `nilai_minimum_satuan` (rupiah, bilangan bulat ≥ 0), `nilai_minimum_total`, `dasar_hukum`; respons tambahan: `uraian_barang` | `tahun_berlaku` |
| `unit-sekolah` | `Ref_Unit`, `Ref_Sub_Unit`, `Ref_UPB` | lihat 4.1 | `tingkat`, `jenis`, `status_pencocokan` |

**Implementasi backend:** `server/app/api/v1/endpoints/admin/master/master_aset/` (satu pabrik router untuk semua slug), model di `server/app/models/master/aset.py`, migrasi `b7c4d1e92f05` (tahap 1) dan `c8d5e2fa3016` (tahap 2). Semua endpoint **wajib login** (cookie/Bearer). Kode kesalahan: `404` data tidak ada, `409` kode sudah ada atau masih dipakai (hapus), `422` format salah atau kode barang/metode rujukan belum ada, `400` mengubah kode yang terkunci.

**Impor data awal:** `server/scripts/import_simda_master_aset.py` membaca SIMDA BMD (SQL Server, hanya baca) dan mengisi semua master; aman dijalankan berulang. Hasil impor pada database pelatihan: 13.734 kode barang, 3.479 masa manfaat, 338 aturan kapitalisasi, 2 metode, 6 kondisi, 6 pemilik, 11 alasan penghapusan, 365 nilai minimum kapitalisasi (73 kelompok × 2021–2025), 650 unit/sub unit/UPB.

**Catatan:**
- `uraian_barang` pada `masa-manfaat` dan `kapitalisasi-masa-manfaat` diisi backend dari `kode-barang`.
- Arti kode `jenis_kapitalisasi` (`Jn_Kap`) di SIMDA belum dipastikan.
- `nilai-minimum-kapitalisasi` bersumber dari `Ta_KA` SIMDA (kode Permendagri 108; peralatan Rp1 juta, alat kedokteran/kesehatan Rp1,5 juta, gedung Rp25 juta, jalan Rp40 juta, sisanya Rp0). Ambang di Excel penyusutan (sheet `kebijakan akuntansi`: Rp300 ribu / Rp500 ribu / Rp1 juta / Rp1,5 juta) memakai kode lama Permendagri 17 dan **berbeda**; bila Perbup yang berlaku mengikuti Excel, nilainya disunting manual. Kolom `ThnPenyusutan` dan `Kd_KA` di `Ta_KA` belum diketahui artinya dan tidak diimpor.

### 4.1 `unit-sekolah` — Unit, Sub Unit, dan UPB Dinas Pendidikan

Satu tabel (`master_aset_unit`) untuk tiga tingkat, hanya Dinas Pendidikan (SIMDA `Kd_Bidang` 8, `Kd_Unit` 1; nama lama "Dinas Pendidikan Pemuda dan Olahraga", nama sekarang "Dinas Pendidikan dan Kebudayaan"). Kunci SIMDA `(kd_bidang, kd_unit, kd_sub, kd_upb)` sama dengan kunci tabel aset (`Ta_KIB_A..F`).

| Field | Keterangan |
|---|---|
| `kd_bidang`, `kd_unit`, `kd_sub`, `kd_upb` | *Kunci*. `kd_sub` kosong = baris unit; `kd_upb` kosong = baris sub unit. Induknya harus sudah ada. |
| `kode`, `tingkat`, `kode_induk` | Diisi backend: `08.01` (`unit`), `08.01.002` (`sub_unit`), `08.01.002.003` (`upb`). `kode` dipakai sebagai `id` pada `/option`. |
| `jenis` | `DINAS`, `UPT`, `SD`, `SMP`, `SATAP`, `TK`, `SMA`, `SMK`, `SKB`, `LAINNYA` |
| `nama`, `nama_lama`, `tahun_perubahan` | Nama sekarang, nama sebelum perubahan nomenklatur, dan tahun nama sekarang mulai berlaku (nama lama berlaku sampai tahun sebelumnya). SIMDA tidak menyimpan tahunnya, jadi `tahun_perubahan` diisi manual. |
| `nama_simda` | Teks asli SIMDA, mis. `SDN 1 TINANGGEA (SDN RORAYA)`; hanya diisi impor. |
| `sekolah_id`, `sekolah_kedua_id` | `master_sekolah.id`; hanya untuk tingkat `upb`. `sekolah_kedua_id` untuk UPB satu atap (SD + SMP, dua NPSN). Satu sekolah hanya boleh dipadankan dengan satu UPB (`409`). |
| `status_pencocokan` | `belum`, `otomatis` (hasil impor, perlu ditinjau), `manual` (sudah diverifikasi), `bukan_sekolah`. `otomatis`/`manual` wajib punya `sekolah_id`; `belum`/`bukan_sekolah` tidak boleh punya. |
| `catatan_pencocokan`, `keterangan` | Catatan impor (hanya baca) dan keterangan bebas. |
| Respons tambahan | `nama_induk`, `sekolah_label`, `sekolah_kedua_label` (`<nama> (NPSN <npsn>)`), `unit_kerja_id`, `unit_kerja_nama` |

- **Hubungan ke `unit_kerja`:** tidak disalin. `unit_kerja_id`/`unit_kerja_nama` dibaca dari `master_sekolah.simpeg_unit_kerja_id/_nama` milik `sekolah_id`, yaitu `simpeg.unit_kerja` yang namanya dipakai kolom `unit_kerja` modul sarpras/usulan.
- **Pencocokan otomatis (impor):** nama baru UPB dinormalkan (`SDN` = `SD NEGERI`, `SATU ATAP` = `SATAP`, `KONSEL` = `KONAWE SELATAN`, dst.) lalu dibandingkan dengan `nama_sekolah` dan `simpeg_unit_kerja_nama` pada bentuk pendidikan yang sama. Hanya kecocokan tunggal yang diterima; nama lama tidak dipakai karena sering sama dengan nama baru sekolah lain. Impor ulang tidak mengubah baris berstatus `manual`, dan tidak menimpa `nama`/`nama_lama`/`jenis` selama teks SIMDA tidak berubah.
- **Dilewati impor:** sub unit dan UPB tanpa nama di SIMDA (kosong, `.`, `'`); tidak ada baris KIB yang memakainya. Unit lain di bidang 8 (Dinas Kepemudaan dan Olahraga) tidak diambil.
- Pencarian sekolah di form memakai `GET /api/v1/admin/master/sekolah/option?search=`.


### Integrasi Identitas SIMDA pada Master Sekolah

Respons daftar dan detail Master Sekolah menyertakan `simda_upb` berupa
UnitSekolahResponse atau `null`. Data dibaca dari relasi `master_aset_unit.sekolah_id`
atau `sekolah_kedua_id`, tanpa menyalin kode ke tabel sekolah.

`PUT /api/v1/admin/master/sekolah/{id}` menerima `simda_upb_id` (ID baris referensi,
bukan kode SIMDA). Field tidak dikirim: pertahankan relasi; `null`: lepas;
ID: hubungkan atau pindahkan ke UPB. Perubahan profil dan relasi disimpan dalam
satu transaksi dan menggunakan autentikasi pemutakhiran profil sekolah.

Pencarian pilihan menggunakan `unit-sekolah/read?tingkat=upb&search=...`.
Referensi bukan UPB atau berstatus bukan sekolah ditolak (422). UPB biasa yang
sudah dipakai sekolah lain atau UPB SATAP dengan dua sekolah ditolak (409).
Saat sekolah utama dilepas dari UPB bersama, sekolah kedua menjadi utama.
UPB tanpa sekolah kembali berstatus `belum`. Pemilihan UPB tunggal menandai
padanan `manual`; penambahan sekolah kedua pada UPB SATAP menandai padanan
`otomatis` untuk ditinjau bersama pada halaman Referensi Unit & UPB SIMDA.
