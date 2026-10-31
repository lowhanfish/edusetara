"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Pagination,
  Select,
} from "../../_components/ui";

interface EducationProgram {
  id: string;
  category: "Jenjang" | "Kurikulum" | "GTK";
  name: string;
  scope: string;
  totalUnits: string;
  curriculum: string;
  status: "Aktif" | "Dalam Proses" | "Evaluasi";
}

const initialPrograms: EducationProgram[] = [
  {
    id: "edu-1",
    category: "Jenjang",
    name: "Satuan Sekolah Menengah Pertama (SMP)",
    scope: "25 Kecamatan se-Konsel",
    totalUnits: "84 Sekolah (7.420 Siswa)",
    curriculum: "Kurikulum Merdeka Mandiri Berbagi",
    status: "Aktif",
  },
  {
    id: "edu-2",
    category: "Jenjang",
    name: "Satuan Sekolah Dasar (SD)",
    scope: "25 Kecamatan se-Konsel",
    totalUnits: "196 Sekolah (18.340 Siswa)",
    curriculum: "Kurikulum Merdeka Mandiri Berubah",
    status: "Aktif",
  },
  {
    id: "edu-3",
    category: "Kurikulum",
    name: "Modul Projek Penguatan Profil Pelajar Pancasila (P5)",
    scope: "Kearifan Lokal Konsel",
    totalUnits: "14 Tema Budaya Tolaki",
    curriculum: "Fase A s/d Fase D",
    status: "Aktif",
  },
  {
    id: "edu-4",
    category: "GTK",
    name: "Pendidikan Profesi Guru (PPG) Daljab & Guru Penggerak",
    scope: "Tenaga Pendidik ASN & P3K",
    totalUnits: "1.240 Guru Bersertifikat",
    curriculum: "Platform Merdeka Mengajar (PMM)",
    status: "Dalam Proses",
  },
  {
    id: "edu-5",
    category: "Kurikulum",
    name: "Penguatan Literasi & Numerasi Berbasis Rapor Pendidikan",
    scope: "SD dan SMP Pelaksana IKM",
    totalUnits: "280 Satuan Pendidikan",
    curriculum: "Asesmen Nasional & Sulingjar",
    status: "Aktif",
  },
  {
    id: "edu-6",
    category: "GTK",
    name: "Komunitas Belajar (Kombel) Guru Gugus & MGMP Mapel",
    scope: "Tingkat Kecamatan",
    totalUnits: "42 Kelompok Kerja Aktif",
    curriculum: "Pengembangan Berkelanjutan",
    status: "Evaluasi",
  },
];

