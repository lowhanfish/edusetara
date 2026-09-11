export type NavItem = {
  label: string;
  href: string;
  children?: {
    label: string;
    description: string;
    href: string;
    icon: string;
  }[];
};

export const navItems: NavItem[] = [
  { label: "Beranda", href: "#beranda" },
  {
    label: "Tentang Kami",
    href: "#tentang-kami",
    children: [
      {
        label: "Profil Dinas",
        description: "Mengenal Dikbud Konawe Selatan",
        href: "#tentang-kami",
        icon: "⌂",
      },
      {
        label: "Standar Pelayanan",
        description: "Komitmen dan dokumen pelayanan",
        href: "#standar-pelayanan",
        icon: "▤",
      },
      {
        label: "Kontak & Alamat",
        description: "Lokasi dan kanal komunikasi resmi",
        href: "#footer",
        icon: "⌖",
      },
    ],
  },
  {
    label: "Layanan Publik",
    href: "#layanan",
    children: [
      {
        label: "Layanan Berdasarkan Pengguna",
        description: "Untuk siswa, guru, sekolah, dan operator",
        href: "#layanan",
        icon: "♙",
      },
      {
        label: "Layanan Cepat",
        description: "Dapodik, regulasi, pengaduan, dan unduhan",
        href: "#layanan-cepat",
        icon: "↗",
      },
      {
        label: "Cari Sekolah",
        description: "Temukan sekolah berdasarkan wilayah",
        href: "#cari-sekolah",
        icon: "⌕",
      },
    ],
  },
  {
    label: "Data & Statistik",
    href: "#data-statistik",
    children: [
      {
        label: "Statistik Pendidikan",
        description: "Ringkasan sekolah, siswa, dan tenaga pendidik",
        href: "#data-statistik",
        icon: "▥",
      },
      {
        label: "Indeks Kepuasan",
        description: "Tren kepuasan layanan masyarakat",
        href: "#kepuasan-masyarakat",
        icon: "↗",
      },
      {
        label: "Pengumuman Resmi",
        description: "Jadwal dan pemberitahuan terbaru",
        href: "#pengumuman",
        icon: "◷",
      },
    ],
  },
  {
    label: "Pendidikan",
    href: "#cari-sekolah",
    children: [
      {
        label: "Direktori Sekolah",
        description: "Informasi SD, SMP, dan PAUD",
        href: "#cari-sekolah",
        icon: "⌂",
      },
      {
        label: "Data Pendidikan",
        description: "Statistik pendidikan Konawe Selatan",
        href: "#data-statistik",
        icon: "▥",
      },
      {
        label: "Dokumen Layanan",
        description: "Standar dan maklumat pelayanan",
        href: "#standar-pelayanan",
        icon: "▤",
      },
    ],
  },
  {
    label: "Kebudayaan",
    href: "#kebudayaan",
    children: [
      {
        label: "Warisan Budaya",
        description: "Situs, seni, dan tradisi daerah",
        href: "#kebudayaan",
        icon: "✦",
      },
      {
        label: "Sanggar & Komunitas",
        description: "Pelaku dan ruang kegiatan budaya",
        href: "#kebudayaan",
        icon: "♣",
      },
      {
        label: "Berita Kebudayaan",
        description: "Kabar dan agenda budaya terkini",
        href: "#berita",
        icon: "▣",
      },
    ],
  },
  { label: "Berita", href: "#berita" },
  { label: "Pengumuman", href: "#pengumuman" },
  { label: "Hubungi Kami", href: "#footer" },
];

export const audiences = [
  { icon: "👥", label: "Siswa &\nOrang Tua", tone: "gold" },
  { icon: "🧑‍🏫", label: "Guru & GTK", tone: "sand" },
  { icon: "🏫", label: "Sekolah", tone: "mint" },
  { icon: "💻", label: "Operator", tone: "sand" },
  { icon: "👨‍👩‍👧", label: "Masyarakat", tone: "gold" },
];

export const latestNews = [
  {
    title: "Konawe Selatan Gelar Festival Budaya Daerah 2026",
    date: "4 September 2026",
    category: "Budaya",
  },
  {
    title: "Sosialisasi Kurikulum Merdeka bagi Guru se-Konawe Selatan",
    date: "3 September 2026",
    category: "Pendidikan",
  },
  {
    title: "Dinas Pendidikan Salurkan Bantuan Sarana untuk Sekolah",
    date: "2 September 2026",
    category: "Sarpras",
  },
];

export const announcements = [
  {
    date: "05",
    month: "SEP",
    title: "Pemberitahuan Jadwal Pelaksanaan ANBK 2026",
  },
  {
    date: "03",
    month: "SEP",
    title: "Pengumuman Hasil Seleksi Administrasi PPPK Guru 2026",
  },
  {
    date: "28",
    month: "AGT",
    title: "Undangan Sosialisasi Dapodik Tahun Ajaran 2026/2027",
  },
  {
    date: "25",
    month: "AGT",
    title: "Pelaksanaan Festival Budaya Konawe Selatan 2026",
  },
];

export const quickLinks = [
  {
    icon: "▣",
    title: "Dapodik",
    description: "Unduh aplikasi & informasi terbaru",
    tone: "blue",
  },
  {
    icon: "♙",
    title: "SPM Pendidikan",
    description: "Standar Pelayanan Minimal",
    tone: "gold",
  },
  {
    icon: "♟",
    title: "Pengaduan",
    description: "Sampaikan aspirasi dan pengaduan",
    tone: "teal",
  },
  {
    icon: "▤",
    title: "Regulasi",
    description: "Peraturan & kebijakan",
    tone: "red",
  },
  {
    icon: "↓",
    title: "Download",
    description: "Formulir, dokumen, dan panduan",
    tone: "orange",
  },
  {
    icon: "?",
    title: "FAQ",
    description: "Pertanyaan yang sering diajukan",
    tone: "blue",
  },
];

export const educationStats = [
  { icon: "🏫", value: "612", label: "Jumlah Sekolah", tone: "blue" },
  { icon: "👥", value: "98.274", label: "Jumlah Siswa", tone: "green" },
  { icon: "👨‍🏫", value: "6.315", label: "Jumlah Guru", tone: "orange" },
  { icon: "⌖", value: "25", label: "Kecamatan", tone: "purple" },
];

export const cultureLinks = [
  { icon: "⌂", label: "Situs & Cagar Budaya" },
  { icon: "♨", label: "Seni Tradisional" },
  { icon: "♣", label: "Sanggar & Komunitas" },
  { icon: "▣", label: "Agenda Budaya" },
  { icon: "▤", label: "Galeri Budaya" },
];

export const satisfactionTrend = [
  { value: "85.62%", year: "2022", height: 58 },
  { value: "93.10%", year: "2023", height: 76 },
  { value: "96.14%", year: "2024", height: 88 },
  { value: "92.27%", year: "2025", height: 73 },
  { value: "90.14%", year: "2026", height: 67 },
];

export const serviceStandards = [
  {
    title: "Standar Pelayanan Publik Dikbud Konsel",
    size: "PDF · 1.2 MB",
  },
  { title: "Maklumat Pelayanan", size: "PDF · 800 KB" },
  { title: "Surat Keputusan Layanan", size: "PDF · 1.1 MB" },
];

export const footerQuickLinks = [
  "Beranda",
  "Tentang Kami",
  "Layanan Publik",
  "Data & Statistik",
  "Pendidikan",
  "Kebudayaan",
];

export const footerServices = [
  "Dapodik",
  "Pengaduan",
  "Download",
  "Regulasi",
  "PPID",
  "FAQ",
];
