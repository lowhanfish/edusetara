"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { fetchData } from "@/lib/api_secure";
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

export default function PendidikanAdminPage() {
  const [items, setItems] = useState<EducationProgram[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"Semua" | "Jenjang" | "Kurikulum" | "GTK">("Semua");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const q = debouncedSearch.trim() ? `&search=${encodeURIComponent(debouncedSearch.trim())}` : "";
      const res = await fetchData<{ total: number; data: any[] }>(
        `/api/v1/admin/pendidikan/read?page=${page}&per_page=${pageSize}&skip=${skip}&limit=${pageSize}${q}`
      );

      if (res && Array.isArray(res.data)) {
        const mapped: EducationProgram[] = res.data.map((row: any) => ({
          id: row.id,
          category: (row.category || "Jenjang") as EducationProgram["category"],
          name: row.name || "",
          scope: row.scope || "Kabupaten Konawe Selatan",
          totalUnits: row.total_units || row.totalUnits || "-",
          curriculum: row.curriculum || "Kurikulum Merdeka",
          status: (row.status || "Aktif") as EducationProgram["status"],
        }));

        let filtered = mapped;
        if (activeTab !== "Semua") {
          filtered = filtered.filter(i => i.category === activeTab);
        }
        if (statusFilter !== "all") {
          filtered = filtered.filter(i => i.status === statusFilter);
        }

        setItems(filtered);
        setTotalCount(res.total ?? mapped.length);
      }
    } catch (err: any) {
      console.error("Gagal memuat data program pendidikan:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, activeTab, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Statistik Ringkasan
  const stats = {
    total: totalCount,
    jenjangCount: items.filter((i) => i.category === "Jenjang").length,
    kurikulumCount: items.filter((i) => i.category === "Kurikulum").length,
    gtkCount: items.filter((i) => i.category === "GTK").length,
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      category: "Jenjang",
      name: "",
      scope: "",
      totalUnits: "",
      curriculum: "Kurikulum Merdeka",
      status: "Aktif",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EducationProgram) => {
    setEditingId(item.id);
    setFormData({
      category: item.category,
      name: item.name,
      scope: item.scope,
      totalUnits: item.totalUnits,
      curriculum: item.curriculum,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const payload = {
      name: formData.name,
      category: formData.category,
      scope: formData.scope || "Kabupaten Konawe Selatan",
      total_units: formData.totalUnits || "-",
      curriculum: formData.curriculum,
      status: formData.status,
    };

    try {
      if (editingId) {
        await fetchData(`/api/v1/admin/pendidikan/update/${editingId}`, {
          method: "PUT",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Diperbarui",
          text: "Program pendidikan berhasil diperbarui.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await fetchData(`/api/v1/admin/pendidikan/create`, {
          method: "POST",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Ditambahkan",
          text: "Program pendidikan baru telah disimpan.",
          timer: 1800,
          showConfirmButton: false,
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: err?.message || "Terjadi kesalahan sistem saat menyimpan.",
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Hapus Program Pendidikan?",
      text: `Program "${name}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await fetchData(`/api/v1/admin/pendidikan/delete/${id}`, {
          method: "DELETE",
        });
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Program berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
        loadData();
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text: err?.message || "Terjadi kesalahan sistem.",
        });
      }
    }
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
        badge={<Badge variant="gold">{totalCount} Data Program</Badge>}
        action={
          <Button variant="gold" icon="🎓" onClick={handleOpenCreate}>
            + Tambah Data Pendidikan
          </Button>
        }
      />

      {/* 3. Kartu Metrik Ringkasan */}
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

      {/* 4. Toolbar Filter & Tabel */}
      <Card className="border border-white/80 shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-80">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari program, cakupan wilayah, kurikulum..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
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

        {/* Tabel HTML */}
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      Memuat program pendidikan...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada data program pendidikan ditemukan.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const statusVariant =
                    item.status === "Aktif"
                      ? "success"
                      : item.status === "Dalam Proses"
                      ? "warning"
                      : "neutral";

                  return (
                    <tr key={item.id} className="hover:bg-white/50 transition-colors duration-150">
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <p className="font-bold text-[#2d2410] hover:text-[#a86a00] transition-colors leading-snug">
                          {item.name}
                        </p>
                      </td>
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
                      <td className="px-4 py-3.5 text-xs align-middle text-[#5e5133]">
                        {item.scope}
                      </td>
                      <td className="px-4 py-3.5 text-xs align-middle text-[#7d7152] font-medium">
                        {item.totalUnits}
                      </td>
                      <td className="px-4 py-3.5 text-xs align-middle text-[#7d7152]">
                        {item.curriculum}
                      </td>
                      <td className="px-4 py-3.5 text-xs align-middle text-center">
                        <Badge variant={statusVariant} size="sm">
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-xs align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Program"
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-red-600 hover:bg-red-50/80"
                            onClick={() => handleDelete(item.id, item.name)}
                            title="Hapus Program"
                          >
                            🗑️
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

        {/* Footer Paginasi */}
        <div className="px-6 py-4 bg-white/20 border-t border-white/60">
          <Pagination
            page={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            total={totalCount}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </Card>

      {/* Modal Form Tambah / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Program Pendidikan" : "Tambah Program / Satuan Pendidikan"}
        description="Lengkapi informasi program jenjang, kurikulum ajar, atau pemberdayaan tenaga pendidik."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-edu">
              {editingId ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </>
        }
      >
        <form id="form-edu" onSubmit={handleSubmit} className="space-y-4">
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
