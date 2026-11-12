"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
  Select,
} from "../../../../_components/ui";
import { SekolahRecord, SekolahUpdatePayload } from "../types";
import {
  useResponseListSekolah,
  useUpdateSekolah,
  useSyncSekolah,
  useKecamatanList,
} from "../hooks/crud";
import DetailSekolahModal from "./DetailSekolahModal";
import EditSekolahModal from "./EditSekolahModal";
import { listindex } from "@/utilities/pagination";
import Swal from "sweetalert2";

interface SekolahManagerProps {
  jenjang: "SD" | "SMP" | "TK" | "PKBM" | "ALL";
  title: string;
  category?: string;
  description: string;
  icon: string;
  breadcrumbs: { label: string; href: string | null }[];
}

const KECAMATAN_OPTIONS = [
  "Andoolo", "Andoolo Barat", "Angata", "Baito", "Basala", "Benua", "Buke",
  "Kolono", "Kolono Timur", "Konda", "Laeya", "Lainea", "Lalembuu", "Landono",
  "Laonti", "Moramo", "Moramo Utara", "Mowila", "Palangga", "Palangga Selatan",
  "Ranomeeto", "Ranomeeto Barat", "Sabulakoa", "Tinanggea", "Wolasi"
];

export default function SekolahManager({
  jenjang,
  title,
  category = "Data Master",
  description,
  icon,
  breadcrumbs,
}: SekolahManagerProps) {
  // Filter States
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [kecamatanFilter, setKecamatanFilter] = useState("Semua");
  const [bmdFilter, setBmdFilter] = useState<"" | "sudah" | "belum">("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals State
  const [selectedRecord, setSelectedRecord] = useState<SekolahRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Query Hook
  const queryJenjang = jenjang === "ALL" ? "" : jenjang;
  const { List, isLoading, isError, error, refetch } = useResponseListSekolah({
    page,
    pageSize,
    search: debouncedSearch,
    jenjang: queryJenjang,
    statusSekolah: statusFilter,
    kecamatan: kecamatanFilter,
    statusBmd: bmdFilter,
  });

  const { kecamatanList } = useKecamatanList();

  const updateMutation = useUpdateSekolah();
  const syncMutation = useSyncSekolah();

  const rawList: SekolahRecord[] = useMemo(() => {
    if (!List?.data || !Array.isArray(List.data)) return [];
    return List.data;
  }, [List]);

  // Statistik Metrik
  const stats = useMemo(() => {
    const total = List?.total ?? rawList.length;
    const negeriCount = rawList.filter((s) => s.status_sekolah === "NEGERI").length;
    const swastaCount = rawList.filter((s) => s.status_sekolah === "SWASTA").length;
    const satapCount = rawList.filter((s) => s.jenjang === "SATAP").length;
    return { total, negeriCount, swastaCount, satapCount };
  }, [List, rawList]);

  const handleOpenDetail = (item: SekolahRecord) => {
    setSelectedRecord(item);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (item: SekolahRecord) => {
    setSelectedRecord(item);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (id: string, payload: SekolahUpdatePayload) => {
    updateMutation.mutate(
      { id, body: payload },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
      }
    );
  };

  const handleSyncConfirm = () => {
    Swal.fire({
      title: "Sinkronisasi Data Dapodik",
      text: "Sistem akan menyelaraskan data satuan pendidikan terbaru dari basis data Dapodik Kemendikdasmen Kabupaten Konawe Selatan. Lanjutkan?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Ya, Sinkronkan!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#71717a",
    }).then((res) => {
      if (res.isConfirmed) {
        syncMutation.mutate();
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Breadcrumbs Navigasi */}
      <nav className="flex items-center gap-1.5 text-xs text-[#7d7152] font-medium">
        <Link href="/admin" className="hover:text-[#2d2410] transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#a89b7b]">{category}</span>
        <span>/</span>
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={i}>
            {b.href ? (
              <Link href={b.href} className="hover:text-[#2d2410] transition-colors">
                {b.label}
              </Link>
            ) : (
              <span className="text-[#a89b7b]">{b.label}</span>
            )}
            {i < breadcrumbs.length - 1 && <span>/</span>}
          </React.Fragment>
        ))}
        <span>/</span>
        <span className="text-[#2d2410] font-semibold">{title}</span>
      </nav>

      {/* 2. PageHeader Standar EduSetara */}
      <PageHeader
        title={title}
        description={description}
        badge={<Badge variant="gold">{stats.total} Satuan Terdaftar</Badge>}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncConfirm}
              disabled={syncMutation.isPending}
              title="Sinkronisasi Data Dapodik Kabupaten Konawe Selatan"
            >
              🔄 Sync Dapodik
            </Button>
          </div>
        }
      />

      {/* 3. Kartu Metrik Ringkasan (Glassmorphism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Total Satuan {title}</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.total} Lembaga</h4>
            <span className="text-[11px] text-[#7d7152]">Master Mandiri Dapodik</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            {icon}
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Status Negeri</p>
            <h4 className="text-2xl font-bold text-emerald-700 mt-1">{stats.negeriCount} Sekolah</h4>
            <span className="text-[11px] text-emerald-700 font-medium">Binaan Pemerintah Kab.</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            🏛️
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Status Swasta / Yayasan</p>
            <h4 className="text-2xl font-bold text-[#a86a00] mt-1">{stats.swastaCount} Sekolah</h4>
            <span className="text-[11px] text-[#7d7152]">Penyelenggara Yayasan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#a86a00] flex items-center justify-center text-xl font-bold shadow-2xs">
            🏢
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">
              {jenjang === "SD" || jenjang === "SMP" ? "Satuan Satu Atap (SATAP)" : "Kewilayahan Tersebar"}
            </p>
            <h4 className="text-2xl font-bold text-sky-700 mt-1">
              {jenjang === "SD" || jenjang === "SMP" ? `${stats.satapCount} SATAP` : "25 Kecamatan"}
            </h4>
            <span className="text-[11px] text-sky-700 font-medium">
              {jenjang === "SD" || jenjang === "SMP" ? "Integrasi SD & SMP Terpadu" : "Se-Kabupaten Konsel"}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-sky-700 flex items-center justify-center text-xl font-bold shadow-2xs">
            🧭
          </div>
        </Card>
      </div>

      {/* 4. Kontainer Utama (Toolbar Filter & Tabel Semantik) */}
      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Filter */}
        <section aria-labelledby="school-filter-heading" className="border-b border-[#2d2410]/10 bg-white/40 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200/70 bg-amber-50 text-amber-800" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7h16M7 12h10M10 17h4" />
                  <circle cx="8" cy="7" r="2" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <div>
                <h2 id="school-filter-heading" className="text-sm font-bold text-[#2d2410]">Cari & Filter Sekolah</h2>
                <p className="mt-0.5 text-xs text-[#7d7152]">Temukan sekolah berdasarkan identitas, status, atau kecamatan.</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="shrink-0"
              icon={
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7v5h-5M4 17v-5h5" />
                  <path d="M6.1 6.1A8 8 0 0 1 20 12M4 12a8 8 0 0 0 13.9 5.9" />
                </svg>
              }
            >
              Segarkan
            </Button>
          </div>

          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-12">
            <div className="min-w-0 sm:col-span-2 lg:col-span-4">
              <Input
                id="school-search"
                label="Pencarian sekolah"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nama sekolah, NPSN, atau alamat..."
                leftIcon={
                  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="m16 16 4.5 4.5" />
                  </svg>
                }
              />
            </div>
            <div className="min-w-0 lg:col-span-2">
              <Select
                id="school-status-filter"
                label="Status sekolah"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="Semua">Semua status</option>
                <option value="NEGERI">Negeri</option>
                <option value="SWASTA">Swasta</option>
              </Select>
            </div>
            <div className="min-w-0 lg:col-span-3">
              <Select
                id="school-district-filter"
                label="Kecamatan"
                value={kecamatanFilter}
                onChange={(e) => {
                  setKecamatanFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="Semua">Semua kecamatan</option>
                {kecamatanList.length > 0
                  ? kecamatanList.map((kec) => (
                      <option key={kec.id} value={kec.label}>{kec.label}</option>
                    ))
                  : KECAMATAN_OPTIONS.map((kec) => (
                      <option key={kec} value={kec}>{kec}</option>
                    ))}
              </Select>
            </div>
            <div className="min-w-0 lg:col-span-3">
              <Select
                id="school-bmd-filter"
                label="Status BMD"
                value={bmdFilter}
                onChange={(e) => {
                  setBmdFilter(e.target.value as "" | "sudah" | "belum");
                  setPage(1);
                }}
              >
                <option value="">Semua status BMD</option>
                <option value="sudah">Sudah terhubung BMD</option>
                <option value="belum">Belum terhubung BMD</option>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#2d2410]/8 pt-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2 text-[11px] text-[#7d7152]">
              {search || statusFilter !== "Semua" || kecamatanFilter !== "Semua" || bmdFilter ? (
                <>
                  <span className="font-medium">Filter aktif:</span>
                  {[
                    search.trim() ? `Pencarian: ${search.trim()}` : null,
                    statusFilter !== "Semua" ? `Status: ${statusFilter === "NEGERI" ? "Negeri" : "Swasta"}` : null,
                    kecamatanFilter !== "Semua" ? `Kec. ${kecamatanFilter}` : null,
                    bmdFilter ? `BMD: ${bmdFilter === "sudah" ? "Sudah terhubung" : "Belum terhubung"}` : null,
                  ].filter(Boolean).map((filter) => (
                    <span key={filter} className="max-w-full break-words rounded-lg border border-amber-200/70 bg-amber-50 px-2.5 py-1 font-medium text-amber-900">{filter}</span>
                  ))}
                </>
              ) : (
                <span>Semua status sekolah, kecamatan, dan BMD · Hasil diperbarui otomatis saat filter berubah.</span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!search && statusFilter === "Semua" && kecamatanFilter === "Semua" && !bmdFilter}
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                setStatusFilter("Semua");
                setKecamatanFilter("Semua");
                setBmdFilter("");
                setPage(1);
              }}
              className="shrink-0"
            >
              Reset filter
            </Button>
          </div>
        </section>

        {/* Tabel Semantik */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="w-[6%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  No
                </th>
                <th className="w-[12%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  NPSN
                </th>
                <th className="w-[34%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Nama Satuan Pendidikan
                </th>
                <th className="w-[12%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Jenjang & Status
                </th>
                <th className="w-[18%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Kecamatan / Wilayah
                </th>
                <th className="w-[8%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  Akreditasi
                </th>
                <th className="w-[10%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, idx) => (
                  <tr key={`sk-${idx}`} className="animate-pulse">
                    <td className="px-4 py-3.5 text-center">
                      <div className="h-4 w-4 bg-amber-200/50 rounded-md mx-auto" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-16 bg-amber-200/50 rounded" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-48 bg-amber-200/50 rounded" />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="h-5 w-16 bg-amber-200/40 rounded-full mx-auto" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-28 bg-amber-200/40 rounded" />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="h-4 w-8 bg-amber-200/40 rounded mx-auto" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="h-7 w-16 bg-amber-200/40 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-rose-600 text-xs font-semibold">
                    Gagal mengambil data dari server: {(error as any)?.message || "Koneksi terputus"}
                  </td>
                </tr>
              ) : rawList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada data sekolah ditemukan untuk filter ini.
                  </td>
                </tr>
              ) : (
                rawList.map((item, idx) => {
                  const isSatap = item.jenjang === "SATAP";
                  return (
                    <tr key={item.id || item.npsn || item.unit_kerja_id} className="hover:bg-white/50 transition-colors duration-150">
                      {/* 1. No */}
                      <td className="px-4 py-3.5 text-xs align-middle text-center font-semibold text-[#a89b7b]">
                        {listindex(pageSize, page, idx)}
                      </td>

                      {/* 2. NPSN */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        {item.npsn ? (
                          <span className="font-mono font-bold text-[#a86a00] bg-amber-400/20 px-2 py-0.5 rounded border border-amber-300/30 inline-block">
                            {item.npsn}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#a89b7b] italic font-sans">
                            Belum diisi
                          </span>
                        )}
                      </td>

                      {/* 3. Nama Sekolah */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <p className="font-bold text-[#2d2410] leading-snug">
                          {item.nama_sekolah}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.alamat && (
                            <p className="text-[11px] text-[#7d7152] truncate max-w-sm">
                              📍 {item.alamat}
                            </p>
                          )}
                          {item.latitude && item.longitude && (
                            <span
                              className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200"
                              title={`Koordinat: ${item.latitude}, ${item.longitude}`}
                            >
                              🗺️ GPS
                            </span>
                          )}
                          {item.simpeg_unit_kerja_id && (
                            <span
                              className="text-[10px] text-sky-800 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200"
                              title={`SIMPEG: ${item.simpeg_unit_kerja_nama || item.simpeg_unit_kerja_id}`}
                            >
                              🏛️ SIMPEG
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-amber-800">
                          {item.simda_upb ? `SIMDA: ${item.simda_upb.kode}` : "SIMDA: belum terhubung"}
                        </p>
                      </td>

                      {/* 4. Jenjang & Status */}
                      <td className="px-4 py-3.5 text-xs align-middle text-center">
                        <div className="flex flex-col items-center gap-1">
                          {item.bentuk_pendidikan ? (
                            <Badge variant="gold" size="sm">
                              {item.bentuk_pendidikan}
                            </Badge>
                          ) : isSatap ? (
                            <Badge variant="info" size="sm">
                              SATAP
                            </Badge>
                          ) : (
                            <Badge variant="gold" size="sm">
                              {item.jenjang}
                            </Badge>
                          )}
                          <Badge
                            variant={item.status_sekolah === "NEGERI" ? "success" : "neutral"}
                            size="sm"
                          >
                            {item.status_sekolah}
                          </Badge>
                        </div>
                      </td>

                      {/* 5. Wilayah / Kecamatan */}
                      <td className="px-4 py-3.5 text-xs align-middle">
                        <span className="font-semibold text-[#2d2410] block">
                          {item.kecamatan || "-"}
                        </span>
                        {item.desa_kelurahan && (
                          <span className="text-[#7d7152] text-[11px] block">
                            Desa: {item.desa_kelurahan}
                          </span>
                        )}
                      </td>

                      {/* 6. Akreditasi */}
                      <td className="px-4 py-3.5 text-xs align-middle text-center">
                        {item.akreditasi ? (
                          <span className="font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-xs">
                            {item.akreditasi}
                          </span>
                        ) : (
                          <span className="text-[#a89b7b] text-[11px]">-</span>
                        )}
                      </td>

                      {/* 7. Aksi */}
                      <td className="px-4 py-3.5 text-xs align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetail(item)}
                            title="Lihat Detail Profil Sekolah"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Metadata Sekolah"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

        {/* Footer Paginasi */}
        <div className="px-6 py-4 bg-white/20 border-t border-white/60">
          <Pagination
            page={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={(newSize: number) => {
              setPageSize(newSize);
              setPage(1);
            }}
            total={List?.total ?? rawList.length}
            pageSizeOptions={[10, 20, 50]}
          />
        </div>
      </Card>

      {/* Modal Detail Profil */}
      <DetailSekolahModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
        onEditClick={handleOpenEdit}
      />

      {/* Modal Edit Metadata */}
      <EditSekolahModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        record={selectedRecord}
        onSave={handleSaveEdit}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
