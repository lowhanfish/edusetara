# Rencana Kerja Aktif EduSetara

Diperbarui: 13 November 2026.

Gunakan satu berkas ini untuk rencana aktif. Hapus butir yang telah selesai setelah hasilnya diverifikasi; dokumentasi teknis tetap berada pada dokumen modul masing-masing. Jangan membuat direktori atau berkas rencana baru untuk setiap kegiatan.

## Prioritas berikutnya: pengajuan rekonsiliasi Dana BOSP

Status: direncanakan, belum diimplementasikan.

Tujuan: sekolah dapat mengunggah dan melengkapi seluruh dokumen terlebih dahulu. Usulan baru masuk antrean verifikasi dinas setelah sekolah menekan tombol **Ajukan ke Dinas**.

- [ ] Periksa alur usulan, lampiran, status, dan verifikasi yang sudah ada sebelum menentukan perubahan skema/API.
- [ ] Pisahkan tindakan simpan draf dari pengajuan. Pembuatan usulan dan unggah dokumen tidak otomatis membuat usulan masuk antrean dinas.
- [ ] Sediakan status Draf, Diajukan, dan Perlu Perbaikan sebagai satu sumber kebenaran (*single source of truth*), diselaraskan dengan status verifikasi yang sudah ada.
- [ ] Standarkan kode peran/jenis kategori dokumen BOSP pada master kategori (mis. BKU, Rekening Koran, SPTJM, Laporan Pajak, BA Pemeriksaan Kas, Rekap Belanja Modal) agar pemeriksaan kelengkapan dan ekstraksi tahap lanjut tidak bergantung pada teks uraian bebas.
- [ ] Sekolah dapat mengubah draf dan melengkapi lampiran secara bertahap, serta sistem menyimpan hash berkas (`SHA-256`) untuk mendeteksi duplikasi berkas dan perubahan saat pengajuan ulang.
- [ ] Tambahkan tombol Ajukan ke Dinas beserta pemeriksaan kelengkapan dokumen wajib di backend dan pesan hasilnya di antarmuka.
- [ ] Catat waktu, versi pengajuan, dan pengguna yang mengajukan. Cegah pengajuan berulang atas usulan yang sedang diverifikasi.
- [ ] Batasi antrean, jumlah data, dan tindakan verifikasi dinas pada usulan yang sudah diajukan. Terapkan aturan di backend.
- [ ] Kunci perubahan usulan dan lampiran selama pemeriksaan. Jika dikembalikan untuk perbaikan, sekolah dapat memperbaiki lalu mengajukan ulang.
- [ ] Tentukan penanganan data lama berdasarkan status dan riwayatnya agar usulan yang sedang diverifikasi tidak berubah menjadi draf tanpa dasar.
- [ ] Verifikasi alur: simpan/unggah tetap draf, draf tidak masuk verifikasi, pengajuan lengkap masuk antrean, pengajuan tidak lengkap ditolak, dokumen terkunci saat diperiksa, serta perbaikan dan pengajuan ulang berjalan sesuai hak akses.

## Pengembangan berikutnya: Riwayat Penguasaan Aset & Bukti Serah Terima (BMD / DAK)

Status: direncanakan untuk pengembangan modul Inventaris Aset BMD; melengkapi pencatatan riwayat kondisi yang sudah ada agar rantai penguasaan barang (*chain of custody*) memiliki bukti visual dan dokumen ber-TTE yang kuat.

Tujuan: melacak siapa penanggung jawab dan siapa pemegang/pemakai barang dari waktu ke waktu (mis. perpindahan dari Si A ke Si B), kondisi fisik saat diserahkan/diterima beserta fotonya, serta mengikatkan Surat Pernyataan Kondisi Barang ber-TTE Kepala Sekolah untuk satu atau banyak barang sekaligus dalam satu paket pengadaan.

- [ ] **Pembedaan Penanggung Jawab dan Pemegang Aset**:
  - Tambahkan pencatatan **Penanggung Jawab** (Kepala Sekolah / Pengurus Barang) dan **Pemegang/Pemakai Langsung** (nama, NIP/jabatan) pada status penguasaan terkini dan setiap catatan perpindahan.
