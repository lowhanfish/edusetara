"use client";

import React, { useState } from "react";
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

const initialSections: ProfileSection[] = [
  {
    id: "prof-1",
    title: "Visi & Misi Dinas Pendidikan dan Kebudayaan",
    category: "Visi Misi",
    updatedAt: "10 Jan 2026",
    content: "Mewujudkan Sumber Daya Manusia Konawe Selatan yang Cerdas, Berkarakter, Unggul, Berdaya Saing, dan Berbudaya Luhur Berlandaskan Kearifan Lokal.",
    status: "Aktif",
  },
  {
    id: "prof-2",
    title: "Maklumat Pelayanan Terpadu Satu Pintu (PTSP)",
    category: "Maklumat Pelayanan",
    updatedAt: "01 Feb 2026",
    content: "Dengan ini kami pimpinan beserta seluruh jajaran pegawai Dikbud Konawe Selatan berjanji dan berkomitmen menyelenggarakan pelayanan publik sesuai standar pelayanan yang telah ditetapkan.",
    status: "Aktif",
  },
  {
    id: "prof-3",
    title: "Struktur Organisasi & Pejabat Eselon",
    category: "Struktur Pejabat",
    updatedAt: "15 Jul 2026",
    content: "Daftar susunan Kepala Dinas, Sekretaris, Kepala Bidang Pembinaan Dikdas, Bidang GTK, Bidang Kebudayaan, dan Pengawas Sekolah.",
    status: "Aktif",
  },
];

export default function ProfilAdminPage() {
  const [sections, setSections] = useState<ProfileSection[]>(initialSections);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Visi Misi" as ProfileSection["category"],
    content: "",
    status: "Aktif" as ProfileSection["status"],
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newItem: ProfileSection = {
      id: `prof-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      updatedAt: "17 Sep 2026",
      content: formData.content,
      status: formData.status,
    };

    setSections([newItem, ...sections]);
    setIsModalOpen(false);
    setFormData({
      title: "",
      category: "Visi Misi",
      content: "",
      status: "Aktif",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil & Standar Pelayanan"
        description="Kelola halaman profil dinas, visi misi kepala daerah, maklumat pelayanan, dan standar mutu kedinasan."
        badge={<Badge variant="gold">{sections.length} Bagian</Badge>}
        action={
          <Button variant="gold" icon="📋" onClick={() => setIsModalOpen(true)}>
            Tambah Bagian Profil
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardHeader className="bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Badge variant="neutral">{item.category}</Badge>
                <Badge variant={item.status === "Aktif" ? "success" : "warning"}>
                  {item.status}
                </Badge>
              </div>
              <span className="text-xs text-slate-400">Diperbarui: {item.updatedAt}</span>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              <CardTitle>{item.title}</CardTitle>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.content}
              </p>
            </CardContent>
            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-white">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Edit bagian: ${item.title}`)}
              >
                Edit Konten
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-red-600 hover:bg-red-50"
                onClick={() => setSections(sections.filter((s) => s.id !== item.id))}
              >
                Hapus
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Bagian Profil / Maklumat"
        description="Isi judul bagian dan naskah konten resmi yang akan ditampilkan di menu Tentang Kami."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-profile">
              Simpan Konten
            </Button>
          </>
        }
      >
        <form id="form-profile" onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Judul Bagian / Dokumen"
            placeholder="Contoh: Maklumat Standar Pelayanan Publik 2026"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ProfileSection["category"],
                })
              }
              options={[
                { value: "Visi Misi", label: "Visi & Misi" },
                { value: "Maklumat Pelayanan", label: "Maklumat Pelayanan" },
                { value: "Struktur Pejabat", label: "Struktur Organisasi" },
                { value: "Regulasi", label: "Regulasi & SK Kedinasan" },
              ]}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ProfileSection["status"],
                })
              }
              options={[
                { value: "Aktif", label: "Tampil di Website" },
                { value: "Draft", label: "Draft Sementara" },
              ]}
            />
          </div>

          <Textarea
            label="Naskah / Konten Lengkap"
            placeholder="Ketikkan isi naskah maklumat atau profil di sini..."
            rows={5}
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}
