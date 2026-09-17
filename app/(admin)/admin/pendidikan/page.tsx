"use client";

import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Select,
  Textarea,
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
];

export default function PendidikanAdminPage() {
  const [items, setItems] = useState<EducationProgram[]>(initialPrograms);
  const [activeTab, setActiveTab] = useState<"Semua" | "Jenjang" | "Kurikulum" | "GTK">("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    category: "Jenjang" as EducationProgram["category"],
    name: "",
    scope: "",
    totalUnits: "",
    curriculum: "Kurikulum Merdeka",
    status: "Aktif" as EducationProgram["status"],
  });

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

  const filtered = items.filter(
    (item) => activeTab === "Semua" || item.category === activeTab
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Pendidikan & Kurikulum"
        description="Kelola informasi jenjang satuan pendidikan (PAUD, SD, SMP), implementasi kurikulum, dan data guru tenaga kependidikan."
        badge={<Badge variant="gold">{items.length} Data Program</Badge>}
        action={
          <Button variant="gold" icon="🎓" onClick={() => setIsModalOpen(true)}>
            Tambah Data Pendidikan
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {(["Semua", "Jenjang", "Kurikulum", "GTK"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-[#052552] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab === "Semua" ? "Semua Bidang" : tab}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-bold text-[#58708d] uppercase tracking-wider">
                <th className="py-3 px-4">Nama Program / Satuan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Wilayah / Sasaran</th>
                <th className="py-3 px-4">Jumlah / Kapasitas</th>
                <th className="py-3 px-4">Kurikulum / Sistem</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#052552]">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant="neutral">{item.category}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {item.scope}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                    {item.totalUnits}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {item.curriculum}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge
                      variant={
                        item.status === "Aktif"
                          ? "success"
                          : item.status === "Dalam Proses"
                          ? "info"
                          : "warning"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => alert(`Edit: ${item.name}`)}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-red-600 hover:bg-red-50"
                        onClick={() =>
                          setItems(items.filter((x) => x.id !== item.id))
                        }
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Form */}
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
            <Select
              label="Kategori Bidang"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as EducationProgram["category"],
                })
              }
              options={[
                { value: "Jenjang", label: "Jenjang & Satuan Pendidikan" },
                { value: "Kurikulum", label: "Kurikulum & Pembelajaran" },
                { value: "GTK", label: "Pendidik & Tenaga Kependidikan" },
              ]}
            />
            <Select
              label="Status Pelaksanaan"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as EducationProgram["status"],
                })
              }
              options={[
                { value: "Aktif", label: "Aktif Berjalan" },
                { value: "Dalam Proses", label: "Dalam Proses / Sosialisasi" },
                { value: "Evaluasi", label: "Tahap Evaluasi" },
              ]}
            />
          </div>

          <Input
            label="Nama Program / Satuan"
            placeholder="Contoh: Sekolah Dasar Negeri se-Konawe Selatan"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Wilayah / Sasaran"
              placeholder="Contoh: 25 Kecamatan se-Konsel"
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
            />
            <Input
              label="Jumlah / Kapasitas"
              placeholder="Contoh: 196 Sekolah (18.340 Siswa)"
              value={formData.totalUnits}
              onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
            />
          </div>

          <Input
            label="Kurikulum / Platform"
            placeholder="Contoh: Kurikulum Merdeka Mandiri Berbagi"
            value={formData.curriculum}
            onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}
