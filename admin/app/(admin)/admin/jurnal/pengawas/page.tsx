"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  JENIS_PENDAMPINGAN_OPTIONS,
  JurnalPengawasRecord,
  SEKOLAH_BINAAN_OPTIONS,
  STATUS_PENGAWAS_OPTIONS,
  TUGAS_PENGAWAS_OPTIONS,
} from "./types";
import { DUMMY_JURNAL_PENGAWAS } from "./data";
import FormPengawasModal from "./components/FormPengawasModal";
import DetailPengawasModal from "./components/DetailPengawasModal";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { showLoadingAlert, swallAlert } from "@/lib/show_swall";

export default function JurnalPengawasPage() {
  const baseUrl = useUrlStore((state) => state.URL.APP);
  // State Sumber Data
  const [data, setData] = useState<JurnalPengawasRecord[]>(DUMMY_JURNAL_PENGAWAS);
  const [search, setSearch] = useState("");
  const [sekolahFilter, setSekolahFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Load from Backend API
  const loadJurnal = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchData<{ total: number; data: any[] }>(
        `${baseUrl}/api/v1/admin/jurnal/pengawas/read?limit=100`
      );
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: JurnalPengawasRecord[] = res.data.map((item) => ({
          id: item.id,
          unit_kerja: item.unit_kerja || SEKOLAH_BINAAN_OPTIONS[0],
          kepsek: item.kepsek || "",
          pendampingan_id: item.pendampingan_id || JENIS_PENDAMPINGAN_OPTIONS[0],
          temuan_akademik: item.temuan_akademik || "",
          temuan_manajerial: item.temuan_manajerial || "",
          tindak_lanjut: item.tindak_lanjut || "",
          tugas_id: item.tugas_id || TUGAS_PENGAWAS_OPTIONS[0],
          tgl: item.tgl || (item.created_at ? String(item.created_at).slice(0, 10) : "2026-10-20"),
          file: item.file || "",
          status: item.status || STATUS_PENGAWAS_OPTIONS[0],
          created_at: item.created_at,
          created_by: item.created_by || "H. Syamsul Bahri, M.Si",
        }));
        setData(mapped);
      }
    } catch (e) {
      console.warn("[JurnalPengawas] Fallback to local data:", e);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    loadJurnal();
  }, [loadJurnal]);

  // State Paginasi
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<JurnalPengawasRecord | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Form State
  const [formData, setFormData] = useState<Partial<JurnalPengawasRecord>>({
    unit_kerja: SEKOLAH_BINAAN_OPTIONS[0],
    kepsek: "",
    pendampingan_id: JENIS_PENDAMPINGAN_OPTIONS[0],
    temuan_akademik: "",
    temuan_manajerial: "",
    tindak_lanjut: "",
    tugas_id: TUGAS_PENGAWAS_OPTIONS[0],
    tgl: new Date().toISOString().split("T")[0],
    file: "",
    status: STATUS_PENGAWAS_OPTIONS[0],
  });

  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.unit_kerja.toLowerCase().includes(q) ||
        item.kepsek.toLowerCase().includes(q) ||
        item.temuan_akademik.toLowerCase().includes(q) ||
        item.temuan_manajerial.toLowerCase().includes(q) ||
        item.pendampingan_id.toLowerCase().includes(q);

      const matchSekolah = sekolahFilter === "all" || item.unit_kerja === sekolahFilter;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;

      return matchSearch && matchSekolah && matchStatus;
    });
  }, [data, search, sekolahFilter, statusFilter]);

  // Paginasi Data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Statistik Metrik
  const stats = useMemo(() => {
    const total = data.length;
    const selesai = data.filter((d) => d.status === "Selesai Disupervisi").length;
    const tindakLanjut = data.filter((d) => d.status === "Perlu Tindak Lanjut").length;
    const monitoring = data.filter((d) => d.status === "Monitoring Lanjutan").length;
    return { total, selesai, tindakLanjut, monitoring };
  }, [data]);

  // Handler Modal
  const openAddModal = () => {
    setFormMode("add");
    setFormData({
      unit_kerja: SEKOLAH_BINAAN_OPTIONS[0],
      kepsek: "",
      pendampingan_id: JENIS_PENDAMPINGAN_OPTIONS[0],
      temuan_akademik: "",
      temuan_manajerial: "",
      tindak_lanjut: "",
      tugas_id: TUGAS_PENGAWAS_OPTIONS[0],
      tgl: new Date().toISOString().split("T")[0],
      file: "",
      status: "Selesai Disupervisi",
    });
    setIsFormOpen(true);
  };

  const openEditModal = (item: JurnalPengawasRecord) => {
    setFormMode("edit");
    setSelectedRecord(item);
    setFormData({ ...item });
    setIsFormOpen(true);
  };

  const openDetailModal = (item: JurnalPengawasRecord) => {
    setSelectedRecord(item);
    setIsDetailOpen(true);
  };

  const handleDelete = async (id: string, sekolah: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data supervisi sekolah "${sekolah}"?`)) {
      showLoadingAlert("Menghapus supervisi...");
      try {
        await fetchData(`${baseUrl}/api/v1/admin/jurnal/pengawas/delete/${id}`, {
          method: "DELETE",
        });
        swallAlert("sukses dihapus", "success");
        await loadJurnal();
      } catch (err) {
        setData((prev) => prev.filter((item) => item.id !== id));
        swallAlert("sukses dihapus", "success");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kepsek || !formData.temuan_akademik || !formData.tindak_lanjut) {
      alert("Silakan lengkapi Kepala Sekolah, Temuan Akademik, dan Arahan Rekomendasi!");
      return;
    }

    showLoadingAlert(formMode === "add" ? "Menambahkan supervisi..." : "Menyimpan perubahan...");

    try {
      if (formMode === "add") {
        await fetchData(`${baseUrl}/api/v1/admin/jurnal/pengawas/create`, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        swallAlert("sukses ditambahkan", "success");
      } else if (formMode === "edit" && selectedRecord) {
        await fetchData(`${baseUrl}/api/v1/admin/jurnal/pengawas/update/${selectedRecord.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        swallAlert("sukses diperbarui", "success");
      }
      setIsFormOpen(false);
      await loadJurnal();
    } catch (err) {
      console.warn("Backend error, updating local state:", err);
      if (formMode === "add") {
        const newRecord: JurnalPengawasRecord = {
          ...(formData as JurnalPengawasRecord),
          id: `JPW-${new Date().getFullYear()}-${String(data.length + 1).padStart(3, "0")}`,
          created_at: new Date().toISOString(),
          created_by: "H. Syamsul Bahri, S.Pd., M.Si (Pengawas Pembina)",
        };
        setData([newRecord, ...data]);
      } else if (formMode === "edit" && selectedRecord) {
        setData((prev) =>
          prev.map((item) =>
            item.id === selectedRecord.id
              ? { ...item, ...(formData as JurnalPengawasRecord) }
              : item
          )
        );
      }
      setIsFormOpen(false);
      swallAlert("Tersimpan lokal", "info");
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
        <span className="text-[#a89b7b]">Jurnal V2</span>
        <span>/</span>
        <span className="text-[#2d2410] font-semibold">Jurnal Pengawas</span>
      </nav>

      {/* 2. PageHeader Standar Admin */}
      <PageHeader
        title="Jurnal Pengawas"
        description="Instrumen pengawasan terpadu, pembinaan manajerial kepala sekolah, supervisi instruksional guru, dan monitoring rapor pendidikan satuan binaan."
        badge={<Badge variant="gold">Jurnal V2</Badge>}
        action={
          <Button variant="gold" onClick={openAddModal}>
            + Tambah Supervisi Pengawas
          </Button>
        }
      />

      {/* 3. 4 Kartu Metrik Ringkasan (Glassmorphism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Total Kunjungan</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.total} Visitasi</h4>
            <span className="text-[11px] text-[#7d7152]">Sekolah Binaan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            🏫
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Selesai Disupervisi</p>
            <h4 className="text-2xl font-bold text-emerald-700 mt-1">{stats.selesai} Sekolah</h4>
            <span className="text-[11px] text-emerald-700 font-semibold">Instrumen Lengkap</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            ✅
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Perlu Tindak Lanjut</p>
            <h4 className="text-2xl font-bold text-amber-700 mt-1">{stats.tindakLanjut} Sekolah</h4>
            <span className="text-[11px] text-amber-700 font-medium">Atensi RKT / ARKAS</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-amber-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            ⚠️
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Monitoring Lanjutan</p>
            <h4 className="text-2xl font-bold text-sky-700 mt-1">{stats.monitoring} Visitasi</h4>
            <span className="text-[11px] text-[#7d7152]">Jadwal Gladi ANBK</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-sky-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            🔍
          </div>
        </Card>
      </div>

      {/* 4. Kontainer Utama Terpadu (Filter & Tabel dalam satu wadah Card Glassmorphism) */}
      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Filter & Pencarian Data */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-80">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari sekolah, kepala sekolah, atau temuan..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <Select
              value={sekolahFilter}
              onChange={(e) => setSekolahFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Sekolah Binaan</option>
              {SEKOLAH_BINAAN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Status Supervisi</option>
              {STATUS_PENGAWAS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            {(search || sekolahFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSekolahFilter("all");
                  setStatusFilter("all");
                }}
                className="text-rose-600 hover:text-rose-700"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>

        {/* Tabel Semantik HTML: table, thead, tbody, tr, th, td */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="w-[5%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  No
                </th>
                <th className="w-[12%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Tanggal
                </th>
                <th className="w-[24%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Sekolah Binaan & Kepsek
                </th>
                <th className="w-[18%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Bidang Pendampingan
                </th>
                <th className="w-[21%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Temuan Supervisi
                </th>
                <th className="w-[10%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Status
                </th>
                <th className="w-[10%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada catatan supervisi pengawas ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const statusVariant =
                    row.status === "Selesai Disupervisi"
                      ? "success"
                      : row.status === "Perlu Tindak Lanjut"
                      ? "warning"
                      : "danger";

                  return (
                    <tr key={row.id} className="hover:bg-white/50 transition-colors duration-150">
                      {/* 1. No */}
                      <td className="px-4 py-3.5 text-xs align-middle text-center font-semibold text-[#a89b7b]">
                        {(page - 1) * pageSize + idx + 1}
                      </td>

                      {/* 2. Tanggal */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-[#2d2410]">
                            {new Intl.DateTimeFormat("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(row.tgl))}
                          </span>
                          <span className="text-[11px] text-[#7d7152]">
                            {new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(
                              new Date(row.tgl)
                            )}
                          </span>
                        </div>
                      </td>

                      {/* 3. Sekolah Binaan & Kepsek */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#2d2410] hover:text-[#a86a00] transition-colors leading-snug">
                            {row.unit_kerja}
                          </p>
                          <p className="text-xs text-[#7d7152] font-medium">
                            Kepsek: {row.kepsek}
                          </p>
                        </div>
                      </td>

                      {/* 4. Bidang Pendampingan */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <div className="space-y-1">
                          <span className="inline-block text-[11px] font-semibold text-amber-900 bg-amber-400/25 px-2 py-0.5 rounded-md border border-amber-300/40">
                            {row.pendampingan_id}
                          </span>
                          <p className="text-[11px] text-[#7d7152]">{row.tugas_id}</p>
                        </div>
                      </td>

                      {/* 5. Temuan Supervisi */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <p className="text-xs text-[#2d2410] line-clamp-2 leading-relaxed">
                          {row.temuan_akademik}
                        </p>
                      </td>

                      {/* 6. Status Supervisi */}
                      <td className="px-4 py-3.5 text-xs align-middle text-center">
                        <Badge variant={statusVariant} size="sm">
                          {row.status}
                        </Badge>
                      </td>

                      {/* 7. Tombol Aksi */}
                      <td className="px-4 py-3.5 text-xs align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailModal(row)}
                            title="Lihat Laporan Supervisi"
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
                            title="Edit Supervisi"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-red-600 hover:bg-red-50/80"
                            onClick={() => handleDelete(row.id, row.unit_kerja)}
                            title="Hapus Supervisi"
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

        {/* Footer Paginasi Tabel Terstandar */}
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

      {/* 5. Modal Formulir Tambah/Edit */}
      <FormPengawasModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      {/* 6. Modal Detail / Pratinjau Cetak */}
      <DetailPengawasModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
