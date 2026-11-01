"use client";

import React, { useState, useEffect, useCallback } from "react";
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

interface StatRecord {
  id: string;
  indicator: string;
  category: "Pendidikan" | "Kepuasan Masyarakat (IKM)" | "Ketenagaan" | "Sarpras";
  value: string;
  unit: string;
  period: string;
  trend: string;
}

export default function StatistikAdminPage() {
  const [stats, setStats] = useState<StatRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    indicator: "",
    category: "Pendidikan" as StatRecord["category"],
    value: "",
    unit: "",
    period: "2026",
    trend: "",
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
        `/api/v1/admin/statistik/read?page=${page}&per_page=${pageSize}&skip=${skip}&limit=${pageSize}${q}`
      );

      if (res && Array.isArray(res.data)) {
        const mapped: StatRecord[] = res.data.map((row: any) => ({
          id: row.id,
          indicator: row.indicator || "",
          category: (row.category || "Pendidikan") as StatRecord["category"],
          value: row.value || "0",
          unit: row.unit || "Satuan",
          period: row.period || "2026",
          trend: row.trend || "-",
        }));
        setStats(mapped);
        setTotalCount(res.total ?? mapped.length);
      }
    } catch (err: any) {
      console.error("Gagal memuat statistik:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      indicator: "",
      category: "Pendidikan",
      value: "",
      unit: "",
      period: "2026",
      trend: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: StatRecord) => {
    setEditingId(item.id);
    setFormData({
      indicator: item.indicator,
      category: item.category,
      value: item.value,
      unit: item.unit,
      period: item.period,
      trend: item.trend,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.indicator || !formData.value) return;

    const payload = {
      indicator: formData.indicator,
      category: formData.category,
      value: formData.value,
      unit: formData.unit || "Satuan",
      period: formData.period,
      trend: formData.trend || "-",
    };

    try {
      if (editingId) {
        await fetchData(`/api/v1/admin/statistik/update/${editingId}`, {
          method: "PUT",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Diperbarui",
          text: "Indikator statistik berhasil diperbarui.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await fetchData(`/api/v1/admin/statistik/create`, {
          method: "POST",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Ditambahkan",
          text: "Indikator baru telah disimpan.",
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
        text: err?.message || "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  const handleDelete = async (id: string, indicator: string) => {
    const result = await Swal.fire({
      title: "Hapus Indikator Statistik?",
      text: `Indikator "${indicator}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await fetchData(`/api/v1/admin/statistik/delete/${id}`, {
          method: "DELETE",
        });
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Indikator berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
        loadData();
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text: err?.message || "Terjadi kesalahan sistem saat menghapus data.",
        });
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Manajemen Data & Statistik"
        description="Kelola indikator capaian mutu pendidikan, indeks kepuasan masyarakat (IKM), dan statistik agregat wilayah."
        badge={<Badge variant="gold">{totalCount} Indikator</Badge>}
        action={
          <Button variant="gold" icon="📈" onClick={handleOpenCreate}>
            Tambah Indikator Statistik
          </Button>
        }
      />

      {/* Grid of Key Figures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold text-[#7d7152] uppercase tracking-wider">
                {item.category}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {item.trend}
              </span>
            </div>
            <div>
              <span className="text-3xl font-black text-[#2d2410] tracking-tight">
                {item.value}
              </span>
              <span className="text-xs text-[#7d7152] ml-1.5 font-medium">
                {item.unit}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-2 text-xs font-medium text-slate-700 line-clamp-2">
              {item.indicator}
            </div>
          </div>
        ))}
      </div>

      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Pencarian Data di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Cari indikator atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel Semantik Native HTML */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Nama Indikator</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Kategori</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Nilai Data</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Periode</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Tren / Capaian</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      Memuat indikator statistik...
                    </div>
                  </td>
                </tr>
              ) : stats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada indikator statistik ditemukan.
                  </td>
                </tr>
              ) : (
                stats.map((item) => (
                  <tr key={item.id} className="hover:bg-white/50 transition-colors duration-150">
                    <td className="px-4 py-3.5 text-xs align-middle font-bold text-[#2d2410]">
                      {item.indicator}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge variant="neutral">{item.category}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle font-bold text-[#a86a00] whitespace-nowrap">
                      {item.value} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle whitespace-nowrap text-[#7d7152]">
                      {item.period}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle whitespace-nowrap text-emerald-700 font-semibold">
                      {item.trend}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(item.id, item.indicator)}
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Paginasi Terstandar */}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Indikator Statistik" : "Tambah Indikator Statistik"}
        description="Masukkan angka indikator capaian pendidikan atau survei kepuasan layanan publik."
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-stat">
              {editingId ? "Simpan Perubahan" : "Simpan Indikator"}
            </Button>
          </>
        }
      >
        <form id="form-stat" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Indikator"
            placeholder="Contoh: Rata-Rata Nilai Literasi Rapor Pendidikan"
            required
            value={formData.indicator}
            onChange={(e) => setFormData({ ...formData, indicator: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as StatRecord["category"],
                })
              }
              options={[
                { value: "Pendidikan", label: "Pendidikan & Akademik" },
                { value: "Kepuasan Masyarakat (IKM)", label: "Kepuasan Masyarakat (IKM)" },
                { value: "Ketenagaan", label: "Guru & Ketenagaan" },
                { value: "Sarpras", label: "Sarana & Prasarana" },
              ]}
            />
            <Input
              label="Periode / Tahun"
              placeholder="Contoh: 2026 Ganjil"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nilai Angka"
              placeholder="Contoh: 85.5"
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
            <Input
              label="Satuan Nilai"
              placeholder="Contoh: Skor / Siswa / %"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>

          <Input
            label="Keterangan Tren"
            placeholder="Contoh: +2.5% Peningkatan"
            value={formData.trend}
            onChange={(e) => setFormData({ ...formData, trend: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}
