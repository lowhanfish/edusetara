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
  BIDANG_LAYANAN_BK,
  JurnalBKRecord,
  KELAS_BK_OPTIONS,
  MODEL_KEGIATAN_BK,
  STATUS_BK_OPTIONS,
} from "./types";
import { DUMMY_JURNAL_BK } from "./data";
import FormBKModal from "./components/FormBKModal";
import DetailBKModal from "./components/DetailBKModal";

export default function JurnalBKPage() {
  // State Sumber Data
  const [data, setData] = useState<JurnalBKRecord[]>(DUMMY_JURNAL_BK);
  const [search, setSearch] = useState("");
  const [bidangFilter, setBidangFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // State Paginasi
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<JurnalBKRecord | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Form State
  const [formData, setFormData] = useState<Partial<JurnalBKRecord>>({
    nm_siswa: "",
    kelas_id: KELAS_BK_OPTIONS[0],
    tgl: new Date().toISOString().split("T")[0],
    materi_layanan: "",
    permasalahan: "",
    mdl_kegiatan_id: MODEL_KEGIATAN_BK[0],
    jns_layanan_id: BIDANG_LAYANAN_BK[0],
    hasil: "",
    rnc_tindak_lanjut: "",
    keterangan: "",
    file: "",
    status: STATUS_BK_OPTIONS[0],
  });

  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.nm_siswa.toLowerCase().includes(q) ||
        item.kelas_id.toLowerCase().includes(q) ||
        item.materi_layanan.toLowerCase().includes(q) ||
        item.permasalahan.toLowerCase().includes(q) ||
        item.jns_layanan_id.toLowerCase().includes(q);

      const matchBidang = bidangFilter === "all" || item.jns_layanan_id === bidangFilter;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;

      return matchSearch && matchBidang && matchStatus;
    });
  }, [data, search, bidangFilter, statusFilter]);

  // Paginasi Data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Statistik Metrik
  const stats = useMemo(() => {
    const total = data.length;
    const selesai = data.filter((d) => d.status === "Selesai / Teratasi").length;
    const pemantauan = data.filter((d) => d.status === "Dalam Pemantauan").length;
    const alihTangan = data.filter((d) => d.status === "Alih Tangan Kasus").length;
    return { total, selesai, pemantauan, alihTangan };
  }, [data]);

  // Handler Modal
  const openAddModal = () => {
    setFormMode("add");
    setFormData({
      nm_siswa: "",
      kelas_id: KELAS_BK_OPTIONS[0],
      tgl: new Date().toISOString().split("T")[0],
      materi_layanan: "",
      permasalahan: "",
      mdl_kegiatan_id: MODEL_KEGIATAN_BK[0],
      jns_layanan_id: BIDANG_LAYANAN_BK[0],
      hasil: "",
      rnc_tindak_lanjut: "",
      keterangan: "",
      file: "",
      status: "Selesai / Teratasi",
    });
    setIsFormOpen(true);
  };

  const openEditModal = (item: JurnalBKRecord) => {
    setFormMode("edit");
    setSelectedRecord(item);
    setFormData({ ...item });
    setIsFormOpen(true);
  };

  const openDetailModal = (item: JurnalBKRecord) => {
    setSelectedRecord(item);
    setIsDetailOpen(true);
  };

  const handleDelete = (id: string, siswa: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data catatan konseling "${siswa}"?`)) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nm_siswa || !formData.materi_layanan || !formData.permasalahan) {
      alert("Silakan lengkapi Nama Siswa, Topik Materi, dan Gejala Masalah!");
      return;
    }

    if (formMode === "add") {
      const newRecord: JurnalBKRecord = {
        ...(formData as JurnalBKRecord),
        id: `JBK-${new Date().getFullYear()}-${String(data.length + 1).padStart(3, "0")}`,
        created_at: new Date().toISOString(),
        created_by: "Nurul Hidayati, S.Pd. (Guru BK Konsel)",
      };
      setData([newRecord, ...data]);
    } else if (formMode === "edit" && selectedRecord) {
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedRecord.id ? { ...item, ...(formData as JurnalBKRecord) } : item
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
        <span className="text-[#2d2410] font-semibold">Jurnal BK</span>
      </nav>

      {/* 2. PageHeader Standar Admin */}
      <PageHeader
        title="Jurnal Bimbingan Konseling (BK)"
        description="Dokumentasi layanan bimbingan konseling pribadi, sosial, belajar, dan karir untuk mendukung perkembangan psikologis dan prestasi siswa."
        badge={<Badge variant="gold">Jurnal V2</Badge>}
        action={
          <Button variant="gold" onClick={openAddModal}>
            + Tambah Catatan BK
          </Button>
        }
      />

      {/* 3. 4 Kartu Metrik Ringkasan (Glassmorphism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Total Kasus & Sesi</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.total} Sesi</h4>
            <span className="text-[11px] text-[#7d7152]">Semester Berjalan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            🗣️
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Kasus Selesai</p>
            <h4 className="text-2xl font-bold text-emerald-700 mt-1">{stats.selesai} Kasus</h4>
            <span className="text-[11px] text-emerald-700 font-semibold">Solusi & Komitmen Damai</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            ✨
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Dalam Pemantauan</p>
            <h4 className="text-2xl font-bold text-amber-700 mt-1">{stats.pemantauan} Siswa</h4>
            <span className="text-[11px] text-[#7d7152]">Monitoring berkala</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-amber-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            👁️
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Alih Tangan Kasus</p>
            <h4 className="text-2xl font-bold text-sky-700 mt-1">{stats.alihTangan} Siswa</h4>
            <span className="text-[11px] text-sky-700 font-medium">Rujukan Medis / Psikolog</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-sky-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            🏥
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
              placeholder="Cari siswa, topik masalah, atau rombel..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <Select
              value={bidangFilter}
              onChange={(e) => setBidangFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Bidang Layanan</option>
              {BIDANG_LAYANAN_BK.map((opt) => (
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
              <option value="all">Semua Status Penanganan</option>
              {STATUS_BK_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            {(search || bidangFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setBidangFilter("all");
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
                <th className="w-[20%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Nama Siswa Konseli
                </th>
                <th className="w-[16%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Bidang & Model
                </th>
                <th className="w-[25%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Topik Masalah & Solusi
                </th>
                <th className="w-[12%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
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
                    Tidak ada catatan bimbingan konseling ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const statusVariant =
                    row.status === "Selesai / Teratasi"
                      ? "success"
                      : row.status === "Dalam Pemantauan"
                      ? "warning"
                      : "danger";

                  return (
                    <tr key={row.id} className="hover:bg-white/50 transition-colors duration-150">
                      {/* 1. No */}
                      <td className="px-4 py-3.5 text-xs align-middle text-center font-semibold text-[#a89b7b]">
                        {(page - 1) * pageSize + idx + 1}
                      </td>

                      {/* 2. Tanggal Sesi */}
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

                      {/* 3. Nama Siswa & Rombel */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#2d2410] hover:text-[#a86a00] transition-colors leading-snug">
                            {row.nm_siswa}
                          </p>
                          <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-400/20 px-1.5 py-0.2 rounded border border-amber-300/30">
                            {row.kelas_id}
                          </span>
                        </div>
                      </td>

                      {/* 4. Bidang & Model Layanan */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <div className="space-y-1">
                          <span className="inline-block text-[11px] font-semibold text-amber-900 bg-amber-400/25 px-2 py-0.5 rounded-md border border-amber-300/40">
                            {row.jns_layanan_id}
                          </span>
                          <p className="text-[11px] text-[#7d7152] truncate">{row.mdl_kegiatan_id}</p>
                        </div>
                      </td>

                      {/* 5. Topik Masalah & Solusi */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-[#2d2410] line-clamp-1">
                            {row.materi_layanan}
                          </p>
                          <p className="text-xs text-[#7d7152] line-clamp-1">
                            {row.permasalahan}
                          </p>
                        </div>
                      </td>

                      {/* 6. Status Kasus */}
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
                            title="Lihat Lembar Konseling"
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
                            title="Edit Catatan BK"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-red-600 hover:bg-red-50/80"
                            onClick={() => handleDelete(row.id, row.nm_siswa)}
                            title="Hapus Catatan BK"
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
      <FormBKModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      {/* 6. Modal Detail / Pratinjau Cetak */}
      <DetailBKModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