- [ ] **Fitur Dokumen Serah Terima / Surat Pernyataan Kondisi ber-TTE (1 Dokumen untuk Banyak Barang / *Batch*)**:
  - Sediakan unggah PDF **Surat Pernyataan Kondisi Barang / BAST ber-TTE** (hasil tanda tangan elektronik resmi Kepala Sekolah, baik via integrasi API BSrE maupun unggah PDF ber-TTE) beserta foto dokumentasi penerimaan awal.
  - Sediakan mekanisme pemilihan banyak barang sekaligus (*checklist / multi-select*) agar **1 file Surat Pernyataan ber-TTE** dapat mengikat puluhan item dalam satu paket pengadaan/DAK sekaligus tanpa harus menandatangani surat per unit barang.
  - Simpan hash `SHA-256` berkas PDF (dan validasi tanda tangan digital bila memungkinkan) agar dokumen pernyataan tidak dapat diubah diam-diam setelah diunggah.
- [ ] **Aksi Pindah Tangan / Serah Terima per Unit (Si A → Si B)**:
  - Tambahkan alur serah terima pemegang per barang yang wajib mencatat pihak penyerah, pihak penerima/pemegang baru, penanggung jawab saat itu, kondisi barang saat diserahkan (Baik/Rusak Ringan/Rusak Berat), serta **foto kondisi fisik wajib** saat serah terima berlangsung.
- [ ] **Menu Riwayat Aset (*Immutable Timeline*)**:
  - Tambahkan menu khusus **Riwayat Aset** di bawah modul Sarpras / Inventaris Aset untuk menelusuri kronologi lengkap per barang (Penerimaan Awal + Tautan PDF Surat Pernyataan TTE → Pemegang Si A [Foto] → Pindah Tangan ke Si B [Foto] → Pemeriksaan Kondisi/Kerusakan [Foto]) maupun penelusuran riwayat berdasarkan sekolah atau nama pemegang/penanggung jawab.
  - Pastikan seluruh entri riwayat serah terima, foto, dan tautan surat pernyataan bersifat *immutable* (tidak dapat diedit atau dihapus).
- [ ] **Peringatan Dini (*Red Flag*) Kerusakan Cepat**:
  - Tandai aset yang baru diterima/diserahkan dalam kondisi baik (mis. pengadaan DAK tahun berjalan) namun mengalami penurunan kondisi menjadi rusak dalam rentang waktu singkat sebagai bahan atensi verifikasi Dinas.

## Pengembangan berikutnya: Sistem Persuratan Online & Legalisir Ijazah Online (Integrasi TTE BSrE)

Status: direncanakan; memanfaatkan infrastruktur Tanda Tangan Elektronik (TTE) BSrE melalui API web service Pemda Konawe Selatan yang telah dimiliki oleh hampir seluruh ASN dan Kepala Sekolah.

Catatan teknis awal: pelajari dokumentasi API web service BSrE Pemda Konawe Selatan terlebih dahulu sebelum implementasi proses penandatanganan elektronik.

### 1. Sistem Persuratan Online (Dinas ↔ Sekolah)
- [ ] **Manajemen Surat Masuk, Surat Keluar, & Disposisi**: Alur draf surat, verifikasi/paraf berjenjang, penomoran otomatis, disposisi, serta distribusi digital antara Dinas Pendidikan dan sekolah tanpa perlu antar berkas fisik.
- [ ] **Penandatanganan Elektronik Terintegrasi (API BSrE)**: Pembubuhan TTE langsung di aplikasi oleh pejabat Dinas atau Kepala Sekolah (termasuk mendukung dokumen seperti Surat Pernyataan Kondisi Aset, SPTJM, SK, dan surat edaran).
- [ ] **QR Code Verifikasi & Arsip Digital**: Setiap surat bertanda tangan elektronik disertai QR Code yang terhubung ke halaman validasi keaslian dokumen di EduSetara.

### 2. Legalisir Ijazah Online (Layanan Publik: Pemohon ↔ Sekolah / Dinas)
- [ ] **Pengajuan Online Pemohon/Alumni**: Unggah scan ijazah asli dan identitas pemohon, dengan tujuan sekolah asal (atau Dinas Pendidikan apabila sekolah sudah tutup/merger).
- [ ] **Verifikasi Data Kelulusan**: Pemeriksaan kecocokan nomor seri ijazah, identitas, dan tahun lulus oleh operator sekolah/Dinas terhadap arsip buku induk/Dapodik.
- [ ] **Pembubuhan Cap Legalisir + TTE BSrE & QR Validasi**: Sistem membubuhkan blok keterangan legalisir digital, QR Code verifikasi publik, dan tanda tangan elektronik Kepala Sekolah/pejabat berwenang melalui API BSrE.
- [ ] **Unduh Mandiri & Validasi Publik**: Pemohon mengunduh PDF ijazah terlegalisir ber-TTE yang sah digunakan secara digital maupun cetak, dan instansi penerima dapat memindai QR Code untuk memastikan keaslian dokumen.

