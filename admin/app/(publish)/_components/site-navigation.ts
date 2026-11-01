export type NavItem = {
  id: string;
  label: string;
  href: string;
  children?: {
    id: string;
    label: string;
    description: string;
    href: string;
    icon: string;
  }[];
};

export type FooterLink = {
  id: string;
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  {
    id: "home",
    label: "Beranda",
    href: "/",
  },
  {
    id: "about",
    label: "Tentang Kami",
    href: "/tentang-kami",
    children: [
      {
        id: "profile",
        label: "Profil & Visi Misi",
        description: "Mengenal struktur organisasi, tugas pokok, dan visi misi dinas.",
        href: "/tentang-kami",
        icon: "🏛️",
      },
      {
        id: "standards",
        label: "Standar Pelayanan",
        description: "Maklumat dan komitmen integritas pelayanan publik tanpa pungli.",
        href: "/tentang-kami/standar-pelayanan",
        icon: "📋",
      },
      {
        id: "contact",
        label: "Kontak & Pengaduan",
        description: "Kanal aspirasi, lokasi kantor, dan nomor telepon kedinasan.",
        href: "/tentang-kami/kontak",
        icon: "💬",
      },
    ],
  },
  {
    id: "public-services",
    label: "Layanan Publik",
    href: "/layanan-publik",
    children: [
      {
        id: "school-finder",
        label: "Cari Sekolah",
        description: "Pangkalan data direktori seluruh satuan pendidikan PAUD, SD, dan SMP se-Konsel.",
        href: "/layanan-publik/cari-sekolah",
        icon: "🏫",
      },
      {
        id: "fast-services",
        label: "Layanan Cepat",
        description: "Legalisir ijazah, rekomendasi operasional, dan mutasi siswa.",
        href: "/layanan-publik/layanan-cepat",
        icon: "⚡",
      },
    ],
  },
  {
    id: "education",
    label: "Pendidikan",
    href: "/pendidikan",
    children: [
      {
        id: "curriculum",
        label: "Kurikulum & Program",
        description: "Penerapan Kurikulum Merdeka, modul ajar, dan program prioritas.",
        href: "/pendidikan/kurikulum",
        icon: "📚",
      },
      {
        id: "teachers",
        label: "GTK & Pendidik",
        description: "Kompetensi guru penggerak, sertifikasi, dan pengembangan keprofesian.",
        href: "/pendidikan/tenaga-kependidikan",
        icon: "👨‍🏫",
      },
    ],
  },
  {
    id: "culture",
    label: "Kebudayaan",
    href: "/kebudayaan",
    children: [
      {
        id: "heritage",
        label: "Cagar & Warisan Budaya",
        description: "Pelestarian tradisi Tolaki dan cagar budaya Konawe Selatan.",
        href: "/kebudayaan",
        icon: "🏺",
      },
      {
        id: "festivals",
        label: "Agenda Festival",
        description: "Jadwal pameran, festival seni tradisi, dan kalender kebudayaan.",
        href: "/kebudayaan/agenda-festival",
        icon: "🎭",
      },
      {
        id: "communities",
        label: "Sanggar Seni & Komunitas",
        description: "Direktori paguyuban dan sanggar binaan bidang kebudayaan.",
        href: "/kebudayaan/sanggar-komunitas",
        icon: "🪕",
      },
    ],
  },
  {
    id: "data",
    label: "Data & Statistik",
    href: "/data-statistik",
    children: [
      {
        id: "dashboard",
        label: "Indikator Kinerja",
        description: "Angka Partisipasi Murni, rasio murid-guru, dan ringkasan mutu.",
        href: "/data-statistik",
        icon: "📊",
      },
      {
        id: "satisfaction",
        label: "Survei Kepuasan",
        description: "Hasil indeks kepuasan masyarakat terhadap layanan dinas.",
        href: "/data-statistik/indeks-kepuasan",
        icon: "⭐",
      },
    ],
  },
  {
    id: "news",
    label: "Berita",
    href: "/berita",
  },
  {
    id: "announcements",
    label: "Pengumuman",
    href: "/pengumuman",
  },
];

export const footerQuickLinks: FooterLink[] = [
  { id: "fl-1", label: "Profil & Visi Misi", href: "/tentang-kami" },
  { id: "fl-2", label: "Cari Sekolah Terdekat", href: "/layanan-publik/cari-sekolah" },
  { id: "fl-3", label: "Warta & Berita Resmi", href: "/berita" },
  { id: "fl-4", label: "Papan Pengumuman", href: "/pengumuman" },
  { id: "fl-5", label: "Warisan Budaya Konsel", href: "/kebudayaan" },
  { id: "fl-6", label: "Portal Admin EduSetara", href: "/admin" },
];

export const footerServices: FooterLink[] = [
  { id: "fs-1", label: "Legalisir Ijazah", href: "/layanan-publik/layanan-cepat" },
  { id: "fs-2", label: "Rekomendasi Mutasi Siswa", href: "/layanan-publik/layanan-cepat" },
  { id: "fs-3", label: "Konsultasi Dana BOSP", href: "/layanan-publik" },
  { id: "fs-4", label: "Informasi Tunjangan GTK", href: "/pendidikan/tenaga-kependidikan" },
  { id: "fs-5", label: "Standar Layanan Publik", href: "/tentang-kami/standar-pelayanan" },
  { id: "fs-6", label: "Kanal Kontak & Aduan", href: "/tentang-kami/kontak" },
];
