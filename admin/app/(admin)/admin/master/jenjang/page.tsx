"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
  Select,
} from "../../../_components/ui";

import {
  JenjangRecord,
  KATEGORI_JENJANG_OPTIONS,
  STATUS_JENJANG_OPTIONS,
} from "./types";
import { DUMMY_JENJANG } from "./data";
import FormJenjangModal from "./components/FormJenjangModal";
import DetailJenjangModal from "./components/DetailJenjangModal";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";

export default function MasterJenjangPage() {
  const apiUrl = useUrlStore((state) => state.URL.APP);

  // Data Source State
  const [data, setData] = useState<JenjangRecord[]>(DUMMY_JENJANG);
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<JenjangRecord | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Field State
  const [formData, setFormData] = useState<Partial<JenjangRecord>>({
    id: "",
    uraian: "",
    nip: "",
    unit_kerja: "Bidang Pembinaan Sekolah Dasar",
    keterangan: "",
    kategori: "Formal",
    status: "Aktif",
  });

  // Fetch data dari FastAPI Backend
  const loadDataFromBackend = async () => {
    setIsLoadingApi(true);
    try {
      const res = await fetchData<{ total: number; data: any[] }>(
        `${apiUrl}/api/v1/admin/master/jenjang?skip=0&limit=100`
      );
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: JenjangRecord[] = res.data.map((item, idx) => ({
          id: item.id || `JJG-0${idx + 1}`,
          uraian: item.uraian || "",
          nip: item.nip || null,
          unit_kerja: item.unit_kerja || "Dinas Pendidikan & Kebudayaan",
          keterangan:
            item.keterangan ||
            (item.uraian.includes("PAUD") || item.uraian.includes("TK")
              ? "Pendidikan Anak Usia Dini formal & non-formal (TK, KB, TPA, SPS)"
              : item.uraian.includes("SD")
              ? "Pendidikan dasar wajib belajar 6 tahun (Kelas 1 s/d Kelas 6)"
              : item.uraian.includes("SMP")
              ? "Pendidikan menengah pertama wajib belajar 3 tahun (Kelas 7 s/d 9)"
              : "Pendidikan kesetaraan & non-formal masyarakat"),
          kategori: item.uraian.includes("PKBM") ? "Non-Formal" : "Formal",
          status: "Aktif",
          created_at: item.created_at,
          created_by: item.created_by || "Administrator SIMPEG",
        }));
        setData(mapped);
      }
    } catch {
      // Jika backend belum aktif atau error, gunakan data dummy fallback
    } finally {
      setIsLoadingApi(false);
    }
  };

  useEffect(() => {
    loadDataFromBackend();
  }, [apiUrl]);

  // Filter Data (Pencarian & Multi-Kriteria)
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.uraian.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        (item.unit_kerja || "").toLowerCase().includes(q) ||
        (item.keterangan || "").toLowerCase().includes(q);

      const matchKategori = kategoriFilter === "all" || item.kategori === kategoriFilter;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;

      return matchSearch && matchKategori && matchStatus;
    });
  }, [data, search, kategoriFilter, statusFilter]);

  // Paginasi Data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Statistik Ringkasan Metrik
  const stats = useMemo(() => {
    const total = data.length;
    const formalCount = data.filter((d) => d.kategori === "Formal").length;
    const nonFormalCount = data.filter((d) => d.kategori === "Non-Formal").length;
    const activeCount = data.filter((d) => (d.status || "Aktif") === "Aktif").length;
    return { total, formalCount, nonFormalCount, activeCount };
  }, [data]);

  // Modal Handlers
  const openAddModal = () => {
    setFormMode("add");
    setFormData({
      id: `JJG-${String(data.length + 1).padStart(2, "0")}`,
      uraian: "",
      nip: "",
      unit_kerja: "Bidang Pembinaan Sekolah Dasar",
      keterangan: "",
      kategori: "Formal",
      status: "Aktif",
    });
    setIsFormOpen(true);
  };

  const openEditModal = (item: JenjangRecord) => {
    setFormMode("edit");
    setSelectedRecord(item);
    setFormData({ ...item });
    setIsFormOpen(true);
  };

  const openDetailModal = (item: JenjangRecord) => {
    setSelectedRecord(item);
    setIsDetailOpen(true);
  };

  const handleDelete = async (id: string, uraian: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Master Jenjang "${uraian}" (${id})?`)) {
      try {
        await fetchData(`${apiUrl}/api/v1/admin/master/jenjang/${id}`, {
          method: "DELETE",
        });
      } catch {
        // Abaikan jika fallback
      }
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.uraian || !formData.id) {
      alert("Silakan lengkapi Kode dan Nama Jenjang Pendidikan!");
      return;
    }

    setIsSubmitting(true);

    try {
      if (formMode === "add") {
        const payload = {
          id: formData.id,
          uraian: formData.uraian,
          nip: formData.nip || null,
          unit_kerja: formData.unit_kerja || null,
        };

        try {
          await fetchData(`${apiUrl}/api/v1/admin/master/jenjang`, {
            method: "POST",
            body: JSON.stringify(payload),
          });
        } catch {
          // Tetap update state lokal jika offline
        }

        const newRecord: JenjangRecord = {
          ...(formData as JenjangRecord),
          created_at: new Date().toISOString(),
          created_by: "Administrator SIMPEG",
        };
        setData([newRecord, ...data]);
      } else if (formMode === "edit" && selectedRecord) {
        const payload = {
          uraian: formData.uraian,
          unit_kerja: formData.unit_kerja || null,
        };

        try {
          await fetchData(`${apiUrl}/api/v1/admin/master/jenjang/${selectedRecord.id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
        } catch {
          // Tetap update state lokal jika offline
        }

        setData((prev) =>
          prev.map((item) =>
            item.id === selectedRecord.id ? { ...item, ...(formData as JenjangRecord) } : item
          )
        );
      }
      setIsFormOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Breadcrumbs Navigasi */}
      <nav className="flex items-center gap-1.5 text-xs text-[#7d7152] font-medium">
        <Link href="/admin" className="hover:text-[#2d2410] transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#a89b7b]">Data Master</span>
        <span>/</span>
        <span className="text-[#2d2410] font-semibold">Master Jenjang</span>
      </nav>

      {/* 2. PageHeader Standar EduSetara */}
      <PageHeader
        title="Master Jenjang Pendidikan"
        description="Konfigurasi dan klasifikasi jenjang satuan pendidikan (PAUD/TK, SD, SMP, PKBM) untuk sinkronisasi Dapodik, PPDB, dan penugasan guru."
        badge={<Badge variant="gold">Data Master</Badge>}
        action={
          <Button variant="gold" onClick={openAddModal}>
            + Tambah Jenjang
          </Button>
        }
      />

      {/* 3. 4 Kartu Metrik Ringkasan (Glassmorphism Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Total Jenjang</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.total} Jenjang</h4>
            <span className="text-[11px] text-emerald-700 font-medium">Terdaftar di Sistem</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            🎓
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Pendidikan Formal</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.formalCount} Tingkat</h4>
            <span className="text-[11px] text-emerald-700 font-semibold">PAUD, SD & SMP</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            🏫
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Non-Formal / PKBM</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.nonFormalCount} Jalur</h4>
            <span className="text-[11px] text-[#a86a00] font-medium">Paket A, B, C Kesetaraan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            📚
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Status Keaktifan</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.activeCount} Aktif</h4>
            <span className="text-[11px] text-emerald-700 font-semibold">100% Terintegrasi Dapodik</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            ⚡
          </div>
        </Card>
      </div>

      {/* 4. Kontainer Utama Terpadu (Toolbar Filter + Tabel HTML Semantik + Paginasi) */}
      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Filter & Pencarian Data */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-80">
            <Input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Cari kode, nama jenjang, atau unit kerja..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <Select
              value={kategoriFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setKategoriFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Jalur Pendidikan</option>
              {KATEGORI_JENJANG_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  Jalur {opt}
                </option>
              ))}
            </Select>

            <Select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Status</option>
              {STATUS_JENJANG_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            {(search || kategoriFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setKategoriFilter("all");
                  setStatusFilter("all");
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
                <th className="w-[5%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  No
                </th>
                <th className="w-[12%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Kode
                </th>
                <th className="w-[28%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Jenjang Pendidikan
                </th>
                <th className="w-[14%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Jalur
                </th>
                <th className="w-[22%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Unit Kerja Pembina
                </th>
                <th className="w-[10%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Status
                </th>
                <th className="w-[9%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada data master jenjang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  return (
                    <tr key={row.id} className="hover:bg-white/50 transition-colors duration-150">
                      {/* 1. Nomor Baris */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle text-center font-semibold text-[#a89b7b]">
                        {(page - 1) * pageSize + idx + 1}
                      </td>

                      {/* 2. Kode Jenjang */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-white/70 text-[#2d2410] border border-white/80 shadow-2xs font-mono">
                          {row.id}
                        </span>
                      </td>

                      {/* 3. Jenjang Pendidikan */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#2d2410] hover:text-[#a86a00] transition-colors">
                            {row.uraian}
                          </p>
                          <p className="text-[11px] text-[#7d7152] line-clamp-1">
                            {row.keterangan || "Jenjang pendidikan terdaftar"}
                          </p>
                        </div>
                      </td>

                      {/* 4. Kategori Jalur */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle">
                        <span
                          className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            row.kategori === "Non-Formal"
                              ? "bg-amber-100/70 text-amber-900 border-amber-300/50"
                              : "bg-blue-50 text-blue-800 border-blue-200/60"
                          }`}
                        >
                          {row.kategori || "Formal"}
                        </span>
                      </td>

                      {/* 5. Unit Kerja */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle">
                        <span className="text-xs text-[#5e5133] font-medium">
                          {row.unit_kerja || "Dinas Pendidikan"}
                        </span>
                      </td>

                      {/* 6. Status */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle text-center">
                        <Badge
                          variant={row.status === "Non-Aktif" ? "neutral" : "success"}
                          size="sm"
                        >
                          {row.status || "Aktif"}
                        </Badge>
                      </td>

                      {/* 7. Tombol Aksi (Detail, Edit, Hapus) */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailModal(row)}
                            title="Lihat Detail Jenjang"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(row)}
                            title="Edit Jenjang"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-red-600 hover:bg-red-50/80"
                            onClick={() => handleDelete(row.id, row.uraian)}
                            title="Hapus Jenjang"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Paginasi Tabel */}
        <div className="px-6 py-4 bg-white/20 border-t border-white/60">
          <Pagination
            page={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            total={filteredData.length}
            pageSizeOptions={[3, 5, 10, 20]}
          />
        </div>
      </Card>

      {/* 5. Modal Formulir Tambah/Edit Terpisah */}
      <FormJenjangModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

      {/* 6. Modal Detail Pratinjau Terpisah */}
      <DetailJenjangModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