## Pengembangan tahap akhir: pemeriksaan awal BOSP dengan AI

Status: gagasan tahap akhir; dikerjakan setelah fitur operasional utama (pengajuan BOSP, riwayat aset, dan persuratan/legalisir TTE) berjalan stabil. Tahap 1 (draf dan Ajukan ke Dinas) tidak menunggu bagian ini.

### 1. Prinsip dan Batasan Utama

- **Pemicu Pemeriksaan**: Pengajuan eksplisit ke dinas (**Ajukan ke Dinas**) menjadi pemicu pemeriksaan di latar belakang (*asynchronous*); draf dan unggahan bertahap tidak diperiksa AI.
- **Unit Pemeriksaan (Snapshot Berkas)**: Satu sekolah, satu periode, satu versi pengajuan (snapshot berkas terkunci yang tidak berubah saat diperiksa). Saat pengajuan ulang (*resubmission*), hanya berkas yang hash `SHA-256`-nya berubah serta uji silangnya yang diproses ulang.
- **Bukan Satu Prompt Raksasa (*Indirect LLM*)**: Pemeriksaan tidak melempar seluruh paket PDF sekaligus ke satu prompt LLM, melainkan mengubah setiap dokumen menjadi kertas kerja terstruktur terlebih dahulu, menjalankan rekonsiliasi terprogram, lalu menggunakan LLM + RAG secara terfokus.
- **Indikasi Berbukti (*Human-in-the-Loop*)**: Hasil berupa daftar indikasi berbukti (lengkap dengan rujukan dokumen, halaman, dan baris/sel sumber) untuk membantu verifikator dinas, bukan opini audit final, tuduhan, atau penolakan otomatis.
- **Pemisahan Status & Ketahanan (*Fallback*)**: Status pemrosesan AI terpisah dari status verifikasi dinas; keputusan akhir tetap pada dinas. Jika pemrosesan AI gagal atau melewati batas waktu, verifikasi manual oleh dinas tetap berjalan tanpa terblokir.
- **Penggunaan Komponen Eksternal**: Bagian TotoL (`/Users/dinaskominfo/kiken/Project/Python/TotO-L-py`) dipakai hanya bila lulus benchmark pada dokumen BOSP nyata; skema ekstraksi, aturan rekonsiliasi BOSP, dan kertas kerja dibangun khusus untuk EduSetara.

### 2. Metode Pemrosesan: Arsitektur *Indirect LLM* (4 Lapis)

1. **Lapis 1 — Ekstraksi & Normalisasi ke Kertas Kerja Digital (*Document-to-Schema*)**
   - Dokumen PDF digital/XLSX (seperti ekspor ARKAS) diekstrak menggunakan parser tabel deterministik; dokumen hasil pindaian (*scan*) seperti SPTJM bertanda tangan, Rekening Koran bank, atau nota/bukti diproses melalui OCR/Vision secara terarah.
   - Menghasilkan data JSON/tabel baku per jenis dokumen (`CanonicalBKU`, `CanonicalPajak`, `CanonicalRekeningKoran`, `CanonicalRingkasan/SPTJM`, `CanonicalBelanjaModal`) lengkap dengan koordinat sumber (`dokumen_id`, `halaman`, `baris`).
2. **Lapis 2 — Mesin Rekonsiliasi & Deteksi Anomali Deterministik (100% Kode Python/SQL)**
   - Menjalankan seluruh perhitungan aritmetika kas, kecocokan mutasi antar-dokumen, keseimbangan pajak, dan deteksi pola statistik secara terprogram di atas hasil Lapis 1 agar konsisten dan bebas halusinasi angka.
3. **Lapis 3 — Audit Semantik & Kepatuhan Regulasi (*Targeted LLM + RAG Juknis BOSP*)**
   - Mengirimkan hanya baris-baris transaksi yang telah diekstrak/disaring ke LLM bersama potongan aturan resmi Juknis BOSP (RAG) untuk menilai kesesuaian uraian belanja dengan kode rekening, larangan penggunaan dana, dan kewajaran bukti bernilai besar.
