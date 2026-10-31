"use client";

import React, { useState } from "react";
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

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  );

  return (
    <div className="space-y-6 pb-12">
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

      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Pencarian Data di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Cari nama layanan atau kategori..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada layanan ditemukan.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
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
            total={filtered.length}
            pageSizeOptions={[5, 10, 20]}
          />
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
