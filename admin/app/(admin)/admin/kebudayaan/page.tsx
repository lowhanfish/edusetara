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

interface CultureItem {
  id: string;
  name: string;
  type: "Cagar Budaya" | "Warisan Takbenda (WBTb)" | "Sanggar Seni" | "Festival / Agenda";
  location: string;
  description: string;
  status: "Terverifikasi" | "Dalam Kajian" | "Aktif";
}

const initialCulture: CultureItem[] = [
  {
    id: "cult-1",
    name: "Tarian Lulo Tradisional Tolaki",
    type: "Warisan Takbenda (WBTb)",
    location: "Konawe Selatan (Seluruh Wilayah)",
    description: "Tarian persahabatan dan perayaan syukur masyarakat Tolaki yang diwariskan turun-temurun.",
    status: "Terverifikasi",
  },
  {
    id: "cult-2",
    name: "Situs Makam Kuno Raja Konda",
    type: "Cagar Budaya",
    location: "Kecamatan Konda",
    description: "Kompleks makam bersejarah era kerajaan lokal dengan nisan batu berukir motif kuno.",
    status: "Dalam Kajian",
  },
  {
    id: "cult-3",
    name: "Sanggar Seni Anawai Konsel",
    type: "Sanggar Seni",
    location: "Andoolo, Konawe Selatan",
    description: "Wadah pembinaan generasi muda untuk seni tari tradisi dan musik gamelan bambu.",
    status: "Aktif",
  },
  {
    id: "cult-4",
    name: "Festival Seni Budaya & Kuliner Tradisional HUT Konsel 2026",
    type: "Festival / Agenda",
    location: "Pelataran Kantor Bupati Konsel",
    description: "Pekan kebudayaan daerah menampilkan lomba tari lulo massal dan pameran kerajinan serat enau.",
    status: "Aktif",
  },
];

export default function KebudayaanAdminPage() {
  const [items, setItems] = useState<CultureItem[]>(initialCulture);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("Semua");

  const [formData, setFormData] = useState({
    name: "",
    type: "Cagar Budaya" as CultureItem["type"],
    location: "",
    description: "",
    status: "Terverifikasi" as CultureItem["status"],
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newItem: CultureItem = {
      id: `cult-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      location: formData.location || "Kab. Konawe Selatan",
      description: formData.description || "-",
      status: formData.status,
    };

    setItems([newItem, ...items]);
    setIsModalOpen(false);
    setFormData({
      name: "",
      type: "Cagar Budaya",
      location: "",
      description: "",
      status: "Terverifikasi",
    });
  };

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Semua" || item.type === filterType;
    return matchSearch && matchType;
  });

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Manajemen Kebudayaan Daerah"
        description="Inventarisasi warisan budaya takbenda, cagar budaya bersejarah, sanggar seni, serta kalender festival kebudayaan."
        badge={<Badge variant="gold">{items.length} Data Budaya</Badge>}
        action={
          <Button variant="gold" icon="🎭" onClick={() => setIsModalOpen(true)}>
            Tambah Data Budaya
          </Button>
        }
      />

      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Pencarian & Filter Tabs di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-80">
            <Input
              placeholder="Cari objek budaya, sanggar, lokasi..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
            {[
              "Semua",
              "Warisan Takbenda (WBTb)",
              "Cagar Budaya",
              "Sanggar Seni",
              "Festival / Agenda",
            ].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setFilterType(type);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterType === type
                    ? "bg-[#2d2410] text-white shadow-2xs"
                    : "bg-white/60 text-slate-600 border border-white/80 hover:bg-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Semantik Native HTML */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Nama Objek / Sanggar</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Jenis Kebudayaan</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Lokasi / Kecamatan</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Deskripsi</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Status</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada data kebudayaan ditemukan.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr key={item.id} className="hover:bg-white/50 transition-colors duration-150">
                    <td className="px-4 py-3.5 text-xs align-middle font-bold text-[#2d2410]">
                      {item.name}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge variant="neutral">{item.type}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-[#5e5133]">
                      {item.location}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-[#7d7152] max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge
                        variant={
                          item.status === "Terverifikasi" || item.status === "Aktif"
                            ? "success"
                            : "warning"
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
        title="Tambah Data Kebudayaan"
        description="Daftarkan cagar budaya, warisan takbenda, sanggar komunitas seni, atau agenda festival."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-culture">
              Simpan Data
            </Button>
          </>
        }
      >
        <form id="form-culture" onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nama Objek / Sanggar / Festival"
            placeholder="Contoh: Tarian Lulo Massal Konsel"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Jenis Kebudayaan"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as CultureItem["type"],
                })
              }
              options={[
                { value: "Cagar Budaya", label: "Cagar Budaya (Benda / Situs)" },
                { value: "Warisan Takbenda (WBTb)", label: "Warisan Takbenda (WBTb)" },
                { value: "Sanggar Seni", label: "Sanggar & Komunitas Seni" },
                { value: "Festival / Agenda", label: "Festival / Agenda Kegiatan" },
              ]}
            />
            <Select
              label="Status Verifikasi"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as CultureItem["status"],
                })
              }
              options={[
                { value: "Terverifikasi", label: "Terverifikasi / Resmi" },
                { value: "Dalam Kajian", label: "Dalam Kajian Tim Ahli" },
                { value: "Aktif", label: "Aktif Beroperasi" },
              ]}
            />
          </div>

          <Input
            label="Lokasi / Kecamatan"
            placeholder="Contoh: Kecamatan Andoolo"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <Textarea
            label="Deskripsi & Sejarah Singkat"
            placeholder="Jelaskan asal-usul, nilai sejarah, atau keunikan..."
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </form>
      </Modal>
    </div>
  );
}
