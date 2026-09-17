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

interface PublicService {
  id: string;
  name: string;
  category: "Layanan Siswa" | "Layanan Guru" | "Layanan Sekolah" | "Direktori Sekolah";
  processingTime: string;
  fee: string;
  requirements: string;
  status: "Online" | "Tatap Muka" | "Aktif";
}

const initialServices: PublicService[] = [
  {
    id: "srv-1",
    name: "Pengurusan Rekomendasi Mutasi Siswa Masuk / Keluar Daerah",
    category: "Layanan Siswa",
    processingTime: "1 Hari Kerja",
    fee: "Gratis (Rp 0)",
    requirements: "Surat pindah sekolah asal, rapor terakhir, fotokopi KK/Akte",
    status: "Online",
  },
  {
    id: "srv-2",
    name: "Legalisir Ijazah & Piagam Prestasi Sekolah",
    category: "Layanan Siswa",
    processingTime: "30 Menit",
    fee: "Gratis (Rp 0)",
    requirements: "Membawa ijazah asli & fotokopi maksimal 5 lembar",
    status: "Tatap Muka",
  },
  {
    id: "srv-3",
    name: "Penerbitan Surat Cuti & Rekomendasi Kenaikan Pangkat Guru",
    category: "Layanan Guru",
    processingTime: "2 Hari Kerja",
    fee: "Gratis (Rp 0)",
    requirements: "SK terakhir, bukti penilaian kinerja (SKP), persetujuan Kepala Sekolah",
    status: "Online",
  },
  {
    id: "srv-4",
    name: "Pengajuan Verifikasi & Validasi Sarpras Rusak Berat (DAK)",
    category: "Layanan Sekolah",
    processingTime: "3 Hari Kerja",
    fee: "Gratis (Rp 0)",
    requirements: "Foto kondisi fisik, berita acara komite sekolah, usulan Dapodik",
    status: "Online",
  },
];

export default function LayananAdminPage() {
  const [services, setServices] = useState<PublicService[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Layanan Siswa" as PublicService["category"],
    processingTime: "1 Hari Kerja",
    fee: "Gratis (Rp 0)",
    requirements: "",
    status: "Online" as PublicService["status"],
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newItem: PublicService = {
      id: `srv-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      processingTime: formData.processingTime,
      fee: formData.fee,
      requirements: formData.requirements || "Sesuai SOP Dikbud Konsel",
      status: formData.status,
    };

    setServices([newItem, ...services]);
    setIsModalOpen(false);
    setFormData({
      name: "",
      category: "Layanan Siswa",
      processingTime: "1 Hari Kerja",
      fee: "Gratis (Rp 0)",
      requirements: "",
      status: "Online",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Layanan Publik & SOP"
        description="Atur jenis layanan terpadu, standar operasional prosedur (SOP), estimasi waktu pelayanan, serta syarat administrasi."
        badge={<Badge variant="gold">{services.length} Layanan Aktif</Badge>}
        action={
          <Button variant="gold" icon="🏛️" onClick={() => setIsModalOpen(true)}>
            Tambah Layanan
          </Button>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-bold text-[#58708d] uppercase tracking-wider">
                <th className="py-3 px-4">Nama Layanan</th>
                <th className="py-3 px-4">Sasaran Pengguna</th>
                <th className="py-3 px-4">Estimasi Waktu</th>
                <th className="py-3 px-4">Biaya</th>
                <th className="py-3 px-4">Moda Layanan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((item) => (
                <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#052552] max-w-sm">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant="neutral">{item.category}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                    ⏱️ {item.processingTime}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                    {item.fee}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant={item.status === "Online" ? "success" : "info"}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => alert(`Edit SOP: ${item.name}`)}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-red-600 hover:bg-red-50"
                        onClick={() =>
                          setServices(services.filter((s) => s.id !== item.id))
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Layanan Publik Baru"
        description="Definisikan standar pelayanan publik, syarat dokumen pengajuan, dan estimasi waktu selesai."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-layanan">
              Simpan Layanan
            </Button>
          </>
        }
      >
        <form id="form-layanan" onSubmit={handleCreate} className="space-y-4">
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
