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
    description: "Pangkalan data kepemilikan dan legalitas bidang lahan tanah satuan pendidikan.",
    endpoint: "/api/v1/admin/sarpras/tanah",
    queryKey: "sarpras-tanah",
    icon: "🗺️",
    fields: [
      { name: "title", label: "Luas Tanah Sekolah", type: "text", required: true, placeholder: "Contoh: 3.300 m² atau 1,19 ha" },
      { name: "file", label: "Berkas Bukti Kepemilikan / Sertifikat Tanah (PDF/Gambar)", type: "file", required: false, placeholder: "Unggah bukti kepemilikan/sertifikat tanah" },
      { name: "file_type", label: "Tipe Berkas (pdf/jpg/png)", type: "text", required: false, placeholder: "pdf / jpg / png" }
    ],
    tableCols: [
      { key: "title", label: "Luas Tanah" },
      { key: "file", label: "Berkas" },
      { key: "file_type", label: "Tipe Berkas" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/sarpras/bangunan",
    entity: "SarprasBangunan",
    title: "Bangunan Sekolah",
    category: "Sarana dan Prasarana",
    description: "Pendataan fisik gedung, luasan tapak, kelaikan bangunan, dan status hak kepemilikan.",
    endpoint: "/api/v1/admin/sarpras/bangunan",
    queryKey: "sarpras-bangunan",
    icon: "🏫",
    fields: [
      { name: "nama", label: "Nama Unit Gedung / Bangunan Sekolah", type: "text", required: true, placeholder: "Contoh: Gedung Kelas 1 / RKB UNIT 1" },
      { name: "luas", label: "Luas Tapak Bangunan (m²)", type: "text", required: false, placeholder: "Contoh: 800 m²" },
      { name: "kepemilikan_id", label: "Status Kepemilikan", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/sarpras/kepemilikan/option", masterQueryKey: "master-sarpras-kepemilikan-option", hookName: "Kepemilikan", placeholder: "Pilih status kepemilikan" },
      { name: "tahun", label: "Tahun Bangunan", type: "text", required: false, placeholder: "Contoh: 2020" },
      { name: "persentase", label: "Persentase Kerusakan Bangunan (%)", type: "number", required: false, placeholder: "Contoh: 0" },
      { name: "kondisi_id", label: "Kondisi Bangunan", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/sarpras/bangunan/option", masterQueryKey: "master-sarpras-bangunan-option", hookName: "KondisiBangunan", placeholder: "Pilih kondisi bangunan" },
      { name: "jns_bantuan_id", label: "Jenis Bantuan", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/sarpras/jenis-bantuan/option", masterQueryKey: "master-sarpras-jenis-bantuan-option", hookName: "JenisBantuan", placeholder: "Pilih jenis bantuan" },
      { name: "sumber_id", label: "Sumber Dana", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/sarpras/sumber-dana/option", masterQueryKey: "master-sarpras-sumber-dana-option", hookName: "SumberDana", placeholder: "Pilih sumber dana" }
    ],
    tableCols: [
      { key: "nama", label: "Nama Bangunan" },
      { key: "luas", label: "Luas" },
      { key: "kepemilikan_id", label: "Status Kepemilikan" },
      { key: "kondisi_id", label: "Kondisi Bangunan" },
      { key: "sumber_id", label: "Sumber Dana" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/sarpras/ruang",
    entity: "SarprasRuang",
    title: "Ruang Sekolah",
    category: "Sarana dan Prasarana",
    description: "Pemetaan unit ruangan spesifik yang berada di dalam bangunan sekolah.",
    endpoint: "/api/v1/admin/sarpras/ruang",
    queryKey: "sarpras-ruang",
    icon: "🚪",
    fields: [
      { name: "bangunan_id", label: "Unit Bangunan / Gedung", type: "select", required: false, masterEndpoint: "/api/v1/admin/sarpras/bangunan/option", masterQueryKey: "sarpras-bangunan-option", hookName: "Bangunan", placeholder: "Pilih gedung/bangunan" },
      { name: "kelas_id", label: "Tingkat / Kelas Rujukan", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/jurnal/kelas/option", masterQueryKey: "master-kelas-option", hookName: "Kelas", placeholder: "Pilih kelas" },
      { name: "nama", label: "Nama Ruangan", type: "text", required: true, placeholder: "Contoh: Ruangan Kelas 1A / Lab Komputer" },
      { name: "luas", label: "Luas Ruangan (m²)", type: "text", required: false, placeholder: "Contoh: 56 m²" },
      { name: "kondisi_id", label: "Kondisi Ruangan", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/sarpras/kondisi-alat/option", masterQueryKey: "master-sarpras-kondisi-option", hookName: "Kondisi", placeholder: "Pilih kondisi ruangan" }
    ],
    tableCols: [
      { key: "nama", label: "Nama Ruangan" },
      { key: "bangunan_id", label: "Unit Bangunan" },
      { key: "kelas_id", label: "Tingkat / Kelas" },
      { key: "kondisi_id", label: "Kondisi Ruangan" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/sarpras/peralatan",
    entity: "SarprasPeralatan",
    title: "Peralatan / Aset",
    category: "Sarana dan Prasarana",
    description: "Inventarisasi perangkat TIK, alat elektronik, dan furnitur penunjang di masing-masing ruangan.",
    endpoint: "/api/v1/admin/sarpras/peralatan",
    queryKey: "sarpras-peralatan",
    icon: "🖥️",
    fields: [
      { name: "ruang_id", label: "Lokasi Ruangan Penempatan", type: "select", required: false, masterEndpoint: "/api/v1/admin/sarpras/ruang/option", masterQueryKey: "sarpras-ruang-option", hookName: "Ruang", placeholder: "Pilih ruangan penempatan" },
      { name: "nama", label: "Nama Peralatan / Aset", type: "text", required: true, placeholder: "Contoh: Komputer Asus / Printer Epson L300" },
      { name: "jml_alat", label: "Jumlah Unit Peralatan", type: "number", required: true, placeholder: "Contoh: 2" },
      { name: "kondisi_id", label: "Kondisi Peralatan", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/sarpras/kondisi-alat/option", masterQueryKey: "master-sarpras-kondisi-option", hookName: "Kondisi", placeholder: "Pilih kondisi peralatan" },
      { name: "tahun", label: "Tahun Pengadaan / Perolehan", type: "number", required: false, placeholder: "Contoh: 2026" },
      { name: "sumber_id", label: "Sumber Dana", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/sarpras/sumber-dana/option", masterQueryKey: "master-sarpras-sumber-dana-option", hookName: "SumberDana", placeholder: "Pilih sumber dana" }
    ],
    tableCols: [
      { key: "nama", label: "Nama Peralatan" },
      { key: "ruang_id", label: "Ruang Penempatan" },
      { key: "jml_alat", label: "Jumlah" },
      { key: "kondisi_id", label: "Kondisi" },
      { key: "sumber_id", label: "Sumber Dana" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },

  // 3. Rombel
  {
    dir: "app/(admin)/admin/rombel/paud",
    entity: "RombelPaud",
    title: "Rombel Jenjang PAUD",
    category: "Rombel",
    description: "Pengelolaan rombongan belajar khusus kelompok bermain dan pendidikan anak usia dini.",
    endpoint: "/api/v1/admin/rombel/paud",
    queryKey: "rombel-paud",
    icon: "🧸",
    fields: [
      { name: "nama", label: "Nama Rombel PAUD", type: "text", required: true, placeholder: "Contoh: Kelompok Bermain Melati" },
      { name: "tgkt_pendidikan", label: "Tingkat Pendidikan / Jenjang", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/jenjang/option", masterQueryKey: "master-jenjang-option", hookName: "Jenjang", placeholder: "Pilih jenjang pendidikan" },
      { name: "wali_kelas", label: "Guru Pendamping / Wali Kelas", type: "text", required: false, placeholder: "Nama guru pendamping" },
      { name: "jns_rombel", label: "Jenis Rombel", type: "select", required: false, options: [{ value: "0", label: "Kelas Reguler" }, { value: "1", label: "Kelas Jauh/Kecil" }, { value: "2", label: "Kelas Terbuka" }], placeholder: "Pilih jenis rombel" },
      { name: "ruang_kelas", label: "Ruang Kelas (Sarpras Ruang)", type: "select", required: false, masterEndpoint: "/api/v1/admin/sarpras/ruang/option", masterQueryKey: "sarpras-ruang-option", hookName: "Ruang", placeholder: "Pilih ruang belajar" },
      { name: "kurikulum", label: "Kurikulum", type: "select", required: false, options: [{ value: "Kurikulum Merdeka", label: "Kurikulum Merdeka" }, { value: "Kurikulum 2013", label: "Kurikulum 2013" }], placeholder: "Pilih kurikulum" }
    ],
    tableCols: [
      { key: "nama", label: "Nama Rombel" },
      { key: "tgkt_pendidikan", label: "Tingkat Pendidikan" },
      { key: "ruang_kelas", label: "Ruang Kelas" },
      { key: "wali_kelas", label: "Wali Kelas" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/rombel/sd",
    entity: "RombelSd",
    title: "Rombel Jenjang SD",
    category: "Rombel",
    description: "Pengelolaan rombongan belajar tingkat sekolah dasar.",
    endpoint: "/api/v1/admin/rombel/sd",
    queryKey: "rombel-sd",
    icon: "🎒",
    fields: [
      { name: "nama", label: "Nama Rombel SD", type: "text", required: true, placeholder: "Contoh: Kelas 1A" },
      { name: "tgkt_pendidikan", label: "Tingkat Pendidikan / Jenjang", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/jenjang/option", masterQueryKey: "master-jenjang-option", hookName: "Jenjang", placeholder: "Pilih jenjang pendidikan" },
      { name: "wali_kelas", label: "Wali Kelas", type: "text", required: false, placeholder: "Nama wali kelas" },
      { name: "jns_rombel", label: "Jenis Rombel", type: "select", required: false, options: [{ value: "0", label: "Kelas Reguler" }, { value: "1", label: "Kelas Jauh/Kecil" }, { value: "2", label: "Kelas Terbuka" }], placeholder: "Pilih jenis rombel" },
      { name: "ruang_kelas", label: "Ruang Kelas (Sarpras Ruang)", type: "select", required: false, masterEndpoint: "/api/v1/admin/sarpras/ruang/option", masterQueryKey: "sarpras-ruang-option", hookName: "Ruang", placeholder: "Pilih ruang belajar" },
      { name: "kurikulum", label: "Kurikulum", type: "select", required: false, options: [{ value: "Kurikulum Merdeka", label: "Kurikulum Merdeka" }, { value: "Kurikulum 2013", label: "Kurikulum 2013" }], placeholder: "Pilih kurikulum" }
    ],
    tableCols: [
      { key: "nama", label: "Nama Rombel" },
      { key: "tgkt_pendidikan", label: "Tingkat Pendidikan" },
      { key: "ruang_kelas", label: "Ruang Kelas" },
      { key: "wali_kelas", label: "Wali Kelas" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/rombel/smp",
    entity: "RombelSmp",
    title: "Rombel Jenjang SMP",
    category: "Rombel",
    description: "Pengelolaan rombongan belajar tingkat sekolah menengah pertama.",
    endpoint: "/api/v1/admin/rombel/smp",
    queryKey: "rombel-smp",
    icon: "📘",
    fields: [
      { name: "nama", label: "Nama Rombel SMP", type: "text", required: true, placeholder: "Contoh: Kelas VII A" },
      { name: "tgkt_pendidikan", label: "Tingkat Pendidikan / Jenjang", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/jenjang/option", masterQueryKey: "master-jenjang-option", hookName: "Jenjang", placeholder: "Pilih jenjang pendidikan" },
      { name: "wali_kelas", label: "Wali Kelas", type: "text", required: false, placeholder: "Nama wali kelas" },
      { name: "jns_rombel", label: "Jenis Rombel", type: "select", required: false, options: [{ value: "0", label: "Kelas Reguler" }, { value: "1", label: "Kelas Jauh/Kecil" }, { value: "2", label: "Kelas Terbuka" }], placeholder: "Pilih jenis rombel" },
      { name: "ruang_kelas", label: "Ruang Kelas (Sarpras Ruang)", type: "select", required: false, masterEndpoint: "/api/v1/admin/sarpras/ruang/option", masterQueryKey: "sarpras-ruang-option", hookName: "Ruang", placeholder: "Pilih ruang belajar" },
      { name: "kurikulum", label: "Kurikulum", type: "select", required: false, options: [{ value: "Kurikulum Merdeka", label: "Kurikulum Merdeka" }, { value: "Kurikulum 2013", label: "Kurikulum 2013" }], placeholder: "Pilih kurikulum" }
    ],
    tableCols: [
      { key: "nama", label: "Nama Rombel" },
      { key: "tgkt_pendidikan", label: "Tingkat Pendidikan" },
      { key: "ruang_kelas", label: "Ruang Kelas" },
      { key: "wali_kelas", label: "Wali Kelas" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },

  // 4. Usulan Sekolah
  {
    dir: "app/(admin)/admin/usulan/tunjangan-guru",
    entity: "UsulanTunjanganGuru",
    title: "Usulan Tunjangan Guru",
    category: "Usulan Sekolah",
    description: "Permohonan aneka tunjangan pendidik (TPG, Tamsil, TKG) ke Dinas Pendidikan dan Kebudayaan.",
    endpoint: "/api/v1/admin/usulan/tunjangan-guru",
    queryKey: "usulan-tunjangan-guru",
    icon: "💰",
    fields: [
      { name: "tahun", label: "Tahun Anggaran", type: "text", required: true, placeholder: "Contoh: 2026" },
      { name: "triwulan_id", label: "Periode Triwulan", type: "select", required: true, masterEndpoint: "/api/v1/admin/master/usulan/triwulan/option", masterQueryKey: "master-usulan-triwulan-option", hookName: "Triwulan", placeholder: "Pilih triwulan" },
      { name: "jenis_id", label: "Jenis Tunjangan (Penerima)", type: "select", required: true, masterEndpoint: "/api/v1/admin/master/usulan/jenis-penerima/option", masterQueryKey: "master-usulan-jenis-penerima-option", hookName: "JenisPenerima", placeholder: "Pilih jenis tunjangan" },
      { name: "kelas_id", label: "Kelas / Kategori Penerima", type: "select", required: true, masterEndpoint: "/api/v1/admin/master/usulan/kelas-penerima/option", masterQueryKey: "master-usulan-kelas-penerima-option", hookName: "KelasPenerima", placeholder: "Pilih kelas penerima" },
      { name: "jml_guru", label: "Jumlah Guru Pengusul", type: "number", required: false, placeholder: "Contoh: 1" },
      { name: "nominal", label: "Nominal Usulan (Rp)", type: "number", required: false, placeholder: "Contoh: 12000000" },
      { name: "file", label: "Berkas Lampiran SKTP (PDF)", type: "file", required: false, placeholder: "Unggah dokumen SKTP" },
      { name: "file_type", label: "Tipe Berkas (pdf)", type: "text", required: false, placeholder: "pdf" }
    ],
    tableCols: [
      { key: "tahun", label: "Tahun" },
      { key: "triwulan_id", label: "Triwulan" },
      { key: "jenis_id", label: "Jenis Penerima" },
      { key: "kelas_id", label: "Kelas Penerima" },
      { key: "nominal", label: "Nominal Usulan" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/usulan/pip/data-pendukung",
    entity: "UsulanPipPendukung",
    title: "Data Pendukung PIP",
    category: "Usulan Sekolah > Usulan Bantuan PIP",
    description: "Dokumentasi alokasi program bantuan PIP, SK, Berita Acara Rapat Penetapan Siswa Layak PIP.",
    endpoint: "/api/v1/admin/usulan/pip/data-pendukung",
    queryKey: "usulan-pip-pendukung",
    icon: "📑",
    fields: [
      { name: "uraian", label: "Uraian SK / Berita Acara Penetapan PIP", type: "text", required: true, placeholder: "Contoh: SK Pemberian PIP SD Tahap I T.A 2026" },
      { name: "jenjang_id", label: "Jenjang Pendidikan", type: "select", required: true, masterEndpoint: "/api/v1/admin/master/jenjang/option", masterQueryKey: "master-jenjang-option", hookName: "Jenjang", placeholder: "Pilih jenjang" },
      { name: "nominal", label: "Besaran Pagu Nominal Per Siswa (Rp)", type: "number", required: true, placeholder: "Contoh: 450000" },
      { name: "tahun", label: "Tahun Penetapan", type: "text", required: true, placeholder: "Contoh: 2026" },
      { name: "file", label: "Dokumen SK / Berita Acara (PDF)", type: "file", required: false, placeholder: "Unggah berkas SK PIP" }
    ],
    tableCols: [
      { key: "uraian", label: "Uraian SK" },
      { key: "jenjang_id", label: "Jenjang" },
      { key: "nominal", label: "Nominal (Rp)" },
      { key: "tahun", label: "Tahun" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/usulan/pip/data-penerima",
    entity: "UsulanPipPenerima",
    title: "Data Penerima PIP",
    category: "Usulan Sekolah > Usulan Bantuan PIP",
    description: "Penetapan peserta didik aktif yang berhak menerima penyaluran dana bantuan PIP.",
    endpoint: "/api/v1/admin/usulan/pip/data-penerima",
    queryKey: "usulan-pip-penerima",
    icon: "🎓",
    fields: [
      { name: "pendukung_id", label: "Data Pendukung PIP", type: "select", required: true, masterEndpoint: "/api/v1/admin/usulan/pip/data-pendukung/option", masterQueryKey: "usulan-pip-pendukung-option", hookName: "DataPendukung", placeholder: "Pilih dokumen rujukan SK PIP" },
      { name: "siswa_id", label: "Peserta Didik (Master Siswa)", type: "select", required: true, masterEndpoint: "/api/v1/admin/master/siswa/option", masterQueryKey: "master-siswa-option", hookName: "Siswa", placeholder: "Pilih siswa penerima PIP" }
    ],
    tableCols: [
      { key: "siswa_id", label: "Nama Peserta Didik" },
      { key: "pendukung_id", label: "Rujukan Kuota PIP" },
      { key: "unit_kerja", label: "Satuan Pendidikan" },
      { key: "created_at", label: "Waktu Penetapan" }
    ]
  },
  {
    dir: "app/(admin)/admin/usulan/assessment",
    entity: "UsulanAssessment",
    title: "Usulan Data Assessment",
    category: "Usulan Sekolah",
    description: "Status moda pelaksanaan sekolah, jumlah siswa peserta asesmen/ANBK, dan rincian gender.",
    endpoint: "/api/v1/admin/usulan/assessment",
    queryKey: "usulan-assessment",
    icon: "📊",
    fields: [
      { name: "status_sekolah_id", label: "Status Pelaksanaan Sekolah", type: "select", required: true, options: [{ value: "0", label: "Mandiri / Negeri" }, { value: "1", label: "Menumpang / Swasta" }, { value: "2", label: "Satuan Pendidikan Kerjasama (SPK)" }], placeholder: "Pilih status moda pelaksanaan" },
      { name: "jml_siswa", label: "Total Peserta Siswa", type: "number", required: true, placeholder: "Contoh: 30" },
      { name: "jml_laki", label: "Jumlah Peserta Laki-laki", type: "number", required: false, placeholder: "Contoh: 15" },
      { name: "jml_perempuan", label: "Jumlah Peserta Perempuan", type: "number", required: false, placeholder: "Contoh: 15" },
      { name: "kurikulum_k13", label: "Peserta Kurikulum 2013", type: "text", required: false, placeholder: "Contoh: 0" },
      { name: "kurikulum_kurmer", label: "Peserta Kurikulum Merdeka", type: "text", required: false, placeholder: "Contoh: 30" },
      { name: "file", label: "Dokumen Bukti Kesiapan Asesmen (PDF)", type: "file", required: false, placeholder: "Unggah dokumen pendukung asesmen" }
    ],
    tableCols: [
      { key: "jml_siswa", label: "Total Siswa" },
      { key: "jml_laki", label: "Laki-laki" },
      { key: "jml_perempuan", label: "Perempuan" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/usulan/rekonsiliasi-bosp",
    entity: "UsulanRekonsiliasiBosp",
    title: "Usulan Rekonsiliasi Dana BOSP",
    category: "Usulan Sekolah",
    description: "Pengajuan pertanggungjawaban (SPJ) keuangan dan aset BOSP ke Dinas Pendidikan dan Kebudayaan.",
    endpoint: "/api/v1/admin/usulan/rekonsiliasi-bosp",
    queryKey: "usulan-rekonsiliasi-bosp",
    icon: "🧾",
    fields: [
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SDN 4 Ranomeeto" },
      { name: "tahun", label: "Tahun Anggaran", type: "text", required: true, placeholder: "Contoh: 2026" },
      { name: "tahap", label: "Semester / Tahap", type: "select", required: true, options: [{ value: "Semester I (Januari - Juni)", label: "Semester I (Januari - Juni)" }, { value: "Semester II (Juli - Desember)", label: "Semester II (Juli - Desember)" }], placeholder: "Pilih semester" },
      { name: "nominal_dana", label: "Nominal Penyerapan Dana BOSP (Rp)", type: "number", required: false, placeholder: "Contoh: 50000000" },
      { name: "kategori_spj", label: "Kategori Dokumen SPJ (Master Kategori)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/kategori/option", masterQueryKey: "master-kategori-option", hookName: "KategoriSpj", placeholder: "Pilih kategori SPJ BOSP" },
      { name: "file_bku", label: "Buku Kas Umum / BKU (PDF)", type: "file", required: false, placeholder: "Unggah berkas BKU" },
      { name: "file_rekening", label: "Rekening Koran Bank Sultra (PDF)", type: "file", required: false, placeholder: "Unggah rekening koran" },
      { name: "file_sptjm", label: "SPTJM BOSP Bermaterai (PDF)", type: "file", required: false, placeholder: "Unggah SPTJM" },
      { name: "status", label: "Status Usulan", type: "select", required: false, options: [{ value: "Sedang Diproses Verifikasi", label: "Sedang Diproses Verifikasi" }, { value: "Cek Benar", label: "Cek Benar" }, { value: "Cek Lengkap", label: "Cek Lengkap" }, { value: "Disetujui", label: "Disetujui" }], placeholder: "Pilih status usulan" }
    ],
    tableCols: [
      { key: "sekolah", label: "Satuan Pendidikan" },
      { key: "tahun", label: "Tahun" },
      { key: "tahap", label: "Semester" },
      { key: "kategori_spj", label: "Kategori SPJ" },
      { key: "nominal_dana", label: "Nominal" },
      { key: "status", label: "Status Usulan" }
    ]
  },

  // 5. Kegiatan Sekolah
  {
    dir: "app/(admin)/admin/kegiatan-sekolah",
    entity: "KegiatanSekolah",
    title: "Kegiatan Sekolah",
    category: "Kegiatan Sekolah",
    description: "Dokumentasi dan pelaporan aktivitas belajar, ekstrakurikuler, workshop, dan hari besar sekolah.",
    endpoint: "/api/v1/admin/kegiatan-sekolah",
    queryKey: "kegiatan-sekolah",
    icon: "📸",
    fields: [
      { name: "nama_kegiatan", label: "Nama / Tajuk Kegiatan", type: "text", required: true, placeholder: "Contoh: Upacara Hardiknas & Pentas Seni" },
      { name: "deskripsi", label: "Deskripsi Lengkap Kegiatan", type: "textarea", required: true, placeholder: "Uraian jalannya kegiatan..." },
      { name: "tgl_kegiatan", label: "Tanggal Pelaksanaan", type: "date", required: true },
      { name: "foto", label: "Foto Banner / Dokumentasi", type: "file", required: false, placeholder: "Unggah foto kegiatan" },
      { name: "link_youtube", label: "Tautan Video YouTube Kegiatan", type: "text", required: false, placeholder: "https://www.youtube.com/watch?v=..." }
    ],
    tableCols: [
      { key: "nama_kegiatan", label: "Nama Kegiatan" },
      { key: "tgl_kegiatan", label: "Tanggal" },
      { key: "foto", label: "Foto" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },

  // 6. Komunitas Belajar
  {
    dir: "app/(admin)/admin/komunitas-belajar",
    entity: "KomunitasBelajar",
    title: "Komunitas Belajar",
    category: "Komunitas Belajar",
    description: "Pengelolaan aktivitas kelompok belajar guru dan tenaga kependidikan intra dan antar satuan pendidikan.",
    endpoint: "/api/v1/admin/komunitas-belajar",
    queryKey: "komunitas-belajar",
    icon: "🤝",
    fields: [
      { name: "nama", label: "Nama Komunitas Belajar", type: "text", required: true, placeholder: "Contoh: Kombel Berbagi Praktik Baik" },
      { name: "jns_kegiatan", label: "Siklus / Jenis Kegiatan", type: "select", required: true, options: [{ value: "0", label: "Siklus Refleksi Awal" }, { value: "1", label: "Siklus Perencanaan" }, { value: "2", label: "Siklus Implementasi" }, { value: "3", label: "Siklus Evaluasi" }], placeholder: "Pilih siklus kegiatan" },
      { name: "tgl_kegiatan", label: "Tanggal Pelaksanaan", type: "date", required: true },
      { name: "nama_id", label: "Nama Guru / Penanggung Jawab", type: "text", required: false, placeholder: "Nama guru penggerak / penanggung jawab" },
      { name: "jabatan", label: "Jabatan dalam Kombel", type: "select", required: false, options: [{ value: "Ketua", label: "Ketua" }, { value: "Wakil", label: "Wakil" }, { value: "Sekretaris", label: "Sekretaris" }, { value: "Koordinator", label: "Koordinator" }, { value: "Anggota", label: "Anggota" }], placeholder: "Pilih jabatan" },
      { name: "file", label: "Dokumen Berita Acara / SK Kombel (PDF)", type: "file", required: false, placeholder: "Unggah dokumen pendukung" }
    ],
    tableCols: [
      { key: "nama", label: "Nama Kombel" },
      { key: "jabatan", label: "Jabatan" },
      { key: "tgl_kegiatan", label: "Tanggal" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },

  // 7. Piagam Sertifikat
  {
    dir: "app/(admin)/admin/piagam-sertifikat",
    entity: "PiagamSertifikat",
    title: "Piagam & Sertifikat",
    category: "Penghargaan",
    description: "Pencatatan prestasi, penghargaan kejuaraan dan piagam sertifikat tingkat Guru, Siswa, dan Sekolah.",
    endpoint: "/api/v1/admin/piagam-sertifikat",
    queryKey: "piagam-sertifikat",
    icon: "🏆",
    fields: [
      { name: "kategori", label: "Kategori Penerima Penghargaan", type: "select", required: true, options: [{ value: "Siswa", label: "Peserta Didik (Siswa)" }, { value: "Guru", label: "Pendidik (Guru)" }, { value: "Sekolah", label: "Satuan Pendidikan (Sekolah)" }], placeholder: "Pilih kategori penerima" },
      { name: "nama", label: "Nama Penerima Penghargaan", type: "text", required: true, placeholder: "Nama penerima" },
      { name: "kegiatan", label: "Nama Ajang / Kompetisi", type: "text", required: true, placeholder: "Contoh: Olimpiade Sains Nasional" },
      { name: "juara", label: "Capaian Juara / Penghargaan", type: "text", required: false, placeholder: "Contoh: Juara 1 Medali Emas" },
      { name: "tingkat", label: "Tingkat Kejuaraan", type: "select", required: false, options: [{ value: "Kecamatan", label: "Tingkat Kecamatan" }, { value: "Kabupaten", label: "Tingkat Kabupaten" }, { value: "Provinsi", label: "Tingkat Provinsi" }, { value: "Nasional", label: "Tingkat Nasional" }, { value: "Internasional", label: "Tingkat Internasional" }], placeholder: "Pilih tingkat kejuaraan" },
      { name: "tahun", label: "Tahun Prestasi", type: "text", required: false, placeholder: "Contoh: 2026" },
      { name: "penyelenggara", label: "Instansi / Lembaga Penyelenggara", type: "text", required: false, placeholder: "Contoh: Balai Pengembangan Talenta Indonesia" },
      { name: "file", label: "Pindaian Piagam / Sertifikat (PDF/Gambar)", type: "file", required: false, placeholder: "Unggah piagam penghargaan" }
    ],
    tableCols: [
      { key: "nama", label: "Penerima" },
      { key: "kegiatan", label: "Ajang" },
      { key: "juara", label: "Juara" },
      { key: "tingkat", label: "Tingkat" },
      { key: "file", label: "Berkas" }
    ]
  },

  // 8. Gallery (9 Modules)
  {
    dir: "app/(admin)/admin/gallery/sekolah-penggerak",
    entity: "SekolahPenggerak",
    title: "Sekolah Penggerak",
    category: "Gallery",
    description: "Dokumentasi publikasi program dan kegiatan Program Sekolah Penggerak.",
    endpoint: "/api/v1/admin/gallery/sekolah-penggerak",
    queryKey: "gallery-sekolah-penggerak",
    icon: "🌟",
    fields: [
      { name: "judul", label: "Tajuk / Nama Kegiatan", type: "text", required: true, placeholder: "Contoh: Lokakarya Komite Pembelajaran" },
      { name: "tujuan", label: "Tujuan Pelaksanaan", type: "textarea", required: false, placeholder: "Tujuan kegiatan..." },
      { name: "proses", label: "Tahapan / Proses Kegiatan", type: "textarea", required: false, placeholder: "Rangkaian proses pelaksanaan..." },
      { name: "hasil", label: "Hasil Capaian Transformasi", type: "textarea", required: false, placeholder: "Output dan hasil capaian..." },
      { name: "link", label: "Tautan Video YouTube", type: "text", required: false, placeholder: "https://www.youtube.com/watch?v=..." },
      { name: "file", label: "Foto / Dokumentasi Kegiatan", type: "file", required: false, placeholder: "Unggah foto kegiatan" }
    ],
    tableCols: [
      { key: "judul", label: "Nama Kegiatan" },
      { key: "link", label: "Video YouTube" },
      { key: "file", label: "Foto" },
      { key: "created_at", label: "Waktu Catat" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/guru-penggerak",
    entity: "GuruPenggerak",
    title: "Guru Penggerak",
    category: "Gallery",
    description: "Portofolio aksi nyata dan karya kepemimpinan pembelajaran Guru Penggerak.",
    endpoint: "/api/v1/admin/gallery/guru-penggerak",
    queryKey: "gallery-guru-penggerak",
    icon: "🌱",
    fields: [
      { name: "judul", label: "Tajuk Aksi Nyata / Praktik Baik", type: "text", required: true, placeholder: "Contoh: Aksi Nyata Modul 1.4 Budaya Positif" },
      { name: "nama_guru", label: "Nama Guru Penggerak", type: "text", required: false, placeholder: "Nama lengkap guru" },
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: false, placeholder: "Nama sekolah bertugas" },
      { name: "angkatan", label: "Angkatan Guru Penggerak", type: "text", required: false, placeholder: "Contoh: Angkatan 9" },
      { name: "deskripsi", label: "Deskripsi Prakarsa Perubahan", type: "textarea", required: false, placeholder: "Uraian implementasi di kelas..." },
      { name: "file", label: "Dokumentasi Foto Aksi Nyata", type: "file", required: false, placeholder: "Unggah foto dokumentasi" },
      { name: "link", label: "Tautan Video Pembelajaran", type: "text", required: false, placeholder: "https://www.youtube.com/watch?v=..." }
    ],
    tableCols: [
      { key: "judul", label: "Tajuk Aksi Nyata" },
      { key: "nama_guru", label: "Guru" },
      { key: "angkatan", label: "Angkatan" },
      { key: "file", label: "Foto" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/organisasi-penggerak",
    entity: "OrganisasiPenggerak",
    title: "Organisasi Penggerak",
    category: "Gallery",
    description: "Dokumentasi program pendampingan dari Organisasi Penggerak di sekolah sasaran.",
    endpoint: "/api/v1/admin/gallery/organisasi-penggerak",
    queryKey: "gallery-organisasi-penggerak",
    icon: "🏢",
    fields: [
      { name: "judul", label: "Nama Program / Pelatihan", type: "text", required: true, placeholder: "Contoh: Pelatihan Pembelajaran Berbasis Numerasi" },
      { name: "nama_organisasi", label: "Nama Lembaga / Yayasan Mitra", type: "text", required: false, placeholder: "Nama organisasi mitra" },
      { name: "kegiatan", label: "Uraian Fokus Kegiatan", type: "text", required: false, placeholder: "Fokus kegiatan..." },
      { name: "deskripsi", label: "Deskripsi Pelaksanaan", type: "textarea", required: false, placeholder: "Rincian pelaksanaan bimtek..." },
      { name: "file", label: "Foto Dokumentasi", type: "file", required: false, placeholder: "Unggah foto kegiatan" },
      { name: "link", label: "Tautan Video Dokumentasi", type: "text", required: false, placeholder: "https://www.youtube.com/watch?v=..." }
    ],
    tableCols: [
      { key: "judul", label: "Program" },
      { key: "nama_organisasi", label: "Organisasi Mitra" },
      { key: "file", label: "Foto" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/kegiatan-kepala-sekolah",
    entity: "KegiatanKepalaSekolah",
    title: "Kegiatan Kepala Sekolah",
    category: "Gallery",
    description: "Dokumentasi kegiatan manajerial, supervisi akademik, dan forum Kelompok Kerja Kepala Sekolah.",
    endpoint: "/api/v1/admin/gallery/kegiatan-kepala-sekolah",
    queryKey: "gallery-kegiatan-kepala-sekolah",
    icon: "👔",
    fields: [
      { name: "judul", label: "Tajuk Kegiatan Kepemimpinan / MKKS", type: "text", required: true, placeholder: "Contoh: Rapat Koordinasi MKKS SMP" },
      { name: "tujuan", label: "Target / Tujuan Kegiatan", type: "textarea", required: false, placeholder: "Target tata kelola..." },
      { name: "proses", label: "Rangkaian Jalannya Kegiatan", type: "textarea", required: false, placeholder: "Uraian proses..." },
      { name: "hasil", label: "Hasil Evaluasi & Rekomendasi", type: "textarea", required: false, placeholder: "Hasil rapat..." },
      { name: "file", label: "Dokumentasi Foto Kegiatan", type: "file", required: false, placeholder: "Unggah foto kegiatan" },
      { name: "link", label: "Tautan Video YouTube", type: "text", required: false, placeholder: "https://www.youtube.com/watch?v=..." }
    ],
    tableCols: [
      { key: "judul", label: "Tajuk Kegiatan" },
      { key: "file", label: "Foto" },
      { key: "created_at", label: "Waktu Catat" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/kegiatan-kkg-sd",
    entity: "KegiatanKkgSd",
    title: "Kegiatan KKG SD",
    category: "Gallery",
    description: "Dokumentasi forum Kelompok Kerja Guru Sekolah Dasar (KKG SD) tingkat gugus/kecamatan.",
    endpoint: "/api/v1/admin/gallery/kegiatan-kkg-sd",
    queryKey: "gallery-kegiatan-kkg-sd",
    icon: "👥",
    fields: [
      { name: "judul", label: "Agenda / Topik KKG SD", type: "text", required: true, placeholder: "Contoh: Bedah CP dan Penyusunan ATP Fase C" },
      { name: "gugus", label: "Nama Gugus / Kecamatan", type: "text", required: false, placeholder: "Contoh: Gugus I Buke" },
      { name: "materi", label: "Materi Pembahasan Bersama", type: "text", required: false, placeholder: "Contoh: Modul Ajar Matematika" },
      { name: "deskripsi", label: "Deskripsi Pelaksanaan", type: "textarea", required: false, placeholder: "Uraian diskusi & hasil rekomendasi..." },
      { name: "file", label: "Foto Dokumentasi KKG", type: "file", required: false, placeholder: "Unggah foto KKG" },
      { name: "link", label: "Tautan Video YouTube", type: "text", required: false, placeholder: "https://www.youtube.com/watch?v=..." }
    ],
    tableCols: [
      { key: "judul", label: "Agenda KKG" },
      { key: "gugus", label: "Gugus" },
      { key: "file", label: "Foto" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/kegiatan-guru-mgmp",
    entity: "KegiatanGuruMgmp",
    title: "Kegiatan Guru MGMP",
    category: "Gallery",
    description: "Dokumentasi kegiatan Musyawarah Guru Mata Pelajaran jenjang SMP.",
    endpoint: "/api/v1/admin/gallery/kegiatan-guru-mgmp",
    queryKey: "gallery-kegiatan-guru-mgmp",
    icon: "🔬",
    fields: [
      { name: "judul", label: "Agenda Kegiatan MGMP", type: "text", required: true, placeholder: "Contoh: Workshop Pengajaran Bahasa Inggris Komunikatif" },
      { name: "mata_pelajaran", label: "Bidang Studi / Mata Pelajaran", type: "text", required: false, placeholder: "Contoh: IPA / Matematika" },
      { name: "deskripsi", label: "Deskripsi Pelaksanaan", type: "textarea", required: false, placeholder: "Uraian lokakarya instrumen..." },
      { name: "file", label: "Foto Dokumentasi MGMP", type: "file", required: false, placeholder: "Unggah foto kegiatan" },
      { name: "link", label: "Tautan Video YouTube", type: "text", required: false, placeholder: "https://www.youtube.com/watch?v=..." }
    ],
    tableCols: [
      { key: "judul", label: "Agenda MGMP" },
      { key: "mata_pelajaran", label: "Mata Pelajaran" },
      { key: "file", label: "Foto" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/kegiatan-tk-paud",
    entity: "KegiatanTkPaud",
    title: "Kegiatan TK & PAUD",
    category: "Gallery",
    description: "Dokumentasi ragam kegiatan belajar sambil bermain dan penguatan karakter usia dini.",
    endpoint: "/api/v1/admin/gallery/kegiatan-tk-paud",
    queryKey: "gallery-kegiatan-tk-paud",
    icon: "🎨",
    fields: [
      { name: "judul", label: "Nama / Tajuk Kegiatan Anak Usia Dini", type: "text", required: true, placeholder: "Contoh: Kegiatan Berkebun & Mengenal Tanaman Obat" },
      { name: "sekolah", label: "Satuan PAUD / TK", type: "text", required: false, placeholder: "Contoh: TK Negeri 1 Palangga" },
      { name: "deskripsi", label: "Deskripsi Stimulasi / Capaian Anak", type: "textarea", required: false, placeholder: "Uraian pengenalan lingkungan..." },
      { name: "file", label: "Foto Kegiatan", type: "file", required: false, placeholder: "Unggah foto anak didik" },
      { name: "link", label: "Tautan Video YouTube", type: "text", required: false, placeholder: "https://www.youtube.com/watch?v=..." }
    ],
    tableCols: [
      { key: "judul", label: "Kegiatan" },
      { key: "sekolah", label: "Sekolah" },
      { key: "file", label: "Foto" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/kegiatan-pengawas",
    entity: "KegiatanPengawas",
    title: "Kegiatan Pengawas Satdik",
    category: "Gallery",
    description: "Dokumentasi forum pembinaan, rakor korwas, dan workshop kepengawasan satuan pendidikan.",
    endpoint: "/api/v1/admin/gallery/kegiatan-pengawas",
    queryKey: "gallery-kegiatan-pengawas",
    icon: "📋",
    fields: [
      { name: "judul", label: "Tema Pembinaan / Rakor Pengawas", type: "text", required: true, placeholder: "Contoh: Rakor Kelompok Kerja Pengawas Sekolah" },
      { name: "nama_pengawas", label: "Nama Pengawas Satuan Pendidikan", type: "text", required: false, placeholder: "Nama koordinator pengawas" },
      { name: "wilayah_binaan", label: "Wilayah Satuan Pendidikan Binaan", type: "text", required: false, placeholder: "Contoh: Korwas Palangga" },
      { name: "deskripsi", label: "Uraian Diseminasi Kebijakan & Hasil Supervisi", type: "textarea", required: false, placeholder: "Hasil evaluasi..." },
      { name: "file", label: "Dokumentasi Foto Rakor / Kunjungan", type: "file", required: false, placeholder: "Unggah foto kepengawasan" },
      { name: "link", label: "Tautan Video YouTube", type: "text", required: false, placeholder: "https://www.youtube.com/watch?v=..." }
    ],
    tableCols: [
      { key: "judul", label: "Tema Pembinaan" },
      { key: "nama_pengawas", label: "Pengawas" },
      { key: "file", label: "Foto" }
    ]
  },
  {
    dir: "app/(admin)/admin/gallery/video-testimoni",
    entity: "VideoTestimoni",
    title: "Video Testimoni",
    category: "Gallery",
    description: "Unggahan video testimoni, apresiasi, dan ulasan dampak program dari stakeholder pendidikan.",
    endpoint: "/api/v1/admin/gallery/video-testimoni",
    queryKey: "gallery-video-testimoni",
    icon: "🎬",
    fields: [
      { name: "judul", label: "Tajuk Testimoni / Pernyataan", type: "text", required: true, placeholder: "Contoh: Testimoni Bupati Konawe Selatan" },
      { name: "narasumber", label: "Nama Tokoh / Narasumber", type: "text", required: true, placeholder: "Nama lengkap narasumber" },
      { name: "peran", label: "Peran / Jabatan Pemangku Kepentingan", type: "text", required: false, placeholder: "Contoh: Kepala Daerah / Kepala Sekolah / Guru" },
      { name: "link_video", label: "Tautan Video YouTube (Wajib)", type: "text", required: true, placeholder: "https://www.youtube.com/watch?v=..." },
      { name: "keterangan", label: "Ringkasan Ulasan / Kutipan Dampak", type: "textarea", required: false, placeholder: "Kutipan pernyataan positif..." }
    ],
    tableCols: [
      { key: "judul", label: "Judul" },
      { key: "narasumber", label: "Narasumber" },
      { key: "peran", label: "Peran" },
      { key: "link_video", label: "Tautan Video" }
    ]
  },

  // 9. Verifikasi
  {
    dir: "app/(admin)/admin/verifikasi/tunjangan-guru",
    entity: "VerifikasiTunjanganGuru",
    title: "Verifikasi Tunjangan Guru",
    category: "Verifikasi",
    description: "Pemeriksaan dan validasi berkas pengajuan tunjangan guru dari satuan pendidikan.",
    endpoint: "/api/v1/admin/verifikasi/tunjangan-guru",
    queryKey: "verifikasi-tunjangan-guru",
    icon: "✅",
    fields: [
      { name: "nama_guru", label: "Nama Guru Pengusul", type: "text", required: false, placeholder: "Nama guru" },
      { name: "nuptk", label: "NUPTK", type: "text", required: false, placeholder: "Nomor NUPTK" },
      { name: "sekolah", label: "Satuan Pendidikan", type: "text", required: false, placeholder: "Sekolah" },
      { name: "jenis_tunjangan", label: "Jenis Tunjangan", type: "text", required: false, placeholder: "TPG / Tamsil / TKG" },
      { name: "status_verifikasi", label: "Status Verifikasi Tim Dinas", type: "select", required: true, options: [{ value: "Menunggu", label: "Menunggu Verifikasi" }, { value: "Disetujui", label: "Disetujui / Terbit SKTP" }, { value: "Perbaikan", label: "Perlu Perbaikan Berkas" }, { value: "Ditolak", label: "Ditolak" }], placeholder: "Pilih status verifikasi" },
      { name: "catatan", label: "Catatan Verifikator Dinas", type: "textarea", required: false, placeholder: "Catatan hasil verifikasi..." }
    ],
    tableCols: [
      { key: "nama_guru", label: "Guru" },
      { key: "sekolah", label: "Sekolah" },
      { key: "jenis_tunjangan", label: "Tunjangan" },
      { key: "status_verifikasi", label: "Status" }
    ]
  },
  {
    dir: "app/(admin)/admin/verifikasi/rekonsiliasi-bosp",
    entity: "VerifikasiRekonsiliasiBosp",
    title: "Verifikasi Usulan Rekonsiliasi Dana BOSP",
    category: "Verifikasi",
    description: "Verifikasi dokumen pertanggungjawaban (SPJ) dana BOSP satuan pendidikan oleh dinas.",
    endpoint: "/api/v1/admin/verifikasi/rekonsiliasi-bosp",
    queryKey: "verifikasi-rekonsiliasi-bosp",
    icon: "🔍",
    fields: [
      { name: "sekolah", label: "Nama Satuan Pendidikan", type: "text", required: false, placeholder: "Sekolah pengusul" },
      { name: "tahap", label: "Semester / Tahap", type: "text", required: false, placeholder: "Semester I / Semester II" },
      { name: "tahun", label: "Tahun Anggaran", type: "text", required: false, placeholder: "2026" },
      { name: "nominal_disetujui", label: "Nominal Dana Disetujui (Rp)", type: "number", required: false, placeholder: "Nominal disetujui" },
      { name: "status_verifikasi", label: "Status Verifikasi Tim Dinas", type: "select", required: true, options: [{ value: "Sedang Diproses Verifikasi", label: "Sedang Diproses Verifikasi" }, { value: "Cek Benar", label: "Tahap Cek Benar (Kesesuaian Angka)" }, { value: "Cek Lengkap", label: "Tahap Cek Lengkap (26 Berkas Valid)" }, { value: "Disetujui", label: "Disetujui (Bebas Rekonsiliasi)" }, { value: "Perbaikan", label: "Perlu Koreksi Berkas SPJ" }], placeholder: "Pilih status verifikasi" },
      { name: "catatan_verifikator", label: "Catatan Hasil Koreksi Verifikator", type: "textarea", required: false, placeholder: "Catatan koreksi SPJ..." }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "tahap", label: "Tahap" },
      { key: "tahun", label: "Tahun" },
      { key: "status_verifikasi", label: "Status Verifikasi" }
    ]
  },

  // 10. Regulasi dan Info GTK
  {
    dir: "app/(admin)/admin/regulasi-gtk/pengumuman",
    entity: "RegulasiGtkPengumuman",
    title: "Pengumuman GTK",
    category: "Regulasi dan Info GTK",
    description: "Publikasi pengumuman kedinasan khusus Guru dan Tenaga Kependidikan.",
    endpoint: "/api/v1/admin/regulasi-gtk/pengumuman",
    queryKey: "regulasi-gtk-pengumuman",
    icon: "📢",
    fields: [
      { name: "judul", label: "Judul Pengumuman GTK", type: "text", required: true, placeholder: "Contoh: Jadwal Pemberkasan TPG Triwulan I" },
      { name: "isi", label: "Isi Ringkas Pengumuman", type: "textarea", required: true, placeholder: "Uraian pengumuman..." },
      { name: "tanggal", label: "Tanggal Pengumuman", type: "date", required: true },
      { name: "target", label: "Sasaran Penerima Pengumuman", type: "text", required: false, placeholder: "Contoh: Seluruh Guru Penerima TPG" },
      { name: "file", label: "Lampiran Surat Edaran / Pengumuman (PDF)", type: "file", required: false, placeholder: "Unggah dokumen surat edaran" }
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
    entity: "RegulasiGtkModulMateri",
    title: "Modul dan Materi Pelatihan",
    category: "Regulasi dan Info GTK",
    description: "Repository modul pelatihan, pedoman ajar, dan materi peningkatan kompetensi GTK.",
    endpoint: "/api/v1/admin/regulasi-gtk/modul-materi",
    queryKey: "regulasi-gtk-modul-materi",
    icon: "📚",
    fields: [
      { name: "judul", label: "Judul Modul / Materi Pelatihan", type: "text", required: true, placeholder: "Contoh: Modul Ajar Diferensiasi Kurikulum Merdeka" },
      { name: "tema", label: "Tema / Bidang Pelatihan", type: "text", required: false, placeholder: "Contoh: Pedagogik & Numerasi" },
      { name: "penyusun", label: "Tim Penyusun / Narasumber", type: "text", required: false, placeholder: "Contoh: Tim Balai Guru Penggerak" },
      { name: "tahun", label: "Tahun Terbit", type: "text", required: false, placeholder: "2026" },
      { name: "file", label: "Berkas Dokumen Modul (PDF)", type: "file", required: false, placeholder: "Unggah modul PDF" },
      { name: "link", label: "Tautan Materi / Video Penjelas", type: "text", required: false, placeholder: "https://..." }
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
    entity: "RegulasiGtkRegulasi",
    title: "Regulasi GTK",
    category: "Regulasi dan Info GTK",
    description: "Himpunan produk hukum, Perbup, dan SK Kadis terkait Guru dan Tenaga Kependidikan.",
    endpoint: "/api/v1/admin/regulasi-gtk/regulasi",
    queryKey: "regulasi-gtk-regulasi",
    icon: "📜",
    fields: [
      { name: "nomor_regulasi", label: "Nomor Dokumen Regulasi / Surat Keputusan", type: "text", required: true, placeholder: "Contoh: Perbup No. 14 Tahun 2026" },
      { name: "tentang", label: "Tentang / Pokok Regulasi", type: "textarea", required: true, placeholder: "Uraian isi ketentuan regulasi..." },
      { name: "tahun", label: "Tahun Penetapan", type: "text", required: true, placeholder: "2026" },
      { name: "jenis", label: "Jenis Produk Hukum", type: "text", required: false, placeholder: "Contoh: Peraturan Bupati / Keputusan Kadis" },
      { name: "file", label: "Salinan Dokumen Regulasi (PDF)", type: "file", required: false, placeholder: "Unggah dokumen regulasi PDF" }
    ],
    tableCols: [
      { key: "nomor_regulasi", label: "Nomor Regulasi" },
      { key: "tentang", label: "Tentang" },
      { key: "tahun", label: "Tahun" },
      { key: "file", label: "Berkas" }
    ]
  },

  // 11. PPDB
  {
    dir: "app/(admin)/admin/ppdb/paud",
    entity: "PpdbPaud",
    title: "PPDB PAUD",
    category: "PPDB",
    description: "Pendaftaran peserta didik baru jenjang PAUD dan Taman Kanak-Kanak.",
    endpoint: "/api/v1/admin/ppdb/paud",
    queryKey: "ppdb-paud",
    icon: "🚼",
    fields: [
      { name: "nama", label: "Nama Lengkap Calon Siswa", type: "text", required: true, placeholder: "Nama lengkap calon siswa" },
      { name: "nm_panggilan", label: "Nama Panggilan", type: "text", required: false, placeholder: "Nama panggilan" },
      { name: "jns_kelamin", label: "Jenis Kelamin", type: "select", required: true, options: [{ value: "Laki-laki", label: "Laki-laki" }, { value: "Perempuan", label: "Perempuan" }], placeholder: "Pilih jenis kelamin" },
      { name: "nik", label: "NIK Calon Siswa", type: "text", required: true, placeholder: "16 digit NIK" },
      { name: "tmp_lahir", label: "Tempat Lahir", type: "text", required: false, placeholder: "Tempat lahir" },
      { name: "tgl_lahir", label: "Tanggal Lahir", type: "date", required: false },
      { name: "agama", label: "Agama (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/agama/option", masterQueryKey: "master-ppdb-agama-option", hookName: "Agama", placeholder: "Pilih agama" },
      { name: "alamat", label: "Alamat Tempat Tinggal", type: "textarea", required: false, placeholder: "Alamat jalan / RT / RW" },
      { name: "rt_rw", label: "RT / RW", type: "text", required: false, placeholder: "Contoh: 001/002" },
      { name: "dusun", label: "Dusun / Lingkungan", type: "text", required: false, placeholder: "Nama dusun" },
      { name: "kode_pos", label: "Kode Pos", type: "text", required: false, placeholder: "Kode pos" },
      { name: "tmp_tinggal", label: "Status Tempat Tinggal (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/tempat-tinggal/option", masterQueryKey: "master-ppdb-tempat-tinggal-option", hookName: "TempatTinggal", placeholder: "Pilih status tempat tinggal" },
      { name: "moda_transportasi", label: "Moda Transportasi (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/transportasi/option", masterQueryKey: "master-ppdb-transportasi-option", hookName: "Transportasi", placeholder: "Pilih moda transportasi" },
      { name: "nama_ayah", label: "Nama Ayah Kandung", type: "text", required: false, placeholder: "Nama ayah" },
      { name: "nik_ayah", label: "NIK Ayah", type: "text", required: false, placeholder: "NIK ayah" },
      { name: "pendidikan_ayah", label: "Pendidikan Ayah (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pendidikan/option", masterQueryKey: "master-ppdb-pendidikan-option", hookName: "Pendidikan", placeholder: "Pilih pendidikan ayah" },
      { name: "pekerjaan_ayah", label: "Pekerjaan Ayah (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pekerjaan/option", masterQueryKey: "master-ppdb-pekerjaan-option", hookName: "Pekerjaan", placeholder: "Pilih pekerjaan ayah" },
      { name: "penghasilan_ayah", label: "Penghasilan Ayah (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/penghasilan/option", masterQueryKey: "master-ppdb-penghasilan-option", hookName: "Penghasilan", placeholder: "Pilih penghasilan ayah" },
      { name: "nama_ibu", label: "Nama Ibu Kandung", type: "text", required: false, placeholder: "Nama ibu" },
      { name: "nik_ibu", label: "NIK Ibu", type: "text", required: false, placeholder: "NIK ibu" },
      { name: "pendidikan_ibu", label: "Pendidikan Ibu (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pendidikan/option", masterQueryKey: "master-ppdb-pendidikan-option", hookName: "Pendidikan", placeholder: "Pilih pendidikan ibu" },
      { name: "pekerjaan_ibu", label: "Pekerjaan Ibu (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pekerjaan/option", masterQueryKey: "master-ppdb-pekerjaan-option", hookName: "Pekerjaan", placeholder: "Pilih pekerjaan ibu" },
      { name: "penghasilan_ibu", label: "Penghasilan Ibu (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/penghasilan/option", masterQueryKey: "master-ppdb-penghasilan-option", hookName: "Penghasilan", placeholder: "Pilih penghasilan ibu" },
      { name: "nama_wali", label: "Nama Wali Murid", type: "text", required: false, placeholder: "Nama wali (jika ada)" },
      { name: "file", label: "Berkas Lampiran KK / Akta (PDF/Gambar)", type: "file", required: false, placeholder: "Unggah dokumen berkas" }
    ],
    tableCols: [
      { key: "nama", label: "Calon Siswa" },
      { key: "jns_kelamin", label: "L/P" },
      { key: "nik", label: "NIK" },
      { key: "agama", label: "Agama" },
      { key: "tmp_tinggal", label: "Tempat Tinggal" },
      { key: "moda_transportasi", label: "Transportasi" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/ppdb/sd",
    entity: "PpdbSd",
    title: "PPDB SD",
    category: "PPDB",
    description: "Pendaftaran peserta didik baru jenjang Sekolah Dasar jalur zonasi, afirmasi, dan mutasi.",
    endpoint: "/api/v1/admin/ppdb/sd",
    queryKey: "ppdb-sd",
    icon: "🎒",
    fields: [
      { name: "nama", label: "Nama Lengkap Calon Siswa", type: "text", required: true, placeholder: "Nama lengkap calon siswa" },
      { name: "nm_panggilan", label: "Nama Panggilan", type: "text", required: false, placeholder: "Nama panggilan" },
      { name: "jns_kelamin", label: "Jenis Kelamin", type: "select", required: true, options: [{ value: "Laki-laki", label: "Laki-laki" }, { value: "Perempuan", label: "Perempuan" }], placeholder: "Pilih jenis kelamin" },
      { name: "nisn", label: "NISN (Jika Ada)", type: "text", required: false, placeholder: "10 digit NISN" },
      { name: "nik", label: "NIK Calon Siswa", type: "text", required: true, placeholder: "16 digit NIK" },
      { name: "tmp_lahir", label: "Tempat Lahir", type: "text", required: false, placeholder: "Tempat lahir" },
      { name: "tgl_lahir", label: "Tanggal Lahir", type: "date", required: false },
      { name: "agama", label: "Agama (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/agama/option", masterQueryKey: "master-ppdb-agama-option", hookName: "Agama", placeholder: "Pilih agama" },
      { name: "alamat", label: "Alamat Tempat Tinggal", type: "textarea", required: false, placeholder: "Alamat jalan / RT / RW" },
      { name: "rt_rw", label: "RT / RW", type: "text", required: false, placeholder: "Contoh: 001/002" },
      { name: "dusun", label: "Dusun / Lingkungan", type: "text", required: false, placeholder: "Nama dusun" },
      { name: "kode_pos", label: "Kode Pos", type: "text", required: false, placeholder: "Kode pos" },
      { name: "tmp_tinggal", label: "Status Tempat Tinggal (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/tempat-tinggal/option", masterQueryKey: "master-ppdb-tempat-tinggal-option", hookName: "TempatTinggal", placeholder: "Pilih status tempat tinggal" },
      { name: "moda_transportasi", label: "Moda Transportasi (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/transportasi/option", masterQueryKey: "master-ppdb-transportasi-option", hookName: "Transportasi", placeholder: "Pilih moda transportasi" },
      { name: "nama_ayah", label: "Nama Ayah Kandung", type: "text", required: false, placeholder: "Nama ayah" },
      { name: "nik_ayah", label: "NIK Ayah", type: "text", required: false, placeholder: "NIK ayah" },
      { name: "pendidikan_ayah", label: "Pendidikan Ayah (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pendidikan/option", masterQueryKey: "master-ppdb-pendidikan-option", hookName: "Pendidikan", placeholder: "Pilih pendidikan ayah" },
      { name: "pekerjaan_ayah", label: "Pekerjaan Ayah (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pekerjaan/option", masterQueryKey: "master-ppdb-pekerjaan-option", hookName: "Pekerjaan", placeholder: "Pilih pekerjaan ayah" },
      { name: "penghasilan_ayah", label: "Penghasilan Ayah (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/penghasilan/option", masterQueryKey: "master-ppdb-penghasilan-option", hookName: "Penghasilan", placeholder: "Pilih penghasilan ayah" },
      { name: "nama_ibu", label: "Nama Ibu Kandung", type: "text", required: false, placeholder: "Nama ibu" },
      { name: "nik_ibu", label: "NIK Ibu", type: "text", required: false, placeholder: "NIK ibu" },
      { name: "pendidikan_ibu", label: "Pendidikan Ibu (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pendidikan/option", masterQueryKey: "master-ppdb-pendidikan-option", hookName: "Pendidikan", placeholder: "Pilih pendidikan ibu" },
      { name: "pekerjaan_ibu", label: "Pekerjaan Ibu (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pekerjaan/option", masterQueryKey: "master-ppdb-pekerjaan-option", hookName: "Pekerjaan", placeholder: "Pilih pekerjaan ibu" },
      { name: "penghasilan_ibu", label: "Penghasilan Ibu (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/penghasilan/option", masterQueryKey: "master-ppdb-penghasilan-option", hookName: "Penghasilan", placeholder: "Pilih penghasilan ibu" },
      { name: "nama_wali", label: "Nama Wali Murid", type: "text", required: false, placeholder: "Nama wali (jika ada)" },
      { name: "file", label: "Berkas Persyaratan (PDF/Gambar)", type: "file", required: false, placeholder: "Unggah dokumen persyaratan" }
    ],
    tableCols: [
      { key: "nama", label: "Calon Siswa" },
      { key: "jns_kelamin", label: "L/P" },
      { key: "nisn", label: "NISN" },
      { key: "nik", label: "NIK" },
      { key: "agama", label: "Agama" },
      { key: "tmp_tinggal", label: "Tempat Tinggal" },
      { key: "moda_transportasi", label: "Transportasi" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/ppdb/smp",
    entity: "PpdbSmp",
    title: "PPDB SMP",
    category: "PPDB",
    description: "Pendaftaran peserta didik baru jenjang SMP jalur zonasi, afirmasi, mutasi, dan prestasi.",
    endpoint: "/api/v1/admin/ppdb/smp",
    queryKey: "ppdb-smp",
    icon: "🏫",
    fields: [
      { name: "nama", label: "Nama Lengkap Calon Siswa", type: "text", required: true, placeholder: "Nama lengkap calon siswa" },
      { name: "nm_panggilan", label: "Nama Panggilan", type: "text", required: false, placeholder: "Nama panggilan" },
      { name: "jns_kelamin", label: "Jenis Kelamin", type: "select", required: true, options: [{ value: "Laki-laki", label: "Laki-laki" }, { value: "Perempuan", label: "Perempuan" }], placeholder: "Pilih jenis kelamin" },
      { name: "nisn", label: "NISN", type: "text", required: true, placeholder: "10 digit NISN" },
      { name: "nik", label: "NIK Calon Siswa", type: "text", required: true, placeholder: "16 digit NIK" },
      { name: "tmp_lahir", label: "Tempat Lahir", type: "text", required: false, placeholder: "Tempat lahir" },
      { name: "tgl_lahir", label: "Tanggal Lahir", type: "date", required: false },
      { name: "agama", label: "Agama (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/agama/option", masterQueryKey: "master-ppdb-agama-option", hookName: "Agama", placeholder: "Pilih agama" },
      { name: "alamat", label: "Alamat Tempat Tinggal", type: "textarea", required: false, placeholder: "Alamat jalan / RT / RW" },
      { name: "rt_rw", label: "RT / RW", type: "text", required: false, placeholder: "Contoh: 001/002" },
      { name: "dusun", label: "Dusun / Lingkungan", type: "text", required: false, placeholder: "Nama dusun" },
      { name: "kode_pos", label: "Kode Pos", type: "text", required: false, placeholder: "Kode pos" },
      { name: "tmp_tinggal", label: "Status Tempat Tinggal (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/tempat-tinggal/option", masterQueryKey: "master-ppdb-tempat-tinggal-option", hookName: "TempatTinggal", placeholder: "Pilih status tempat tinggal" },
      { name: "moda_transportasi", label: "Moda Transportasi (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/transportasi/option", masterQueryKey: "master-ppdb-transportasi-option", hookName: "Transportasi", placeholder: "Pilih moda transportasi" },
      { name: "nama_ayah", label: "Nama Ayah Kandung", type: "text", required: false, placeholder: "Nama ayah" },
      { name: "nik_ayah", label: "NIK Ayah", type: "text", required: false, placeholder: "NIK ayah" },
      { name: "pendidikan_ayah", label: "Pendidikan Ayah (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pendidikan/option", masterQueryKey: "master-ppdb-pendidikan-option", hookName: "Pendidikan", placeholder: "Pilih pendidikan ayah" },
      { name: "pekerjaan_ayah", label: "Pekerjaan Ayah (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pekerjaan/option", masterQueryKey: "master-ppdb-pekerjaan-option", hookName: "Pekerjaan", placeholder: "Pilih pekerjaan ayah" },
      { name: "penghasilan_ayah", label: "Penghasilan Ayah (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/penghasilan/option", masterQueryKey: "master-ppdb-penghasilan-option", hookName: "Penghasilan", placeholder: "Pilih penghasilan ayah" },
      { name: "nama_ibu", label: "Nama Ibu Kandung", type: "text", required: false, placeholder: "Nama ibu" },
      { name: "nik_ibu", label: "NIK Ibu", type: "text", required: false, placeholder: "NIK ibu" },
      { name: "pendidikan_ibu", label: "Pendidikan Ibu (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pendidikan/option", masterQueryKey: "master-ppdb-pendidikan-option", hookName: "Pendidikan", placeholder: "Pilih pendidikan ibu" },
      { name: "pekerjaan_ibu", label: "Pekerjaan Ibu (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/pekerjaan/option", masterQueryKey: "master-ppdb-pekerjaan-option", hookName: "Pekerjaan", placeholder: "Pilih pekerjaan ibu" },
      { name: "penghasilan_ibu", label: "Penghasilan Ibu (Master PPDB)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/ppdb/penghasilan/option", masterQueryKey: "master-ppdb-penghasilan-option", hookName: "Penghasilan", placeholder: "Pilih penghasilan ibu" },
      { name: "nama_wali", label: "Nama Wali Murid", type: "text", required: false, placeholder: "Nama wali (jika ada)" },
      { name: "file", label: "Berkas Persyaratan (PDF/Gambar)", type: "file", required: false, placeholder: "Unggah dokumen persyaratan" }
    ],
    tableCols: [
      { key: "nama", label: "Calon Siswa" },
      { key: "jns_kelamin", label: "L/P" },
      { key: "nisn", label: "NISN" },
      { key: "nik", label: "NIK" },
      { key: "agama", label: "Agama" },
      { key: "tmp_tinggal", label: "Tempat Tinggal" },
      { key: "moda_transportasi", label: "Transportasi" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/kuota-ppdb",
    entity: "KuotaPpdb",
    title: "Kuota PPDB",
    category: "PPDB",
    description: "Penetapan alokasi daya tampung dan kuota jalur pendaftaran tiap satuan pendidikan.",
    endpoint: "/api/v1/admin/kuota-ppdb",
    queryKey: "kuota-ppdb",
    icon: "🎯",
    fields: [
      { name: "sekolah", label: "Nama Satuan Pendidikan", type: "text", required: true, placeholder: "Contoh: SMPN 22 Konawe Selatan" },
      { name: "jenjang", label: "Jenjang Pendidikan", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/jenjang/option", masterQueryKey: "master-jenjang-option", hookName: "Jenjang", placeholder: "Pilih jenjang" },
      { name: "total_kuota", label: "Total Daya Tampung (Siswa)", type: "number", required: true, placeholder: "Contoh: 128" },
      { name: "jalur_zonasi", label: "Alokasi Kuota Zonasi", type: "number", required: false, placeholder: "Contoh: 70" },
      { name: "jalur_afirmasi", label: "Alokasi Kuota Afirmasi", type: "number", required: false, placeholder: "Contoh: 20" },
      { name: "jalur_prestasi", label: "Alokasi Kuota Prestasi", type: "number", required: false, placeholder: "Contoh: 30" },
      { name: "jalur_mutasi", label: "Alokasi Kuota Mutasi", type: "number", required: false, placeholder: "Contoh: 8" }
    ],
    tableCols: [
      { key: "sekolah", label: "Sekolah" },
      { key: "jenjang", label: "Jenjang" },
      { key: "total_kuota", label: "Total Kuota" },
      { key: "jalur_zonasi", label: "Zonasi" },
      { key: "jalur_afirmasi", label: "Afirmasi" }
    ]
  },

  // 12. Jurnal V2
  {
    dir: "app/(admin)/admin/jurnal/guru-kelas",
    entity: "JurnalGuruKelas",
    title: "Jurnal Guru Kelas",
    category: "Jurnal V2",
    description: "Dokumentasi pelaksanaan KBM guru kelas, tema ajar, model pembelajaran, dan evaluasi harian.",
    endpoint: "/api/v1/admin/jurnal/guru-kelas",
    queryKey: "jurnal-guru-kelas",
    icon: "📖",
    fields: [
      { name: "tgl", label: "Tanggal Pelaksanaan KBM", type: "date", required: true },
      { name: "tema", label: "Tema / Bahan Ajar", type: "text", required: true, placeholder: "Contoh: Indahnya Kebersamaan" },
      { name: "materi_pokok", label: "Materi Pokok Pembelajaran", type: "text", required: true, placeholder: "Contoh: Keberagaman Suku Bangsa" },
      { name: "pertemuan_ke", label: "Pertemuan Ke-", type: "number", required: false, placeholder: "Contoh: 1" },
      { name: "model_pembelajaran", label: "Model Pembelajaran (Master Model)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/model-pembelajaran/option", masterQueryKey: "master-model-pembelajaran-option", hookName: "ModelPembelajaran", placeholder: "Pilih model pembelajaran" },
      { name: "metode_pembelajaran", label: "Metode Pembelajaran", type: "text", required: false, placeholder: "Contoh: Diskusi, Demonstrasi, Tanya Jawab" },
      { name: "kegiatan", label: "Uraian Ringkas Aktivitas KBM", type: "textarea", required: false, placeholder: "Ringkasan kegiatan mengajar..." },
      { name: "penilaian", label: "Teknik Penilaian Pembelajaran", type: "text", required: false, placeholder: "Contoh: Penilaian Sikap & Kuis Formatif" },
      { name: "siswa_hadir", label: "Jumlah Siswa Hadir", type: "number", required: false, placeholder: "Contoh: 28" },
      { name: "persentase", label: "Persentase Kehadiran (%)", type: "number", required: false, placeholder: "Contoh: 100" },
      { name: "file", label: "Dokumentasi / Foto KBM", type: "file", required: false, placeholder: "Unggah foto KBM" }
    ],
    tableCols: [
      { key: "tema", label: "Tema / Bahan" },
      { key: "materi_pokok", label: "Materi Pokok" },
      { key: "model_pembelajaran", label: "Model Pembelajaran" },
      { key: "tgl", label: "Tanggal" },
      { key: "siswa_hadir", label: "Hadir" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/jurnal/kepala-sekolah",
    entity: "JurnalKepalaSekolah",
    title: "Jurnal Kepala Sekolah",
    category: "Jurnal V2",
    description: "Pencatatan aktivitas manajerial, supervisi internal guru, dan pembinaan komite sekolah.",
    endpoint: "/api/v1/admin/jurnal/kepala-sekolah",
    queryKey: "jurnal-kepala-sekolah",
    icon: "🖊️",
    fields: [
      { name: "tgl", label: "Tanggal Kegiatan", type: "date", required: true },
      { name: "uraian", label: "Tajuk / Uraian Kegiatan Kepemimpinan", type: "text", required: true, placeholder: "Contoh: Rapat Evaluasi RKT dan RKAS" },
      { name: "target", label: "Target Peningkatan Tata Kelola", type: "text", required: false, placeholder: "Contoh: Kepatuhan 100% pelaporan ARKAS" },
      { name: "hasil", label: "Hasil / Capaian Kegiatan", type: "textarea", required: false, placeholder: "Hasil evaluasi..." },
      { name: "keterlibatan", label: "Pihak yang Terlibat", type: "text", required: false, placeholder: "Contoh: Seluruh Dewan Guru dan Komite" },
      { name: "keterangan", label: "Catatan Tambahan / Rekomendasi", type: "textarea", required: false, placeholder: "Catatan..." },
      { name: "file", label: "Dokumen / Berita Acara (PDF/Gambar)", type: "file", required: false, placeholder: "Unggah dokumen pendukung" }
    ],
    tableCols: [
      { key: "uraian", label: "Uraian Kegiatan" },
      { key: "target", label: "Target" },
      { key: "tgl", label: "Tanggal" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },
  {
    dir: "app/(admin)/admin/jurnal/pengawas",
    entity: "JurnalPengawas",
    title: "Jurnal Pengawas Sekolah",
    category: "Jurnal V2",
    description: "Pelaporan pendampingan klinis, pengawasan manajerial, dan supervisi akademik sekolah binaan.",
    endpoint: "/api/v1/admin/jurnal/pengawas",
    queryKey: "jurnal-pengawas",
    icon: "🧐",
    fields: [
      { name: "tgl", label: "Tanggal Kunjungan / Supervisi", type: "date", required: true },
      { name: "kepsek", label: "Kepala Sekolah yang Disupervisi", type: "text", required: false, placeholder: "Nama Kepala Satuan Pendidikan" },
      { name: "pendampingan_id", label: "Tahapan Siklus Pendampingan (Master Pendampingan)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/pendampingan/option", masterQueryKey: "master-pendampingan-option", hookName: "Pendampingan", placeholder: "Pilih tahapan pendampingan" },
      { name: "tugas_id", label: "Fungsi Penugasan (Master Tugas)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/tugas/option", masterQueryKey: "master-tugas-option", hookName: "Tugas", placeholder: "Pilih peran penugasan" },
      { name: "temuan_akademik", label: "Temuan Supervisi Akademik", type: "textarea", required: false, placeholder: "Catatan perangkat ajar & KBM guru..." },
      { name: "temuan_manajerial", label: "Temuan Supervisi Manajerial", type: "textarea", required: false, placeholder: "Catatan administrasi sekolah..." },
      { name: "tindak_lanjut", label: "Rencana Tindak Lanjut / Rekomendasi", type: "textarea", required: false, placeholder: "Tindak lanjut..." },
      { name: "file", label: "Instrumen Supervisi / Laporan (PDF)", type: "file", required: false, placeholder: "Unggah instrumen pembinaan" }
    ],
    tableCols: [
      { key: "kepsek", label: "Kepala Sekolah" },
      { key: "pendampingan_id", label: "Tahapan Pendampingan" },
      { key: "tugas_id", label: "Fungsi Tugas" },
      { key: "tgl", label: "Tanggal" },
      { key: "unit_kerja", label: "Sekolah Binaan" }
    ]
  },
  {
    dir: "app/(admin)/admin/jurnal/bk",
    entity: "JurnalBk",
    title: "Jurnal Bimbingan Konseling (BK)",
    category: "Jurnal V2",
    description: "Pendokumentasian layanan bimbingan konseling peserta didik: bimbingan pribadi, sosial, belajar, dan karir.",
    endpoint: "/api/v1/admin/jurnal/bk",
    queryKey: "jurnal-bk",
    icon: "🧘",
    fields: [
      { name: "tgl", label: "Tanggal Pelaksanaan Layanan BK", type: "date", required: true },
      { name: "nm_siswa", label: "Nama Peserta Didik (Master Siswa)", type: "select", required: true, masterEndpoint: "/api/v1/admin/master/siswa/option", masterQueryKey: "master-siswa-option", hookName: "Siswa", placeholder: "Pilih siswa konseling" },
      { name: "kelas_id", label: "Tingkat / Kelas Siswa (Master Kelas)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/jurnal/kelas/option", masterQueryKey: "master-kelas-option", hookName: "Kelas", placeholder: "Pilih kelas" },
      { name: "jns_layanan_id", label: "Bidang Layanan BK (Master BK Jenis Layanan)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/bk-jenis-layanan/option", masterQueryKey: "master-bk-jenis-layanan-option", hookName: "JenisLayanan", placeholder: "Pilih bidang layanan" },
      { name: "mdl_kegiatan_id", label: "Format / Kegiatan Layanan (Master BK Kegiatan Layanan)", type: "select", required: false, masterEndpoint: "/api/v1/admin/master/bk-kegiatan-layanan/option", masterQueryKey: "master-bk-kegiatan-layanan-option", hookName: "KegiatanLayanan", placeholder: "Pilih format kegiatan" },
      { name: "materi_layanan", label: "Topik / Materi Layanan", type: "text", required: false, placeholder: "Contoh: Bimbingan Disiplin & Motivasi Belajar" },
      { name: "permasalahan", label: "Gejala / Masalah yang Dihadapi", type: "textarea", required: false, placeholder: "Uraian problematika..." },
      { name: "hasil", label: "Hasil Konseling yang Dicapai", type: "textarea", required: false, placeholder: "Hasil kesepakatan konseling..." },
      { name: "rnc_tindak_lanjut", label: "Rencana Tindak Lanjut Penanganan", type: "textarea", required: false, placeholder: "Rencana pemantauan..." },
      { name: "file", label: "Dokumen Lembar Komitmen / Bukti (PDF/Foto)", type: "file", required: false, placeholder: "Unggah dokumen konseling" }
    ],
    tableCols: [
      { key: "nm_siswa", label: "Nama Siswa" },
      { key: "kelas_id", label: "Kelas" },
      { key: "jns_layanan_id", label: "Bidang Layanan" },
      { key: "mdl_kegiatan_id", label: "Format Kegiatan" },
      { key: "tgl", label: "Tanggal" },
      { key: "unit_kerja", label: "Satuan Pendidikan" }
    ]
  },

  // 13. Publish (Custom pages preserved)
  {
    dir: "app/(admin)/admin/publish/berita",
    entity: "Berita",
    title: "Manajemen Berita",
    category: "Publish",
    description: "Pengelolaan artikel berita seputar pendidikan dan kebudayaan daerah.",
    endpoint: "/api/v1/admin/publish/berita",
    queryKey: "publish-berita",
    icon: "📰",
    skipRefactor: true,
    fields: [],
    tableCols: []
  },
  {
    dir: "app/(admin)/admin/publish/pengumuman",
    entity: "Pengumuman",
    title: "Manajemen Pengumuman",
    category: "Publish",
    description: "Publikasi pengumuman penting dinas untuk khalayak umum.",
    endpoint: "/api/v1/admin/publish/pengumuman",
    queryKey: "publish-pengumuman",
    icon: "📢",
    skipRefactor: true,
    fields: [],
    tableCols: []
  },
  {
    dir: "app/(admin)/admin/publish/pendidikan",
    entity: "Pendidikan",
    title: "Artikel Pendidikan",
    category: "Publish",
    description: "Pengelolaan artikel edukatif, info kurikulum, dan direktori GTK.",
    endpoint: "/api/v1/admin/publish/pendidikan",
    queryKey: "publish-pendidikan",
    icon: "🎓",
    skipRefactor: true,
    fields: [],
    tableCols: []
  },
  {
    dir: "app/(admin)/admin/publish/kebudayaan",
    entity: "Kebudayaan",
    title: "Artikel Kebudayaan",
    category: "Publish",
    description: "Promosi agenda festival budaya, sanggar seni, dan situs warisan daerah.",
    endpoint: "/api/v1/admin/publish/kebudayaan",
    queryKey: "publish-kebudayaan",
    icon: "🎭",
    skipRefactor: true,
    fields: [],
    tableCols: []
  },
  {
    dir: "app/(admin)/admin/publish/layanan",
    entity: "Layanan",
    title: "Layanan Publik",
    category: "Publish",
    description: "Pengelolaan informasi standar operasional prosedur dan penanggung jawab layanan dinas.",
    endpoint: "/api/v1/admin/publish/layanan",
    queryKey: "publish-layanan",
    icon: "🏛️",
    skipRefactor: true,
    fields: [],
    tableCols: []
  },
  {
    dir: "app/(admin)/admin/publish/statistik",
    entity: "Statistik",
    title: "Data Statistik",
    category: "Publish",
    description: "Pengelolaan indikator capaian, SPM, dan indeks kepuasan publik.",
    endpoint: "/api/v1/admin/publish/statistik",
    queryKey: "publish-statistik",
    icon: "📊",
    skipRefactor: true,
    fields: [],
    tableCols: []
  },
  {
    dir: "app/(admin)/admin/publish/profil",
    entity: "Profil",
    title: "Profil Dinas",
    category: "Publish",
    description: "Pengelolaan profil organisasi dinas, tupoksi, dan pimpinan.",
    endpoint: "/api/v1/admin/publish/profil",
    queryKey: "publish-profil",
    icon: "🏢",
    skipRefactor: true,
    fields: [],
    tableCols: []
  },
  {
    dir: "app/(admin)/admin/publish/banner",
    entity: "Banner",
    title: "Banner Carousel",
    category: "Publish",
    description: "Pengaturan slide sorotan visual beranda portal publik.",
    endpoint: "/api/v1/admin/publish/banner",
    queryKey: "publish-banner",
    icon: "🖼️",
    skipRefactor: true,
    fields: [],
    tableCols: []
  },
  {
    dir: "app/(admin)/admin/publish/kontak",
    entity: "Kontak",
    title: "Pesan Masuk",
    category: "Publish",
    description: "Pengelolaan aspirasi, aduan, dan pesan kontak masyarakat.",
    endpoint: "/api/v1/admin/publish/kontak",
    queryKey: "publish-kontak",
    icon: "✉️",
    skipRefactor: true,
    fields: [],
    tableCols: []
  }
];
