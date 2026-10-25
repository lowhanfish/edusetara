# 📑 Dokumentasi Kontrak Data & API Backend (Admin EduSetara)
**Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan**  
*Versi: 1.0.0 | Format Data: JSON / RESTful API | Autentikasi: Bearer Token / HTTP-only Session Cookie*

---

## 📌 Daftar Isi
1. [Standar Response & Status Code](#1-standar-response--status-code)
2. [Autentikasi & Sesi Admin](#2-autentikasi--sesi-admin)
3. [Dashboard Metrics (`/admin`)](#3-dashboard-metrics-admin)
4. [Modul Berita & Artikel (`/admin/berita`)](#4-modul-berita--artikel-adminberita)
5. [Modul Pengumuman & Edaran (`/admin/pengumuman`)](#5-modul-pengumuman--edaran-adminpengumuman)
6. [Modul Pendidikan & Kurikulum (`/admin/pendidikan`)](#6-modul-pendidikan--kurikulum-adminpendidikan)
7. [Modul Direktori Sekolah (`/admin/sekolah`)](#7-modul-direktori-sekolah-adminsekolah)
8. [Modul Kebudayaan & Kesenian (`/admin/kebudayaan`)](#8-modul-kebudayaan--kesenian-adminkebudayaan)
9. [Modul Layanan Publik & SOP (`/admin/layanan`)](#9-modul-layanan-publik--sop-adminlayanan)
10. [Modul Data & Statistik Mutu (`/admin/statistik`)](#10-modul-data--statistik-mutu-adminstatistik)
11. [Modul Profil, Maklumat & Regulasi (`/admin/profil`)](#11-modul-profil-maklumat--regulasi-adminprofil)
12. [Modul Banner & Slider Homepage (`/admin/banner`)](#12-modul-banner--slider-homepage-adminbanner)
13. [Modul Pesan Masuk & Aspirasi (`/admin/kontak`)](#13-modul-pesan-masuk--aspirasi-adminkontak)
14. Sarana & Prasarana: Tanah Sekolah (`/admin/sarpras/tanah`)
15. Sarana & Prasarana: Bangunan (`/admin/sarpras/bangunan`)
16. Sarana & Prasarana: Ruang (`/admin/sarpras/ruang`)
17. Sarana & Prasarana: Peralatan / Aset (`/admin/sarpras/peralatan`)
18. Master Sarpras (Bangunan, Kepemilikan, Sumber Dana, Kondisi Alat, Jenis Bantuan) (`/admin/master/sarpras/{bangunan|kepemilikan|sumber-dana|kondisi-alat|jenis-bantuan}`)
19. Usulan Tunjangan Guru (`/admin/usulan/tunjangan-guru`)
20. Usulan Asesmen (`/admin/usulan/assessment`)
21. Usulan Rekonsiliasi BOSP (`/admin/usulan/rekonsiliasi-bosp`)
22. Usulan PIP: Data Pendukung (`/admin/usulan/pip/data-pendukung`)
23. Usulan PIP: Data Penerima (`/admin/usulan/pip/data-penerima`)
24. Kegiatan Sekolah (`/admin/kegiatan-sekolah`)
25. Rombel PAUD / SD / SMP (`/admin/rombel/{paud|sd|smp}`)
26. Komunitas Belajar (`/admin/komunitas-belajar`)
27. Jurnal V2 (`/admin/jurnal/*`)
28. Modul Gallery Publikasi (`/admin/gallery/*`)
29. Piagam & Sertifikat PTK (`/admin/piagam-sertifikat`)
30. Modul Verifikasi Kedinasan (`/admin/verifikasi/*`)
31. Regulasi & Info GTK (`/admin/regulasi-gtk/*`)
32. Modul PPDB & Kuota (`/admin/ppdb/*`, `/admin/kuota-ppdb`)
33. Profil Kelembagaan (`/admin/profile/*`)
34. Data Master Pelengkap (`/admin/master/*`)

---

## 1. Standar Response & Status Code

Semua endpoint backend harus mengembalikan respon dalam format envelope JSON standar berikut:

### Format Berhasil (Success)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data berhasil diambil",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Format Gagal (Error)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validasi formulir gagal",
  "errors": [
    {
      "field": "title",
      "message": "Judul tidak boleh kosong"
    }
  ]
}
```

### HTTP Status Codes:
- `200 OK` : Permintaan berhasil diproses.
- `201 Created` : Entitas baru berhasil dibuat.
- `400 Bad Request` : Parameter atau payload request tidak valid.
- `401 Unauthorized` : Token autentikasi kadaluarsa atau tidak disertakan.
- `403 Forbidden` : Akun tidak memiliki hak akses administrator.
- `404 Not Found` : Data dengan ID atau slug yang diminta tidak ditemukan.
- `500 Internal Server Error` : Terjadi kesalahan tak terduga pada server backend.

---

## 2. Autentikasi & Sesi Admin

### 2.1 Login Admin
- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:
```json
{
  "email": "admin@dikbud-konsel.go.id",
  "password": "PasswordRahasia123!"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "admin": {
      "id": "adm-001",
      "name": "Administrator Dikbud",
      "email": "admin@dikbud-konsel.go.id",
      "role": "SUPER_ADMIN",
      "avatar": "/img/avatar-admin.png"
    }
  }
}
```

### 2.2 Verifikasi Sesi / Get Current User
- **Endpoint**: `GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: Mengembalikan objek `admin`.

---

## 3. Dashboard Metrics (`/admin`)

Mengambil ringkasan data statistik cepat dan feed aktivitas terbaru pada panel dashboard.

- **Endpoint**: `GET /api/v1/admin/dashboard`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalSchools": 287,
      "totalTeachers": 4231,
      "totalStudents": 52847,
      "activeAnnouncements": 12
    },
    "recentNews": [
      {
        "id": "news-1",
        "title": "Dikbud Konsel Dorong Pemanfaatan Teknologi...",
        "category": "Pendidikan",
        "date": "2026-09-05",
        "views": 420
      }
    ],
    "incomingMessagesCount": 5
  }
}
```

---

## 4. Modul Berita & Artikel (`/admin/berita`)

### 4.1 Daftar Berita (List & Filter)
- **Endpoint**: `GET /api/v1/admin/news`
- **Query Params**:
  - `page` (integer, default: 1)
  - `limit` (integer, default: 10)
  - `category` (string, optional: `Pendidikan`, `Kebudayaan`, `GTK & Guru`, `Sarana Prasarana`, `Prestasi Siswa`)
  - `status` (string, optional: `Terbit`, `Draft`)
  - `search` (string, optional)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "news-1",
      "title": "Dikbud Konsel Dorong Pemanfaatan Teknologi Digital",
      "slug": "teknologi-pembelajaran-sekolah",
      "category": "Pendidikan",
      "excerpt": "Pemerintah Kabupaten Konawe Selatan melalui Dinas...",
      "author": "Tim Humas Dikbud",
      "date": "2026-09-05",
      "status": "Terbit",
      "image": "/img/pendidikan-jenjang.jpg",
      "featured": true,
      "createdAt": "2026-09-05T08:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 24, "totalPages": 3 }
}
```

### 4.2 Tambah Berita Baru
- **Endpoint**: `POST /api/v1/admin/news`
- **Request Body**:
```json
{
  "title": "Pekan Kebudayaan Daerah Resmi Dibuka",
  "slug": "pekan-kebudayaan-daerah-resmi-dibuka",
  "category": "Kebudayaan",
  "excerpt": "Pembukaan pekan kebudayaan dimeriahkan ribuan siswa...",
  "content": {
    "lead": "Pekan Kebudayaan Daerah Konawe Selatan tahun 2026...",
    "paragraphs": [
      "Paragraf 1 konten berita lengkap...",
      "Paragraf 2 kelanjutan isi artikel..."
    ],
    "quote": {
      "text": "Mari lestarikan identitas lokal kita.",
      "author": "Bupati Konawe Selatan",
      "role": "Pemerintah Daerah"
    },
    "highlights": ["Diikuti 25 kecamatan", "Lomba seni tradisional"]
  },
  "author": "Tim Humas",
  "authorRole": "Staf Redaksi",
  "readTime": "3 menit baca",
  "image": "https://storage.dikbud.go.id/news/budaya-01.jpg",
  "imageCaption": "Suasana pembukaan parade seni budaya.",
  "tags": ["Budaya", "Festival", "Konsel"],
  "featured": true,
  "status": "Terbit"
}
```

### 4.3 Update Berita
- **Endpoint**: `PUT /api/v1/admin/news/:id`
- **Request Body**: Objek partial sesuai struktur formulir berita.

### 4.4 Hapus Berita
- **Endpoint**: `DELETE /api/v1/admin/news/:id`
- **Response `200 OK`**: `{"success": true, "message": "Berita berhasil dihapus"}`

---

## 5. Modul Pengumuman & Edaran (`/admin/pengumuman`)

### 5.1 Daftar Pengumuman
- **Endpoint**: `GET /api/v1/admin/announcements`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "ann-1",
      "number": "420/892/DIKBUD/IX/2026",
      "title": "Edaran Petunjuk Teknis Pelaksanaan ANBK Gelombang I",
      "category": "Edaran Dinas",
      "publishDate": "2026-09-12",
      "urgency": "Penting",
      "status": "Aktif",
      "attachmentUrl": "/docs/juknis-anbk-2026.pdf",
      "attachmentSize": "2.4 MB"
    }
  ]
}
```

### 5.2 Tambah Pengumuman
- **Endpoint**: `POST /api/v1/admin/announcements`
- **Request Body**:
```json
{
  "number": "420/901/DIKBUD/IX/2026",
  "title": "Jadwal Pencairan Tunjangan Profesi Guru (TPG) Triwulan 3",
  "category": "Edaran Dinas",
  "urgency": "Penting",
  "publishDate": "2026-09-17",
  "status": "Aktif",
  "content": "Diberitahukan kepada seluruh penerima TPG...",
  "attachmentUrl": "https://storage.dikbud.go.id/docs/tpg-tw3.pdf",
  "attachmentSize": "1.8 MB"
}
```

---

## 6. Modul Pendidikan & Kurikulum (`/admin/pendidikan`)

Mengelola pilar jenjang pendidikan, program kurikulum Merdeka/P5, dan pembinaan guru (GTK).

### 6.1 Daftar Program Pendidikan
- **Endpoint**: `GET /api/v1/admin/education`
- **Query Params**: `category` (`Jenjang` | `Kurikulum` | `GTK`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "edu-1",
      "category": "Jenjang",
      "name": "Satuan Sekolah Menengah Pertama (SMP)",
      "scope": "25 Kecamatan se-Konsel",
      "totalUnits": "84 Sekolah (7.420 Siswa)",
      "curriculum": "Kurikulum Merdeka Mandiri Berbagi",
      "status": "Aktif"
    }
  ]
}
```

### 6.2 Tambah Program Pendidikan
- **Endpoint**: `POST /api/v1/admin/education`
- **Request Body**:
```json
{
  "category": "Kurikulum",
  "name": "Modul Kearifan Lokal Seni Tari Tolaki",
  "scope": "Jenjang SD se-Kecamatan Ranomeeto",
  "totalUnits": "18 Sekolah Binaan",
  "curriculum": "P5 Fase C",
  "status": "Aktif"
}
```

---

## 7. Modul Direktori Sekolah (`/admin/sekolah`)

Mengelola database master satuan pendidikan SD & SMP se-Kabupaten Konawe Selatan.

### 7.1 Daftar Satuan Sekolah
- **Endpoint**: `GET /api/v1/admin/schools`
- **Query Params**:
  - `search` (NPSN, nama sekolah, desa, kecamatan)
  - `level` (`SD` | `SMP`)
  - `status` (`NEGERI` | `SWASTA`)
  - `district` (nama kecamatan)
  - `page`, `limit`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "npsn": "40402064",
      "name": "SD NEGERI 11 ANDOOLO",
      "address": "Blok E",
      "village": "Alengge Agung",
      "district": "Andoolo",
      "level": "SD",
      "status": "NEGERI",
      "url": "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/40402064"
    }
  ],
  "meta": { "total": 287 }
}
```

### 7.2 Tambah Data Sekolah
- **Endpoint**: `POST /api/v1/admin/schools`
- **Request Body**:
```json
{
  "npsn": "40409999",
  "name": "SD NEGERI 20 ANDOOLO",
  "address": "Jl. Trans Sulawesi Desa Makmur",
  "village": "Makmur Jaya",
  "district": "Andoolo",
  "level": "SD",
  "status": "NEGERI"
}
```

### 7.3 Update Data Sekolah
- **Endpoint**: `PUT /api/v1/admin/schools/:npsn`

### 7.4 Hapus Data Sekolah
- **Endpoint**: `DELETE /api/v1/admin/schools/:npsn`

---

## 8. Modul Kebudayaan & Kesenian (`/admin/kebudayaan`)

Mengelola cagar budaya, WBTb, sanggar seni, dan agenda festival daerah.

### 8.1 Daftar Objek & Komunitas Kebudayaan
- **Endpoint**: `GET /api/v1/admin/culture`
- **Query Params**: `type` (`Cagar Budaya` | `Warisan Takbenda (WBTb)` | `Sanggar Seni` | `Festival / Agenda`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cult-1",
      "name": "Tarian Lulo Tradisional Tolaki",
      "type": "Warisan Takbenda (WBTb)",
      "location": "Konawe Selatan (Seluruh Wilayah)",
      "description": "Tarian persahabatan masyarakat Tolaki...",
      "status": "Terverifikasi"
    }
  ]
}
```

### 8.2 Tambah Objek Budaya / Agenda
- **Endpoint**: `POST /api/v1/admin/culture`
- **Request Body**:
```json
{
  "name": "Sanggar Tari Anawai Monapa",
  "type": "Sanggar Seni",
  "location": "Kecamatan Ranomeeto",
  "description": "Pembinaan seni pertunjukan generasi muda...",
  "status": "Aktif"
}
```

---

## 9. Modul Layanan Publik & SOP (`/admin/layanan`)

Mengelola jenis layanan, syarat administrasi, waktu layanan, dan tarif.

### 9.1 Daftar Layanan Publik
- **Endpoint**: `GET /api/v1/admin/services`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "srv-1",
      "name": "Pengurusan Rekomendasi Mutasi Siswa",
      "category": "Layanan Siswa",
      "processingTime": "1 Hari Kerja",
      "fee": "Gratis (Rp 0)",
      "requirements": "Surat pindah sekolah, rapor terakhir, fotokopi KK",
      "status": "Online"
    }
  ]
}
```

### 9.2 Tambah / Update Standar Layanan
- **Endpoint**: `POST /api/v1/admin/services` atau `PUT /api/v1/admin/services/:id`
- **Request Body**:
```json
{
  "name": "Legalisir Ijazah Pengganti Hilang",
  "category": "Layanan Siswa",
  "processingTime": "2 Hari Kerja",
  "fee": "Gratis (Rp 0)",
  "requirements": "Surat keterangan kehilangan dari Polsek, fotokopi buku induk",
  "status": "Tatap Muka"
}
```

---

## 10. Modul Data & Statistik Mutu (`/admin/statistik`)

Mengelola indikator numerik kinerja pendidikan, Rapor Pendidikan, dan IKM.

### 10.1 Daftar Indikator Statistik
- **Endpoint**: `GET /api/v1/admin/statistics`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "stat-2",
      "indicator": "Indeks Kepuasan Masyarakat (IKM) Pelayanan Dikbud",
      "category": "Kepuasan Masyarakat (IKM)",
      "value": "88.42",
      "unit": "Skor Mutu A",
      "period": "Semester I 2026",
      "trend": "+1.2% YoY"
    }
  ]
}
```

