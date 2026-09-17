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
} from "../../_components/ui";

interface StatRecord {
  id: string;
  indicator: string;
  category: "Pendidikan" | "Kepuasan Masyarakat (IKM)" | "Ketenagaan" | "Sarpras";
  value: string;
  unit: string;
  period: string;
  trend: string;
}

const initialStats: StatRecord[] = [
  {
    id: "stat-1",
    indicator: "Total Satuan Pendidikan Terakreditasi (SD/SMP)",
    category: "Pendidikan",
    value: "287",
    unit: "Sekolah",
    period: "2026 Ganjil",
    trend: "+3 Sekolah",
  },
  {
    id: "stat-2",
    indicator: "Indeks Kepuasan Masyarakat (IKM) Pelayanan Dikbud",
    category: "Kepuasan Masyarakat (IKM)",
    value: "88.42",
    unit: "Skor Mutu A (Sangat Baik)",
    period: "Semester I 2026",
    trend: "+1.2% YoY",
  },
  {
    id: "stat-3",
    indicator: "Rasio Guru Bersertifikat Pendidik (Sertifikasi)",
    category: "Ketenagaan",
    value: "78.6",
    unit: "% Tenaga Pendidik",
    period: "2026",
    trend: "+4.5% Capaian",
  },
  {
    id: "stat-4",
    indicator: "Tingkat Partisipasi Sekolah (Angka Partisipasi Murni)",
    category: "Pendidikan",
    value: "98.2",
    unit: "% Usia Sekolah",
    period: "2026",
    trend: "+0.8% Naik",
  },
];

export default function StatistikAdminPage() {
  const [stats, setStats] = useState<StatRecord[]>(initialStats);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    indicator: "",
    category: "Pendidikan" as StatRecord["category"],
    value: "",
    unit: "",
    period: "2026",
    trend: "",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.indicator || !formData.value) return;

    const newItem: StatRecord = {
      id: `stat-${Date.now()}`,
      indicator: formData.indicator,
      category: formData.category,
      value: formData.value,
      unit: formData.unit || "Satuan",
      period: formData.period,
      trend: formData.trend || "-",
    };

    setStats([newItem, ...stats]);
    setIsModalOpen(false);
    setFormData({
      indicator: "",
      category: "Pendidikan",
      value: "",
      unit: "",
      period: "2026",
      trend: "",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Data & Statistik"
        description="Kelola indikator capaian mutu pendidikan, indeks kepuasan masyarakat (IKM), dan statistik agregat wilayah."
        badge={<Badge variant="gold">{stats.length} Indikator</Badge>}
        action={
          <Button variant="gold" icon="📈" onClick={() => setIsModalOpen(true)}>
            Tambah Indikator Statistik
          </Button>
        }
      />

      {/* Grid of Key Figures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold text-[#58708d] uppercase tracking-wider">
                {item.category}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {item.trend}
              </span>
            </div>
            <div>
              <span className="text-3xl font-black text-[#052552] tracking-tight">
                {item.value}
              </span>
              <span className="text-xs text-[#58708d] ml-1.5 font-medium">
                {item.unit}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-2 text-xs font-medium text-slate-700 line-clamp-2">
              {item.indicator}
            </div>
          </div>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-bold text-[#58708d] uppercase tracking-wider">
                <th className="py-3 px-4">Nama Indikator</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Nilai Data</th>
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4">Tren / Capaian</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.map((item) => (
                <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#052552]">
                    {item.indicator}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant="neutral">{item.category}</Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0b3b73] whitespace-nowrap">
                    {item.value} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                    {item.period}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-emerald-700 font-semibold">
                    {item.trend}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-red-600 hover:bg-red-50"
                      onClick={() =>
                        setStats(stats.filter((s) => s.id !== item.id))
                      }
                    >
                      🗑️
                    </Button>
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
        title="Tambah Indikator Statistik"
        description="Masukkan angka indikator capaian pendidikan atau survei kepuasan layanan publik."
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-stat">
              Simpan Indikator
            </Button>
          </>
        }
      >
        <form id="form-stat" onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nama Indikator"
            placeholder="Contoh: Rata-Rata Nilai Literasi Rapor Pendidikan"
            required
            value={formData.indicator}
            onChange={(e) => setFormData({ ...formData, indicator: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as StatRecord["category"],
                })
              }
              options={[
                { value: "Pendidikan", label: "Pendidikan & Akademik" },
                { value: "Kepuasan Masyarakat (IKM)", label: "Kepuasan Masyarakat (IKM)" },
                { value: "Ketenagaan", label: "Guru & Ketenagaan" },
                { value: "Sarpras", label: "Sarana & Prasarana" },
              ]}
            />
            <Input
              label="Periode / Tahun"
              placeholder="Contoh: 2026 Ganjil"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nilai Angka"
              placeholder="Contoh: 85.5"
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
            <Input
              label="Satuan Nilai"
              placeholder="Contoh: Skor / Siswa / %"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>

          <Input
            label="Keterangan Tren"
            placeholder="Contoh: +2.5% Peningkatan"
            value={formData.trend}
            onChange={(e) => setFormData({ ...formData, trend: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}
