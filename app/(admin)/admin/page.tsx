import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../_components/ui";

const stats = [
  {
    label: "Total Satuan Sekolah",
    value: "287",
    change: "+3 baru",
    icon: "🏫",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    label: "Tenaga Pendidik & Guru",
    value: "4.231",
    change: "+45 sertifikasi",
    icon: "👨‍🏫",
    color: "bg-sky-100 text-sky-800",
  },
  {
    label: "Peserta Didik Aktif",
    value: "52.847",
    change: "+312 Dapodik",
    icon: "🎓",
    color: "bg-amber-100 text-amber-800",
  },
  {
    label: "Pengumuman Aktif",
    value: "12",
    change: "3 penting",
    icon: "📢",
    color: "bg-rose-100 text-rose-800",
  },
];

const quickActions = [
  { label: "Tulis Berita", icon: "✍️", href: "/admin/berita" },
  { label: "Buat Pengumuman", icon: "📣", href: "/admin/pengumuman" },
  { label: "Data Sekolah", icon: "🏫", href: "/admin/sekolah" },
  { label: "Layanan Publik", icon: "🏛️", href: "/admin/layanan" },
];

const recentNews = [
  {
    id: 1,
    title: "Dikbud Konsel Dorong Pemanfaatan Teknologi & Perangkat Digital",
    category: "Pendidikan",
    date: "05 Sep 2026",
    status: "Terbit",
  },
  {
    id: 2,
    title: "Pelestarian Seni Musik Tradisional Tolaki Melalui Ekstrakurikuler",
    category: "Kebudayaan",
    date: "28 Agu 2026",
    status: "Terbit",
  },
  {
    id: 3,
    title: "Diseminasi Praktik Baik Pembelajaran Berdiferensiasi Jenjang SMP",
    category: "GTK & Guru",
    date: "14 Agu 2026",
    status: "Draft",
  },
  {
    id: 4,
    title: "Revitalisasi Ruang Kelas & Laboratorium IPA 15 SMP Negeri",
    category: "Sarpras",
    date: "02 Agu 2026",
    status: "Terbit",
  },
];

const recentAnnouncements = [
  {
    id: 1,
    title: "Petunjuk Teknis Pelaksanaan ANBK Jenjang SD & SMP",
    category: "Akademik",
    deadline: "28 Sep",
    urgent: true,
  },
  {
    id: 2,
    title: "Verifikasi Berkas Seleksi Calon Kepala Sekolah Tahap II",
    category: "Kepegawaian",
    deadline: "30 Sep",
    urgent: false,
  },
  {
    id: 3,
    title: "Batas Sinkronisasi Dapodik Semester Ganjil TA 2026/2027",
    category: "Dapodik",
    deadline: "Selesai",
    urgent: true,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-[#fff8dd] via-[#ffedaa] to-[#ffe082] rounded-2xl p-6 sm:p-7 border border-[#ffd54f] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#052552] tracking-tight">
            Selamat Datang di Portal Admin! 👋
          </h2>
          <p className="text-xs sm:text-sm text-[#314a6e] font-medium max-w-xl">
            Pusat manajemen konten publikasi, warta kedinasan, layanan publik, dan data pendidikan Kabupaten Konawe Selatan.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-xl text-xs font-bold text-[#052552] shadow-xs border border-white/60 shrink-0">
          <span>📅</span>
          <span>Rabu, 17 September 2026</span>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-all duration-150"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {stat.label}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#052552] tracking-tight block">
                {stat.value}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                {stat.change}
              </span>
            </div>
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${stat.color}`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Action Shortcuts ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-[#ffc400] hover:bg-amber-50/30 text-xs font-bold text-[#052552] transition-all shadow-xs"
          >
            <span className="text-lg">{action.icon}</span>
            <span>{action.label}</span>
            <span className="ml-auto text-slate-300">›</span>
          </Link>
        ))}
      </div>

      {/* ── 2-Column Content Area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Recent News Table */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">📰</span>
                <CardTitle>Publikasi Berita Terkini</CardTitle>
              </div>
              <Link
                href="/admin/berita"
                className="text-xs font-bold text-[#0b3b73] hover:text-[#ffc400] transition-colors"
              >
                Lihat Semua →
              </Link>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Artikel</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentNews.map((news) => (
                  <TableRow key={news.id}>
                    <TableCell className="font-bold text-[#052552] max-w-sm truncate">
                      {news.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="neutral">{news.category}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {news.date}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={news.status === "Terbit" ? "success" : "warning"}
                      >
                        {news.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right 4 Cols: Active Announcements */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">📢</span>
                <CardTitle>Pengumuman Aktif</CardTitle>
              </div>
              <Link
                href="/admin/pengumuman"
                className="text-xs font-bold text-[#0b3b73] hover:text-[#ffc400] transition-colors"
              >
                Semua →
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              {recentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-amber-50/30 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="neutral">{ann.category}</Badge>
                    {ann.urgent ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        PENTING
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Batas: {ann.deadline}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#052552] leading-snug line-clamp-2">
                    {ann.title}
                  </h4>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── System Activity Log ── */}
      <Card>
        <CardHeader className="bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-lg">🕐</span>
            <CardTitle>Riwayat Aktivitas & Pembaruan Sistem</CardTitle>
          </div>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {[
            { text: "Admin menerbitkan artikel: 'Dikbud Konsel Dorong Pemanfaatan Teknologi Digital'", time: "10 menit lalu", icon: "✍️" },
            { text: "Sistem menyinkronkan data Dapodik Semester Ganjil 2026", time: "1 jam lalu", icon: "🔄" },
            { text: "Surat Edaran Petunjuk Teknis ANBK 2026 diunggah ke portal", time: "3 jam lalu", icon: "📢" },
            { text: "Data direktori SDN 12 Andoolo diperbarui", time: "Kemarin", icon: "🏫" },
          ].map((act, i) => (
            <div
              key={i}
              className="px-6 py-3.5 flex items-center justify-between gap-4 text-xs hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm">
                  {act.icon}
                </span>
                <span className="font-semibold text-[#052552]">{act.text}</span>
              </div>
              <span className="text-slate-400 whitespace-nowrap">{act.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
