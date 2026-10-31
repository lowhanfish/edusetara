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
  JurnalGuruKelasRecord,
  MODEL_OPTIONS,
  METODE_OPTIONS,
  PENILAIAN_OPTIONS,
} from "./types";
import { DUMMY_JURNAL_GURU_KELAS } from "./data";
import FormJurnalModal from "./components/FormJurnalModal";
import DetailJurnalModal from "./components/DetailJurnalModal";

export default function JurnalGuruKelasPage() {
  // Sumber Data State (Looping tabel merujuk ke data dummy kita)
  const [data, setData] = useState<JurnalGuruKelasRecord[]>(DUMMY_JURNAL_GURU_KELAS);
  const [search, setSearch] = useState("");
  const [modelFilter, setModelFilter] = useState("all");
  const [penilaianFilter, setPenilaianFilter] = useState("all");

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<JurnalGuruKelasRecord | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Form Field State
  const [formData, setFormData] = useState<Partial<JurnalGuruKelasRecord>>({
    sekolah: "SDN 2 BUKE",
    tema: "",
    materi_pokok: "",
    pertemuan_ke: 1,
    tgl: new Date().toISOString().split("T")[0],
    model_pembelajaran: MODEL_OPTIONS[0],
    metode_pembelajaran: METODE_OPTIONS[0],
    kegiatan: "",
    penilaian: PENILAIAN_OPTIONS[0],
    siswa_hadir: 28,
    siswa_izin: 0,
    siswa_sakit: 0,
    siswa_alpa: 0,
    persentase: 100,
    keterangan: "",
    file: "",
  });

  // Kalkulasi Otomatis Persentase Kehadiran
  const calculatePercentage = (hadir: number, izin: number, sakit: number, alpa: number) => {
    const total = hadir + izin + sakit + alpa;
    if (total === 0) return 0;
    return Math.round((hadir / total) * 100);
  };

  const handlePresenceChange = (
    field: "siswa_hadir" | "siswa_izin" | "siswa_sakit" | "siswa_alpa",
    value: number
  ) => {
    const nextVal = Math.max(0, value || 0);
    const updated = { ...formData, [field]: nextVal };
    const pct = calculatePercentage(
      field === "siswa_hadir" ? nextVal : updated.siswa_hadir || 0,
      field === "siswa_izin" ? nextVal : updated.siswa_izin || 0,
      field === "siswa_sakit" ? nextVal : updated.siswa_sakit || 0,
      field === "siswa_alpa" ? nextVal : updated.siswa_alpa || 0
    );
    setFormData({ ...updated, persentase: pct });
  };

  // Filter Data (Pencarian & Multi-Kriteria)
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.tema.toLowerCase().includes(q) ||
        item.materi_pokok.toLowerCase().includes(q) ||
        item.sekolah.toLowerCase().includes(q) ||
        item.kegiatan.toLowerCase().includes(q);

      const matchModel = modelFilter === "all" || item.model_pembelajaran === modelFilter;
      const matchPenilaian = penilaianFilter === "all" || item.penilaian === penilaianFilter;

      return matchSearch && matchModel && matchPenilaian;
    });
  }, [data, search, modelFilter, penilaianFilter]);

  // Paginasi Data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Statistik Ringkasan Metrik
  const stats = useMemo(() => {
    const total = data.length;
    const avgKehadiran =
      total > 0 ? Math.round(data.reduce((acc, c) => acc + c.persentase, 0) / total) : 0;
    const totalHadir = data.reduce((acc, c) => acc + c.siswa_hadir, 0);
    const totalDokumen = data.filter((d) => Boolean(d.file)).length;
    return { total, avgKehadiran, totalHadir, totalDokumen };
  }, [data]);

  // Modal Handlers
  const openAddModal = () => {
    setFormMode("add");
    setFormData({
      sekolah: "SDN 2 BUKE",
      tema: "",
      materi_pokok: "",
      pertemuan_ke: data.length + 1,
      tgl: new Date().toISOString().split("T")[0],
      model_pembelajaran: MODEL_OPTIONS[0],
      metode_pembelajaran: METODE_OPTIONS[0],
      kegiatan: "",
      penilaian: PENILAIAN_OPTIONS[0],
      siswa_hadir: 28,
      siswa_izin: 0,
      siswa_sakit: 0,
      siswa_alpa: 0,
      persentase: 100,
      keterangan: "",
      file: "",
    });
    setIsFormOpen(true);
  };

  const openEditModal = (item: JurnalGuruKelasRecord) => {
    setFormMode("edit");
    setSelectedRecord(item);
    setFormData({ ...item });
    setIsFormOpen(true);
  };

  const openDetailModal = (item: JurnalGuruKelasRecord) => {
    setSelectedRecord(item);
    setIsDetailOpen(true);
  };

  const handleDelete = (id: string, tema: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data jurnal "${tema}"?`)) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tema || !formData.materi_pokok) {
      alert("Silakan lengkapi Tema dan Materi Pokok pembelajaran!");
      return;
    }

    if (formMode === "add") {
      const newRecord: JurnalGuruKelasRecord = {
        ...(formData as JurnalGuruKelasRecord),
        id: `JGK-${new Date().getFullYear()}-${String(data.length + 1).padStart(3, "0")}`,
        created_at: new Date().toISOString(),
        created_by: "Ibu Sri Wahyuni, S.Pd (NIP 198803152014022003)",
      };
      setData([newRecord, ...data]);
    } else if (formMode === "edit" && selectedRecord) {
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedRecord.id ? { ...item, ...(formData as JurnalGuruKelasRecord) } : item
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
        <span className="text-[#2d2410] font-semibold">Jurnal Guru Kelas</span>
      </nav>

      {/* 2. PageHeader Standar Admin */}
      <PageHeader
        title="Jurnal Guru Kelas"
        description="Pencatatan aktivitas harian pembelajaran tematik terpadu, presensi siswa, sintaks KBM, dan dokumentasi kelas."
        badge={<Badge variant="gold">Jurnal V2</Badge>}
        action={
          <Button variant="gold" onClick={openAddModal}>
            + Tambah Jurnal Guru Kelas
          </Button>
        }
      />

      {/* 3. 4 Kartu Metrik Ringkasan (Glassmorphism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Total KBM Tercatat</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.total} Sesi</h4>
            <span className="text-[11px] text-emerald-700 font-medium">Bulan Aktif</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            📖
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Rata-rata Presensi</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.avgKehadiran}%</h4>
            <span className="text-[11px] text-emerald-700 font-semibold">Taraf Kehadiran Sangat Baik</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            📊
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Partisipasi Siswa</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.totalHadir} Siswa</h4>
            <span className="text-[11px] text-[#7d7152]">Akumulasi hadir KBM</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            👥
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Dokumentasi Foto</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.totalDokumen} Berkas</h4>
            <span className="text-[11px] text-[#a86a00] font-medium">100% Terverifikasi</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            📷
          </div>
        </Card>
      </div>

      {/* 4. Kontainer Utama Terpadu (Filter & Tabel di dalam satu wadah Card Glassmorphism) */}
      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Filter & Pencarian Data di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-80">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tema, materi pokok, atau sekolah..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <Select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Model Pembelajaran</option>
              {MODEL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <Select
              value={penilaianFilter}
              onChange={(e) => setPenilaianFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Asesmen</option>
              {PENILAIAN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            {(search || modelFilter !== "all" || penilaianFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setModelFilter("all");
                  setPenilaianFilter("all");
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
                <th className="w-[14%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Pertemuan & Tgl
                </th>
                <th className="w-[24%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Tema & Satuan Pendidikan
                </th>
                <th className="w-[16%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Model & Metode
                </th>
                <th className="w-[17%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Presensi Siswa
                </th>
                <th className="w-[10%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Asesmen
                </th>
                <th className="w-[7%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Berkas
                </th>
                <th className="w-[7%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada data jurnal ditemukan.
                  </td>
                </tr>
              ) : (
                /* Looping Baris Tabel Langsung dari Data Dummy Terpaginasi */
                paginatedData.map((row, idx) => {
                  const presenceVariant =
                    row.persentase >= 95
                      ? "success"
                      : row.persentase >= 85
                      ? "warning"
                      : "danger";

                  return (
                    <tr key={row.id} className="hover:bg-white/50 transition-colors duration-150">
                      {/* 1. Nomor Baris */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle text-center font-semibold text-[#a89b7b]">
                        <p>{(page - 1) * pageSize + idx + 1}</p>
                      </td>

                      {/* 2. Pertemuan & Tanggal */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center w-fit px-2 py-0.5 rounded-lg text-[11px] font-bold bg-white/70 text-[#2d2410] border border-white/80 shadow-2xs">
                            Pertemuan ke-{row.pertemuan_ke}
                          </span>
                          <span className="text-xs text-[#7d7152] font-medium">
                            {new Intl.DateTimeFormat("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(row.tgl))}
                          </span>
                        </div>
                      </td>

                      {/* 3. Tema, Subtema, & Satuan Pendidikan */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#2d2410] hover:text-[#a86a00] transition-colors">
                            {row.tema}
                          </p>
                          <p className="text-xs text-[#7d7152] line-clamp-1">
                            {row.materi_pokok}
                          </p>
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wide text-amber-800 bg-amber-400/20 px-1.5 py-0.2 rounded border border-amber-300/30">
                            {row.sekolah}
                          </span>
                        </div>
                      </td>

                      {/* 4. Model & Metode Pembelajaran */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center text-[10px] font-semibold text-amber-900 bg-amber-400/25 px-2 py-0.5 rounded-md border border-amber-300/40 w-fit">
                            {row.model_pembelajaran}
                          </span>
                          <p className="text-xs text-[#7d7152] truncate">
                            {row.metode_pembelajaran}
                          </p>
                        </div>
                      </td>

                      {/* 5. Presensi Siswa & Visual Progress Bar */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="flex items-center justify-between w-full text-xs">
                            <Badge variant={presenceVariant} size="sm">
                              {row.persentase}%
                            </Badge>
                            <span className="text-[11px] text-[#7d7152]">
                              H:{row.siswa_hadir} | I:{row.siswa_izin} | S:{row.siswa_sakit} | A:{row.siswa_alpa}
                            </span>
                          </div>
                          <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden border border-white/80">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                row.persentase >= 95
                                  ? "bg-emerald-500"
                                  : row.persentase >= 85
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                              style={{ width: `${row.persentase}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 6. Asesmen / Penilaian */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle text-center">
                        <Badge variant="neutral" size="sm">
                          {row.penilaian}
                        </Badge>
                      </td>

                      {/* 7. Dokumentasi Berkas */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle text-center">
                        {row.file ? (
                          <button
                            type="button"
                            onClick={() => openDetailModal(row)}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xl text-xs font-semibold bg-white/70 text-[#2d2410] border border-white/80 hover:bg-white hover:border-[#f5b82e] shadow-2xs transition-all cursor-pointer"
                            title="Klik untuk melihat dokumen foto"
                          >
                            <span>📷</span>
                            <span className="text-[11px] truncate max-w-[70px]">
                              {row.file.replace(/^.*\//, "")}
                            </span>
                          </button>
                        ) : (
                          <span className="text-xs text-[#a89b7b]">-</span>
                        )}
                      </td>

                      {/* 8. Tombol Aksi (Detail, Edit, Hapus) */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailModal(row)}
                            title="Lihat Detail Jurnal"
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
                            title="Edit Jurnal"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-red-600 hover:bg-red-50/80"
                            onClick={() => handleDelete(row.id, row.tema)}
                            title="Hapus Jurnal"
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

      {/* 5. Modal Formulir Tambah/Edit Terpisah */}
      <FormJurnalModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        handlePresenceChange={handlePresenceChange}
      />

      {/* 6. Modal Detail / Pratinjau Cetak Terpisah */}
      <DetailJurnalModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