4. **Lapis 4 — Kompilasi Kertas Kerja Indikasi untuk Verifikator Dinas**
   - Menggabungkan temuan Lapis 2 dan Lapis 3 menjadi daftar indikasi terstruktur berisi kelompok anomali, tingkat keparahan, penjelasan singkat, rujukan pasal Juknis (bila ada), serta tautan ke halaman/baris dokumen sumber.

### 3. Empat Kelompok Deteksi Anomali Paket BOSP

#### Kelompok 1: Anomali Kelengkapan, Keutuhan, & Kesesuaian Isi Dokumen (*Gatekeeper*)
Mendeteksi kesalahan berkas sebelum masuk ke pemeriksaan isi yang berat:
- **Duplikasi Berkas Antar-Slot**: Dua kategori dokumen berbeda mengunggah berkas yang identik (dicek melalui `SHA-256`) atau berkas rusak/terkunci kata sandi.
- **Salah Kamar Dokumen (*Content-to-Slot Mismatch*)**: Isi dokumen tidak sesuai dengan slot kategorinya (mis. berkas BKU diunggah pada slot Laporan Pajak).
- **Ketidaksesuaian Identitas & Periode**: Nama sekolah/NPSN, tahun anggaran, atau tahap/semester yang tertulis di dalam dokumen berbeda dengan metadata usulan yang sedang diajukan (mis. mengunggah Rekening Koran Semester I pada pengajuan Semester II).
- **Metode**: Hash berkas, pemeriksaan keterbacaan PDF, dan ekstraksi ringan halaman pertama/judul dokumen.

#### Kelompok 2: Anomali Rekonsiliasi Silang Antar-Dokumen (*Cross-Document Mismatch*)
Menguji kekonsistenan angka yang saling mengunci di antara dokumen dalam satu paket:
- **SPTJM / LPJ vs BKU**: Mencocokkan `nominal_dana` pada usulan, `Saldo Awal`, `Total Penerimaan`, `Total Belanja (Operasi + Modal)`, dan `Saldo Akhir` pada SPTJM/LPJ terhadap rekapitulasi perhitungan baris BKU.
- **BKU & BA Pemeriksaan Kas vs Rekening Koran Bank**:
  - Mencocokkan `Saldo Akhir Bank` pada BKU/BA Kas dengan `Saldo Akhir` pada Rekening Koran di tanggal penutupan periode.
  - Mencocokkan mutasi penarikan tunai/pencairan di Rekening Koran dengan transaksi penerimaan/penarikan di BKU berdasarkan tanggal dan nominal (mendeteksi dana keluar dari bank yang tidak tercatat di BKU atau selisih bunga/biaya admin bank).
- **BKU vs Laporan Pajak (Buku Pembantu Pajak)**:
  - Memeriksa apakah transaksi belanja kena pajak di BKU memiliki pasangan pemungutan pajak.
  - Memastikan `Total Pajak Dipungut` sama dengan `Total Pajak Disetor`, serta mendeteksi pajak yang sudah dipungut tetapi belum disetor (atau belum memiliki NTPN/bukti setor) hingga akhir periode.
- **BKU (Belanja Modal) vs Data Aset/Inventaris (KIB)**:
  - Mencocokkan total realisasi *Belanja Modal* pada BKU/LPJ dengan daftar penambahan barang/aset sekolah pada periode yang sama (termasuk sinkronisasi dengan modul Inventaris Aset BMD di EduSetara).
- **Metode**: Perhitungan dan pencocokan terprogram (Python/SQL) di atas data terstruktur hasil Lapis 1.

#### Kelompok 3: Anomali Pola Transaksi di Dalam BKU (*Intra-Document Forensic Pattern*)
Mendeteksi kejanggalan pola pembukuan walaupun jumlah total akhir terlihat seimbang:
- **Pecah Transaksi (*Split Purchasing*)**: Transaksi berulang pada tanggal yang sama atau berurutan dengan uraian/penyedia serupa dan nominal yang dipecah tepat di bawah ambang batas pajak atau aturan pengadaan.
- **Kronologi & Saldo Kas Tunai Negatif**: Saldo kas tunai sempat bernilai minus pada tanggal tertentu (pengeluaran tunai dicatat sebelum tanggal penarikan dana dari bank), atau urutan tanggal dan nomor bukti (`No. Bukti`) tidak kronologis.
- **Transaksi Ganda (*Duplicate Entry*)**: Kombinasi `(tanggal, nominal, uraian)` atau nomor bukti yang sama tercatat lebih dari sekali di BKU.
- **Anomali Waktu Transaksi**: Tanggal transaksi berada di luar rentang periode pengajuan, atau lonjakan penyerapan anggaran bernilai besar secara mendadak di hari-hari terakhir penutupan periode dengan uraian generik.
- **Metode**: Aturan heuristik, pemeriksaan deret waktu (*time-series*), dan algoritma kemiripan teks di Python.

