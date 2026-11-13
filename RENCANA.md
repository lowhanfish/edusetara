# Rencana Kerja Aktif EduSetara

Diperbarui: 13 November 2026.

Gunakan satu berkas ini untuk rencana aktif. Hapus butir yang telah selesai setelah hasilnya diverifikasi; dokumentasi teknis tetap berada pada dokumen modul masing-masing. Jangan membuat direktori atau berkas rencana baru untuk setiap kegiatan.

## Prioritas berikutnya: pengajuan rekonsiliasi Dana BOSP

Status: direncanakan, belum diimplementasikan.

Tujuan: sekolah dapat mengunggah dan melengkapi seluruh dokumen terlebih dahulu. Usulan baru masuk antrean verifikasi dinas setelah sekolah menekan tombol **Ajukan ke Dinas**.

- [ ] Periksa alur usulan, lampiran, status, dan verifikasi yang sudah ada sebelum menentukan perubahan skema/API.
- [ ] Pisahkan tindakan simpan draf dari pengajuan. Pembuatan usulan dan unggah dokumen tidak otomatis membuat usulan masuk antrean dinas.
- [ ] Sediakan status Draf, Diajukan, dan Perlu Perbaikan, diselaraskan dengan status verifikasi yang sudah ada.
- [ ] Sekolah dapat mengubah draf dan melengkapi lampiran secara bertahap.
- [ ] Tambahkan tombol Ajukan ke Dinas beserta pemeriksaan kelengkapan dokumen wajib di backend dan pesan hasilnya di antarmuka.
- [ ] Catat waktu dan pengguna yang mengajukan. Cegah pengajuan berulang atas usulan yang sedang diverifikasi.
- [ ] Batasi antrean, jumlah data, dan tindakan verifikasi dinas pada usulan yang sudah diajukan. Terapkan aturan di backend.
- [ ] Kunci perubahan usulan dan lampiran selama pemeriksaan. Jika dikembalikan untuk perbaikan, sekolah dapat memperbaiki lalu mengajukan ulang.
- [ ] Tentukan penanganan data lama berdasarkan status dan riwayatnya agar usulan yang sedang diverifikasi tidak berubah menjadi draf tanpa dasar.
- [ ] Verifikasi alur: simpan/unggah tetap draf, draf tidak masuk verifikasi, pengajuan lengkap masuk antrean, pengajuan tidak lengkap ditolak, dokumen terkunci saat diperiksa, serta perbaikan dan pengajuan ulang berjalan sesuai hak akses.

## Pengembangan lanjutan: audit awal dengan AI

Status: gagasan untuk tahap berikutnya; belum menjadi bagian implementasi saat ini.

- [ ] Rancang pemeriksaan dokumen dengan AI sebelum pengajuan ke dinas, dengan hasil berupa temuan dan saran perbaikan.
- [ ] Evaluasi penyedia dan model ketika tahap ini dimulai; Gemini menjadi salah satu kandidat, belum ada model yang ditetapkan.
- [ ] Tentukan format hasil, perlindungan data dokumen, biaya, dan apakah pemeriksaan bersifat opsional atau wajib sebelum pengajuan.
- [ ] Pertahankan keputusan verifikasi akhir pada dinas.
