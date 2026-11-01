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

interface PublicService {
  id: string;
  name: string;
  category: "Layanan Siswa" | "Layanan Guru" | "Layanan Sekolah" | "Direktori Sekolah";
  processingTime: string;
  fee: string;
  requirements: string;
  status: "Online" | "Tatap Muka" | "Aktif";
}

export default function LayananAdminPage() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [formData, setFormData] = useState({
    name: "",
    category: "Layanan Siswa" as PublicService["category"],
    processingTime: "1 Hari Kerja",
    fee: "Gratis (Rp 0)",
    requirements: "",
    status: "Online" as PublicService["status"],
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
        `/api/v1/admin/layanan/read?page=${page}&per_page=${pageSize}&skip=${skip}&limit=${pageSize}${q}`
      );

      if (res && Array.isArray(res.data)) {
        const mapped: PublicService[] = res.data.map((row: any) => ({
          id: row.id,
          name: row.nama_layanan || row.name || "",
          category: (row.kategori || row.category || "Layanan Siswa") as PublicService["category"],
          processingTime: row.waktu_layanan || row.processingTime || "1 Hari Kerja",
          fee: row.biaya || row.fee || "Gratis (Rp 0)",
          requirements: row.syarat || row.requirements || "Sesuai ketentuan",
          status: (row.status || "Online") as PublicService["status"],
        }));
        setServices(mapped);
        setTotalCount(res.total ?? mapped.length);
      }
    } catch (err: any) {
      console.error("Gagal memuat data layanan:", err);
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
      name: "",
      category: "Layanan Siswa",
      processingTime: "1 Hari Kerja",
      fee: "Gratis (Rp 0)",
      requirements: "",
      status: "Online",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PublicService) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      processingTime: item.processingTime,
      fee: item.fee,
      requirements: item.requirements,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const payload = {
      nama_layanan: formData.name,
      kategori: formData.category,
      waktu_layanan: formData.processingTime,
      biaya: formData.fee,
      syarat: formData.requirements || "Sesuai SOP Dikbud Konsel",
      status: formData.status,
    };

    try {
      if (editingId) {
        await fetchData(`/api/v1/admin/layanan/update/${editingId}`, {
          method: "PUT",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Diperbarui",
          text: "Data layanan publik berhasil diperbarui.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await fetchData(`/api/v1/admin/layanan/create`, {
          method: "POST",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Ditambahkan",
          text: "Layanan publik baru telah disimpan.",
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
      title: "Hapus Layanan Publik?",
      text: `Layanan "${name}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await fetchData(`/api/v1/admin/layanan/delete/${id}`, {
          method: "DELETE",
        });
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Layanan berhasil dihapus.",
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
        title="Manajemen Layanan Publik & SOP"
        description="Atur jenis layanan terpadu, standar operasional prosedur (SOP), estimasi waktu pelayanan, serta syarat administrasi."
        badge={<Badge variant="gold">{totalCount} Layanan Aktif</Badge>}
        action={
          <Button variant="gold" icon="🏛️" onClick={handleOpenCreate}>
            Tambah Layanan
          </Button>
        }
      />

      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Pencarian Data di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Cari nama layanan atau kategori..."
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
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Nama Layanan</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Sasaran Pengguna</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Estimasi Waktu</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Biaya</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Moda Layanan</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      Memuat data layanan publik...
                    </div>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada layanan ditemukan.
                  </td>
                </tr>
              ) : (
                services.map((item) => (
                  <tr key={item.id} className="hover:bg-white/50 transition-colors duration-150">
                    <td className="px-4 py-3.5 text-xs align-middle font-bold text-[#2d2410] max-w-sm">
                      {item.name}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge variant="neutral">{item.category}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-[#7d7152] whitespace-nowrap">
                      ⏱️ {item.processingTime}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle font-semibold text-emerald-700 whitespace-nowrap">
                      {item.fee}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge variant={item.status === "Online" ? "success" : "info"}>
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
        title={editingId ? "Edit Layanan Publik" : "Tambah Layanan Publik Baru"}
        description="Definisikan standar pelayanan publik, syarat dokumen pengajuan, dan estimasi waktu selesai."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-layanan">
              {editingId ? "Simpan Perubahan" : "Simpan Layanan"}
            </Button>
          </>
        }
      >
        <form id="form-layanan" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Layanan / Prosedur"
            placeholder="Contoh: Rekomendasi Mutasi Siswa Antar Kabupaten"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Sasaran Pengguna"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as PublicService["category"],
                })
              }
              options={[
                { value: "Layanan Siswa", label: "Siswa & Orang Tua" },
                { value: "Layanan Guru", label: "Guru & Tenaga Pendidik" },
                { value: "Layanan Sekolah", label: "Satuan Pendidikan / Sekolah" },
                { value: "Direktori Sekolah", label: "Direktori Data Sekolah" },
              ]}
            />
            <Select
              label="Moda Layanan"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as PublicService["status"],
                })
              }
              options={[
                { value: "Online", label: "Daring (Online / Sistem Digital)" },
                { value: "Tatap Muka", label: "Tatap Muka (Loket PTSP)" },
                { value: "Aktif", label: "Kombinasi (Hybrid)" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimasi Waktu Pelayanan"
              placeholder="Contoh: 1 Hari Kerja"
              value={formData.processingTime}
              onChange={(e) =>
                setFormData({ ...formData, processingTime: e.target.value })
              }
            />
            <Input
              label="Biaya / Tarif"
              placeholder="Contoh: Gratis (Rp 0)"
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
            />
          </div>

          <Textarea
            label="Persyaratan Dokumen & Alur"
            placeholder="Tuliskan berkas yang harus dilampirkan pemohon..."
            rows={3}
            value={formData.requirements}
            onChange={(e) =>
              setFormData({ ...formData, requirements: e.target.value })
            }
          />
        </form>
      </Modal>
    </div>
  );
}
