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
  Select,
  Textarea,
} from "../../_components/ui";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  primaryButtonLabel: string;
  primaryButtonLink: string;
  image: string;
  order: number;
  status: "Aktif" | "Nonaktif";
}

export default function BannerAdminPage() {
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badgeText: "Portal Resmi Dikbud Konsel",
    primaryButtonLabel: "Lihat Layanan",
    primaryButtonLink: "/layanan-publik",
    image: "/img/hero-konsel.png",
    order: 1,
    status: "Aktif" as BannerSlide["status"],
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchData<{ total: number; data: any[] }>(
        `/api/v1/admin/banner/read?limit=50`
      );

      if (res && Array.isArray(res.data)) {
        const mapped: BannerSlide[] = res.data.map((row: any) => ({
          id: row.id,
          title: row.title || "",
          subtitle: row.subtitle || "",
          badgeText: row.badge_text || row.badgeText || "Portal Resmi Dikbud Konsel",
          primaryButtonLabel: row.primary_button_label || row.primaryButtonLabel || "Jelajahi Layanan",
          primaryButtonLink: row.primary_button_link || row.primaryButtonLink || "/layanan-publik",
          image: row.image || "/img/hero-konsel.png",
          order: Number(row.order_num || row.order || 1),
          status: (row.status || "Aktif") as BannerSlide["status"],
        }));
        setBanners(mapped);
      }
    } catch (err: any) {
      console.error("Gagal memuat banner:", err);
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
      subtitle: "",
      badgeText: "Portal Resmi Dikbud Konsel",
      primaryButtonLabel: "Lihat Layanan",
      primaryButtonLink: "/layanan-publik",
      image: "/img/hero-konsel.png",
      order: banners.length + 1,
      status: "Aktif",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BannerSlide) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      subtitle: item.subtitle,
      badgeText: item.badgeText,
      primaryButtonLabel: item.primaryButtonLabel,
      primaryButtonLink: item.primaryButtonLink,
      image: item.image,
      order: item.order,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      badge_text: formData.badgeText,
      primary_button_label: formData.primaryButtonLabel,
      primary_button_link: formData.primaryButtonLink,
      image: formData.image,
      order_num: String(formData.order),
      status: formData.status,
    };

    try {
      if (editingId) {
        await fetchData(`/api/v1/admin/banner/update/${editingId}`, {
          method: "PUT",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Diperbarui",
          text: "Slider banner berhasil diperbarui.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await fetchData(`/api/v1/admin/banner/create`, {
          method: "POST",
          body: payload,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil Ditambahkan",
          text: "Slider banner baru telah disimpan.",
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
      title: "Hapus Slider Banner?",
      text: `Banner "${title}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await fetchData(`/api/v1/admin/banner/delete/${id}`, {
          method: "DELETE",
        });
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Banner berhasil dihapus.",
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
        title="Banner & Slider Beranda"
        description="Atur tayangan slider utama (hero banner) di halaman muka website publik, foto latar belakang, dan tombol aksi."
        badge={<Badge variant="gold">{banners.length} Slider</Badge>}
        action={
          <Button variant="gold" icon="🖼️" onClick={handleOpenCreate}>
            Tambah Slider Banner
          </Button>
        }
      />

      {loading ? (
        <Card className="p-12 text-center text-xs text-[#7d7152]">
          <div className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            Memuat daftar banner...
          </div>
        </Card>
      ) : banners.length === 0 ? (
        <Card className="p-12 text-center text-xs text-[#7d7152]">
          Belum ada slider banner. Klik &quot;Tambah Slider Banner&quot; di atas untuk membuat banner baru.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between overflow-hidden border border-white/80 shadow-xs">
              <div className="p-6 bg-gradient-to-br from-[#fff6dc] to-[#fff0c4] border-b border-amber-200/50 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d2410] bg-white/70 px-2.5 py-1 rounded-md">
                    Urutan #{item.order}
                  </span>
                  <Badge variant={item.status === "Aktif" ? "success" : "neutral"}>
                    {item.status}
                  </Badge>
                </div>
                <span className="text-xs text-[#a86a00] font-bold">
                  {item.badgeText}
                </span>
                <h3 className="text-lg font-extrabold text-[#2d2410]">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-700 line-clamp-2">
                  {item.subtitle}
                </p>
              </div>

              <div className="p-5 flex items-center justify-between bg-white text-xs text-slate-600">
                <div className="flex flex-col">
                  <span className="font-semibold text-[#2d2410]">
                    Tombol: {item.primaryButtonLabel}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {item.primaryButtonLink}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(item)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(item.id, item.title)}
                  >
                    🗑️ Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Slider Hero" : "Tambah Slider Hero Baru"}
        description="Masukkan judul hero banner, teks penjelas, dan tautan tombol yang akan muncul di beranda."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-banner">
              {editingId ? "Simpan Perubahan" : "Simpan Slider"}
            </Button>
          </>
        }
      >
        <form id="form-banner" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Utama Slider"
            placeholder="Contoh: Pendidikan Cerdas, Lestari Budayanya"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Teks Label / Badge Atas"
              placeholder="Contoh: Portal Resmi Dikbud Konsel"
              value={formData.badgeText}
              onChange={(e) =>
                setFormData({ ...formData, badgeText: e.target.value })
              }
            />
            <Input
              label="Urutan Tampil (No. Urut)"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: Number(e.target.value) })
              }
            />
          </div>

          <Textarea
            label="Deskripsi / Subtitle Banner"
            placeholder="Jelaskan pesan atau arahan singkat untuk banner ini..."
            rows={3}
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
          />

          <FileInput
            label="Foto / Gambar Latar Belakang Banner"
            accept="image/*"
            value={formData.image}
            onChange={(fileName) =>
              setFormData({ ...formData, image: fileName })
            }
            helperText="Unggah gambar hero slider resolusi tinggi (rekomendasi 1920x800 px)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Label Tombol Utama"
              placeholder="Contoh: Jelajahi Layanan"
              value={formData.primaryButtonLabel}
              onChange={(e) =>
                setFormData({ ...formData, primaryButtonLabel: e.target.value })
              }
            />
            <Input
              label="Link Tujuan Tombol"
              placeholder="Contoh: /layanan-publik"
              value={formData.primaryButtonLink}
              onChange={(e) =>
                setFormData({ ...formData, primaryButtonLink: e.target.value })
              }
            />
          </div>

          <Select
            label="Status Tampil"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as BannerSlide["status"],
              })
            }
            options={[
              { value: "Aktif", label: "Aktif & Ditampilkan" },
              { value: "Nonaktif", label: "Nonaktifkan Sementara" },
            ]}
          />
        </form>
      </Modal>
    </div>
  );
}
