"use client";

import React, { useMemo, useState } from "react";
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
  JurnalKepalaSekolahRecord,
  KETERLIBATAN_OPTIONS,
  STATUS_KEPSEK_OPTIONS,
} from "./types";
import { DUMMY_JURNAL_KEPALA_SEKOLAH } from "./data";
import FormKepsekModal from "./components/FormKepsekModal";
import DetailKepsekModal from "./components/DetailKepsekModal";

export default function JurnalKepalaSekolahPage() {
  // State Sumber Data
  const [data, setData] = useState<JurnalKepalaSekolahRecord[]>(DUMMY_JURNAL_KEPALA_SEKOLAH);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [keterlibatanFilter, setKeterlibatanFilter] = useState("all");

  // State Paginasi
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<JurnalKepalaSekolahRecord | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Form State
  const [formData, setFormData] = useState<Partial<JurnalKepalaSekolahRecord>>({
    sekolah: "SMP Negeri 1 Andoolo",
    uraian: "",
    target: "",
    hasil: "",
    keterlibatan: KETERLIBATAN_OPTIONS[0],
    tgl: new Date().toISOString().split("T")[0],
    keterangan: "",
    file: "",
    status: STATUS_KEPSEK_OPTIONS[0],
  });

  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.uraian.toLowerCase().includes(q) ||
        item.target.toLowerCase().includes(q) ||
        item.hasil.toLowerCase().includes(q) ||
        item.sekolah.toLowerCase().includes(q);

      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchKeterlibatan =
        keterlibatanFilter === "all" || item.keterlibatan === keterlibatanFilter;

      return matchSearch && matchStatus && matchKeterlibatan;
    });
  }, [data, search, statusFilter, keterlibatanFilter]);

  // Paginasi Data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Statistik Metrik
  const stats = useMemo(() => {
    const total = data.length;
    const terealisasi = data.filter((d) => d.status === "Terealisasi").length;
    const dalamProses = data.filter((d) => d.status === "Dalam Proses").length;
    const evaluasi = data.filter((d) => d.status === "Evaluasi").length;
    return { total, terealisasi, dalamProses, evaluasi };
  }, [data]);

  // Handler Modal
  const openAddModal = () => {
    setFormMode("add");
    setFormData({
      sekolah: "SMP Negeri 1 Andoolo",
      uraian: "",
      target: "",
      hasil: "",
      keterlibatan: KETERLIBATAN_OPTIONS[0],
      tgl: new Date().toISOString().split("T")[0],
      keterangan: "",
      file: "",
      status: "Terealisasi",
    });
    setIsFormOpen(true);
  };

  const openEditModal = (item: JurnalKepalaSekolahRecord) => {
    setFormMode("edit");
    setSelectedRecord(item);
    setFormData({ ...item });
    setIsFormOpen(true);
  };

  const openDetailModal = (item: JurnalKepalaSekolahRecord) => {
    setSelectedRecord(item);
    setIsDetailOpen(true);
  };

  const handleDelete = (id: string, uraian: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus agenda jurnal "${uraian}"?`)) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.uraian || !formData.target || !formData.hasil) {
      alert("Silakan lengkapi Uraian, Target, dan Hasil pelaksanaan!");
      return;
    }

    if (formMode === "add") {
      const newRecord: JurnalKepalaSekolahRecord = {
        ...(formData as JurnalKepalaSekolahRecord),
        id: `JKS-${new Date().getFullYear()}-${String(data.length + 1).padStart(3, "0")}`,
        created_at: new Date().toISOString(),
        created_by: "Drs. H. Mulyono, M.Pd (Kepala Sekolah)",
      };
      setData([newRecord, ...data]);
    } else if (formMode === "edit" && selectedRecord) {
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedRecord.id
            ? { ...item, ...(formData as JurnalKepalaSekolahRecord) }
            : item
        )
      );
    }

    setIsFormOpen(false);
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
        <span className="text-[#2d2410] font-semibold">Jurnal Kepala Sekolah</span>
      </nav>

      {/* 2. PageHeader Standar Admin */}
      <PageHeader
        title="Jurnal Kepala Sekolah"
        description="Dokumentasi kepemimpinan sekolah, supervisi instruksional pendidik/tendik, koordinasi komite, dan akuntabilitas manajerial satuan pendidikan."
        badge={<Badge variant="gold">Jurnal V2</Badge>}
        action={
          <Button variant="gold" onClick={openAddModal}>
            + Tambah Agenda Kepala Sekolah
          </Button>
        }
      />

      {/* 3. 4 Kartu Metrik Ringkasan (Glassmorphism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Total Agenda Tercatat</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.total} Kegiatan</h4>
            <span className="text-[11px] text-[#7d7152]">Semester Berjalan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            📋
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Terealisasi Penuh</p>
            <h4 className="text-2xl font-bold text-emerald-700 mt-1">{stats.terealisasi} Agenda</h4>
            <span className="text-[11px] text-emerald-700 font-semibold">Tercapai Sesuai Target</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            ✅
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Dalam Pelaksanaan</p>
            <h4 className="text-2xl font-bold text-amber-700 mt-1">{stats.dalamProses} Agenda</h4>
            <span className="text-[11px] text-[#7d7152]">Monitoring berkala</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-amber-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            ⏳
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Tahap Evaluasi</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.evaluasi} Agenda</h4>
            <span className="text-[11px] text-[#a86a00] font-medium">Revisi & Tindak Lanjut</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
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
              placeholder="Cari uraian agenda, sasaran, atau hasil..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Status Realisasi</option>
              {STATUS_KEPSEK_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <Select
              value={keterlibatanFilter}
              onChange={(e) => setKeterlibatanFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Stakeholder</option>
              {KETERLIBATAN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            {(search || statusFilter !== "all" || keterlibatanFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setKeterlibatanFilter("all");
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
                  Tanggal Agenda
                </th>
                <th className="w-[28%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Uraian Tugas & Satuan Sekolah
                </th>
                <th className="w-[20%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Target & Hasil Realisasi
                </th>
                <th className="w-[15%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Stakeholder
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
                    Tidak ada data agenda kepala sekolah ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const statusVariant =
                    row.status === "Terealisasi"
                      ? "success"
                      : row.status === "Dalam Proses"
                      ? "warning"
                      : "danger";

                  return (
                    <tr key={row.id} className="hover:bg-white/50 transition-colors duration-150">
                      {/* 1. No */}
                      <td className="px-4 py-3.5 text-xs align-middle text-center font-semibold text-[#a89b7b]">
                        {(page - 1) * pageSize + idx + 1}
                      </td>

                      {/* 2. Tanggal Pelaksanaan */}
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

                      {/* 3. Uraian Tugas & Satuan Pendidikan */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#2d2410] hover:text-[#a86a00] transition-colors leading-snug">
                            {row.uraian}
                          </p>
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wide text-amber-800 bg-amber-400/20 px-1.5 py-0.2 rounded border border-amber-300/30">
                            {row.sekolah}
                          </span>
                        </div>
                      </td>

                      {/* 4. Target & Hasil Realisasi */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <div className="space-y-1">
                          <p className="text-xs text-[#2d2410] line-clamp-1">
                            <span className="font-semibold text-[#7d7152]">🎯 Target:</span> {row.target}
                          </p>
                          <p className="text-xs text-[#2d2410] line-clamp-1">
                            <span className="font-semibold text-emerald-700">✅ Hasil:</span> {row.hasil}
                          </p>
                        </div>
                      </td>

                      {/* 5. Stakeholder Terlibat */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <span className="inline-flex items-center text-[11px] font-medium text-[#5e5133] bg-white/60 px-2 py-0.5 rounded-md border border-white/80">
                          {row.keterlibatan}
                        </span>
                      </td>

                      {/* 6. Status Realisasi */}
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
                            title="Lihat Detail Agenda"
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
                            title="Edit Agenda"
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
                            title="Hapus Agenda"
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
      <FormKepsekModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      {/* 6. Modal Detail / Pratinjau Lembar Jurnal */}
      <DetailKepsekModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