#### Kelompok 4: Anomali Semantik & Kepatuhan Juknis BOSP (*Targeted LLM + RAG*)
Mendeteksi ketidakwajaran makna uraian transaksi dan kepatuhan terhadap regulasi:
- **Salah Klasifikasi Kode Rekening (*Account Misclassification*)**: Uraian transaksi tidak sesuai dengan kelompok akun belanjanya (mis. pembelian barang habis pakai seperti kertas/konsumsi dicatat pada kode rekening *Belanja Modal Aset Tetap*, atau sebaliknya pembelian peralatan elektronik dicatat sebagai belanja habis pakai sehingga tidak masuk ke pencatatan aset/KIB).
- **Indikasi Pelanggaran Larangan Juknis BOSP**: Menyandingkan uraian transaksi BKU dengan basis pengetahuan aturan resmi Juknis BOSP (RAG) untuk menandai belanja yang berpotensi melanggar larangan (mis. pembayaran honorarium, iuran, atau kegiatan yang tidak diperkenankan juknis).
- **Uraian Kabur pada Nilai Besar & Uji Petik Bukti**: Menandai transaksi bernilai besar yang uraiannya terlalu umum tanpa rincian satuan/kegiatan, serta membandingkan keterbacaan bukti/nota bernilai besar terhadap baris BKU terkait.
- **Metode**: Pemanggilan LLM terfokus (*batched rows*) dengan skema output terstruktur wajib bukti (`dokumen_id`, `halaman`, `baris`, `kutipan_sumber`, `rujukan_aturan`).

### 4. Urutan Pelaksanaan Bertahap (Agar Terkelola Saat Implementasi)

Agar implementasi tidak terlalu berat sekaligus, pengerjaan Tahap AI dibagi menjadi 4 sub-tahap berurutan:
- [ ] **Tahap AI-1 (Fondasi & Kelompok 1 — Gatekeeper)**: Antrean worker asinkron, penyimpanan status/hasil AI terpisah, validasi hash berkas, dan pemeriksaan kesesuaian identitas/periode/jenis dokumen pada halaman awal PDF.
- [ ] **Tahap AI-2 (Kelompok 2 — Ekstraksi Tabel & Rekonsiliasi Silang Deterministik)**: Parser BKU, SPTJM, Pajak, dan Rekening Koran ke skema JSON baku, diikuti mesin rekonsiliasi angka lintas-dokumen dan pencocokan Belanja Modal dengan data aset.
- [ ] **Tahap AI-3 (Kelompok 3 — Deteksi Pola Transaksi BKU)**: Aturan deteksi pecah transaksi, saldo kas tunai negatif, duplikasi baris, dan anomali kronologi tanggal/nomor bukti.
- [ ] **Tahap AI-4 (Kelompok 4 — Targeted LLM & RAG Juknis BOSP)**: Pengindeksan dokumen regulasi Juknis BOSP serta pemeriksaan semantik klasifikasi kode rekening dan kepatuhan aturan menggunakan LLM.

### 5. Keputusan Teknis yang Harus Ditetapkan Sebelum Mulai Tahap AI

- [ ] Kumpulkan *corpus* uji berlabel (sampel paket PDF asli dari beberapa sekolah/periode, termasuk contoh yang normal dan yang memiliki temuan koreksi dinas) dengan *holdout* terpisah.
- [ ] Benchmark parser PDF/XLSX (`pdfplumber`/`pymupdf`/OCR) dan uji apakah komponen `TotO-L-py` layak dipakai pada sampel dokumen BOSP nyata.
- [ ] Tetapkan daftar kategori dokumen wajib menurut jenjang/periode beserta matriks prosedur verifikasi resmi dari dinas.
- [ ] Tetapkan pemilihan model/provider LLM, batas anggaran token per pengajuan, kebijakan privasi pengiriman data ke provider, serta keputusan apakah ringkasan hasil awal tertentu ditampilkan ke sekolah atau khusus verifikator dinas.
