"use client";

import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { fetchData } from "@/lib/api_secure";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Modal,
  PageHeader,
  Select,
  Textarea,
} from "../../_components/ui";

interface ProfileSection {
  id: string;
  title: string;
  category: "Visi Misi" | "Maklumat Pelayanan" | "Struktur Pejabat" | "Regulasi";
  updatedAt: string;
  content: string;
  status: "Aktif" | "Draft";
}

export default function ProfilAdminPage() {
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Visi Misi" as ProfileSection["category"],
    content: "",
    status: "Aktif" as ProfileSection["status"],
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchData<{ total: number; data: any[] }>(
        `/api/v1/admin/profil/read?limit=50`
      );

      if (res && Array.isArray(res.data)) {
        const mapped: ProfileSection[] = res.data.map((row: any) => ({
          id: row.id,
          title: row.title || "",
          category: (row.category || "Visi Misi") as ProfileSection["category"],
          updatedAt: row.updated_at
            ? new Date(row.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
            : "Terbaru",
          content: row.content || "",
          status: (row.status || "Aktif") as ProfileSection["status"],
        }));
        setSections(mapped);
      }
    } catch (err: any) {
      console.error("Gagal memuat profil dinas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "Visi Misi",
      content: "",
      status: "Aktif",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ProfileSection) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      content: item.content,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const payload = {
      title: formData.title,
      category: formData.category,
      content: formData.content,
      status: formData.status,
    };

    try {
      if (editingId) {
        await fetchData(`/api/v1/admin/profil/update/${editingId}`, {
          method: "PUT",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Diperbarui",
          text: "Bagian profil dinas berhasil diperbarui.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await fetchData(`/api/v1/admin/profil/create`, {
          method: "POST",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Ditambahkan",
          text: "Bagian profil baru telah disimpan.",
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

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Hapus Bagian Profil?",
      text: `Bagian "${title}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await fetchData(`/api/v1/admin/profil/delete/${id}`, {
          method: "DELETE",
        });
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Bagian profil berhasil dihapus.",
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
      <PageHeader
        title="Profil & Standar Pelayanan"
        description="Kelola halaman profil dinas, visi misi kepala daerah, maklumat pelayanan, dan standar mutu kedinasan."
        badge={<Badge variant="gold">{sections.length} Bagian</Badge>}
        action={
          <Button variant="gold" icon="📋" onClick={handleOpenCreate}>
            Tambah Bagian Profil
          </Button>
        }
      />

      {loading ? (
        <Card className="p-12 text-center text-xs text-[#7d7152]">
          <div className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            Memuat profil dinas...
          </div>
        </Card>
      ) : sections.length === 0 ? (
        <Card className="p-12 text-center text-xs text-[#7d7152]">
          Belum ada data bagian profil. Klik &quot;Tambah Bagian Profil&quot; di atas untuk menambahkan.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between border border-white/80 shadow-xs overflow-hidden">
              <CardHeader className="bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">{item.category}</Badge>
                  <Badge variant={item.status === "Aktif" ? "success" : "warning"}>
                    {item.status}
                  </Badge>
                </div>
                <span className="text-xs text-slate-400">Diperbarui: {item.updatedAt}</span>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 p-6">
                <CardTitle>{item.title}</CardTitle>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </CardContent>
              <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-white">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(item)}
                >
                  Edit Konten
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(item.id, item.title)}
                >
                  Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Bagian Profil / Maklumat" : "Tambah Bagian Profil / Maklumat"}
        description="Isi judul bagian dan naskah konten resmi yang akan ditampilkan di menu Tentang Kami."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-profile">
              {editingId ? "Simpan Perubahan" : "Simpan Konten"}
            </Button>
          </>
        }
      >
        <form id="form-profile" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Bagian / Dokumen"
            placeholder="Contoh: Maklumat Standar Pelayanan Publik 2026"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori Bagian"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ProfileSection["category"],
                })
              }
              options={[
                { value: "Visi Misi", label: "Visi & Misi Daerah" },
                { value: "Maklumat Pelayanan", label: "Maklumat & Janji Layanan" },
                { value: "Struktur Pejabat", label: "Struktur Organisasi / Eselon" },
                { value: "Regulasi", label: "Dasar Hukum & Regulasi" },
              ]}
            />
            <Select
              label="Status Publikasi"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ProfileSection["status"],
                })
              }
              options={[
                { value: "Aktif", label: "Aktif (Tampil Publik)" },
                { value: "Draft", label: "Draft Sementara" },
              ]}
            />
          </div>

          <Textarea
            label="Uraian Lengkap Naskah"
            placeholder="Tuliskan naskah atau butir-butir kebijakan..."
            rows={5}
            required
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
        </form>
      </Modal>
    </div>
  );
}