export default function PendidikanAdminPage() {
  const [items, setItems] = useState<EducationProgram[]>(initialPrograms);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"Semua" | "Jenjang" | "Kurikulum" | "GTK">("Semua");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [formData, setFormData] = useState({
    category: "Jenjang" as EducationProgram["category"],
    name: "",
    scope: "",
    totalUnits: "",
    curriculum: "Kurikulum Merdeka",
    status: "Aktif" as EducationProgram["status"],
  });

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(q) ||
        item.scope.toLowerCase().includes(q) ||
        item.curriculum.toLowerCase().includes(q);

      const matchTab = activeTab === "Semua" || item.category === activeTab;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;

      return matchSearch && matchTab && matchStatus;
    });
  }, [items, search, activeTab, statusFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Statistik Ringkasan
  const stats = useMemo(() => {
    const total = items.length;
    const jenjangCount = items.filter((i) => i.category === "Jenjang").length;
    const kurikulumCount = items.filter((i) => i.category === "Kurikulum").length;
    const gtkCount = items.filter((i) => i.category === "GTK").length;
    return { total, jenjangCount, kurikulumCount, gtkCount };
  }, [items]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newItem: EducationProgram = {
      id: `edu-${Date.now()}`,
      category: formData.category,
      name: formData.name,
      scope: formData.scope || "Kabupaten Konawe Selatan",
      totalUnits: formData.totalUnits || "-",
      curriculum: formData.curriculum,
      status: formData.status,
    };

    setItems([newItem, ...items]);
    setIsModalOpen(false);
    setFormData({
      category: "Jenjang",
      name: "",
      scope: "",
      totalUnits: "",
      curriculum: "Kurikulum Merdeka",
      status: "Aktif",
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#7d7152] font-medium">
        <Link href="/admin" className="hover:text-[#2d2410] transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#a89b7b]">Program Strategis</span>
        <span>/</span>
        <span className="text-[#2d2410] font-semibold">Pendidikan & Kurikulum</span>
      </nav>

      {/* 2. PageHeader */}
      <PageHeader
        title="Manajemen Pendidikan & Kurikulum"
        description="Kelola informasi jenjang satuan pendidikan (PAUD, SD, SMP), implementasi kurikulum, dan data guru tenaga kependidikan."
        badge={<Badge variant="gold">{items.length} Data Program</Badge>}
        action={
          <Button variant="gold" icon="🎓" onClick={() => setIsModalOpen(true)}>
            + Tambah Data Pendidikan
          </Button>
        }
      />

      {/* 3. 4 Kartu Metrik Ringkasan (Glassmorphism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Total Program</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.total} Kebijakan</h4>
            <span className="text-[11px] text-[#7d7152]">Dikbud Konsel</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            🎓
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Jenjang Pendidikan</p>
            <h4 className="text-2xl font-bold text-[#a86a00] mt-1">{stats.jenjangCount} Satuan</h4>
            <span className="text-[11px] text-[#7d7152]">PAUD / SD / SMP</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#a86a00] flex items-center justify-center text-xl font-bold shadow-2xs">
            🏫
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Kurikulum & Modul</p>
            <h4 className="text-2xl font-bold text-sky-700 mt-1">{stats.kurikulumCount} Program</h4>
            <span className="text-[11px] text-[#7d7152]">Kurikulum Merdeka & P5</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-sky-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            📖
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Pendidik & GTK</p>
            <h4 className="text-2xl font-bold text-emerald-700 mt-1">{stats.gtkCount} Program</h4>
            <span className="text-[11px] text-emerald-700 font-medium">PPG & Guru Penggerak</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            👩‍🏫
          </div>
        </Card>
      </div>

      {/* 4. Kontainer Utama Terpadu (Toolbar Filter & Tabel Semantik di dalam wadah Card Glassmorphism) */}
      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Filter & Pencarian Data di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-80">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari program, cakupan wilayah, kurikulum..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Tab Kategori */}
            <div className="flex gap-1 bg-white/50 p-1 rounded-xl border border-white/80">
              {(["Semua", "Jenjang", "Kurikulum", "GTK"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#2d2410] text-white shadow-2xs"
                      : "text-[#7d7152] hover:bg-white/80"
                  }`}
                >
                  {tab === "Semua" ? "Semua Bidang" : tab}
                </button>
              ))}
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Evaluasi">Evaluasi</option>
            </Select>

            {(search || activeTab !== "Semua" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setActiveTab("Semua");
                  setStatusFilter("all");
                }}
                className="text-rose-600 hover:text-rose-700"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>

        {/* Tabel HTML Murni Semantik: table, thead, tbody, tr, th, td */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="w-[30%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Nama Program / Satuan
                </th>
                <th className="w-[12%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Kategori
                </th>
                <th className="w-[18%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Wilayah / Sasaran
                </th>
                <th className="w-[15%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Kapasitas Unit
                </th>
                <th className="w-[15%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Kurikulum / Platform
                </th>
                <th className="w-[10%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Status
                </th>
                <th className="w-[8%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada data program pendidikan ditemukan.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const statusVariant =
                    item.status === "Aktif"
                      ? "success"
                      : item.status === "Dalam Proses"
                      ? "warning"
                      : "neutral";

                  return (
                    <tr key={item.id} className="hover:bg-white/50 transition-colors duration-150">
                      {/* 1. Nama Program */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <p className="font-bold text-[#2d2410] hover:text-[#a86a00] transition-colors leading-snug">
                          {item.name}
                        </p>
                      </td>

                      {/* 2. Kategori */}
                      <td className="px-4 py-3.5 text-xs align-middle text-center">
                        <Badge
                          variant={
                            item.category === "Jenjang"
                              ? "gold"
                              : item.category === "Kurikulum"
                              ? "info"
                              : "neutral"
                          }
                          size="sm"
                        >
                          {item.category}
                        </Badge>
                      </td>

                      {/* 3. Wilayah */}
                      <td className="px-4 py-3.5 text-xs align-middle text-[#5e5133]">
                        {item.scope}
                      </td>

                      {/* 4. Kapasitas */}
                      <td className="px-4 py-3.5 text-xs align-middle text-[#7d7152] font-medium">
                        {item.totalUnits}
                      </td>

                      {/* 5. Kurikulum */}
                      <td className="px-4 py-3.5 text-xs align-middle text-[#7d7152]">
                        {item.curriculum}
                      </td>

                      {/* 6. Status */}
                      <td className="px-4 py-3.5 text-xs align-middle text-center">
                        <Badge variant={statusVariant} size="sm">
                          {item.status}
                        </Badge>
                      </td>

                      {/* 7. Aksi */}
                      <td className="px-4 py-3.5 text-xs align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alert(`Edit program: ${item.name}`)}
                            title="Edit Program"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-red-600 hover:bg-red-50/80"
                            onClick={() => {
                              if (confirm(`Hapus program ${item.name}?`)) {
                                setItems(items.filter((x) => x.id !== item.id));
                              }
                            }}
                            title="Hapus Program"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Paginasi Tabel Terstandar */}
        <div className="px-6 py-4 bg-white/20 border-t border-white/60">
          <Pagination
            page={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            total={filtered.length}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </Card>

      {/* Modal Form Tambah Data Pendidikan */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Program / Satuan Pendidikan"
        description="Lengkapi informasi program jenjang, kurikulum ajar, atau pemberdayaan tenaga pendidik."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-edu">
              Simpan Data
            </Button>
          </>
        }
      >
        <form id="form-edu" onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
                Kategori Bidang
              </label>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as EducationProgram["category"],
                  })
                }
              >
                <option value="Jenjang">Jenjang & Satuan Pendidikan</option>
                <option value="Kurikulum">Kurikulum & Pembelajaran</option>
                <option value="GTK">Pendidik & Tenaga Kependidikan</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
                Status Pelaksanaan
              </label>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as EducationProgram["status"],
                  })
                }
              >
                <option value="Aktif">Aktif Berjalan</option>
                <option value="Dalam Proses">Dalam Proses / Sosialisasi</option>
                <option value="Evaluasi">Tahap Evaluasi</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Nama Program / Satuan Pendidikan <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Contoh: Sekolah Dasar Negeri se-Konawe Selatan"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
                Wilayah / Sasaran
              </label>
              <Input
                placeholder="Contoh: 25 Kecamatan se-Konsel"
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
                Jumlah / Kapasitas
              </label>
              <Input
                placeholder="Contoh: 196 Sekolah (18.340 Siswa)"
                value={formData.totalUnits}
                onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Kurikulum / Platform Acuan
            </label>
            <Input
              placeholder="Contoh: Kurikulum Merdeka Mandiri Berbagi"
              value={formData.curriculum}
              onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
