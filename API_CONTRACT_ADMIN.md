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

## 🔒 Catatan Keamanan & File Upload
1. **Upload File (Gambar & PDF Lampiran)**:
   - Endpoint upload: `POST /api/v1/upload` (tipe `multipart/form-data`).
   - Batas ukuran file gambar: Maksimal **5 MB** (format: `.webp`, `.jpg`, `.png`).
   - Batas ukuran lampiran dokumen: Maksimal **15 MB** (format: `.pdf`).
2. **CORS Policy**:
   - Backend hanya mengizinkan request dari origin domain terdaftar (`http://localhost:3000` pada lingkungan dev dan domain resmi produksi).
