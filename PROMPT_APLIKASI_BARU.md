# Prompt membangun aplikasi baru dari pola EduSetara

Salin isi blok prompt di bawah ke chat pada proyek baru. Ganti bagian `[ISI ...]` sesuai kebutuhan. Jika repository privat, pastikan agen memiliki akses atau sediakan checkout lokalnya. Repo EduSetara adalah referensi; pekerjaan dilakukan di direktori aplikasi baru.

## Prompt siap salin

```text
Saya ingin kamu membangun aplikasi baru dengan mengikuti arsitektur direktori, konvensi, dan pola pengkodean frontend serta backend dari repository referensi berikut:

Repository: https://github.com/lowhanfish/edusetara
Checkout lokal referensi, jika tersedia: [ISI PATH LOKAL ATAU KOSONGKAN]
Branch/commit referensi, jika ingin dikunci: [ISI ATAU GUNAKAN DEFAULT BRANCH]

Detail aplikasi baru:
- Nama aplikasi: [ISI NAMA]
- Tujuan dan pengguna: [ISI TUJUAN DAN JENIS PENGGUNA]
- Modul dan alur utama: [ISI DAFTAR MODUL DAN ALUR]
- Role dan hak akses: [ISI ROLE DAN BATAS AKSES]
- Entitas serta hubungan data: [ISI JIKA SUDAH ADA]
- Gaya visual/identitas: [ISI WARNA, LOGO, ATAU ARAHAN]
- Database dan integrasi eksternal: [ISI KEBUTUHAN]
- Target deployment: [ISI JIKA SUDAH DITENTUKAN]
- Direktori kerja aplikasi baru: [ISI PATH]

Perlakukan EduSetara sebagai template pola implementasi full-stack, bukan sekadar inspirasi visual. Pertahankan cara mengorganisasi dan menulis kodenya, lalu sesuaikan domain, entitas, menu, tampilan, dan aturan bisnis untuk aplikasi baru ini.

1. Baca referensi sebelum mengimplementasikan

- Baca AGENTS.md dan instruksi proyek yang berlaku di referensi maupun proyek tujuan.
- Periksa kode sebenarnya, bukan hanya README. Jika dokumentasi berbeda dari implementasi, jelaskan perbedaannya dan gunakan implementasi serta konfigurasi aktif sebagai dasar.
- Periksa package.json, konfigurasi Vinext/Vite, TypeScript, pyproject.toml, konfigurasi database, router, dan migrasi untuk memahami runtime yang benar-benar dipakai.
- Telusuri setidaknya satu fitur dari halaman frontend sampai database, serta alur autentikasi dan satu modul yang memakai relasi data.
- Gunakan modul Berita sebagai contoh alur CRUD, lalu bandingkan dengan modul master/sekolah untuk memahami pola lookup dan relasi. Jangan menganggap satu modul mewakili seluruh variasi.
- Sebutkan branch/commit referensi yang benar-benar dibaca dan rangkum pola yang akan diikuti sebelum mulai membuat file.
- Jika referensi belum dapat diakses, sampaikan hambatannya. Jangan mengaku telah membacanya atau menggantinya diam-diam dengan template generik.

2. Ikuti struktur dan pola frontend

- Gunakan direktori frontend admin/ seperti referensi. Direktori ini juga menampung halaman publik dan autentikasi.
- Ikuti stack aktif referensi: React, TypeScript, struktur App Router, Tailwind CSS, TanStack Query, dan Zustand. Periksa penggunaan Vinext/Vite pada konfigurasi aktif; jangan mengasumsikan proyek dijalankan dengan Next.js standar hanya karena struktur routing atau README-nya.
- Pertahankan pemisahan area app/(auth), app/(admin), dan app/(publish) sesuai kebutuhan aplikasi baru.
- Susun fitur mengikuti pola:
  app/(admin)/admin/<domain>/<fitur>/
    page.tsx
    types.ts
    hooks/crud.tsx
    components/
- page.tsx mengatur komposisi halaman dan interaksi pengguna. Komponen form/detail diletakkan dalam components/. Request, query, dan mutation ditempatkan dalam hooks/crud.tsx. Bentuk data didefinisikan pada types.ts.
- Gunakan komponen UI bersama di app/(admin)/_components/ui dan pola layout/menu referensi. Sesuaikan identitas visual tanpa membuang konsistensi komponen.
- Ikuti penggunaan TanStack Query untuk list, opsi pilihan, mutasi, cache, dan invalidasi setelah perubahan data. Query key harus membedakan fitur dan parameter filter/pagination.
- Gunakan Zustand untuk state lintas halaman seperti autentikasi dan konfigurasi URL. State form/modal tetap lokal bila tidak perlu dibagikan.
- Ikuti pemisahan lib/api.ts, lib/api_secure.ts, store/useAuthStore.ts, dan store/useUrlStore.ts. URL dasar API berasal dari konfigurasi lingkungan.
- Pertahankan pola tabel, pagination, pencarian dengan debounce, tambah/edit melalui form, detail, konfirmasi hapus, serta notifikasi yang sesuai referensi.
- Sediakan keadaan loading, kosong, error, dan sukses. Gunakan tipe konkret untuk domain baru dan hindari any yang tidak diperlukan.

3. Ikuti struktur dan pola backend Python

- Backend berada di server/ dan menggunakan Python dengan FastAPI, Pydantic v2, SQLAlchemy async, dan Alembic sebagaimana konfigurasi aktif referensi.
- Pertahankan pola direktori:
  server/
    main.py
    app/
      api/
        deps.py
        v1/
          router.py
          endpoints/
            auth/
            users/
            admin/<domain>/<fitur>/
            publish/
      core/
      db/
      models/
      services/
    alembic/
    scripts/
    tests/
- Ikuti penggabungan router bertingkat dan prefix /api/v1. Bedakan endpoint admin dan publik sesuai fungsinya.
- Pada fitur, pisahkan schema.py dan file endpoint seperti contoh referensi; ikuti konvensi router.py atau nama fitur yang digunakan pada domain sejenis.
- Gunakan APIRouter, async def, dan dependency injection melalui Depends. Ambil AsyncSession dari dependency database yang terpusat.
- Pisahkan schema Pydantic dari model database. Ikuti gaya deklaratif SQLAlchemy dengan Column() yang digunakan referensi dan pola base/mixin yang relevan.
- Gunakan pola CRUDBase untuk operasi bersama. Letakkan aturan bisnis khusus pada service atau modul fitur yang sesuai, tanpa memaksakan abstraksi baru yang tidak dibutuhkan.
- Ikuti pola konfigurasi lingkungan, exception handler, transaksi/rollback, penanganan konflik unik, upload, serta metadata pembuatan data.
- Gunakan Alembic untuk perubahan skema database utama. Buat koneksi database eksternal hanya jika diperlukan aplikasi baru; ikuti pemisahan koneksi dan batas aksesnya.

4. Pertahankan integrasi frontend dan backend

- Selaraskan nama field, tipe, nullable, relasi, status, dan format tanggal dari database sampai form.
- Periksa bentuk response yang benar-benar digunakan setiap keluarga endpoint. Referensi memakai response autentikasi berbentuk envelope dan list CRUD yang dapat berbentuk {total, skip, limit, data}; jangan mengasumsikan semua endpoint memiliki satu bentuk response yang sama.
- Selaraskan nomor halaman frontend dengan skip/limit backend. Pastikan pencarian dan total data konsisten.
- Ikuti pola sesi cookie HttpOnly, JWT, refresh session, CSRF, dan penanganan sesi berakhir dengan memeriksa implementasi kedua sisi.
- Terapkan autentikasi dan otorisasi pada endpoint backend sesuai role dan kepemilikan data. Menyembunyikan menu frontend saja tidak cukup. Jangan menyalin akses opsional pada operasi admin tanpa menilai kebutuhan aplikasi baru.
- Untuk upload, selaraskan FormData, validasi file, URL media, penyimpanan, dan perilaku penghapusan file.
- Jangan menyalin bug, fallback field yang tidak relevan, kode mati, atau inkonsistensi referensi. Jika perlu menyimpang untuk memperbaiki masalah, jelaskan secara singkat dan pertahankan pola utama proyek.

5. Bangun sesuai domain aplikasi baru

- Ganti seluruh nama EduSetara, identitas instansi, domain pendidikan, role, menu, dan data contoh dengan kebutuhan aplikasi baru.
- Jangan membawa .env asli, password, token, data pengguna, database dump, atau file unggahan produksi dari referensi. Sediakan .env.example dengan placeholder dan seed data fiktif.
- Jangan menyalin node_modules, virtual environment, output build, cache, atau dependensi vendor yang tersimpan dalam folder script.
- Pertahankan konvensi penamaan yang konsisten dan istilah domain yang dipahami pengguna aplikasi baru.
- Jadikan data backend sumber data untuk fitur yang diimplementasikan. Jangan meninggalkan tombol CRUD atau halaman utama sebagai simulasi lokal jika diminta berfungsi penuh.
- Hindari menambah framework, lapisan abstraksi, atau mengganti stack tanpa kebutuhan yang jelas.

6. Cara bekerja dan hasil yang diharapkan

- Kerjakan di proyek tujuan; jangan mengubah repository referensi.
- Jika kebutuhan penting belum jelas, ajukan pertanyaan yang paling menentukan. Sambil menunggu, lanjutkan pekerjaan yang tidak bergantung pada jawaban itu.
- Setelah memahami referensi, buat kerangka proyek lalu selesaikan satu modul secara menyeluruh sebagai pola bagi modul lain.
- Lanjutkan implementasi modul sesuai ruang lingkup yang saya minta, termasuk frontend, backend, migrasi, serta integrasinya.
- Jalankan pemeriksaan yang relevan: lint/type check/build frontend sesuai script proyek, pengujian backend untuk perilaku penting, dan verifikasi alur CRUD serta autentikasi. Laporkan pemeriksaan yang tidak dapat dijalankan beserta penyebabnya.
- Buat README aplikasi baru berisi cara menyiapkan lingkungan, database, migrasi, seed, menjalankan frontend/backend, dan menjalankan pemeriksaan.
- Tambahkan panduan singkat cara membuat modul baru mengikuti pola yang sama, dengan contoh lokasi file dan alur frontend → API → schema/service → model/database.
- Pada hasil akhir, jelaskan apa yang selesai, lokasi file utama, cara menjalankan, hasil pemeriksaan, dan keterbatasan yang masih ada. Jangan menyebut fitur selesai jika belum terhubung atau belum diverifikasi.

Mulai dengan mengakses repository referensi, membaca struktur serta contoh kode frontend dan backend, kemudian kerjakan aplikasi baru sesuai detail di atas.
```
