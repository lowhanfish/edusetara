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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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

  const filtered = items.filter(
    (item) => filterType === "Semua" || item.type === filterType
  );

  return (
    <div className="space-y-6">
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

      <div className="flex gap-2 overflow-x-auto pb-1">
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
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === type
                ? "bg-[#1f1b4d] text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Objek / Sanggar</TableHead>
              <TableHead>Jenis Kebudayaan</TableHead>
              <TableHead>Lokasi / Kecamatan</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold text-[#1f1b4d]">
                  {item.name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant="neutral">{item.type}</Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {item.location}
                </TableCell>
                <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                  {item.description}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge
                    variant={
                      item.status === "Terverifikasi" || item.status === "Aktif"
                        ? "success"
                        : "warning"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
