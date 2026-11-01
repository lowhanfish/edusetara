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
  Textarea,
} from "../../_components/ui";

interface CultureItem {
  id: string;
  name: string;
  type: "Cagar Budaya" | "Warisan Takbenda (WBTb)" | "Sanggar Seni" | "Festival / Agenda";
  location: string;
  description: string;
  status: "Terverifikasi" | "Dalam Kajian" | "Aktif";
}

export default function KebudayaanAdminPage() {
  const [items, setItems] = useState<CultureItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("Semua");

  const [formData, setFormData] = useState({
    name: "",
    type: "Cagar Budaya" as CultureItem["type"],
    location: "",
    description: "",
    status: "Terverifikasi" as CultureItem["status"],
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
        `/api/v1/admin/kebudayaan/read?page=${page}&per_page=${pageSize}&skip=${skip}&limit=${pageSize}${q}`
      );

      if (res && Array.isArray(res.data)) {
        const mapped: CultureItem[] = res.data.map((row: any) => ({
          id: row.id,
          name: row.name || "",
          type: (row.type || "Cagar Budaya") as CultureItem["type"],
          location: row.location || "Kab. Konawe Selatan",
          description: row.description || "-",
          status: (row.status || "Terverifikasi") as CultureItem["status"],
        }));

        const filtered = filterType === "Semua" ? mapped : mapped.filter(item => item.type === filterType);
        setItems(filtered);
        setTotalCount(res.total ?? mapped.length);
      }
    } catch (err: any) {
      console.error("Gagal memuat data kebudayaan:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, filterType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      type: "Cagar Budaya",
      location: "",
      description: "",
      status: "Terverifikasi",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CultureItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      type: item.type,
      location: item.location,
      description: item.description,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const payload = {
      name: formData.name,
      type: formData.type,
      location: formData.location || "Kab. Konawe Selatan",
      description: formData.description || "-",
      status: formData.status,
    };

    try {
      if (editingId) {
        await fetchData(`/api/v1/admin/kebudayaan/update/${editingId}`, {
          method: "PUT",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Diperbarui",
          text: "Data kebudayaan berhasil diperbarui.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await fetchData(`/api/v1/admin/kebudayaan/create`, {
          method: "POST",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Ditambahkan",
          text: "Data kebudayaan baru telah disimpan.",
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

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Hapus Data Kebudayaan?",
      text: `Objek "${name}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await fetchData(`/api/v1/admin/kebudayaan/delete/${id}`, {
          method: "DELETE",
        });
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Data berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
        loadData();
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text: err?.message || "Terjadi kesalahan saat menghapus data.",
        });
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Manajemen Kebudayaan Daerah"
        description="Inventarisasi warisan budaya takbenda, cagar budaya bersejarah, sanggar seni, serta kalender festival kebudayaan."
        badge={<Badge variant="gold">{totalCount} Data Budaya</Badge>}
        action={
          <Button variant="gold" icon="🎭" onClick={handleOpenCreate}>
            Tambah Data Budaya
          </Button>
        }
      />

      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Pencarian & Filter Tabs di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-80">
            <Input
              placeholder="Cari objek budaya, sanggar, lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
            {[
              "Semua",
              "Warisan Takbenda (WBTb)",
              "Cagar Budaya",
              "Sanggar Seni",
              "Festival / Agenda",
            ].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setFilterType(type);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterType === type
                    ? "bg-[#2d2410] text-white shadow-2xs"
                    : "bg-white/60 text-slate-600 border border-white/80 hover:bg-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Semantik Native HTML */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Nama Objek / Sanggar</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Jenis Kebudayaan</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Lokasi / Kecamatan</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Deskripsi</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Status</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      Memuat data kebudayaan...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada data kebudayaan ditemukan.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/50 transition-colors duration-150">
                    <td className="px-4 py-3.5 text-xs align-middle font-bold text-[#2d2410]">
                      {item.name}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge variant="neutral">{item.type}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-[#5e5133]">
                      {item.location}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-[#7d7152] max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge
                        variant={
                          item.status === "Terverifikasi" || item.status === "Aktif"
                            ? "success"
                            : "warning"
                        }
                      >
                        {item.status}
                      </Badge>
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
                          onClick={() => handleDelete(item.id, item.name)}
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
        title={editingId ? "Edit Data Kebudayaan" : "Tambah Data Kebudayaan"}
        description="Daftarkan cagar budaya, warisan takbenda, sanggar komunitas seni, atau agenda festival."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-culture">
              {editingId ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </>
        }
      >
        <form id="form-culture" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Objek / Sanggar / Festival"
            placeholder="Contoh: Tarian Lulo Massal Konsel"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Jenis Kebudayaan"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as CultureItem["type"],
                })
              }
              options={[
                { value: "Cagar Budaya", label: "Cagar Budaya (Benda / Situs)" },
                { value: "Warisan Takbenda (WBTb)", label: "Warisan Takbenda (WBTb)" },
                { value: "Sanggar Seni", label: "Sanggar & Komunitas Seni" },
                { value: "Festival / Agenda", label: "Festival / Agenda Kegiatan" },
              ]}
            />
            <Select
              label="Status Verifikasi"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as CultureItem["status"],
                })
              }
              options={[
                { value: "Terverifikasi", label: "Terverifikasi / Resmi" },
                { value: "Dalam Kajian", label: "Dalam Kajian Tim Ahli" },
                { value: "Aktif", label: "Aktif Beroperasi" },
              ]}
            />
          </div>

          <Input
            label="Lokasi / Kecamatan"
            placeholder="Contoh: Kecamatan Andoolo"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <Textarea
            label="Deskripsi & Sejarah Singkat"
            placeholder="Jelaskan asal-usul, nilai sejarah, atau keunikan..."
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </form>
      </Modal>
    </div>
  );
}
