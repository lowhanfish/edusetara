import Link from "next/link";
import { Icon } from "../_components/admin-icons";
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
    icon: "school",
    color: "bg-emerald-500/15 text-emerald-600",
  },
  {
    label: "Tenaga Pendidik & Guru",
    value: "4.231",
    change: "+45 sertifikasi",
    icon: "users",
    color: "bg-violet-500/15 text-violet-600",
  },
  {
    label: "Peserta Didik Aktif",
    value: "52.847",
    change: "+312 Dapodik",
    icon: "award",
    color: "bg-amber-400/20 text-amber-600",
  },
  {
    label: "Pengumuman Aktif",
    value: "12",
    change: "3 penting",
    icon: "megaphone",
    color: "bg-rose-500/15 text-rose-600",
  },
];

const quickActions = [
  { label: "Tulis Berita", icon: "edit", href: "/admin/berita" },
  { label: "Buat Pengumuman", icon: "megaphone", href: "/admin/pengumuman" },
  { label: "Data Sekolah", icon: "school", href: "/admin/sekolah" },
  { label: "Layanan Publik", icon: "landmark", href: "/admin/layanan" },
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
      <div className="glass rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1f1b4d] tracking-tight">
            Selamat datang di Portal Admin
          </h2>
          <p className="text-xs sm:text-sm text-[#6b6f8f] max-w-xl">
            Pusat manajemen konten publikasi, warta kedinasan, layanan publik, dan data pendidikan Kabupaten Konawe Selatan.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/70 px-3.5 py-2 rounded-2xl text-xs font-medium text-[#4a4770] border border-white/80 shrink-0">
          <Icon name="calendar" size={15} />
          <span>Rabu, 17 September 2026</span>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-3xl p-5 flex items-center justify-between hover:-translate-y-0.5 transition-all duration-150"
          >
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-[#6b6f8f] block">{stat.label}</span>
              <span className="text-2xl sm:text-3xl font-semibold text-[#1f1b4d] tracking-tight block">
                {stat.value}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded-full inline-block">
                {stat.change}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <Icon name={stat.icon} size={22} />
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
            className="glass flex items-center gap-3 p-3.5 rounded-2xl hover:bg-white/80 text-xs font-semibold text-[#1f1b4d] transition-all"
          >
            <span className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-600 flex items-center justify-center"><Icon name={action.icon} size={16} /></span>
            <span>{action.label}</span>
            <Icon name="arrow" size={14} className="ml-auto text-[#b9b6dc]" />
          </Link>
        ))}
      </div>

      {/* ── 2-Column Content Area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Recent News Table */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon name="news" size={18} className="text-violet-600" />
                <CardTitle>Publikasi Berita Terkini</CardTitle>
              </div>
              <Link
                href="/admin/berita"
                className="text-xs font-bold text-[#5b3fe0] hover:text-[#7c5cff] transition-colors"
              >
                Lihat semua
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
                    <TableCell className="font-semibold text-[#1f1b4d] max-w-sm truncate">
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
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon name="megaphone" size={18} className="text-violet-600" />
                <CardTitle>Pengumuman Aktif</CardTitle>
              </div>
              <Link
                href="/admin/pengumuman"
                className="text-xs font-bold text-[#5b3fe0] hover:text-[#7c5cff] transition-colors"
              >
                Semua
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              {recentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded-2xl border border-white/80 bg-white/50 hover:bg-white/80 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="neutral">{ann.category}</Badge>
                    {ann.urgent ? (
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-500/15 px-2 py-0.5 rounded-full">
                        PENTING
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Batas: {ann.deadline}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-[#1f1b4d] leading-snug line-clamp-2">
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
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon name="clock" size={18} className="text-violet-600" />
            <CardTitle>Riwayat Aktivitas & Pembaruan Sistem</CardTitle>
          </div>
        </CardHeader>
        <div className="divide-y divide-white/60">
          {[
            { text: "Admin menerbitkan artikel: 'Dikbud Konsel Dorong Pemanfaatan Teknologi Digital'", time: "10 menit lalu", icon: "edit" },
            { text: "Sistem menyinkronkan data Dapodik Semester Ganjil 2026", time: "1 jam lalu", icon: "refresh" },
            { text: "Surat Edaran Petunjuk Teknis ANBK 2026 diunggah ke portal", time: "3 jam lalu", icon: "megaphone" },
            { text: "Data direktori SDN 12 Andoolo diperbarui", time: "Kemarin", icon: "school" },
          ].map((act, i) => (
            <div
              key={i}
              className="px-6 py-3.5 flex items-center justify-between gap-4 text-xs hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-600 flex items-center justify-center">
                  <Icon name={act.icon} size={15} />
                </span>
                <span className="font-semibold text-[#1f1b4d]">{act.text}</span>
              </div>
              <span className="text-slate-400 whitespace-nowrap">{act.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