### 10.2 Tambah Indikator Baru
- **Endpoint**: `POST /api/v1/admin/statistics`
- **Request Body**:
```json
{
  "indicator": "Rata-Rata Capaian Literasi SD Rapor Pendidikan",
  "category": "Pendidikan",
  "value": "76.8",
  "unit": "% Capaian Mahir",
  "period": "2026",
  "trend": "+5.1% Naik"
}
```

---

## 11. Modul Profil, Maklumat & Regulasi (`/admin/profil`)

Mengelola naskah visi & misi dinas, maklumat pelayanan, dan struktur pejabat.

### 11.1 Daftar Naskah Profil
- **Endpoint**: `GET /api/v1/admin/profiles`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prof-1",
      "title": "Visi & Misi Dinas Pendidikan dan Kebudayaan",
      "category": "Visi Misi",
      "updatedAt": "2026-09-10",
      "content": "Mewujudkan Sumber Daya Manusia Konawe Selatan yang Cerdas...",
      "status": "Aktif"
    }
  ]
}
```

### 11.2 Tambah / Update Naskah Profil
- **Endpoint**: `POST /api/v1/admin/profiles` atau `PUT /api/v1/admin/profiles/:id`
- **Request Body**:
```json
{
  "title": "Maklumat Pelayanan Terpadu PTSP 2026",
  "category": "Maklumat Pelayanan",
  "content": "Kami berjanji dan berkomitmen menyelenggarakan pelayanan...",
  "status": "Aktif"
}
```

---

## 12. Modul Banner & Slider Homepage (`/admin/banner`)

Mengelola gambar banner besar (hero section) pada beranda portal publik.

### 12.1 Daftar Banner Slider
- **Endpoint**: `GET /api/v1/admin/banners`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "ban-1",
      "title": "Mewujudkan Pendidikan Setara & Berkualitas",
      "subtitle": "Akses pendidikan adil dan bermutu bagi putra-putri Konawe Selatan",
      "image": "/img/hero-slider-1.jpg",
      "link": "/layanan-publik",
      "buttonText": "Jelajahi Layanan",
      "order": 1,
      "status": "Aktif"
    }
  ]
}
```

