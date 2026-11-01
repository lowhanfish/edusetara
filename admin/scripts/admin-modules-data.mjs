import fs from "fs";
import path from "path";

// Definition of all 49 operational modules outside master/
export const modules = [
  // 1. Profile
  {
    dir: "app/(admin)/admin/profile/renstra",
    entity: "Renstra",
    title: "Renstra (Rencana Strategis)",
    category: "Profile",
    description: "Pengelolaan Rencana Strategis (Renstra) Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.",
    endpoint: "/api/v1/admin/profile/renstra",
    queryKey: "profile-renstra",
    icon: "📈",
    fields: [
      { name: "isi", label: "Uraian / Ringkasan Renstra", type: "textarea", required: true, placeholder: "Masukkan uraian lengkap dokumen rencana strategis dinas..." },
      { name: "file", label: "Berkas Dokumen Renstra (PDF)", type: "file", required: false, placeholder: "Unggah dokumen PDF Renstra" }
    ],
    tableCols: [
      { key: "isi", label: "Ringkasan Renstra" },
      { key: "file", label: "Dokumen File" },
      { key: "created_at", label: "Waktu Catat" }
    ]
  },
  {
    dir: "app/(admin)/admin/profile/tugas-fungsi",
    entity: "TugasFungsi",
    title: "Tugas dan Fungsi",
    category: "Profile",
    description: "Pengelolaan Tugas Pokok dan Fungsi (Tupoksi) Dinas Pendidikan dan Kebudayaan.",
    endpoint: "/api/v1/admin/profile/tugas-fungsi",
    queryKey: "profile-tugas-fungsi",
    icon: "⚖️",
    fields: [
      { name: "tugas", label: "Tugas Pokok", type: "textarea", required: true, placeholder: "Uraian tugas pokok instansi..." },
      { name: "fungsi", label: "Rincian Fungsi", type: "textarea", required: true, placeholder: "Uraian rincian fungsi instansi..." },
      { name: "file", label: "Berkas Lampiran Perbup/SK (PDF)", type: "file", required: false, placeholder: "Unggah berkas tupoksi (PDF)" }
    ],
    tableCols: [
      { key: "tugas", label: "Tugas Pokok" },
      { key: "fungsi", label: "Rincian Fungsi" },
      { key: "file", label: "Berkas" }
    ]
  },
  {
    dir: "app/(admin)/admin/profile/visi-misi",
    entity: "VisiMisi",
    title: "Visi dan Misi",
    category: "Profile",
    description: "Pengelolaan Visi, Misi, Tujuan, dan Sasaran Strategis Dinas Pendidikan dan Kebudayaan.",
    endpoint: "/api/v1/admin/profile/visi-misi",
    queryKey: "profile-visi-misi",
    icon: "🎯",
    fields: [
      { name: "visi", label: "Visi Pembangunan Pendidikan", type: "textarea", required: true, placeholder: "Rumusan visi pembangunan pendidikan..." },
      { name: "misi", label: "Misi Pembangunan Pendidikan", type: "textarea", required: true, placeholder: "Rumusan butir-butir misi..." },
      { name: "tujuan", label: "Tujuan Strategis", type: "textarea", required: false, placeholder: "Tujuan strategis penyelenggaraan pendidikan..." },
      { name: "sasaran", label: "Sasaran Program", type: "textarea", required: false, placeholder: "Sasaran capaian program..." }
    ],
    tableCols: [
      { key: "visi", label: "Visi" },
      { key: "misi", label: "Misi" },
      { key: "tujuan", label: "Tujuan" }
    ]
  },

  // 2. Sarana dan Prasarana
  {
    dir: "app/(admin)/admin/sarpras/tanah",
    entity: "SarprasTanah",
    title: "Tanah Sekolah",
    category: "Sarana dan Prasarana",
    description: "Pangkalan data kepemilikan dan legalitas lahan tanah seluruh satuan pendidikan.",
    endpoint: "/api/v1/admin/sarpras/tanah",
    queryKey: "sarpras-tanah",
    icon: "🗺️",
    fields: [
      { name: "sekolah", label: "Nama Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SDN 1 Ranomeeto" },
      { name: "jenis", label: "Jenis / Peruntukan Lahan", type: "text", required: true, placeholder: "Contoh: Bangunan Sekolah & Lapangan" },
      { name: "luas", label: "Luas Tanah (m²)", type: "number", required: true, placeholder: "Contoh: 5000" },
      { name: "luas_lahan_tersedia", label: "Luas Lahan Tersedia (m²)", type: "number", required: false, placeholder: "Contoh: 1500" },
      { name: "kepemilikan", label: "Status Kepemilikan", type: "text", required: true, placeholder: "Contoh: Milik Pemerintah Daerah / Hibah" },
      { name: "bukti_kepemilikan", label: "Bukti Kepemilikan", type: "text", required: false, placeholder: "Contoh: Sertifikat Hak Pakai / Akta Hibah" },
      { name: "nomor_sertifikat", label: "Nomor Sertifikat", type: "text", required: false, placeholder: "Contoh: No. 21.05.01..." },
      { name: "alamat", label: "Alamat / Lokasi Lahan", type: "textarea", required: false, placeholder: "Alamat lengkap tanah sekolah..." }
    ],
    tableCols: [
      { key: "sekolah", label: "Satuan Pendidikan" },
      { key: "jenis", label: "Jenis Lahan" },
      { key: "luas", label: "Luas (m²)" },
      { key: "kepemilikan", label: "Status Hak" },
      { key: "nomor_sertifikat", label: "No. Sertifikat" }
    ]
  },
  {
    dir: "app/(admin)/admin/sarpras/bangunan",
    entity: "SarprasBangunan",
    title: "Bangunan Sekolah",
    category: "Sarana dan Prasarana",
    description: "Pendataan gedung, konstruksi fisik, dan kelaikan bangunan satuan pendidikan.",
    endpoint: "/api/v1/admin/sarpras/bangunan",
    queryKey: "sarpras-bangunan",
    icon: "🏫",
    fields: [
      { name: "sekolah", label: "Nama Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SMPN 2 Konsel" },
      { name: "nama_bangunan", label: "Nama Gedung / Bangunan", type: "text", required: true, placeholder: "Contoh: Gedung Kelas Utama A" },
      { name: "panjang", label: "Panjang (m)", type: "number", required: false, placeholder: "Contoh: 30" },
      { name: "lebar", label: "Lebar (m)", type: "number", required: false, placeholder: "Contoh: 9" },
      { name: "luas_tapak", label: "Luas Tapak (m²)", type: "number", required: false, placeholder: "Contoh: 270" },
      { name: "jumlah_lantai", label: "Jumlah Lantai", type: "number", required: false, placeholder: "Contoh: 1" },
      { name: "kepemilikan", label: "Status Kepemilikan", type: "text", required: false, placeholder: "Contoh: Milik Sendiri" },
      { name: "kondisi", label: "Kondisi Bangunan", type: "text", required: true, placeholder: "Contoh: Baik / Rusak Sedang / Rusak Berat" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "nama_bangunan", label: "Nama Bangunan" },
      { key: "luas_tapak", label: "Luas Tapak (m²)" },
      { key: "jumlah_lantai", label: "Lantai" },
      { key: "kondisi", label: "Kondisi" }
    ]
  },
  {
    dir: "app/(admin)/admin/sarpras/ruang",
    entity: "SarprasRuang",
    title: "Ruang Sekolah",
    category: "Sarana dan Prasarana",
    description: "Registrasi ruang belajar, laboratorium, perpustakaan, dan fasilitas penunjang sekolah.",
    endpoint: "/api/v1/admin/sarpras/ruang",
    queryKey: "sarpras-ruang",
    icon: "🚪",
    fields: [
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SDN 5 Andoolo" },
      { name: "bangunan", label: "Lokasi Gedung / Bangunan", type: "text", required: false, placeholder: "Contoh: Gedung Utama Blok B" },
      { name: "kode_ruang", label: "Kode Ruang", type: "text", required: false, placeholder: "Contoh: R-01" },
      { name: "nama_ruang", label: "Nama Ruang", type: "text", required: true, placeholder: "Contoh: Ruang Kelas 1A / Lab Komputer" },
      { name: "panjang", label: "Panjang (m)", type: "number", required: false, placeholder: "Contoh: 8" },
      { name: "lebar", label: "Lebar (m)", type: "number", required: false, placeholder: "Contoh: 7" },
      { name: "kondisi", label: "Kondisi Ruang", type: "text", required: true, placeholder: "Contoh: Baik / Rusak Ringan" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "nama_ruang", label: "Nama Ruang" },
      { key: "bangunan", label: "Gedung" },
      { key: "kode_ruang", label: "Kode" },
      { key: "kondisi", label: "Kondisi" }
    ]
  },
  {
    dir: "app/(admin)/admin/sarpras/peralatan",
    entity: "SarprasPeralatan",
    title: "Peralatan / Aset",
    category: "Sarana dan Prasarana",
    description: "Inventarisasi peralatan TIK, perabot kelas, laboratorium, dan sarana multimedia.",
    endpoint: "/api/v1/admin/sarpras/peralatan",
    queryKey: "sarpras-peralatan",
    icon: "🖥️",
    fields: [
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SMPN 1 Kolono" },
      { name: "nama_alat", label: "Nama Peralatan / Aset", type: "text", required: true, placeholder: "Contoh: Chromebook DAK / Proyektor" },
      { name: "kode_alat", label: "Kode Barang / NUP", type: "text", required: false, placeholder: "Contoh: TIK-2026-001" },
      { name: "spesifikasi", label: "Spesifikasi / Merk", type: "text", required: false, placeholder: "Contoh: Core i3 / RAM 8GB / Asus" },
      { name: "jumlah", label: "Jumlah Unit", type: "number", required: true, placeholder: "Contoh: 15" },
      { name: "kondisi", label: "Kondisi", type: "text", required: true, placeholder: "Contoh: Baik / Rusak Ringan / Rusak Berat" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "nama_alat", label: "Nama Peralatan" },
      { key: "spesifikasi", label: "Spesifikasi" },
      { key: "jumlah", label: "Jumlah Unit" },
      { key: "kondisi", label: "Kondisi" }
    ]
  },

  // 3. Rombel
  {
    dir: "app/(admin)/admin/rombel/paud",
    entity: "RombelPaud",
    title: "Jenjang PAUD",
    category: "Rombel",
    description: "Pengelolaan rombongan belajar dan kelompok usia jenjang PAUD/TK se-Konawe Selatan.",
    endpoint: "/api/v1/admin/rombel/paud",
    queryKey: "rombel-paud",
    icon: "🧸",
    fields: [
      { name: "sekolah", label: "Satuan PAUD / TK", type: "text", required: true, placeholder: "Contoh: TK Pembina Andoolo" },
      { name: "nama_rombel", label: "Nama Rombongan Belajar", type: "text", required: true, placeholder: "Contoh: Kelompok A Bintang Kecil" },
      { name: "tingkat", label: "Tingkat / Usia", type: "text", required: false, placeholder: "Contoh: Usia 4-5 Tahun" },
      { name: "kurikulum", label: "Kurikulum Operasional", type: "text", required: false, placeholder: "Contoh: Kurikulum Merdeka PAUD" },
      { name: "wali_kelas", label: "Guru Pendamping / Wali", type: "text", required: false, placeholder: "Contoh: Hj. Nurlela, S.Pd" },
      { name: "jumlah_siswa", label: "Jumlah Peserta Didik", type: "number", required: true, placeholder: "Contoh: 18" }
    ],
    tableCols: [
      { key: "sekolah", label: "Satuan PAUD" },
      { key: "nama_rombel", label: "Nama Rombel" },
      { key: "tingkat", label: "Tingkat" },
      { key: "wali_kelas", label: "Guru Wali" },
      { key: "jumlah_siswa", label: "Jumlah Siswa" }
    ]
  },
  {
    dir: "app/(admin)/admin/rombel/sd",
    entity: "RombelSd",
    title: "Jenjang SD",
    category: "Rombel",
    description: "Pengelolaan rombongan belajar jenjang Sekolah Dasar (SD) se-Kabupaten Konawe Selatan.",
    endpoint: "/api/v1/admin/rombel/sd",
    queryKey: "rombel-sd",
    icon: "🎒",
    fields: [
      { name: "sekolah", label: "Nama Satuan Pendidikan SD", type: "text", required: true, placeholder: "Contoh: SDN 2 Buke" },
      { name: "nama_rombel", label: "Nama Rombel", type: "text", required: true, placeholder: "Contoh: Kelas 4 Amanah" },
      { name: "tingkat", label: "Tingkat Kelas", type: "text", required: true, placeholder: "Contoh: Kelas 4" },
      { name: "kurikulum", label: "Kurikulum", type: "text", required: false, placeholder: "Contoh: Kurikulum Merdeka" },
      { name: "wali_kelas", label: "Guru Kelas / Wali", type: "text", required: false, placeholder: "Contoh: Ahmad Fauzi, S.Pd" },
      { name: "jumlah_siswa", label: "Jumlah Peserta Didik", type: "number", required: true, placeholder: "Contoh: 28" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "nama_rombel", label: "Nama Rombel" },
      { key: "tingkat", label: "Tingkat" },
      { key: "wali_kelas", label: "Guru Kelas" },
      { key: "jumlah_siswa", label: "Jumlah Siswa" }
    ]
  },
  {
    dir: "app/(admin)/admin/rombel/smp",
    entity: "RombelSmp",
    title: "Jenjang SMP",
    category: "Rombel",
    description: "Pengelolaan rombongan belajar jenjang Sekolah Menengah Pertama (SMP).",
    endpoint: "/api/v1/admin/rombel/smp",
    queryKey: "rombel-smp",
    icon: "🏫",
    fields: [
      { name: "sekolah", label: "Nama SMP", type: "text", required: true, placeholder: "Contoh: SMPN 1 Ranomeeto" },
      { name: "nama_rombel", label: "Nama Rombel", type: "text", required: true, placeholder: "Contoh: Kelas VII-A" },
      { name: "tingkat", label: "Tingkat Kelas", type: "text", required: true, placeholder: "Contoh: Kelas VII" },
      { name: "kurikulum", label: "Kurikulum", type: "text", required: false, placeholder: "Contoh: Kurikulum Merdeka" },
      { name: "wali_kelas", label: "Wali Kelas", type: "text", required: false, placeholder: "Contoh: Sitti Rahma, M.Pd" },
      { name: "jumlah_siswa", label: "Jumlah Siswa", type: "number", required: true, placeholder: "Contoh: 32" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "nama_rombel", label: "Nama Rombel" },
      { key: "tingkat", label: "Tingkat" },
      { key: "wali_kelas", label: "Wali Kelas" },
      { key: "jumlah_siswa", label: "Jumlah Siswa" }
    ]
  },

  // 4. Usulan Sekolah
  {
    dir: "app/(admin)/admin/usulan/tunjangan-guru",
    entity: "UsulanTunjanganGuru",
    title: "Usulan Tunjangan Guru",
    category: "Usulan Sekolah",
    description: "Pengajuan dan rekap usulan tunjangan profesi, khusus, dan tamsil guru.",
    endpoint: "/api/v1/admin/usulan/tunjangan-guru",
    queryKey: "usulan-tunjangan-guru",
    icon: "💰",
    fields: [
      { name: "nama_guru", label: "Nama Lengkap Guru", type: "text", required: true, placeholder: "Contoh: Rahmawati, S.Pd., Gr." },
      { name: "nuptk", label: "NUPTK", type: "text", required: true, placeholder: "Contoh: 1234567890123456" },
      { name: "sekolah", label: "Satuan Pendidikan Induk", type: "text", required: true, placeholder: "Contoh: SMPN 4 Konsel" },
      { name: "jenis_tunjangan", label: "Jenis Tunjangan", type: "text", required: true, placeholder: "Contoh: TPG (Profesi) / Tunjangan Khusus 3T" },
      { name: "tahun", label: "Tahun Anggaran", type: "number", required: true, placeholder: "Contoh: 2026" },
      { name: "semester", label: "Semester", type: "text", required: false, placeholder: "Contoh: Semester Ganjil / Genap" },
      { name: "status", label: "Status Usulan", type: "text", required: false, placeholder: "Contoh: Diajukan / Terverifikasi" },
      { name: "file", label: "Berkas Pendukung (PDF)", type: "file", required: false, placeholder: "Unggah berkas Info GTK / SKTP" }
    ],
    tableCols: [
      { key: "nama_guru", label: "Nama Guru" },
      { key: "nuptk", label: "NUPTK" },
      { key: "sekolah", label: "Sekolah" },
      { key: "jenis_tunjangan", label: "Jenis Tunjangan" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/usulan/pip/data-pendukung",
    entity: "PipDataPendukung",
    title: "Data Pendukung",
    category: "Usulan Sekolah",
    description: "Arsip berkas SKTM, DTKS, dan dokumen pendukung usulan Program Indonesia Pintar.",
    endpoint: "/api/v1/admin/usulan/pip/data-pendukung",
    queryKey: "usulan-pip-data-pendukung",
    icon: "📁",
    fields: [
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SDN 3 Konda" },
      { name: "nama_siswa", label: "Nama Siswa", type: "text", required: true, placeholder: "Contoh: Muhammad Rezki" },
      { name: "nisn", label: "NISN", type: "text", required: true, placeholder: "Contoh: 0098765432" },
      { name: "dokumen", label: "Nama / Jenis Dokumen", type: "text", required: true, placeholder: "Contoh: Kartu KIP / SKTM Desa" },
      { name: "file", label: "Berkas Scan (PDF / Image)", type: "file", required: false, placeholder: "Unggah scan berkas dokumen" },
      { name: "keterangan", label: "Keterangan", type: "textarea", required: false, placeholder: "Keterangan tambahan kelayakan..." }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "nama_siswa", label: "Nama Siswa" },
      { key: "nisn", label: "NISN" },
      { key: "dokumen", label: "Dokumen" },
      { key: "file", label: "Berkas" }
    ]
  },
  {
    dir: "app/(admin)/admin/usulan/pip/data-penerima",
    entity: "PipDataPenerima",
    title: "Data Penerima",
    category: "Usulan Sekolah",
    description: "Daftar penerima alokasi dana bantuan Program Indonesia Pintar (PIP).",
    endpoint: "/api/v1/admin/usulan/pip/data-penerima",
    queryKey: "usulan-pip-data-penerima",
    icon: "👥",
    fields: [
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SMPN 5 Konsel" },
      { name: "nama_siswa", label: "Nama Siswa Penerima", type: "text", required: true, placeholder: "Contoh: Dewi Lestari" },
      { name: "nisn", label: "NISN", type: "text", required: true, placeholder: "Contoh: 0081234567" },
      { name: "tahun", label: "Tahun Penyaluran", type: "number", required: true, placeholder: "Contoh: 2026" },
      { name: "tahap", label: "Tahap Penyaluran", type: "text", required: true, placeholder: "Contoh: Tahap 1 / Tahap 2" },
      { name: "nominal", label: "Nominal Bantuan (Rp)", type: "number", required: true, placeholder: "Contoh: 750000" },
      { name: "status_penyaluran", label: "Status Penyaluran", type: "text", required: true, placeholder: "Contoh: Sudah Dicairkan / Siap Aktivasi" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "nama_siswa", label: "Nama Siswa" },
      { key: "nisn", label: "NISN" },
      { key: "nominal", label: "Nominal (Rp)" },
      { key: "status_penyaluran", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/usulan/assessment",
    entity: "UsulanAssessment",
    title: "Usulan Data Assessment",
    category: "Usulan Sekolah",
    description: "Pendataan kesiapan dan usulan Asesmen Nasional Berbasis Komputer (ANBK) satuan pendidikan.",
    endpoint: "/api/v1/admin/usulan/assessment",
    queryKey: "usulan-assessment",
    icon: "📊",
    fields: [
      { name: "sekolah", label: "Nama Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SDN 8 Moramo" },
      { name: "tahun", label: "Tahun Pelaksanaan", type: "number", required: true, placeholder: "Contoh: 2026" },
      { name: "jenis_asesmen", label: "Moda & Jenis Asesmen", type: "text", required: true, placeholder: "Contoh: ANBK Mandiri Online / Menumpang" },
      { name: "jumlah_peserta", label: "Jumlah Peserta Didik", type: "number", required: true, placeholder: "Contoh: 30" },
      { name: "status", label: "Status Kesiapan", type: "text", required: false, placeholder: "Contoh: Siap Mandiri / Perlu Tambahan Server" },
      { name: "dokumen", label: "Berkas SPTJM / Berita Acara", type: "file", required: false, placeholder: "Unggah berkas kesiapan (PDF)" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "tahun", label: "Tahun" },
      { key: "jenis_asesmen", label: "Moda Asesmen" },
      { key: "jumlah_peserta", label: "Peserta" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/usulan/rekonsiliasi-bosp",
    entity: "UsulanRekonsiliasiBosp",
    title: "Usulan Rekonsiliasi Dana BOSP",
    category: "Usulan Sekolah",
    description: "Pengajuan berkas LPJ / SPJ dana BOSP reguler dan kinerja satuan pendidikan.",
    endpoint: "/api/v1/admin/usulan/rekonsiliasi-bosp",
    queryKey: "usulan-rekonsiliasi-bosp",
    icon: "🧾",
    fields: [
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SDN 1 Kolono" },
      { name: "tahap", label: "Tahap BOSP", type: "text", required: true, placeholder: "Contoh: Tahap 1 / Tahap 2" },
      { name: "tahun", label: "Tahun Anggaran", type: "number", required: true, placeholder: "Contoh: 2026" },
      { name: "nominal_dana", label: "Nominal Usulan LPJ (Rp)", type: "number", required: true, placeholder: "Contoh: 85000000" },
      { name: "kategori_spj", label: "Kategori Berkas SPJ", type: "text", required: false, placeholder: "Contoh: BKU, Buku Bank, Pajak, SPTJM" },
      { name: "file_bku", label: "Berkas BKU (PDF)", type: "file", required: false, placeholder: "Unggah scan BKU bertanda tangan" },
      { name: "file_rekening", label: "Rekening Koran BOSP", type: "file", required: false, placeholder: "Unggah rekening koran bank" },
      { name: "file_sptjm", label: "Berkas SPTJM Bermaterai", type: "file", required: false, placeholder: "Unggah SPTJM bermaterai" },
      { name: "status", label: "Status Verifikasi", type: "text", required: false, placeholder: "Contoh: Menunggu Verifikasi" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "tahap", label: "Tahap" },
      { key: "tahun", label: "Tahun" },
      { key: "nominal_dana", label: "Nominal LPJ" },
      { key: "status", label: "Status" }
    ]
  },

  // 5. Kegiatan
  {
    dir: "app/(admin)/admin/kegiatan-sekolah",
    entity: "KegiatanSekolah",
    title: "Kegiatan Sekolah",
    category: "Kegiatan Sekolah",
    description: "Agenda, pameran karya, dan aktivitas akademik maupun ekstrakurikuler sekolah.",
    endpoint: "/api/v1/admin/kegiatan-sekolah",
    queryKey: "kegiatan-sekolah",
    icon: "🎯",
    fields: [
      { name: "judul", label: "Judul Kegiatan", type: "text", required: true, placeholder: "Contoh: Gelar Karya P5 Kearifan Lokal" },
      { name: "deskripsi", label: "Uraian Pelaksanaan", type: "textarea", required: true, placeholder: "Deskripsi jalannya aktivitas kegiatan..." },
      { name: "tanggal", label: "Tanggal Kegiatan", type: "date", required: true, placeholder: "YYYY-MM-DD" },
      { name: "tahun", label: "Tahun", type: "number", required: false, placeholder: "Contoh: 2026" },
      { name: "file", label: "Dokumentasi Foto / Laporan", type: "file", required: false, placeholder: "Unggah berkas foto atau dokumen (PDF)" },
      { name: "link", label: "Tautan YouTube / Berita", type: "text", required: false, placeholder: "https://youtube.com/..." }
    ],
    tableCols: [
      { key: "judul", label: "Judul Kegiatan" },
      { key: "tanggal", label: "Tanggal" },
      { key: "tahun", label: "Tahun" },
      { key: "link", label: "Tautan" }
    ]
  },
  {
    dir: "app/(admin)/admin/komunitas-belajar",
    entity: "KomunitasBelajar",
    title: "Komunitas Belajar",
    category: "Komunitas Belajar",
    description: "Pendataan Komunitas Belajar (Kombel) dalam sekolah maupun antarsekolah di PMM.",
    endpoint: "/api/v1/admin/komunitas-belajar",
    queryKey: "komunitas-belajar",
    icon: "🤝",
    fields: [
      { name: "nama_kombel", label: "Nama Komunitas Belajar", type: "text", required: true, placeholder: "Contoh: Kombel Berbagi Praktik Baik Konsel" },
      { name: "ketua", label: "Ketua / Penggerak Kombel", type: "text", required: true, placeholder: "Contoh: Drs. Wahyudin, M.Pd" },
      { name: "jenjang", label: "Jenjang / Lingkup", type: "text", required: false, placeholder: "Contoh: SD / SMP / Antar Sekolah" },
      { name: "jumlah_anggota", label: "Jumlah Anggota Guru", type: "number", required: true, placeholder: "Contoh: 35" },
      { name: "kegiatan_utama", label: "Fokus & Kegiatan Utama", type: "textarea", required: false, placeholder: "Uraian topik diskusi dan praktik baik..." },
      { name: "file_sk", label: "Berkas SK Komunitas Belajar (PDF)", type: "file", required: false, placeholder: "Unggah SK pengesahan kombel" }
    ],
    tableCols: [
      { key: "nama_kombel", label: "Nama Komunitas" },
      { key: "ketua", label: "Penggerak" },
      { key: "jenjang", label: "Jenjang" },
      { key: "jumlah_anggota", label: "Anggota" }
    ]
  },
  {
    dir: "app/(admin)/admin/piagam-sertifikat",
    entity: "PiagamSertifikat",
    title: "Piagam Sertifikat",
    category: "Piagam Sertifikat",
    description: "Pencatatan dan arsip digital piagam penghargaan, bimtek, pelatihan, dan sertifikat kompetensi.",
    endpoint: "/api/v1/admin/piagam-sertifikat",
    queryKey: "piagam-sertifikat",
    icon: "🏆",
    fields: [
      { name: "kegiatan", label: "Nama Pelatihan / Bimtek / Lomba", type: "text", required: true, placeholder: "Contoh: Bimtek Kurikulum Merdeka Berkelanjutan" },
      { name: "penyelenggara", label: "Lembaga / Instansi Penyelenggara", type: "text", required: true, placeholder: "Contoh: Balai Guru Penggerak Sultra" },
      { name: "tahun", label: "Tahun Perolehan", type: "number", required: true, placeholder: "Contoh: 2026" },
      { name: "tempat_pelaksana", label: "Lokasi Pelaksanaan", type: "text", required: false, placeholder: "Contoh: Hotel Claro Kendari" },
      { name: "sebagai", label: "Peran / Predikat", type: "text", required: true, placeholder: "Contoh: Peserta / Narasumber / Juara 1" },
      { name: "file", label: "Berkas Digital Sertifikat (PDF)", type: "file", required: false, placeholder: "Unggah dokumen PDF sertifikat" }
    ],
    tableCols: [
      { key: "kegiatan", label: "Nama Kegiatan" },
      { key: "penyelenggara", label: "Penyelenggara" },
      { key: "tahun", label: "Tahun" },
      { key: "sebagai", label: "Peran" },
      { key: "file", label: "Berkas" }
    ]
  },

  // 6. Gallery
  {
    dir: "app/(admin)/admin/gallery/sekolah-penggerak",
    entity: "GallerySekolahPenggerak",
    title: "Sekolah Penggerak",
    category: "Gallery",
    description: "Galeri dokumentasi program Sekolah Penggerak jenjang PAUD, SD, dan SMP.",
    endpoint: "/api/v1/admin/gallery/sekolah-penggerak",
    queryKey: "gallery-sekolah-penggerak",
    icon: "🚀",
    fields: [
      { name: "judul", label: "Judul Dokumentasi", type: "text", required: true, placeholder: "Contoh: Lokakarya Komite Pembelajaran Sekolah Penggerak" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea", required: true, placeholder: "Uraian kegiatan sekolah penggerak..." },
      { name: "angkatan", label: "Angkatan Program", type: "text", required: false, placeholder: "Contoh: Angkatan 1 / 2 / 3" },
      { name: "file", label: "Foto Dokumentasi", type: "file", required: false, placeholder: "Unggah berkas foto kegiatan" },
      { name: "link", label: "Tautan Video YouTube", type: "text", required: false, placeholder: "https://youtube.com/..." }
    ],
    tableCols: [
      { key: "judul", label: "Judul" },
      { key: "angkatan", label: "Angkatan" },
      { key: "deskripsi", label: "Deskripsi" },
      { key: "link", label: "Tautan" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/guru-penggerak",
    entity: "GalleryGuruPenggerak",
    title: "Gallery Program Guru Penggerak",
    category: "Gallery",
    description: "Dokumentasi aksi nyata dan lokakarya calon Guru Penggerak Konawe Selatan.",
    endpoint: "/api/v1/admin/gallery/guru-penggerak",
    queryKey: "gallery-guru-penggerak",
    icon: "🌟",
    fields: [
      { name: "judul", label: "Judul Aksi Nyata / Kegiatan", type: "text", required: true, placeholder: "Contoh: Panen Hasil Belajar Lokakarya 7" },
      { name: "nama_guru", label: "Nama Calon / Guru Penggerak", type: "text", required: true, placeholder: "Contoh: Dewi Sartika, S.Pd" },
      { name: "sekolah", label: "Satuan Pendidikan Asal", type: "text", required: true, placeholder: "Contoh: SDN 4 Moramo" },
      { name: "angkatan", label: "Angkatan PGP", type: "text", required: false, placeholder: "Contoh: Angkatan 10" },
      { name: "deskripsi", label: "Uraian Aksi", type: "textarea", required: false, placeholder: "Uraian aksi kepemimpinan murid..." },
      { name: "file", label: "Foto Dokumentasi", type: "file", required: false, placeholder: "Unggah dokumentasi foto" },
      { name: "link", label: "Tautan YouTube", type: "text", required: false, placeholder: "https://youtube.com/..." }
    ],
    tableCols: [
      { key: "judul", label: "Judul" },
      { key: "nama_guru", label: "Nama Guru" },
      { key: "sekolah", label: "Sekolah" },
      { key: "angkatan", label: "Angkatan" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/organisasi-penggerak",
    entity: "GalleryOrganisasiPenggerak",
    title: "Gallery Program Organisasi Penggerak",
    category: "Gallery",
    description: "Dokumentasi kolaborasi program Ormas/NGO mitra Kemendikbud di Konsel.",
    endpoint: "/api/v1/admin/gallery/organisasi-penggerak",
    queryKey: "gallery-organisasi-penggerak",
    icon: "🏛️",
    fields: [
      { name: "judul", label: "Nama Kegiatan Kemitraan", type: "text", required: true, placeholder: "Contoh: Pelatihan Literasi Numerasi Kelas Awal" },
      { name: "nama_organisasi", label: "Nama Organisasi Penggerak", type: "text", required: true, placeholder: "Contoh: Yayasan Literasi Anak Nusantara" },
      { name: "kegiatan", label: "Fokus Kegiatan", type: "text", required: false, placeholder: "Contoh: Peningkatan Kemampuan Membaca Dasar" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea", required: false, placeholder: "Uraian kegiatan kemitraan..." },
      { name: "file", label: "Foto Dokumentasi", type: "file", required: false, placeholder: "Unggah foto dokumentasi" },
      { name: "link", label: "Tautan YouTube", type: "text", required: false, placeholder: "https://youtube.com/..." }
    ],
    tableCols: [
      { key: "judul", label: "Judul" },
      { key: "nama_organisasi", label: "Organisasi" },
      { key: "kegiatan", label: "Fokus Kegiatan" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/kegiatan-kepala-sekolah",
    entity: "GalleryKegiatanKepalaSekolah",
    title: "Gallery Kegiatan Kepala Sekolah",
    category: "Gallery",
    description: "Dokumentasi program kerja, supervisi klinis, dan inovasi manajerial Kepala Sekolah.",
    endpoint: "/api/v1/admin/gallery/kegiatan-kepala-sekolah",
    queryKey: "gallery-kegiatan-kepala-sekolah",
    icon: "👔",
    fields: [
      { name: "judul", label: "Nama Kegiatan / Aksi Nyata", type: "text", required: true, placeholder: "Contoh: Bimtek Pemanfaatan Platform Rapor Pendidikan" },
      { name: "tujuan", label: "Tujuan Kegiatan", type: "textarea", required: true, placeholder: "Tujuan pelaksanaan kegiatan manajerial..." },
      { name: "proses", label: "Tahapan / Proses", type: "textarea", required: false, placeholder: "Uraian proses dan keterlibatan guru..." },
      { name: "hasil", label: "Hasil / Capaian Positif", type: "textarea", required: false, placeholder: "Output yang berhasil dicapai..." },
      { name: "file", label: "Foto Dokumentasi", type: "file", required: false, placeholder: "Unggah foto kegiatan" },
      { name: "link", label: "Tautan YouTube", type: "text", required: false, placeholder: "https://youtube.com/..." }
    ],
    tableCols: [
      { key: "judul", label: "Nama Kegiatan" },
      { key: "tujuan", label: "Tujuan" },
      { key: "hasil", label: "Hasil Capaian" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/kegiatan-kkg-sd",
    entity: "GalleryKegiatanKkgSd",
    title: "Gallery Kegiatan KKG SD",
    category: "Gallery",
    description: "Dokumentasi aktivitas Kelompok Kerja Guru (KKG) jenjang Sekolah Dasar se-Konsel.",
    endpoint: "/api/v1/admin/gallery/kegiatan-kkg-sd",
    queryKey: "gallery-kegiatan-kkg-sd",
    icon: "🎨",
    fields: [
      { name: "judul", label: "Nama Kegiatan KKG", type: "text", required: true, placeholder: "Contoh: Penyusunan Modul Ajar Berdiferensiasi" },
      { name: "gugus", label: "Gugus / Wilayah KKG", type: "text", required: true, placeholder: "Contoh: Gugus 2 Ranomeeto" },
      { name: "materi", label: "Materi / Topik Pelatihan", type: "text", required: false, placeholder: "Contoh: Asesmen Diagnostik Awal" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea", required: false, placeholder: "Uraian jalannya pertemuan KKG..." },
      { name: "file", label: "Foto Dokumentasi", type: "file", required: false, placeholder: "Unggah foto kegiatan KKG" },
      { name: "link", label: "Tautan YouTube", type: "text", required: false, placeholder: "https://youtube.com/..." }
    ],
    tableCols: [
      { key: "judul", label: "Nama Kegiatan" },
      { key: "gugus", label: "Gugus KKG" },
      { key: "materi", label: "Materi" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/kegiatan-guru-mgmp",
    entity: "GalleryKegiatanGuruMgmp",
    title: "Gallery Kegiatan Guru MGMP",
    category: "Gallery",
    description: "Dokumentasi Musyawarah Guru Mata Pelajaran (MGMP) jenjang SMP se-Konawe Selatan.",
    endpoint: "/api/v1/admin/gallery/kegiatan-guru-mgmp",
    queryKey: "gallery-kegiatan-guru-mgmp",
    icon: "🔬",
    fields: [
      { name: "judul", label: "Nama Kegiatan MGMP", type: "text", required: true, placeholder: "Contoh: Pembuatan Media Interaktif IPA SMP" },
      { name: "mata_pelajaran", label: "Mata Pelajaran MGMP", type: "text", required: true, placeholder: "Contoh: IPA / Matematika / Bahasa Inggris" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea", required: false, placeholder: "Uraian workshop atau diskusi materi ajar..." },
      { name: "file", label: "Foto Dokumentasi", type: "file", required: false, placeholder: "Unggah foto kegiatan MGMP" },
      { name: "link", label: "Tautan YouTube", type: "text", required: false, placeholder: "https://youtube.com/..." }
    ],
    tableCols: [
      { key: "judul", label: "Nama Kegiatan" },
      { key: "mata_pelajaran", label: "Mata Pelajaran" },
      { key: "deskripsi", label: "Deskripsi" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/kegiatan-tk-paud",
    entity: "GalleryKegiatanTkPaud",
    title: "Gallery Kegiatan TK & PAUD",
    category: "Gallery",
    description: "Dokumentasi kreativitas, transisi PAUD ke SD menyenangkan, dan parenting.",
    endpoint: "/api/v1/admin/gallery/kegiatan-tk-paud",
    queryKey: "gallery-kegiatan-tk-paud",
    icon: "🎈",
    fields: [
      { name: "judul", label: "Nama Acara / Kegiatan", type: "text", required: true, placeholder: "Contoh: Festival Gerak dan Lagu Anak Usia Dini" },
      { name: "sekolah", label: "Satuan PAUD / PKG", type: "text", required: true, placeholder: "Contoh: PKG Kecamatan Andoolo" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea", required: false, placeholder: "Uraian keceriaan kegiatan anak didik..." },
      { name: "file", label: "Foto Dokumentasi", type: "file", required: false, placeholder: "Unggah foto kegiatan TK/PAUD" },
      { name: "link", label: "Tautan YouTube", type: "text", required: false, placeholder: "https://youtube.com/..." }
    ],
    tableCols: [
      { key: "judul", label: "Nama Kegiatan" },
      { key: "sekolah", label: "Satuan PAUD" },
      { key: "deskripsi", label: "Deskripsi" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/kegiatan-pengawas",
    entity: "GalleryKegiatanPengawas",
    title: "Gallery Kegiatan Pengawas Satdik",
    category: "Gallery",
    description: "Dokumentasi pendampingan sekolah, monitoring, dan evaluasi pengawas satuan pendidikan.",
    endpoint: "/api/v1/admin/gallery/kegiatan-pengawas",
    queryKey: "gallery-kegiatan-pengawas",
    icon: "📋",
    fields: [
      { name: "judul", label: "Nama Kegiatan Pendampingan", type: "text", required: true, placeholder: "Contoh: Supervisi Keterlaksanaan Kurikulum Merdeka" },
      { name: "nama_pengawas", label: "Nama Pengawas Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: Drs. H. Sukirman, M.Si" },
      { name: "wilayah_binaan", label: "Wilayah / Rayon Binaan", type: "text", required: false, placeholder: "Contoh: Rayon 3 Konda - Ranomeeto" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea", required: false, placeholder: "Uraian catatan pembinaan..." },
      { name: "file", label: "Foto Dokumentasi", type: "file", required: false, placeholder: "Unggah foto supervisi sekolah" },
      { name: "link", label: "Tautan YouTube", type: "text", required: false, placeholder: "https://youtube.com/..." }
    ],
    tableCols: [
      { key: "judul", label: "Nama Kegiatan" },
      { key: "nama_pengawas", label: "Pengawas" },
      { key: "wilayah_binaan", label: "Wilayah Binaan" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/video-testimoni",
    entity: "GalleryVideoTestimoni",
    title: "Video Testimoni",
    category: "Gallery",
    description: "Koleksi video testimoni guru, siswa, orang tua, dan tokoh masyarakat Konawe Selatan.",
    endpoint: "/api/v1/admin/gallery/video-testimoni",
    queryKey: "gallery-video-testimoni",
    icon: "🎬",
    fields: [
      { name: "judul", label: "Judul Video Testimoni", type: "text", required: true, placeholder: "Contoh: Dampak Positif Bantuan Chromebook Bagi Siswa Pelosok" },
      { name: "narasumber", label: "Nama Narasumber", type: "text", required: true, placeholder: "Contoh: Aisyah Putri (Siswa Berprestasi)" },
      { name: "peran", label: "Status / Peran", type: "text", required: true, placeholder: "Contoh: Siswa SMPN 1 Kolono / Orang Tua Wali" },
      { name: "link_video", label: "Tautan Video (YouTube / Drive)", type: "text", required: true, placeholder: "https://youtube.com/watch?v=..." },
      { name: "keterangan", label: "Kutipan / Ringkasan Testimoni", type: "textarea", required: false, placeholder: "Kutipan kalimat kunci narasumber..." }
    ],
    tableCols: [
      { key: "judul", label: "Judul" },
      { key: "narasumber", label: "Narasumber" },
      { key: "peran", label: "Peran" },
      { key: "link_video", label: "Link Video" }
    ]
  },

  // 7. Verifikasi
  {
    dir: "app/(admin)/admin/verifikasi/tunjangan-guru",
    entity: "VerifikasiTunjanganGuru",
    title: "Verifikasi Tunjangan Guru",
    category: "Verifikasi",
    description: "Pemeriksaan berkas kelayakan jam mengajar, keaktifan dapodik, dan SKTP guru.",
    endpoint: "/api/v1/admin/verifikasi/tunjangan-guru",
    queryKey: "verifikasi-tunjangan-guru",
    icon: "💰",
    fields: [
      { name: "nama_guru", label: "Nama Lengkap Guru", type: "text", required: true, placeholder: "Contoh: Sunardi, S.Pd" },
      { name: "nuptk", label: "NUPTK", type: "text", required: true, placeholder: "Contoh: 8765432109876543" },
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SMPN 3 Ranomeeto" },
      { name: "jenis_tunjangan", label: "Jenis Tunjangan", type: "text", required: true, placeholder: "Contoh: TPG / Tunjangan Daerah Khusus" },
      { name: "status_verifikasi", label: "Status Verifikasi", type: "text", required: true, placeholder: "Contoh: Disetujui / Perlu Perbaikan Berkas / Ditolak" },
      { name: "catatan", label: "Catatan Verifikator", type: "textarea", required: false, placeholder: "Catatan hasil verifikasi berkas..." }
    ],
    tableCols: [
      { key: "nama_guru", label: "Nama Guru" },
      { key: "nuptk", label: "NUPTK" },
      { key: "sekolah", label: "Sekolah" },
      { key: "jenis_tunjangan", label: "Tunjangan" },
      { key: "status_verifikasi", label: "Status Verifikasi" }
    ]
  },
  {
    dir: "app/(admin)/admin/verifikasi/rekonsiliasi-bosp",
    entity: "VerifikasiRekonsiliasiBosp",
    title: "Verifikasi Usulan Rekonsiliasi Dana BOSP",
    category: "Verifikasi",
    description: "Validasi kepatuhan pembukuan, faktur belanja, dan setoran pajak dana BOSP sekolah.",
    endpoint: "/api/v1/admin/verifikasi/rekonsiliasi-bosp",
    queryKey: "verifikasi-rekonsiliasi-bosp",
    icon: "📑",
    fields: [
      { name: "sekolah", label: "Nama Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SDN 1 Ranomeeto" },
      { name: "tahap", label: "Tahap BOSP", type: "text", required: true, placeholder: "Contoh: Tahap 1 / Tahap 2" },
      { name: "tahun", label: "Tahun Anggaran", type: "number", required: true, placeholder: "Contoh: 2026" },
      { name: "nominal_disetujui", label: "Nominal Disetujui (Rp)", type: "number", required: true, placeholder: "Contoh: 95000000" },
      { name: "status_verifikasi", label: "Status Rekonsiliasi", type: "text", required: true, placeholder: "Contoh: Rekonsiliasi Selesai / Siap BA / Belum Lengkap" },
      { name: "catatan_verifikator", label: "Catatan Tim Verifikasi BOSP", type: "textarea", required: false, placeholder: "Catatan kesesuaian berkas pajak dan BKU..." }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "tahap", label: "Tahap" },
      { key: "tahun", label: "Tahun" },
      { key: "nominal_disetujui", label: "Nominal Disetujui" },
      { key: "status_verifikasi", label: "Status" }
    ]
  },

  // 8. Regulasi GTK
  {
    dir: "app/(admin)/admin/regulasi-gtk/pengumuman",
    entity: "RegulasiPengumuman",
    title: "Pengumuman GTK",
    category: "Regulasi dan Info GTK",
    description: "Pengumuman resmi seleksi PPG, uji kompetensi, dan pembagian sertifikat pendidik.",
    endpoint: "/api/v1/admin/regulasi-gtk/pengumuman",
    queryKey: "regulasi-gtk-pengumuman",
    icon: "📣",
    fields: [
      { name: "judul", label: "Judul Pengumuman", type: "text", required: true, placeholder: "Contoh: Jadwal Uji Kompetensi Kenaikan Jabatan Fungsional Guru" },
      { name: "isi", label: "Isi Ringkasan Pengumuman", type: "textarea", required: true, placeholder: "Uraian isi pengumuman GTK..." },
      { name: "tanggal", label: "Tanggal Diterbitkan", type: "date", required: true, placeholder: "YYYY-MM-DD" },
      { name: "target", label: "Sasaran Guru / Tendik", type: "text", required: false, placeholder: "Contoh: Guru Jenjang SD dan SMP se-Konsel" },
      { name: "file", label: "Berkas Lampiran PDF", type: "file", required: false, placeholder: "Unggah dokumen surat edaran (PDF)" }
    ],
    tableCols: [
      { key: "judul", label: "Judul Pengumuman" },
      { key: "tanggal", label: "Tanggal" },
      { key: "target", label: "Sasaran" },
      { key: "file", label: "Berkas" }
    ]
  },
  {
    dir: "app/(admin)/admin/regulasi-gtk/modul-materi",
    entity: "RegulasiModulMateri",
    title: "Modul dan Materi Pelatihan",
    category: "Regulasi dan Info GTK",
    description: "Repositori bahan ajar, modul pelatihan bimtek, dan instrumen Kurikulum Merdeka.",
    endpoint: "/api/v1/admin/regulasi-gtk/modul-materi",
    queryKey: "regulasi-gtk-modul-materi",
    icon: "📖",
    fields: [
      { name: "judul", label: "Judul Modul / Bahan Ajar", type: "text", required: true, placeholder: "Contoh: Panduan Asesmen dan Pembelajaran KSP Konsel" },
      { name: "tema", label: "Tema / Bidang Studi", type: "text", required: true, placeholder: "Contoh: Kurikulum Merdeka / Literasi Numerasi" },
      { name: "penyusun", label: "Penyusun / Tim Pengembang", type: "text", required: false, placeholder: "Contoh: Tim Pengembang Kurikulum Dikbud Konsel" },
      { name: "tahun", label: "Tahun Terbit", type: "number", required: false, placeholder: "Contoh: 2026" },
      { name: "file", label: "Berkas Modul PDF", type: "file", required: false, placeholder: "Unggah berkas modul digital (PDF)" },
      { name: "link", label: "Tautan Sumber Drive", type: "text", required: false, placeholder: "https://drive.google.com/..." }
    ],
    tableCols: [
      { key: "judul", label: "Judul Modul" },
      { key: "tema", label: "Tema" },
      { key: "penyusun", label: "Penyusun" },
      { key: "file", label: "Berkas" }
    ]
  },
  {
    dir: "app/(admin)/admin/regulasi-gtk/regulasi",
    entity: "RegulasiGtk",
    title: "Regulasi",
    category: "Regulasi dan Info GTK",
    description: "Dokumen hukum Perbup, Permendikbudristek, dan Keputusan Kepala Dinas.",
    endpoint: "/api/v1/admin/regulasi-gtk/regulasi",
    queryKey: "regulasi-gtk-regulasi",
    icon: "⚖️",
    fields: [
      { name: "nomor_regulasi", label: "Nomor & Tahun Regulasi", type: "text", required: true, placeholder: "Contoh: Perbup No. 14 Tahun 2026" },
      { name: "tentang", label: "Perihal / Tentang", type: "textarea", required: true, placeholder: "Contoh: Tata Cara Penyaluran Tambahan Penghasilan Guru ASN Daerah" },
      { name: "tahun", label: "Tahun", type: "number", required: true, placeholder: "Contoh: 2026" },
      { name: "jenis", label: "Tingkat Regulasi", type: "text", required: false, placeholder: "Contoh: Peraturan Bupati / Surat Edaran Kadis" },
      { name: "file", label: "Berkas Lembaran Hukum (PDF)", type: "file", required: false, placeholder: "Unggah dokumen PDF regulasi" }
    ],
    tableCols: [
      { key: "nomor_regulasi", label: "Nomor Regulasi" },
      { key: "tentang", label: "Tentang" },
      { key: "tahun", label: "Tahun" },
      { key: "jenis", label: "Tingkat" }
    ]
  },

  // 9. PPDB & Kuota
  {
    dir: "app/(admin)/admin/ppdb/paud",
    entity: "PpdbPaud",
    title: "PPDB PAUD",
    category: "PPDB",
    description: "Pendaftaran peserta didik baru jenjang PAUD dan Taman Kanak-Kanak.",
    endpoint: "/api/v1/admin/ppdb/paud",
    queryKey: "ppdb-paud",
    icon: "🧸",
    fields: [
      { name: "nama_siswa", label: "Nama Calon Murid", type: "text", required: true, placeholder: "Contoh: Muhammad Farhan" },
      { name: "nik", label: "NIK Calon Murid", type: "text", required: true, placeholder: "Contoh: 740501..." },
      { name: "sekolah_tujuan", label: "Satuan PAUD Pilihan", type: "text", required: true, placeholder: "Contoh: TK Negeri Pembina Konsel" },
      { name: "jalur", label: "Jalur Pendaftaran", type: "text", required: true, placeholder: "Contoh: Domisili / Afirmasi" },
      { name: "status", label: "Status Verifikasi", type: "text", required: true, placeholder: "Contoh: Diterima / Diproses" },
      { name: "file_berkas", label: "Berkas Akta / KK (PDF/Gambar)", type: "file", required: false, placeholder: "Unggah dokumen KK dan akta kelahiran" }
    ],
    tableCols: [
      { key: "nama_siswa", label: "Nama Murid" },
      { key: "nik", label: "NIK" },
      { key: "sekolah_tujuan", label: "Sekolah Tujuan" },
      { key: "jalur", label: "Jalur" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/ppdb/sd",
    entity: "PpdbSd",
    title: "PPDB SD",
    category: "PPDB",
    description: "Sistem seleksi dan registrasi peserta didik baru jenjang Sekolah Dasar (SD).",
    endpoint: "/api/v1/admin/ppdb/sd",
    queryKey: "ppdb-sd",
    icon: "🎒",
    fields: [
      { name: "nama_siswa", label: "Nama Calon Siswa", type: "text", required: true, placeholder: "Contoh: Anisa Rahmawati" },
      { name: "nik", label: "NIK", type: "text", required: true, placeholder: "Contoh: 7405..." },
      { name: "nisn", label: "NISN (Jika Ada)", type: "text", required: false, placeholder: "Contoh: 0123456789" },
      { name: "sekolah_tujuan", label: "SD Negeri Pilihan", type: "text", required: true, placeholder: "Contoh: SDN 1 Ranomeeto" },
      { name: "jalur", label: "Jalur Seleksi", type: "text", required: true, placeholder: "Contoh: Zonasi / Afirmasi / Perpindahan Tugas" },
      { name: "status", label: "Status Seleksi", type: "text", required: true, placeholder: "Contoh: Diterima / Menunggu Pengumuman" },
      { name: "file_berkas", label: "Berkas Pendaftaran (PDF)", type: "file", required: false, placeholder: "Unggah berkas KK / Akta" }
    ],
    tableCols: [
      { key: "nama_siswa", label: "Nama Siswa" },
      { key: "nik", label: "NIK" },
      { key: "sekolah_tujuan", label: "Sekolah Tujuan" },
      { key: "jalur", label: "Jalur" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/ppdb/smp",
    entity: "PpdbSmp",
    title: "PPDB SMP",
    category: "PPDB",
    description: "Penerimaan peserta didik baru jenjang Sekolah Menengah Pertama (SMP) 4 jalur.",
    endpoint: "/api/v1/admin/ppdb/smp",
    queryKey: "ppdb-smp",
    icon: "🏫",
    fields: [
      { name: "nama_siswa", label: "Nama Calon Siswa", type: "text", required: true, placeholder: "Contoh: Fadhil Muhammad" },
      { name: "nik", label: "NIK", type: "text", required: true, placeholder: "Contoh: 7405..." },
      { name: "nisn", label: "NISN", type: "text", required: true, placeholder: "Contoh: 0098765432" },
      { name: "asal_sekolah", label: "Asal Satuan Pendidikan SD", type: "text", required: true, placeholder: "Contoh: SDN 2 Buke" },
      { name: "sekolah_tujuan", label: "SMP Pilihan", type: "text", required: true, placeholder: "Contoh: SMPN 1 Ranomeeto" },
      { name: "jalur", label: "Jalur Pendaftaran", type: "text", required: true, placeholder: "Contoh: Zonasi / Prestasi / Afirmasi / Mutasi" },
      { name: "status", label: "Status Seleksi", type: "text", required: true, placeholder: "Contoh: Diterima / Cadangan" },
      { name: "file_berkas", label: "Berkas Rapor & Piagam (PDF)", type: "file", required: false, placeholder: "Unggah gabungan berkas pendaftaran (PDF)" }
    ],
    tableCols: [
      { key: "nama_siswa", label: "Nama Siswa" },
      { key: "nisn", label: "NISN" },
      { key: "asal_sekolah", label: "Asal SD" },
      { key: "sekolah_tujuan", label: "SMP Tujuan" },
      { key: "jalur", label: "Jalur" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/kuota-ppdb",
    entity: "KuotaPpdb",
    title: "Kuota PPDB",
    category: "PPDB",
    description: "Penetapan daya tampung dan alokasi persentase per jalur satuan pendidikan.",
    endpoint: "/api/v1/admin/kuota-ppdb",
    queryKey: "kuota-ppdb",
    icon: "🔢",
    fields: [
      { name: "sekolah", label: "Nama Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SMPN 2 Konsel" },
      { name: "jenjang", label: "Jenjang", type: "text", required: true, placeholder: "Contoh: SMP / SD / PAUD" },
      { name: "total_kuota", label: "Total Daya Tampung (Siswa)", type: "number", required: true, placeholder: "Contoh: 128" },
      { name: "jalur_zonasi", label: "Alokasi Zonasi (Siswa)", type: "number", required: true, placeholder: "Contoh: 64" },
      { name: "jalur_afirmasi", label: "Alokasi Afirmasi (Siswa)", type: "number", required: true, placeholder: "Contoh: 20" },
      { name: "jalur_prestasi", label: "Alokasi Prestasi (Siswa)", type: "number", required: true, placeholder: "Contoh: 38" },
      { name: "jalur_mutasi", label: "Alokasi Mutasi Tugas (Siswa)", type: "number", required: true, placeholder: "Contoh: 6" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "jenjang", label: "Jenjang" },
      { key: "total_kuota", label: "Total Kuota" },
      { key: "jalur_zonasi", label: "Zonasi" },
      { key: "jalur_prestasi", label: "Prestasi" }
    ]
  },

  // 10. Publish
  {
    dir: "app/(admin)/admin/berita",
    entity: "Berita",
    title: "Manajemen Berita",
    category: "Publish",
    description: "Kelola publikasi warta, liputan kegiatan, dan dokumentasi pendidikan & kebudayaan.",
    endpoint: "/api/v1/admin/berita",
    queryKey: "publish-berita",
    icon: "📰",
    fields: [
      { name: "judul", label: "Judul Berita", type: "text", required: true, placeholder: "Judul berita aktual dan informatif..." },
      { name: "slug", label: "Slug URL", type: "text", required: false, placeholder: "judul-berita-anda" },
      { name: "kategori", label: "Kategori Berita", type: "text", required: true, placeholder: "Contoh: Pendidikan / Kebudayaan / Prestasi" },
      { name: "author", label: "Penulis / Redaksi", type: "text", required: false, placeholder: "Contoh: Tim Humas Dikbud" },
      { name: "deskripsi", label: "Ringkasan Singkat (Excerpt)", type: "textarea", required: true, placeholder: "Ringkasan 1-2 kalimat untuk beranda..." },
      { name: "isi", label: "Isi Lengkap Berita", type: "textarea", required: true, placeholder: "Isi naskah berita lengkap..." },
      { name: "foto", label: "Foto Sampul Utama", type: "file", required: false, placeholder: "Unggah foto berita (JPG/PNG)" },
      { name: "status", label: "Status Publikasi", type: "text", required: true, placeholder: "Terbit / Draft" },
      { name: "featured", label: "Berita Utama (Featured)", type: "text", required: false, placeholder: "Ya / Tidak" }
    ],
    tableCols: [
      { key: "judul", label: "Judul Berita" },
      { key: "kategori", label: "Kategori" },
      { key: "author", label: "Penulis" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/pengumuman",
    entity: "Pengumuman",
    title: "Manajemen Pengumuman",
    category: "Publish",
    description: "Publikasi pengumuman dinas kepada guru, kepala sekolah, siswa, dan wali murid.",
    endpoint: "/api/v1/admin/pengumuman",
    queryKey: "publish-pengumuman",
    icon: "📢",
    fields: [
      { name: "judul", label: "Judul Pengumuman", type: "text", required: true, placeholder: "Judul pengumuman dinas..." },
      { name: "slug", label: "Slug URL", type: "text", required: false, placeholder: "judul-pengumuman" },
      { name: "isi", label: "Uraian Isi Pengumuman", type: "textarea", required: true, placeholder: "Detail pengumuman resmi..." },
      { name: "tanggal", label: "Tanggal Diterbitkan", type: "date", required: true, placeholder: "YYYY-MM-DD" },
      { name: "status", label: "Status Publikasi", type: "text", required: true, placeholder: "Terbit / Arsip" },
      { name: "file", label: "Berkas Lampiran PDF", type: "file", required: false, placeholder: "Unggah berkas dokumen pengumuman (PDF)" }
    ],
    tableCols: [
      { key: "judul", label: "Judul Pengumuman" },
      { key: "tanggal", label: "Tanggal" },
      { key: "status", label: "Status" },
      { key: "file", label: "Berkas" }
    ]
  },
  {
    dir: "app/(admin)/admin/pendidikan",
    entity: "PublishPendidikan",
    title: "Informasi & Artikel Pendidikan",
    category: "Publish",
    description: "Katalog konten literasi, kurikulum, dan informasi program pendidikan.",
    endpoint: "/api/v1/admin/pendidikan",
    queryKey: "publish-pendidikan",
    icon: "🎓",
    fields: [
      { name: "judul", label: "Judul Artikel / Informasi", type: "text", required: true, placeholder: "Contoh: Optimalisasi Asesmen Formatif Guru Kelas" },
      { name: "kategori", label: "Kategori Info", type: "text", required: true, placeholder: "Contoh: Kurikulum Merdeka / Literasi / Numerasi" },
      { name: "penulis", label: "Penulis", type: "text", required: false, placeholder: "Contoh: Bidang Pembinaan Dikdas" },
      { name: "konten", label: "Uraian Konten", type: "textarea", required: true, placeholder: "Isi materi atau artikel edukasi..." },
      { name: "file", label: "Foto / Poster Edukasi", type: "file", required: false, placeholder: "Unggah gambar pendukung" },
      { name: "status", label: "Status Publikasi", type: "text", required: true, placeholder: "Terbit / Draft" }
    ],
    tableCols: [
      { key: "judul", label: "Judul" },
      { key: "kategori", label: "Kategori" },
      { key: "penulis", label: "Penulis" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/kebudayaan",
    entity: "PublishKebudayaan",
    title: "Warisan & Seni Kebudayaan",
    category: "Publish",
    description: "Data cagar budaya, warisan takbenda, sanggar seni, dan kalender agenda budaya daerah.",
    endpoint: "/api/v1/admin/kebudayaan",
    queryKey: "publish-kebudayaan",
    icon: "🎭",
    fields: [
      { name: "nama", label: "Nama Objek / Warisan Budaya", type: "text", required: true, placeholder: "Contoh: Tarian Lulo Tolaki / Situs Benteng Kuno" },
      { name: "kategori", label: "Klasifikasi Budaya", type: "text", required: true, placeholder: "Contoh: Cagar Budaya / Warisan Takbenda (WBTb) / Sanggar Seni" },
      { name: "lokasi", label: "Lokasi / Kecamatan", type: "text", required: true, placeholder: "Contoh: Kecamatan Andoolo" },
      { name: "deskripsi", label: "Uraian Sejarah & Deskripsi", type: "textarea", required: true, placeholder: "Penjelasan nilai historis dan pelestarian..." },
      { name: "foto", label: "Foto Dokumentasi", type: "file", required: false, placeholder: "Unggah foto cagar budaya / sanggar" },
      { name: "status", label: "Status Registrasi", type: "text", required: true, placeholder: "Terverifikasi / Dalam Kajian" }
    ],
    tableCols: [
      { key: "nama", label: "Nama Objek Budaya" },
      { key: "kategori", label: "Klasifikasi" },
      { key: "lokasi", label: "Lokasi" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/layanan",
    entity: "PublishLayanan",
    title: "Katalog Layanan Publik",
    category: "Publish",
    description: "Standar operasional prosedur (SOP) dan persyaratan pelayanan administrasi dinas.",
    endpoint: "/api/v1/admin/layanan",
    queryKey: "publish-layanan",
    icon: "🏛️",
    fields: [
      { name: "nama_layanan", label: "Nama Layanan", type: "text", required: true, placeholder: "Contoh: Legalisir Ijazah / Mutasi Siswa / Rekomendasi Izin Operasional" },
      { name: "deskripsi", label: "Deskripsi Singkat Layanan", type: "textarea", required: true, placeholder: "Penjelasan umum mengenai layanan..." },
      { name: "syarat", label: "Persyaratan Berkas", type: "textarea", required: true, placeholder: "Daftar syarat kelengkapan dokumen..." },
      { name: "prosedur", label: "Alur & Estimasi Waktu", type: "textarea", required: false, placeholder: "Contoh: 1 Hari Kerja - Tanpa Biaya (Gratis)" },
      { name: "penanggung_jawab", label: "Seksi / Bidang Pelaksana", type: "text", required: false, placeholder: "Contoh: Subbag Umum & Kepegawaian" },
      { name: "status", label: "Status Layanan", type: "text", required: true, placeholder: "Aktif / Pemeliharaan" }
    ],
    tableCols: [
      { key: "nama_layanan", label: "Nama Layanan" },
      { key: "penanggung_jawab", label: "Bidang Pelaksana" },
      { key: "prosedur", label: "Estimasi Waktu" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/statistik",
    entity: "PublishStatistik",
    title: "Data & Indikator Statistik",
    category: "Publish",
    description: "Indikator angka partisipasi murni, rasio murid-guru, dan statistik pendidikan daerah.",
    endpoint: "/api/v1/admin/statistik",
    queryKey: "publish-statistik",
    icon: "📈",
    fields: [
      { name: "indikator", label: "Nama Indikator Statistik", type: "text", required: true, placeholder: "Contoh: Angka Partisipasi Murni (APM) SMP" },
      { name: "nilai", label: "Nilai Capaian", type: "text", required: true, placeholder: "Contoh: 94.85" },
      { name: "satuan", label: "Satuan Pengukuran", type: "text", required: true, placeholder: "Contoh: % / Jiwa / Ruang" },
      { name: "tahun", label: "Tahun Data", type: "number", required: true, placeholder: "Contoh: 2026" },
      { name: "kategori", label: "Kategori Indikator", type: "text", required: false, placeholder: "Contoh: Akses Pendidikan / Kualitas Guru / Sarpras" },
      { name: "keterangan", label: "Keterangan Sumber Data", type: "textarea", required: false, placeholder: "Sumber rujukan data (Dapodik / BPS Konsel)..." }
    ],
    tableCols: [
      { key: "indikator", label: "Indikator" },
      { key: "nilai", label: "Nilai" },
      { key: "satuan", label: "Satuan" },
      { key: "tahun", label: "Tahun" },
      { key: "kategori", label: "Kategori" }
    ]
  },
  {
    dir: "app/(admin)/admin/profil",
    entity: "PublishProfil",
    title: "Profil & Standar Layanan",
    category: "Publish",
    description: "Struktur organisasi, maklumat pelayanan, dan standar integritas Dinas Pendidikan.",
    endpoint: "/api/v1/admin/profil",
    queryKey: "publish-profil",
    icon: "📋",
    fields: [
      { name: "judul", label: "Judul Bagian Profil", type: "text", required: true, placeholder: "Contoh: Maklumat Pelayanan Publik" },
      { name: "kategori", label: "Kategori", type: "text", required: true, placeholder: "Contoh: Maklumat / Struktur Organisasi / Sejarah" },
      { name: "konten", label: "Uraian Lengkap", type: "textarea", required: true, placeholder: "Isi dokumen profil..." },
      { name: "file", label: "Bagan Struktur / Berkas SK (PDF/Gambar)", type: "file", required: false, placeholder: "Unggah dokumen bagan" },
      { name: "urutan", label: "Nomor Urut Tampil", type: "number", required: false, placeholder: "Contoh: 1" }
    ],
    tableCols: [
      { key: "judul", label: "Judul" },
      { key: "kategori", label: "Kategori" },
      { key: "urutan", label: "Urutan" }
    ]
  },
  {
    dir: "app/(admin)/admin/banner",
    entity: "PublishBanner",
    title: "Banner & Slider Beranda",
    category: "Publish",
    description: "Pengaturan slide spanduk utama, tajuk sorotan, dan tautan aksi beranda website.",
    endpoint: "/api/v1/admin/banner",
    queryKey: "publish-banner",
    icon: "🖼️",
    fields: [
      { name: "title", label: "Judul Utama Banner", type: "text", required: true, placeholder: "Contoh: Transformasi Digital Pendidikan Konawe Selatan" },
      { name: "subtitle", label: "Subjudul / Slogan", type: "textarea", required: false, placeholder: "Contoh: Terwujudnya layanan pendidikan berkualitas dan merata bagi seluruh generasi." },
      { name: "badge_text", label: "Label Badge", type: "text", required: false, placeholder: "Contoh: Portal Resmi Dikbud Konsel" },
      { name: "primary_button_label", label: "Label Tombol Utama", type: "text", required: false, placeholder: "Contoh: Jelajahi Layanan" },
      { name: "primary_button_link", label: "Tautan Tombol Utama", type: "text", required: false, placeholder: "Contoh: /layanan-publik" },
      { name: "image", label: "Gambar Latar Banner (1920x1080)", type: "file", required: false, placeholder: "Unggah berkas foto banner" },
      { name: "order", label: "Urutan Slide", type: "number", required: false, placeholder: "Contoh: 1" },
      { name: "status", label: "Status Tampil", type: "text", required: true, placeholder: "Aktif / Nonaktif" }
    ],
    tableCols: [
      { key: "title", label: "Judul Banner" },
      { key: "badge_text", label: "Badge" },
      { key: "order", label: "Urutan" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/kontak",
    entity: "PublishKontak",
    title: "Pesan & Kontak Masuk",
    category: "Publish",
    description: "Pengelolaan aspirasi masyarakat, saran publik, dan pengaduan layanan terpadu.",
    endpoint: "/api/v1/admin/kontak",
    queryKey: "publish-kontak",
    icon: "💬",
    fields: [
      { name: "nama", label: "Nama Pengirim", type: "text", required: true, placeholder: "Contoh: Hendra Kusuma" },
      { name: "email", label: "Alamat Email", type: "text", required: false, placeholder: "Contoh: hendra@gmail.com" },
      { name: "telepon", label: "Nomor WhatsApp / HP", type: "text", required: false, placeholder: "Contoh: 081234567890" },
      { name: "subjek", label: "Subjek Pesan", type: "text", required: true, placeholder: "Contoh: Permohonan Informasi Beasiswa PIP" },
      { name: "pesan", label: "Uraian Isi Pesan", type: "textarea", required: true, placeholder: "Uraian aspirasi atau pengaduan warga..." },
      { name: "status", label: "Status Tindak Lanjut", type: "text", required: true, placeholder: "Baru / Ditindaklanjuti / Selesai" }
    ],
    tableCols: [
      { key: "nama", label: "Pengirim" },
      { key: "email", label: "Email" },
      { key: "subjek", label: "Subjek" },
      { key: "status", label: "Status" }
    ]
  },

  // 11. Jurnal
  {
    dir: "app/(admin)/admin/jurnal/guru-kelas",
    entity: "JurnalGuruKelas",
    title: "Jurnal Guru Kelas",
    category: "Jurnal V2",
    description: "Pencatatan harian aktivitas belajar mengajar, capaian materi, dan refleksi pedagogik guru kelas.",
    endpoint: "/api/v1/admin/jurnal/guru-kelas",
    queryKey: "jurnal-guru-kelas",
    icon: "👨‍🏫",
    fields: [
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SDN 2 Buke" },
      { name: "tema", label: "Tema / Muatan Pelajaran", type: "text", required: true, placeholder: "Contoh: Siklus Air dan Peristiwa Alam" },
      { name: "materi_pokok", label: "Materi Pokok Pembelajaran", type: "text", required: true, placeholder: "Contoh: Evaporasi, Kondensasi, dan Presipitasi" },
      { name: "pertemuan_ke", label: "Pertemuan Ke-", type: "number", required: true, placeholder: "Contoh: 4" },
      { name: "model_pembelajaran", label: "Model Pembelajaran", type: "text", required: false, placeholder: "Contoh: Problem Based Learning (PBL)" },
      { name: "metode_pembelajaran", label: "Metode Pembelajaran", type: "text", required: false, placeholder: "Contoh: Eksperimen Sederhana & Diskusi" },
      { name: "teknik_penilaian", label: "Teknik Penilaian", type: "text", required: false, placeholder: "Contoh: Rubrik Observasi Sikap & Lembar Formatif" },
      { name: "kendala", label: "Catatan Refleksi / Kendala", type: "textarea", required: false, placeholder: "Kendala pemahaman siswa di kelas..." },
      { name: "solusi", label: "Solusi / Tindak Lanjut", type: "textarea", required: false, placeholder: "Pendampingan remedial atau media tambahan..." }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "tema", label: "Tema Pelajaran" },
      { key: "materi_pokok", label: "Materi Pokok" },
      { key: "pertemuan_ke", label: "Pertemuan" },
      { key: "model_pembelajaran", label: "Model" }
    ]
  },
  {
    dir: "app/(admin)/admin/jurnal/kepala-sekolah",
    entity: "JurnalKepalaSekolah",
    title: "Jurnal Kepala Sekolah",
    category: "Jurnal V2",
    description: "Agenda supervisi manajerial, pembinaan guru, dan tata kelola satuan pendidikan.",
    endpoint: "/api/v1/admin/jurnal/kepala-sekolah",
    queryKey: "jurnal-kepala-sekolah",
    icon: "👔",
    fields: [
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SDN 1 Ranomeeto" },
      { name: "nama_kegiatan", label: "Nama Aktivitas / Kegiatan", type: "text", required: true, placeholder: "Contoh: Supervisi Akademik Guru Kelas 5" },
      { name: "sasaran", label: "Sasaran Supervisi", type: "text", required: false, placeholder: "Contoh: Guru Kelas 5A dan 5B" },
      { name: "tujuan", label: "Tujuan Supervisi", type: "textarea", required: true, placeholder: "Tujuan peningkatan kompetensi pedagogik..." },
      { name: "keterlibatan", label: "Keterlibatan Pihak", type: "text", required: false, placeholder: "Contoh: Komite Sekolah, Tim Kurikulum" },
      { name: "hasil", label: "Hasil Temuan & Catatan", type: "textarea", required: false, placeholder: "Catatan hasil pemantauan di kelas..." },
      { name: "tindak_lanjut", label: "Rencana Tindak Lanjut", type: "textarea", required: false, placeholder: "Bimbingan teknis penyusunan modul..." },
      { name: "status", label: "Status Pelaksanaan", type: "text", required: true, placeholder: "Selesai / Terjadwal" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "nama_kegiatan", label: "Nama Kegiatan" },
      { key: "sasaran", label: "Sasaran" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/jurnal/pengawas",
    entity: "JurnalPengawas",
    title: "Jurnal Pengawas Satdik",
    category: "Jurnal V2",
    description: "Catatan supervisi akademik, evaluasi kurikulum, dan bimbingan manajerial sekolah binaan.",
    endpoint: "/api/v1/admin/jurnal/pengawas",
    queryKey: "jurnal-pengawas",
    icon: "🔍",
    fields: [
      { name: "sekolah_binaan", label: "Nama Sekolah Binaan", type: "text", required: true, placeholder: "Contoh: SMPN 2 Kolono" },
      { name: "fokus_supervisi", label: "Fokus Pendampingan", type: "text", required: true, placeholder: "Contoh: Implementasi Rapor Pendidikan & KSP" },
      { name: "pendekatan", label: "Metode Pendampingan", type: "text", required: false, placeholder: "Contoh: Coaching / Mentoring / Focus Group" },
      { name: "temuan", label: "Uraian Temuan Fakta", type: "textarea", required: true, placeholder: "Hasil evaluasi capaian literasi dan numerasi..." },
      { name: "rekomendasi", label: "Rekomendasi Pembenahan", type: "textarea", required: true, placeholder: "Rekomendasi tindak lanjut bagi kepala sekolah..." },
      { name: "status", label: "Status Supervisi", type: "text", required: true, placeholder: "Selesai / Menunggu Monitoring Ulang" }
    ],
    tableCols: [
      { key: "sekolah_binaan", label: "Sekolah Binaan" },
      { key: "fokus_supervisi", label: "Fokus" },
      { key: "pendekatan", label: "Pendekatan" },
      { key: "status", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/jurnal/bk",
    entity: "JurnalBk",
    title: "Jurnal BK (Bimbingan Konseling)",
    category: "Jurnal V2",
    description: "Dokumentasi konseling individual, bimbingan kelompok, dan layanan konseling sekolah.",
    endpoint: "/api/v1/admin/jurnal/bk",
    queryKey: "jurnal-bk",
    icon: "🧑‍⚕️",
    fields: [
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SMPN 1 Ranomeeto" },
      { name: "jenis_layanan", label: "Jenis Layanan BK", type: "text", required: true, placeholder: "Contoh: Konseling Individual / Bimbingan Klasikal" },
      { name: "bidang_bimbingan", label: "Bidang Bimbingan", type: "text", required: true, placeholder: "Contoh: Pribadi / Sosial / Belajar / Karier" },
      { name: "sasaran_siswa", label: "Nama Siswa / Kelompok Siswa", type: "text", required: true, placeholder: "Contoh: Siswa Kelas VIII-C" },
      { name: "permasalahan", label: "Uraian Kebutuhan / Masalah", type: "textarea", required: true, placeholder: "Kebutuhan motivasi belajar dan manajemen waktu..." },
      { name: "layanan_diberikan", label: "Layanan yang Diberikan", type: "textarea", required: true, placeholder: "Teknik restrukturisasi kognitif dan pembinaan..." },
      { name: "evaluasi", label: "Evaluasi Capaian", type: "textarea", required: false, placeholder: "Perkembangan perilaku positif konseli..." },
      { name: "tindak_lanjut", label: "Rencana Tindak Lanjut", type: "textarea", required: false, placeholder: "Sesi konseling tindak lanjut..." }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "jenis_layanan", label: "Jenis Layanan" },
      { key: "bidang_bimbingan", label: "Bidang" },
      { key: "sasaran_siswa", label: "Sasaran" }
    ]
  }
];
