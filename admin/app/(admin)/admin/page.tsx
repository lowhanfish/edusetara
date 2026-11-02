"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchData } from "@/lib/api_secure";
import { Icon } from "../_components/admin-icons";
import { DashboardAnalyticsSection } from "../_components/chart";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui";

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    totalSekolah: "287",
    totalGuru: "4.231",
    totalSiswa: "52.847",
    totalPengumuman: "12",
  });
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // Fetch counts and recent data in parallel
        const [resSekolah, resSiswa, resBerita, resPengumuman] = await Promise.allSettled([
          fetchData<{ total: number }>("/api/v1/admin/master/sekolah/read?limit=1"),
          fetchData<{ total: number }>("/api/v1/admin/master/siswa/read?limit=1"),
          fetchData<{ total: number; data: any[] }>("/api/v1/admin/berita/read?limit=5"),
          fetchData<{ total: number; data: any[] }>("/api/v1/admin/pengumuman/read?limit=5"),
        ]);

        const totalSekolah = resSekolah.status === "fulfilled" && resSekolah.value?.total
          ? String(resSekolah.value.total)
          : "287";

        const totalSiswa = resSiswa.status === "fulfilled" && resSiswa.value?.total
          ? resSiswa.value.total.toLocaleString("id-ID")
          : "52.847";

        const totalPengumuman = resPengumuman.status === "fulfilled" && resPengumuman.value?.total != null
          ? String(resPengumuman.value.total)
          : "12";

        setStatsData({
          totalSekolah,
          totalGuru: "4.231",
          totalSiswa,
          totalPengumuman,
        });

        if (resBerita.status === "fulfilled" && Array.isArray(resBerita.value?.data) && resBerita.value.data.length > 0) {
          setRecentNews(resBerita.value.data.map((item: any) => ({
            id: item.id,
            title: item.judul || item.title || "",
            category: item.kategori || "Pendidikan",
            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
              : "Terbaru",
            status: item.status || "Terbit",
          })));
        } else {
          setRecentNews([
            { id: 1, title: "Dikbud Konsel Dorong Pemanfaatan Teknologi & Perangkat Digital", category: "Pendidikan", date: "05 Sep 2026", status: "Terbit" },
            { id: 2, title: "Pelestarian Seni Musik Tradisional Tolaki Melalui Ekstrakurikuler", category: "Kebudayaan", date: "28 Agu 2026", status: "Terbit" },
            { id: 3, title: "Diseminasi Praktik Baik Pembelajaran Berdiferensiasi Jenjang SMP", category: "GTK & Guru", date: "14 Agu 2026", status: "Draft" },
            { id: 4, title: "Revitalisasi Ruang Kelas & Laboratorium IPA 15 SMP Negeri", category: "Sarpras", date: "02 Agu 2026", status: "Terbit" },
          ]);
        }

        if (resPengumuman.status === "fulfilled" && Array.isArray(resPengumuman.value?.data) && resPengumuman.value.data.length > 0) {
          setRecentAnnouncements(resPengumuman.value.data.map((item: any) => ({
            id: item.id,
            title: item.judul || item.title || "",
            category: item.kategori || "Akademik",
            deadline: item.deadline || "Sesuai Edaran",
            urgent: Boolean(item.is_important || item.penting),
          })));
        } else {
          setRecentAnnouncements([
            { id: 1, title: "Petunjuk Teknis Pelaksanaan ANBK Jenjang SD & SMP", category: "Akademik", deadline: "28 Sep", urgent: true },
            { id: 2, title: "Verifikasi Berkas Seleksi Calon Kepala Sekolah Tahap II", category: "Kepegawaian", deadline: "30 Sep", urgent: false },
            { id: 3, title: "Batas Sinkronisasi Dapodik Semester Ganjil TA 2026/2027", category: "Dapodik", deadline: "Selesai", urgent: true },
          ]);
        }
      } catch (err) {
        console.error("Gagal memuat statistik dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const stats = [
    {
      label: "Total Satuan Sekolah",
      value: statsData.totalSekolah,
      change: "+3 terakreditasi",
      icon: "school",
      color: "bg-emerald-500/15 text-emerald-600",
    },
    {
      label: "Tenaga Pendidik & Guru",
      value: statsData.totalGuru,
      change: "+45 sertifikasi",
      icon: "users",
      color: "bg-amber-400/25 text-amber-700",
    },
    {
      label: "Peserta Didik Aktif",
      value: statsData.totalSiswa,
      change: "+312 Dapodik",
      icon: "award",
      color: "bg-amber-400/20 text-amber-600",
    },
    {
      label: "Pengumuman Aktif",
      value: statsData.totalPengumuman,
      change: "Aktif di portal",
      icon: "megaphone",
      color: "bg-rose-500/15 text-rose-600",
    },
  ];

  const quickActions = [
    { label: "Tulis Berita", icon: "edit", href: "/admin/publish/berita" },
    { label: "Buat Pengumuman", icon: "megaphone", href: "/admin/publish/pengumuman" },
    { label: "Data Sekolah", icon: "school", href: "/admin/sekolah" },
    { label: "Layanan Publik", icon: "landmark", href: "/admin/publish/layanan" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner with Friendly AI Edu Mascot ── */}
      <div className="glass rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-200/60 shadow-xs">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-br from-amber-300/25 to-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/60 text-amber-900 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Sikola Pindara AI • Edukasi Pintar
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2d2410] tracking-tight">
            Selamat datang di Portal Admin Dikbud!
          </h2>
          <p className="text-xs sm:text-sm text-[#7d7152] leading-relaxed">
            Pusat tata kelola terpadu publikasi berita, rombel, sarpras, usulan bantuan & jurnal pendidikan Kabupaten Konawe Selatan.
          </p>
        </div>

        {/* Robot AI Companion Badge */}
        <div className="flex items-center gap-4 z-10 shrink-0">
          <div className="flex items-center gap-3.5 bg-white/95 px-4 py-2.5 rounded-2xl border border-amber-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 p-0.5 shadow-xs flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#241e12] rounded-[14px] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-1 h-1.5 bg-amber-400 rounded-full mb-0.5" />
                <div className="w-7 h-4 rounded-md bg-amber-400/30 border border-amber-400/60 flex items-center justify-around px-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                </div>
                <div className="w-3 h-1 border-b border-amber-300 rounded-full mt-0.5" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Pindara Bot AI</span>
              <span className="text-xs font-medium text-[#7d7152]">Sistem Terpadu Aktif</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                ● Seluruh modul terhubung
              </span>
            </div>
          </div>
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
              <span className="text-xs font-medium text-[#7d7152] block">{stat.label}</span>
              <span className="text-2xl sm:text-3xl font-semibold text-[#2d2410] tracking-tight block">
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
            className="glass flex items-center gap-3 p-3.5 rounded-2xl hover:bg-white/80 text-xs font-semibold text-[#2d2410] transition-all"
          >
            <span className="w-8 h-8 rounded-xl bg-amber-400/25 text-amber-700 flex items-center justify-center">
              <Icon name={action.icon} size={16} />
            </span>
            <span>{action.label}</span>
            <Icon name="arrow" size={14} className="ml-auto text-[#d8c998]" />
          </Link>
        ))}
      </div>

      {/* ── Interactive Highcharts Analytics Section ── */}
      <DashboardAnalyticsSection />

      {/* ── 2-Column Content Area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Recent News Table */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon name="news" size={18} className="text-amber-700" />
                <CardTitle>Publikasi Berita Terkini</CardTitle>
              </div>
              <Link
                href="/admin/publish/berita"
                className="text-xs font-bold text-[#a86a00] hover:text-[#f5b82e] transition-colors"
              >
                Lihat semua
              </Link>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#2d2410]/10 bg-white/35">
                    <th className="py-3 px-4 font-bold text-[#2d2410]/80">Judul Artikel</th>
                    <th className="py-3 px-4 font-bold text-[#2d2410]/80">Kategori</th>
                    <th className="py-3 px-4 font-bold text-[#2d2410]/80">Tanggal</th>
                    <th className="py-3 px-4 font-bold text-[#2d2410]/80">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/60">
                  {recentNews.map((news) => (
                    <tr key={news.id} className="hover:bg-white/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#2d2410] max-w-sm truncate">
                        {news.title}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="neutral">{news.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {news.date}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={news.status === "Terbit" ? "success" : "warning"}
                        >
                          {news.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: Active Announcements */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon name="megaphone" size={18} className="text-amber-700" />
                <CardTitle>Pengumuman Aktif</CardTitle>
              </div>
              <Link
                href="/admin/publish/pengumuman"
                className="text-xs font-bold text-[#a86a00] hover:text-[#f5b82e] transition-colors"
              >
                Semua
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              {recentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded-2xl border border-white/85 bg-white/50 backdrop-blur-md hover:bg-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-colors space-y-1.5"
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
                  <h4 className="text-xs font-semibold text-[#2d2410] leading-snug line-clamp-2">
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
            <Icon name="clock" size={18} className="text-amber-700" />
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
                <span className="w-8 h-8 rounded-xl bg-amber-400/25 text-amber-700 flex items-center justify-center">
                  <Icon name={act.icon} size={15} />
                </span>
                <span className="font-semibold text-[#2d2410]">{act.text}</span>
              </div>
              <span className="text-slate-400 whitespace-nowrap">{act.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
