"use client";

import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { fetchData } from "@/lib/api_secure";
import {
  Badge,
  Button,
  Card,
  FileInput,
  Input,
  Modal,
  PageHeader,
  Pagination,
  Select,
  Textarea,
} from "../../_components/ui";

interface Announcement {
  id: string;
  number: string;
  title: string;
  category: "Akademik & ANBK" | "Kepegawaian / PPPK" | "Pendataan & Dapodik" | "Kebudayaan & Event";
  summary: string;
  targetAudience: string;
  deadline: string;
  attachmentName: string;
  important: boolean;
  status: "Aktif" | "Draft" | "Selesai";
}

export default function PengumumanAdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [formData, setFormData] = useState({
    number: "",
    title: "",
    category: "Akademik & ANBK" as Announcement["category"],
    summary: "",
    targetAudience: "Semua Satuan Pendidikan",
    deadline: "",
    attachmentName: "",
    important: false,
    status: "Aktif" as Announcement["status"],
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const q = debouncedSearch.trim() ? `&search=${encodeURIComponent(debouncedSearch.trim())}` : "";
      const res = await fetchData<{ total: number; data: any[] }>(
        `/api/v1/admin/pengumuman/read?page=${page}&per_page=${pageSize}&skip=${skip}&limit=${pageSize}${q}`
      );

      if (res && Array.isArray(res.data)) {
        const mapped: Announcement[] = res.data.map((row: any) => ({
          id: row.id,
          number: row.nomor || row.number || "",
          title: row.judul || row.title || "",
          category: (row.kategori || row.category || "Akademik & ANBK") as Announcement["category"],
          summary: row.ringkasan || row.summary || "",
          targetAudience: row.target_audience || row.sasaran || row.targetAudience || "",
          deadline: row.deadline || row.tenggat_waktu || "",
          attachmentName: row.lampiran || row.lampiran_url || row.attachmentName || "",
          important: Boolean(row.is_important ?? row.penting ?? row.important),
          status: (row.status || "Aktif") as Announcement["status"],
        }));
        setAnnouncements(mapped);
        setTotalCount(res.total ?? mapped.length);
      }
    } catch (err: any) {
      console.error("Gagal memuat data pengumuman:", err);
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
      number: "",
      title: "",
      category: "Akademik & ANBK",
      summary: "",
      targetAudience: "Semua Satuan Pendidikan",
      deadline: "",
      attachmentName: "",
      important: false,
      status: "Aktif",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingId(item.id);
    setFormData({
      number: item.number,
      title: item.title,
      category: item.category,
      summary: item.summary,
      targetAudience: item.targetAudience,
      deadline: item.deadline,
      attachmentName: item.attachmentName,
      important: item.important,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const payload = {
      nomor: formData.number || `421/DKB/${Date.now()}`,
      judul: formData.title,
      kategori: formData.category,
      ringkasan: formData.summary || formData.title,
      target_audience: formData.targetAudience,
      deadline: formData.deadline || "Sesuai Edaran",
      lampiran: formData.attachmentName || "Surat_Edaran_Resmi.pdf",
      is_important: formData.important,
      status: formData.status,
    };

    try {
      if (editingId) {
        await fetchData(`/api/v1/admin/pengumuman/update/${editingId}`, {
          method: "PUT",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Diperbarui",
          text: "Data pengumuman berhasil diperbarui.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await fetchData(`/api/v1/admin/pengumuman/create`, {
          method: "POST",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Diterbitkan",
          text: "Pengumuman baru telah disimpan ke sistem.",
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

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Hapus Pengumuman?",
      text: `Pengumuman "${title}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await fetchData(`/api/v1/admin/pengumuman/delete/${id}`, {
          method: "DELETE",
        });
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Pengumuman berhasil dihapus.",
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
        title="Manajemen Pengumuman & Surat Edaran"
        description="Publikasi edaran kedinasan resmi, jadwal ujian, juknis asesmen, dan pemberitahuan penting."
        badge={<Badge variant="gold">{totalCount} Edaran</Badge>}
        action={
          <Button
            variant="gold"
            icon="📢"
            onClick={handleOpenCreate}
          >
            Buat Pengumuman
          </Button>
        }
      />

      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Filter Pencarian di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Cari nomor edaran atau judul..."
              leftIcon="🔍"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel Semantik Native HTML */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">No. Surat & Judul</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Kategori</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Sasaran Penerima</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Batas Waktu</th>
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
                      Memuat data pengumuman...
                    </div>
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada pengumuman ditemukan.
                  </td>
                </tr>
              ) : (
                announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-white/50 transition-colors duration-150">
                    <td className="px-4 py-3.5 text-xs align-middle max-w-md">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono font-semibold text-[#a86a00]">
                          {item.number}
                        </span>
                        <span className="font-bold text-[#2d2410] line-clamp-2">
                          {item.title}
                        </span>
                        {item.important && (
                          <span className="inline-block text-[10px] text-red-600 font-bold">
                            ⚡ PENTING / SEGERA
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge variant="neutral">{item.category}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-[#5e5133]">
                      {item.targetAudience}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle whitespace-nowrap text-[#7d7152]">
                      {item.deadline}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge
                        variant={
                          item.status === "Aktif"
                            ? "success"
                            : item.status === "Draft"
                            ? "warning"
                            : "neutral"
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
                          onClick={() => handleDelete(item.id, item.title)}
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
        title={editingId ? "Edit Pengumuman / Surat Edaran" : "Buat Pengumuman / Surat Edaran"}
        description="Masukkan nomor surat, isi ringkasan, dan dokumen PDF lampiran untuk pengumuman kedinasan."
        maxWidth="2xl"
        footer={
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="gold"
              type="submit"
              form="form-pengumuman"
            >
              {editingId ? "Simpan Perubahan" : "Terbitkan Pengumuman"}
            </Button>
          </>
        }
      >
        <form id="form-pengumuman" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor Surat Resmi"
              placeholder="Contoh: 421.2/342/Dikbud/IX/2026"
              required
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            />
            <Select
              label="Kategori Pengumuman"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Announcement["category"],
                })
              }
              options={[
                { value: "Akademik & ANBK", label: "Akademik & ANBK" },
                { value: "Kepegawaian / PPPK", label: "Kepegawaian / PPPK" },
                { value: "Pendataan & Dapodik", label: "Pendataan & Dapodik" },
                { value: "Kebudayaan & Event", label: "Kebudayaan & Event" },
              ]}
            />
          </div>

          <Input
            label="Perihal / Judul Pengumuman"
            placeholder="Masukkan judul atau perihal surat edaran..."
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Sasaran Penerima"
              placeholder="Contoh: Kepala Satuan Pendidikan SD/SMP"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            />
            <Input
              label="Batas Waktu / Deadline"
              placeholder="Contoh: 28 September 2026"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <Textarea
            label="Ringkasan Isi Pemberitahuan"
            placeholder="Jelaskan pokok-pokok penting surat edaran..."
            rows={3}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileInput
              label="Dokumen PDF Lampiran"
              accept=".pdf"
              value={formData.attachmentName}
              placeholder="Unggah berkas PDF surat edaran..."
              onChange={(fileName) => setFormData({ ...formData, attachmentName: fileName })}
              helperText="Format dokumen resmi PDF maksimal 10 MB"
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Announcement["status"],
                })
              }
              options={[
                { value: "Aktif", label: "Aktif & Tampil di Publik" },
                { value: "Draft", label: "Draft Sementara" },
                { value: "Selesai", label: "Arsip / Sudah Selesai" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="ann-important"
              checked={formData.important}
              onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-400 cursor-pointer"
            />
            <label
              htmlFor="ann-important"
              className="text-xs font-semibold text-[#2d2410] cursor-pointer"
            >
              Tandai sebagai Pengumuman Mendesak / Penting (Badge Merah)
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