### 12.2 Tambah / Update Banner
- **Endpoint**: `POST /api/v1/admin/banners`
- **Request Body**:
```json
{
  "title": "Pekan Kebudayaan Konawe Selatan 2026",
  "subtitle": "Saksikan pergelaran tarian lulo massal dan pameran kriya tradisional",
  "image": "https://storage.dikbud.go.id/banners/banner-festival.jpg",
  "link": "/kebudayaan/agenda-festival",
  "buttonText": "Lihat Jadwal",
  "order": 2,
  "status": "Aktif"
}
```

---

## 13. Modul Pesan Masuk & Aspirasi (`/admin/kontak`)

Mengelola aspirasi publik, aduan pelayanan, serta pengiriman balasan resmi admin.

### 13.1 Daftar Pesan Masuk
- **Endpoint**: `GET /api/v1/admin/messages`
- **Query Params**: `status` (`Semua` | `Belum Dibaca` | `Diproses` | `Selesai`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-1",
      "name": "Muhammad Fadil",
      "email": "fadil@gmail.com",
      "phone": "081234567890",
      "subject": "Konsultasi Alur Mutasi Siswa Masuk dari Luar Provinsi",
      "message": "Selamat siang admin, mohon info berkas apa saja...",
      "date": "2026-09-17 09:30 WITA",
      "status": "Belum Dibaca"
    }
  ]
}
```

### 13.2 Balas Pesan / Ubah Status Aduan
- **Endpoint**: `POST /api/v1/admin/messages/:id/reply`
- **Request Body**:
```json
{
  "replyMessage": "Halo Bpk Fadil, untuk berkas mutasi siswa silakan membawa surat pengantar...",
  "updateStatus": "Selesai",
  "sendEmail": true
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Balasan berhasil dikirimkan ke email pemohon"
}
```

---

## 14. Sarana & Prasarana: Tanah Sekolah (`/admin/sarpras/tanah`)

- **List**: `GET /api/v1/admin/sarpras/tanah` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/sarpras/tanah`
- **Ubah**: `PUT /api/v1/admin/sarpras/tanah/:id`
- **Hapus**: `DELETE /api/v1/admin/sarpras/tanah/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `title` | number | ya | Luas tanah (m²) |
| `file` | string | ya | Berkas bukti kepemilikan / URL |
| `file_type` | string | auto | Ekstensi berkas (pdf/jpg/png) |
| `nip` | string | auto | NIP pengisi |
| `unit_kerja` | string | auto | Unit kerja pengisi |

---

## 15. Sarana & Prasarana: Bangunan (`/admin/sarpras/bangunan`)

- **List**: `GET /api/v1/admin/sarpras/bangunan` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/sarpras/bangunan`
- **Ubah**: `PUT /api/v1/admin/sarpras/bangunan/:id`
- **Hapus**: `DELETE /api/v1/admin/sarpras/bangunan/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `nama` | string | ya | Nama bangunan |
| `luas` | string | ya | Luas bangunan |
| `kepemilikan_id` | string (option) | ya | Relasi Master Kepemilikan |
| `tahun` | string | ya | Tahun bangunan |
| `persentase` | number | ya | Persentase kerusakan |
| `kondisi_id` | string (option) | ya | Relasi Master Kondisi (Bangunan) |
| `jns_bantuan_id` | string (option) | ya | Relasi Master Jenis Bantuan |
| `sumber_id` | string (option) | ya | Relasi Master Sumber Dana |
| `nip / unit_kerja` | string | auto | Dari sesi pengguna |

---

## 16. Sarana & Prasarana: Ruang (`/admin/sarpras/ruang`)

- **List**: `GET /api/v1/admin/sarpras/ruang` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/sarpras/ruang`
- **Ubah**: `PUT /api/v1/admin/sarpras/ruang/:id`
- **Hapus**: `DELETE /api/v1/admin/sarpras/ruang/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `bangunan_id` | string (option) | ya | Relasi Bangunan |
| `kelas_id` | string (option) | ya | Relasi Master Kelas |
| `nama` | string | ya | Nama ruangan |
| `luas` | string | ya | Luas ruangan |
| `kondisi_id` | string (option) | ya | Relasi Master Kondisi |
| `nip / unit_kerja` | string | auto | Dari sesi pengguna |

---

## 17. Sarana & Prasarana: Peralatan / Aset (`/admin/sarpras/peralatan`)

- **List**: `GET /api/v1/admin/sarpras/peralatan` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/sarpras/peralatan`
- **Ubah**: `PUT /api/v1/admin/sarpras/peralatan/:id`
- **Hapus**: `DELETE /api/v1/admin/sarpras/peralatan/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `ruang_id` | string (option) | ya | Relasi Ruang |
| `nama` | string | ya | Nama peralatan/aset |
| `jml_alat` | number | ya | Jumlah |
| `kondisi_id` | string (option) | ya | Relasi Master Kondisi Alat |
| `tahun` | number | ya | Tahun pengadaan |
| `sumber_id` | string (option) | ya | Relasi Master Sumber Dana |
| `nip / unit_kerja` | string | auto | Dari sesi pengguna |

---

## 18. Master Sarpras (Bangunan, Kepemilikan, Sumber Dana, Kondisi Alat, Jenis Bantuan) (`/admin/master/sarpras/{bangunan|kepemilikan|sumber-dana|kondisi-alat|jenis-bantuan}`)

- **List**: `GET /api/v1/admin/master/sarpras/{bangunan|kepemilikan|sumber-dana|kondisi-alat|jenis-bantuan}` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/master/sarpras/{bangunan|kepemilikan|sumber-dana|kondisi-alat|jenis-bantuan}`
- **Ubah**: `PUT /api/v1/admin/master/sarpras/{bangunan|kepemilikan|sumber-dana|kondisi-alat|jenis-bantuan}/:id`
- **Hapus**: `DELETE /api/v1/admin/master/sarpras/{bangunan|kepemilikan|sumber-dana|kondisi-alat|jenis-bantuan}/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `title` | string | ya | Nama |
| `desc` | string | ya | Penjelasan singkat |

---

## 19. Usulan Tunjangan Guru (`/admin/usulan/tunjangan-guru`)

- **List**: `GET /api/v1/admin/usulan/tunjangan-guru` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/usulan/tunjangan-guru`
- **Ubah**: `PUT /api/v1/admin/usulan/tunjangan-guru/:id`
- **Hapus**: `DELETE /api/v1/admin/usulan/tunjangan-guru/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `tahun` | string (option) | ya | `2025` / `2026` |
| `triwulan_id` | string (option) | ya | 1-4 (Triwulan I-IV) |
| `jns_penerimaan_id` | string (option) | ya | TPG PNS, TPG PPPK, Tamsil PNS, Tamsil PPPK, Tunjangan Khusus |
| `kelas_penerima_id` | string (option) | ya | Guru Kelas TK/SD, Guru Mapel SMP, Guru BK, Kepala Sekolah |
| `nama` | string | auto | Readonly dari SIMPEG |
| `nip` | string | auto | Readonly dari SIMPEG |

---

## 20. Usulan Asesmen (`/admin/usulan/assessment`)

- **List**: `GET /api/v1/admin/usulan/assessment` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/usulan/assessment`
- **Ubah**: `PUT /api/v1/admin/usulan/assessment/:id`
- **Hapus**: `DELETE /api/v1/admin/usulan/assessment/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `status_sekolah_id` | string (option) | ya | 0=Negeri, 1=Swasta, 2=Satuan Pendidikan Kerjasama |
| `jml_siswa` | number | ya | Total peserta |
| `jml_laki` | number | ya | Peserta laki-laki |
| `jml_perempuan` | number | ya | Peserta perempuan |
| `kurikulum_k13` | number | ya | Peserta Kurikulum 2013 |
| `kurikulum_kurmer` | number | ya | Peserta Kurikulum Merdeka |
| `file` | string | ya | Lampiran Excel nominasi |

---

## 21. Usulan Rekonsiliasi BOSP (`/admin/usulan/rekonsiliasi-bosp`)

- **List**: `GET /api/v1/admin/usulan/rekonsiliasi-bosp` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/usulan/rekonsiliasi-bosp`
- **Ubah**: `PUT /api/v1/admin/usulan/rekonsiliasi-bosp/:id`
- **Hapus**: `DELETE /api/v1/admin/usulan/rekonsiliasi-bosp/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `tahun` | string (option) | ya | `2025` / `2026` |
| `semester_id` | string (option) | ya | 1=Semester I, 2=Semester II |

---

## 22. Usulan PIP: Data Pendukung (`/admin/usulan/pip/data-pendukung`)

- **List**: `GET /api/v1/admin/usulan/pip/data-pendukung` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/usulan/pip/data-pendukung`
- **Ubah**: `PUT /api/v1/admin/usulan/pip/data-pendukung/:id`
- **Hapus**: `DELETE /api/v1/admin/usulan/pip/data-pendukung/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `uraian` | string | ya | Nama dokumen (SK / Berita Acara) |
| `jenjang_id` | string (option) | ya | Relasi Master Jenjang |
| `nominal` | number | ya | Nominal bantuan |
| `tahun` | number | ya | Tahun anggaran |
| `file` | string | ya | Lampiran PDF |

---

## 23. Usulan PIP: Data Penerima (`/admin/usulan/pip/data-penerima`)

- **List**: `GET /api/v1/admin/usulan/pip/data-penerima` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/usulan/pip/data-penerima`
- **Ubah**: `PUT /api/v1/admin/usulan/pip/data-penerima/:id`
- **Hapus**: `DELETE /api/v1/admin/usulan/pip/data-penerima/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `pendukung_id` | string (option) | ya | Relasi Data Pendukung PIP |
| `siswa_id` | string (option) | ya | Relasi Master Siswa |

---

## 24. Kegiatan Sekolah (`/admin/kegiatan-sekolah`)

- **List**: `GET /api/v1/admin/kegiatan-sekolah` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/kegiatan-sekolah`
- **Ubah**: `PUT /api/v1/admin/kegiatan-sekolah/:id`
- **Hapus**: `DELETE /api/v1/admin/kegiatan-sekolah/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `judul` | string | ya | Judul kegiatan |
| `deskripsi` | string | ya | Deskripsi |
| `tanggal` | date | ya | Tanggal kegiatan |
| `tahun` | number | ya | Tahun |
| `file` | string | ya | Foto / berkas dokumentasi |
| `link` | string | tidak | Link YouTube |
| `nip / unit_kerja` | string | auto | Dari sesi pengguna |

---

## 25. Rombel PAUD / SD / SMP (`/admin/rombel/{paud|sd|smp}`)

- **List**: `GET /api/v1/admin/rombel/{paud|sd|smp}` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/rombel/{paud|sd|smp}`
- **Ubah**: `PUT /api/v1/admin/rombel/{paud|sd|smp}/:id`
- **Hapus**: `DELETE /api/v1/admin/rombel/{paud|sd|smp}/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `kategori` | string | auto | Diisi frontend: `Jenjang PAUD` / `Jenjang SD` / `Jenjang SMP` |
| `jns_rombel` | number (option) | ya | 0=Kelas, 1=Kelas Jauh/Kecil, 2=Kelas Terbuka |
| `tgkt_pendidikan` | string (option) | ya | Relasi Master Jenjang |
| `kurikulum` | string | ya | Kurikulum |
| `nama` | string | ya | Nama rombel |
| `wali_kelas` | string (option) | ya | Guru/pegawai dari SIMPEG |
| `ruang_kelas` | string (option) | ya | Relasi Ruang |
| `nip / unit_kerja` | string | auto | Dari sesi pengguna |

---

## 26. Komunitas Belajar (`/admin/komunitas-belajar`)
27. Jurnal V2 (`/admin/jurnal/*`)
28. Modul Gallery Publikasi (`/admin/gallery/*`)
29. Piagam & Sertifikat PTK (`/admin/piagam-sertifikat`)
30. Modul Verifikasi Kedinasan (`/admin/verifikasi/*`)
31. Regulasi & Info GTK (`/admin/regulasi-gtk/*`)
32. Modul PPDB & Kuota (`/admin/ppdb/*`, `/admin/kuota-ppdb`)
33. Profil Kelembagaan (`/admin/profile/*`)
34. Data Master Pelengkap (`/admin/master/*`)

- **List**: `GET /api/v1/admin/komunitas-belajar` (query: `page`, `limit`, `search`)
- **Tambah**: `POST /api/v1/admin/komunitas-belajar`
- **Ubah**: `PUT /api/v1/admin/komunitas-belajar/:id`
- **Hapus**: `DELETE /api/v1/admin/komunitas-belajar/:id`
- Response mengikuti envelope standar (bagian 1). `id`, `created_at`, `created_by` (+ `nip`, `unit_kerja` bila tertulis) diisi otomatis oleh backend.

| Field | Tipe | Input User | Keterangan |
|---|---|---|---|
| `uraian` | string | ya | Nama komunitas belajar |
| `jns_kegiatan` | string (option) | ya | 0=Refleksi Awal, 1=Perencanaan, 2=Implementasi, 3=Evaluasi |
| `deskripsi` | string (HTML/Text) | ya | Deskripsi kegiatan |
| `file` | file (upload) | ya | Foto atau PDF |
| `type` | string | auto | Tipe berkas |
| `nip / unit_kerja` | string | auto | Dari sesi pengguna |

---


## 27. Jurnal V2 (`/admin/jurnal/*`)

### 27.1 Jurnal Guru Kelas (`/admin/jurnal/guru-kelas`)
- **Endpoint**: `GET /api/v1/admin/jurnal/guru-kelas` | `POST` | `PUT /:id` | `DELETE /:id`
- **Fields**:
  - `tema` (string, required): Tema pembelajaran
  - `materi_pokok` (string, required): Materi pokok atau subtema
  - `pertemuan_ke` (number, required): Nomor urut pertemuan
  - `tgl` (date, required): Tanggal pelaksanaan KBM
  - `model_pembelajaran` (string option): Problem Based Learning, Project Based Learning, Discovery
  - `metode_pembelajaran` (string option): Ceramah, Diskusi, Tanya Jawab, Demonstrasi, Penugasan
  - `kegiatan` (text HTML): Uraian tahapan kegiatan KBM
  - `penilaian` (string option): Sikap, Pengetahuan, Keterampilan
  - `siswa_hadir`, `siswa_izin`, `siswa_sakit`, `siswa_alpa` (number): Rekap presensi
  - `persentase` (number): Persentase kehadiran (contoh: 95)
  - `keterangan` (text): Refleksi pembelajaran
  - `file` (string file): Lampiran foto dokumentasi kelas

### 27.2 Jurnal Kepala Sekolah (`/admin/jurnal/kepala-sekolah`)
- **Endpoint**: `GET /api/v1/admin/jurnal/kepala-sekolah` | `POST` | `PUT /:id` | `DELETE /:id`
- **Fields**:
  - `uraian` (string, required): Uraian agenda manajerial / supervisi
  - `target` (string, required): Target atau sasaran capaian
  - `hasil` (string, required): Output nyata terealisasi
  - `keterlibatan` (string): Pihak yang dilibatkan (Dewan Guru, Pengawas, Komite)
  - `tgl` (date, required): Tanggal pelaksanaan
  - `keterangan` (text HTML): Catatan evaluasi / arahan tindak lanjut
  - `file` (string file): Lampiran notula rapat / foto bukti

### 27.3 Jurnal Pengawas (`/admin/jurnal/pengawas`)
- **Endpoint**: `GET /api/v1/admin/jurnal/pengawas` | `POST` | `PUT /:id` | `DELETE /:id`
- **Fields**:
  - `unit_kerja` (string option): Sekolah binaan dikunjungi
  - `kepsek` (string option): Kepala sekolah yang didampingi
  - `pendampingan_id` (string option): Relasi Master Pendampingan
  - `temuan_akademik` (string): Catatan proses belajar perangkat guru
  - `temuan_manajerial` (string): Catatan administrasi & sarpras
  - `tindak_lanjut` (text): Arahan rekomendasi perbaikan
  - `tugas_id` (string option): Relasi Master Tugas
  - `tgl` (date, required): Tanggal visitasi
  - `file` (string file): Foto visitasi / lembar instrumen

### 27.4 Jurnal Bimbingan Konseling (BK) (`/admin/jurnal/bk`)
- **Endpoint**: `GET /api/v1/admin/jurnal/bk` | `POST` | `PUT /:id` | `DELETE /:id`
- **Fields**:
  - `nm_siswa` (string, required): Nama siswa penerima layanan (relasi Master Siswa)
  - `kelas_id` (string option): Relasi Master Kelas
  - `tgl` (date, required): Tanggal sesi bimbingan
  - `materi_layanan` (text): Topik/materi bimbingan
  - `permasalahan` (text): Uraian masalah / gejala konseling
  - `mdl_kegiatan_id` (string option): Relasi Model Kegiatan BK
  - `jns_layanan_id` (string option): Relasi Bidang Layanan (Pribadi, Sosial, Belajar, Karir)
  - `hasil` (text): Hasil konseling / komitmen siswa
  - `rnc_tindak_lanjut` (text): Rencana pemantauan tindak lanjut
  - `keterangan` (text): Catatan perkembangan
  - `file` (string file): Dokumentasi sesi

---

## 28. Modul Gallery Publikasi (`/admin/gallery/*`)
- **Sub-Modul**:
  1. Sekolah Penggerak (`/admin/gallery/sekolah-penggerak`)
  2. Guru Penggerak (`/admin/gallery/guru-penggerak`)
  3. Organisasi Penggerak (`/admin/gallery/organisasi-penggerak`)
  4. Kegiatan Kepala Sekolah (`/admin/gallery/kegiatan-kepala-sekolah`)
  5. Kegiatan KKG SD (`/admin/gallery/kegiatan-kkg-sd`)
  6. Kegiatan Guru MGMP (`/admin/gallery/kegiatan-guru-mgmp`)
  7. Kegiatan TK & PAUD (`/admin/gallery/kegiatan-tk-paud`)
  8. Kegiatan Pengawas Satdik (`/admin/gallery/kegiatan-pengawas`)
- **Fields Standar Gallery**:
  - `kategori` (string, auto/hidden): Nama sub-program gallery
  - `judul` (string, required): Judul kegiatan / aksi nyata
  - `tujuan` (text, required): Maksud dan tujuan kegiatan
  - `proses` (text, required): Alur / tahapan pelaksanaan
  - `hasil` (text, required): Capaian positif / dampak nyata
  - `link` (string url, optional): Tautan video YouTube jika ada
  - `file` (string file, required): Foto dokumentasi pelaksanaan

### 28.1 Video Testimoni (`/admin/gallery/video-testimoni`)
- **Endpoint**: `GET /api/v1/admin/gallery/video-testimoni` | `POST` | `PUT /:id` | `DELETE /:id`
- **Fields**:
  - `judul` (string, required): Narasi pokok / tajuk testimoni
  - `file` (string file, required): Berkas video testimoni (MP4/WebM)

---

## 29. Piagam & Sertifikat PTK (`/admin/piagam-sertifikat`)
- **Endpoint**: `GET /api/v1/admin/piagam-sertifikat` | `POST` | `PUT /:id` | `DELETE /:id`
- **Fields**:
  - `kegiatan` (string/text, required): Nama pelatihan, bimtek, seminar, atau lomba
  - `penyelenggara` (string/text, required): Instansi/organisasi penyelenggara
  - `tahun` (number, required): Tahun perolehan sertifikat
  - `tempat_pelaksana` (string, required): Lokasi kegiatan
  - `sebagai` (string, required): Peran (Peserta, Narasumber, Juri, Juara)
  - `file` (string file, required): Berkas digital PDF scan piagam/sertifikat

---

## 30. Modul Verifikasi Kedinasan (`/admin/verifikasi/*`)

### 30.1 Verifikasi Tunjangan Guru (`/admin/verifikasi/tunjangan-guru`)
- **Endpoint**: `POST /api/v1/admin/verifikasi/tunjangan-guru/:usulan_id`
- **Fields**:
  - `id` (string): ID usulan yang diverifikasi
  - `status` (number): 1 = Diterima / Disetujui, 2 = Dikembalikan / Ditolak
  - `pesan` (text): Catatan verifikator kelengkapan dokumen / alasan penolakan

### 30.2 Verifikasi Dual-Tahap Rekonsiliasi Dana BOSP (`/admin/verifikasi/rekonsiliasi-bosp`)
- **Endpoint**: `POST /api/v1/admin/verifikasi/rekon-bosp/:lampiran_id`
- **Tahap 1 - Cek Benar**:
  - `status_1` (number): 1 = Terverifikasi Benar, 2 = Penolakan / Perbaikan
  - `pesan_1` (text): Koreksi keabsahan kuitansi, faktur, NTPN
- **Tahap 2 - Cek Lengkap**:
  - `status_2` (number): 1 = Terverifikasi Lengkap, 2 = Belum Lengkap
  - `pesan_2` (text): Koreksi kelengkapan 26 instrumen pelaporan BOSP

---

## 31. Regulasi & Info GTK (`/admin/regulasi-gtk/*`)
- **Pengumuman GTK**: `judul`, `deskripsi`, `file` (PDF edaran resmi)
- **Modul & Materi**: `judul`, `deskripsi` (silabus/kompetensi), `file` (PDF handout materi)
- **Regulasi Hukum**: `judul` (nama & nomor peraturan), `deskripsi` (konsideran/tentang), `tahun`, `file` (PDF lembaran hukum)

---

## 32. Modul PPDB & Kuota (`/admin/ppdb/*`, `/admin/kuota-ppdb`)
- **PPDB PAUD, SD, SMP**: Data biodata calon siswa (`nama`, `jns_kelamin`, `nisn`, `nik`, `tmp_lahir`, `tgl_lahir`, `agama`, `alamat`, `tmp_tinggal`, `moda_transportasi`, data orang tua/wali `nama_ayah`, `nama_ibu`, `pekerjaan`, `file` pasfoto).
- **Kuota PPDB**: Monitoring kalkulasi daya tampung (`nama_sekolah`, `jenjang`, `jml_ruang_tersedia`, `standar_maks_rombel`, `total_daya_tampung`, `siswa_terdaftar`, `sisa_kuota`, `status_kuota`).

---

## 33. Profil Kelembagaan (`/admin/profile/*`)
- **Renstra**: `isi` (uraian rencana strategis 5 tahunan)
- **Tugas Dan Fungsi**: `isi` (tupoksi struktural dinas sesuai SOTK Perbup)
- **Visi Misi**: `isi` (rumusan visi dan misi pendidikan daerah)

---

## 34. Data Master Pelengkap (`/admin/master/*`)
- **Master Siswa**: `nama`, `nisn`, `nik`, `jns_kelamin`, `tmp_lahir`, `tgl_lahir`, `alamat`
- **Master Jurnal**: Bahan Ajar, Materi Ajar, Tingkat Kelas, Mata Pelajaran
- **Master PPDB**: Agama, Tempat Tinggal, Moda Transportasi, Kualifikasi Pendidikan, Pekerjaan, Skala Penghasilan
- **Master BK**: Bidang Jenis Layanan, Bentuk Kegiatan Layanan
- **Master Umum**: Model Pembelajaran, Tahapan Pendampingan, Nama Tugas, Kategori Dokumen BOSP, Master Jenjang

---
## 🔒 Catatan Keamanan & File Upload
1. **Upload File (Gambar & PDF Lampiran)**:
   - Endpoint upload: `POST /api/v1/upload` (tipe `multipart/form-data`).
   - Batas ukuran file gambar: Maksimal **5 MB** (format: `.webp`, `.jpg`, `.png`).
   - Batas ukuran lampiran dokumen: Maksimal **15 MB** (format: `.pdf`).
2. **CORS Policy**:
   - Backend hanya mengizinkan request dari origin domain terdaftar (`http://localhost:3000` pada lingkungan dev dan domain resmi produksi).
