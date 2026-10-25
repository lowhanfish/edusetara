"use client";

import React, { useState } from "react";
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

const initialBanners: BannerSlide[] = [
  {
    id: "ban-1",
    title: "Pendidikan Maju, Budaya Lestari",
    subtitle: "Mewujudkan generasi emas Konawe Selatan yang cerdas, berkarakter, dan berdaya saing global melalui layanan terpadu dan inklusif.",
    badgeText: "Portal Resmi Dinas Pendidikan & Kebudayaan",
    primaryButtonLabel: "Jelajahi Layanan",
    primaryButtonLink: "/layanan-publik",
    image: "/img/hero-konsel.png",
    order: 1,
    status: "Aktif",
  },
  {
    id: "ban-2",
    title: "Digitalisasi Ruang Kelas Merata",
    subtitle: "Pemberdayaan laboratorium komputer dan Chromebook di seluruh pelosok satuan pendidikan SD & SMP se-Kabupaten Konawe Selatan.",
    badgeText: "Inovasi Pembelajaran Digital",
    primaryButtonLabel: "Cari Sekolah",
    primaryButtonLink: "/layanan-publik/cari-sekolah",
    image: "/img/pendidikan-jenjang.jpg",
    order: 2,
    status: "Aktif",
  },
];

export default function BannerAdminPage() {
  const [banners, setBanners] = useState<BannerSlide[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newItem: BannerSlide = {
      id: `ban-${Date.now()}`,
      title: formData.title,
      subtitle: formData.subtitle,
      badgeText: formData.badgeText,
      primaryButtonLabel: formData.primaryButtonLabel,
      primaryButtonLink: formData.primaryButtonLink,
      image: formData.image,
      order: Number(formData.order) || banners.length + 1,
      status: formData.status,
    };

    setBanners([...banners, newItem]);
    setIsModalOpen(false);
    setFormData({
      title: "",
      subtitle: "",
      badgeText: "Portal Resmi Dikbud Konsel",
      primaryButtonLabel: "Lihat Layanan",
      primaryButtonLink: "/layanan-publik",
      image: "/img/hero-konsel.png",
      order: banners.length + 2,
      status: "Aktif",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner & Slider Beranda"
        description="Atur tayangan slider utama (hero banner) di halaman muka website publik, foto latar belakang, dan tombol aksi."
        badge={<Badge variant="gold">{banners.length} Slider</Badge>}
        action={
          <Button variant="gold" icon="🖼️" onClick={() => setIsModalOpen(true)}>
            Tambah Slider Banner
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between">
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
                  className="hover:text-red-600 hover:bg-red-50"
                  onClick={() =>
                    setBanners(banners.filter((b) => b.id !== item.id))
                  }
                >
                  🗑️ Hapus
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Slider Hero Baru"
        description="Masukkan judul hero banner, teks penjelas, dan tautan tombol yang akan muncul di beranda."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-banner">
              Simpan Slider
            </Button>
          </>
        }
      >
        <form id="form-banner" onSubmit={handleCreate} className="space-y-4">
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
