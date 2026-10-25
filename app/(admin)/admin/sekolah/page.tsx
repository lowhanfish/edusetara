"use client";

import React, { useState, useMemo } from "react";
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
} from "../../_components/ui";

interface School {
  npsn: string;
  name: string;
  address: string;
  village: string;
  district: string;
  level: "SD" | "SMP";
  status: "NEGERI" | "SWASTA";
  url?: string;
}

const initialSchools: School[] = [
  {
    npsn: "70005313",
    name: "SD ISLAM TERPADU INSANUL FAIZ",
    address: "Jl.Poros Andoolo - Punggaluku",
    village: "Potoro",
    district: "Andoolo",
    level: "SD",
    status: "SWASTA",
    url: "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/70005313",
  },
  {
    npsn: "40402064",
    name: "SD NEGERI 11 ANDOOLO",
    address: "Blok E",
    village: "Alengge Agung",
    district: "Andoolo",
    level: "SD",
    status: "NEGERI",
    url: "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/40402064",
  },
  {
    npsn: "40405088",
    name: "SD NEGERI 18 ANDOOLO",
    address: "Jln. Usaha Tani Desa Lalonggombu",
    village: "Lalonggombu",
    district: "Andoolo",
    level: "SD",
    status: "NEGERI",
    url: "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/40405088",
  },
  {
    npsn: "40401978",
    name: "SD NEGERI 3 ANDOOLO",
    address: "Jl. Poros Andoolo - Tinanggea",
    village: "Lalobao",
    district: "Andoolo",
    level: "SD",
    status: "NEGERI",
    url: "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/40401978",
  },
  {
    npsn: "40402070",
    name: "SMP NEGERI 1 ANDOOLO",
    address: "Jl. Poros Pemda No. 12",
    village: "Andoolo Utama",
    district: "Andoolo",
    level: "SMP",
    status: "NEGERI",
    url: "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/40402070",
  },
  {
    npsn: "40403155",
    name: "SMP NEGERI 2 LAEYA",
    address: "Jl. Pendidikan Torobulu",
    village: "Torobulu",
    district: "Laeya",
    level: "SMP",
    status: "NEGERI",
    url: "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/40403155",
  },
];

export default function SekolahAdminPage() {
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    npsn: "",
    name: "",
    address: "",
    village: "",
    district: "Andoolo",
    level: "SD" as School["level"],
    status: "NEGERI" as School["status"],
  });

  const filtered = useMemo(() => {
    return schools.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.npsn.includes(search) ||
        s.district.toLowerCase().includes(search.toLowerCase()) ||
        s.village.toLowerCase().includes(search.toLowerCase());

      const matchLevel = levelFilter === "Semua" || s.level === levelFilter;
      const matchStatus = statusFilter === "Semua" || s.status === statusFilter;

      return matchSearch && matchLevel && matchStatus;
    });
  }, [schools, search, levelFilter, statusFilter]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.npsn || !formData.name) return;

    const newItem: School = {
      npsn: formData.npsn,
      name: formData.name.toUpperCase(),
      address: formData.address || "-",
      village: formData.village || "-",
      district: formData.district,
      level: formData.level,
      status: formData.status,
      url: `https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/${formData.npsn}`,
    };

    setSchools([newItem, ...schools]);
    setIsModalOpen(false);
    setFormData({
      npsn: "",
      name: "",
      address: "",
      village: "",
      district: "Andoolo",
      level: "SD",
      status: "NEGERI",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Direktori Satuan Pendidikan (Sekolah)"
        description="Kelola pangkalan data NPSN, nama sekolah, jenjang (SD / SMP), status kelembagaan, serta kecamatan se-Kabupaten Konawe Selatan."
        badge={<Badge variant="gold">{schools.length} Sekolah Terdaftar</Badge>}
        action={
          <Button variant="gold" icon="🏫" onClick={() => setIsModalOpen(true)}>
            Tambah Satuan Sekolah
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="Cari nama sekolah, NPSN, kecamatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-2 overflow-x-auto">
          <Select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            options={[
              { value: "Semua", label: "Semua Jenjang" },
              { value: "SD", label: "SD (Sekolah Dasar)" },
              { value: "SMP", label: "SMP (Menengah Pertama)" },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "Semua", label: "Semua Status" },
              { value: "NEGERI", label: "Negeri" },
              { value: "SWASTA", label: "Swasta" },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NPSN</TableHead>
              <TableHead>Nama Sekolah</TableHead>
              <TableHead>Jenjang</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Wilayah / Kecamatan</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.npsn}>
                <TableCell className="font-mono text-xs font-bold text-[#5b3fe0] whitespace-nowrap">
                  {item.npsn}
                </TableCell>
                <TableCell className="font-bold text-[#1f1b4d] max-w-sm">
                  <div>{item.name}</div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-sky-600 hover:underline inline-flex items-center gap-1 font-normal"
                    >
                      Kemendikdasmen ↗
                    </a>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={item.level === "SMP" ? "info" : "gold"}>
                    {item.level}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={item.status === "NEGERI" ? "success" : "neutral"}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-700 whitespace-nowrap">
                  <span className="font-semibold">{item.district}</span>
                  <span className="text-slate-400 block text-[11px]">{item.village}</span>
                </TableCell>
                <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                  {item.address}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alert(`Edit NPSN: ${item.npsn}`)}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-red-600 hover:bg-red-50"
                      onClick={() =>
                        setSchools(schools.filter((s) => s.npsn !== item.npsn))
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

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Satuan Pendidikan Baru"
        description="Daftarkan profil sekolah ke basis data direktori Dapodik Dikbud Konawe Selatan."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-sekolah">
              Simpan Data Sekolah
            </Button>
          </>
        }
      >
        <form id="form-sekolah" onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor Pokok Sekolah Nasional (NPSN)"
              placeholder="Contoh: 40402064"
              required
              value={formData.npsn}
              onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
            />
            <Input
              label="Nama Lengkap Satuan Sekolah"
              placeholder="Contoh: SD NEGERI 11 ANDOOLO"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Jenjang Pendidikan"
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value as School["level"] })
              }
              options={[
                { value: "SD", label: "SD (Sekolah Dasar)" },
                { value: "SMP", label: "SMP (Sekolah Menengah Pertama)" },
              ]}
            />
            <Select
              label="Status Kelembagaan"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as School["status"] })
              }
              options={[
                { value: "NEGERI", label: "Negeri" },
                { value: "SWASTA", label: "Swasta" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kecamatan"
              placeholder="Contoh: Andoolo"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />
            <Input
              label="Desa / Kelurahan"
              placeholder="Contoh: Alengge Agung"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            />
          </div>

          <Input
            label="Alamat Lengkap"
            placeholder="Contoh: Jl. Poros Andoolo - Punggaluku Km 3"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}
