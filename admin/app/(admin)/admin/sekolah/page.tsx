"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Pagination,
  Select,
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
    address: "Jl. Poros Andoolo - Punggaluku",
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
  {
    npsn: "40402061",
    name: "SD NEGERI 1 RANOMEETO",
    address: "Jl. Poros Bandara Haluoleo",
    village: "Ranomeeto",
    district: "Ranomeeto",
    level: "SD",
    status: "NEGERI",
    url: "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/40402061",
  },
  {
    npsn: "40403152",
    name: "SMP NEGERI 22 KONAWE SELATAN",
    address: "Jl. Pendidikan Buke",
    village: "Buke",
    district: "Buke",
    level: "SMP",
    status: "NEGERI",
    url: "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/40403152",
  },
];

export default function SekolahAdminPage() {
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Statistik Ringkasan
  const stats = useMemo(() => {
    const total = schools.length;
    const sdCount = schools.filter((s) => s.level === "SD").length;
    const smpCount = schools.filter((s) => s.level === "SMP").length;
    const negeriCount = schools.filter((s) => s.status === "NEGERI").length;
    return { total, sdCount, smpCount, negeriCount };
  }, [schools]);

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
    <div className="space-y-6 pb-12">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#7d7152] font-medium">
        <Link href="/admin" className="hover:text-[#2d2410] transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#a89b7b]">Kelembagaan</span>
        <span>/</span>
        <span className="text-[#2d2410] font-semibold">Direktori Sekolah</span>
      </nav>

      {/* 2. PageHeader */}
      <PageHeader
        title="Direktori Satuan Pendidikan (Sekolah)"
        description="Kelola pangkalan data NPSN, nama sekolah, jenjang (SD / SMP), status kelembagaan, serta kecamatan se-Kabupaten Konawe Selatan."
        badge={<Badge variant="gold">{schools.length} Sekolah Terdaftar</Badge>}
        action={
          <Button variant="gold" icon="🏫" onClick={() => setIsModalOpen(true)}>
            + Tambah Satuan Sekolah
          </Button>
        }
      />

      {/* 3. 4 Kartu Metrik Ringkasan (Glassmorphism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Total Satuan Sekolah</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.total} Lembaga</h4>
            <span className="text-[11px] text-[#7d7152]">Dapodik Konsel</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            🏫
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Jenjang SD</p>
            <h4 className="text-2xl font-bold text-[#a86a00] mt-1">{stats.sdCount} Sekolah</h4>
            <span className="text-[11px] text-[#7d7152]">Sekolah Dasar</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#a86a00] flex items-center justify-center text-xl font-bold shadow-2xs">
            🎒
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Jenjang SMP</p>
            <h4 className="text-2xl font-bold text-sky-700 mt-1">{stats.smpCount} Sekolah</h4>
            <span className="text-[11px] text-[#7d7152]">Menengah Pertama</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-sky-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            🎓
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Status Kelembagaan</p>
            <h4 className="text-2xl font-bold text-emerald-700 mt-1">{stats.negeriCount} Negeri</h4>
            <span className="text-[11px] text-emerald-700 font-medium">Bina Pemerintah Kab.</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            🏛️
          </div>
        </Card>
      </div>

      {/* 4. Kontainer Utama Terpadu (Toolbar Filter & Tabel Semantik di dalam wadah Card Glassmorphism) */}
      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Filter & Pencarian Data di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-80">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama sekolah, NPSN, kecamatan..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <Select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="text-xs"
            >
              <option value="Semua">Semua Jenjang</option>
              <option value="SD">SD (Sekolah Dasar)</option>
              <option value="SMP">SMP (Menengah Pertama)</option>
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs"
            >
              <option value="Semua">Semua Status</option>
              <option value="NEGERI">Negeri</option>
              <option value="SWASTA">Swasta</option>
            </Select>

            {(search || levelFilter !== "Semua" || statusFilter !== "Semua") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setLevelFilter("Semua");
                  setStatusFilter("Semua");
                }}
                className="text-rose-600 hover:text-rose-700"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>

        {/* Tabel HTML Murni Semantik: table, thead, tbody, tr, th, td */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="w-[12%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  NPSN
                </th>
                <th className="w-[32%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Nama Satuan Sekolah
                </th>
                <th className="w-[10%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Jenjang
                </th>
                <th className="w-[10%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Status
                </th>
                <th className="w-[16%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Wilayah / Kecamatan
                </th>
                <th className="w-[12%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Alamat
                </th>
                <th className="w-[8%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada data sekolah ditemukan.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr key={item.npsn} className="hover:bg-white/50 transition-colors duration-150">
                    {/* 1. NPSN */}
                    <td className="px-4 py-3.5 text-xs align-middle">
                      <span className="font-mono font-bold text-[#a86a00] bg-amber-400/20 px-2 py-0.5 rounded border border-amber-300/30 inline-block">
                        {item.npsn}
                      </span>
                    </td>

                    {/* 2. Nama Sekolah */}
                    <td className="px-4 py-3.5 text-xs align-middle">
                      <p className="font-bold text-[#2d2410] hover:text-[#a86a00] transition-colors leading-snug">
                        {item.name}
                      </p>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-sky-600 hover:underline inline-flex items-center gap-1 font-normal mt-0.5"
                        >
                          Portal Kemendikdasmen ↗
                        </a>
                      )}
                    </td>

                    {/* 3. Jenjang */}
                    <td className="px-4 py-3.5 text-xs align-middle text-center">
                      <Badge variant={item.level === "SMP" ? "info" : "gold"} size="sm">
                        {item.level}
                      </Badge>
                    </td>

                    {/* 4. Status */}
                    <td className="px-4 py-3.5 text-xs align-middle text-center">
                      <Badge variant={item.status === "NEGERI" ? "success" : "neutral"} size="sm">
                        {item.status}
                      </Badge>
                    </td>

                    {/* 5. Wilayah / Kecamatan */}
                    <td className="px-4 py-3.5 text-xs align-middle">
                      <span className="font-semibold text-[#2d2410]">{item.district}</span>
                      <span className="text-[#7d7152] block text-[11px]">{item.village}</span>
                    </td>

                    {/* 6. Alamat */}
                    <td className="px-4 py-3.5 text-xs align-middle text-[#7d7152] max-w-xs truncate">
                      {item.address}
                    </td>

                    {/* 7. Aksi */}
                    <td className="px-4 py-3.5 text-xs align-middle text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => alert(`Edit data sekolah NPSN: ${item.npsn}`)}
                          title="Edit Sekolah"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-red-600 hover:bg-red-50/80"
                          onClick={() => {
                            if (confirm(`Hapus data sekolah ${item.name}?`)) {
                              setSchools(schools.filter((s) => s.npsn !== item.npsn));
                            }
                          }}
                          title="Hapus Sekolah"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Paginasi Tabel Terstandar */}
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

      {/* Modal Tambah Satuan Sekolah */}
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
            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
                Jenjang Pendidikan
              </label>
              <Select
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value as School["level"] })
                }
              >
                <option value="SD">SD (Sekolah Dasar)</option>
                <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
                Status Kelembagaan
              </label>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as School["status"] })
                }
              >
                <option value="NEGERI">Negeri</option>
                <option value="SWASTA">Swasta</option>
              </Select>
            </div>
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
