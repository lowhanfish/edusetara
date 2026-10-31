"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
} from "../../../_components/ui";

import { ResponseInterface, JenjangRecord } from "./types";
import FormJenjangModal from "./components/FormJenjangModal";
import DetailJenjangModal from "./components/DetailJenjangModal";
import {
  useResponseListMaster,
  useDeleteMaster,
  useCreateMaster,
  useUpdateMaster,
} from "./hooks/crud";
import { listindex } from "@/utilities/pagination";

export default function MasterJenjangPage() {
  // Filter & Search State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce Search input (e-office pattern)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // TanStack Query CRUD Hooks
  const { List, isLoading, isError, error, refetch } = useResponseListMaster(
    page,
    pageSize,
    debouncedSearch
  );
  const deleteMutation = useDeleteMaster();
  const createMutation = useCreateMaster();
  const updateMutation = useUpdateMaster();

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<JenjangRecord | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Form Field State - strictly follows Arsitektur Sistem contract: title, desc
  const initialForm: Partial<ResponseInterface> = {
    title: "",
    desc: "",
  };

  const [formData, setFormData] = useState<Partial<ResponseInterface>>(initialForm);

  const emptyForm = () => {
    setFormData(initialForm);
  };

  // Raw data from TanStack Query
  const rawList: JenjangRecord[] = useMemo(() => {
    if (!List?.data || !Array.isArray(List.data)) return [];
    return List.data;
  }, [List]);

  // Statistik Ringkasan Metrik
  const stats = useMemo(() => {
    const total = List?.total ?? rawList.length;
    const sdCount = rawList.filter((d) => {
      const val = String(d.title || d.uraian || "");
      return ["1", "2", "3", "4", "5", "6"].includes(val) || (d.desc || "").toLowerCase().includes("sd");
    }).length;
    const smpCount = rawList.filter((d) => {
      const val = String(d.title || d.uraian || "");
      return ["7", "8", "9"].includes(val) || (d.desc || "").toLowerCase().includes("smp");
    }).length;
    return { total, sdCount, smpCount };
  }, [List, rawList]);

  // Modal Handlers
  const openAddModal = () => {
    setFormMode("add");
    emptyForm();
    setIsFormOpen(true);
  };

  const openEditModal = (item: JenjangRecord) => {
    setFormMode("edit");
    setSelectedRecord(item);
    setFormData({
      title: item.title || item.uraian || "",
      desc: item.desc || item.keterangan || "",
    });
    setIsFormOpen(true);
  };

  const openDetailModal = (item: JenjangRecord) => {
    setSelectedRecord(item);
    setIsDetailOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus Master Jenjang "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#71717a",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal = (formData.title || formData.uraian || "").trim();
    if (!titleVal) {
      Swal.fire({
        title: "Pemberitahuan!",
        text: "Silakan isi Nama Jenjang (title)!",
        icon: "warning",
      });
      return;
    }

    const payload: Partial<ResponseInterface> = {
      title: titleVal,
      desc: (formData.desc || formData.keterangan || "").trim() || null,
    };

    if (formMode === "add") {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
          emptyForm();
        },
      });
    } else if (formMode === "edit" && selectedRecord) {
      updateMutation.mutate(
        {
          id: selectedRecord.id,
          body: payload,
        },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            emptyForm();
          },
        }
      );
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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
        description="Daftar data tingkat jenjang pendidikan mulai dari kelas 1 Sekolah Dasar (SD) hingga kelas 9 Sekolah Menengah Pertama (SMP) sesuai dokumen spesifikasi Arsitektur Sistem."
        badge={<Badge variant="gold">Data Master</Badge>}
        action={
          <Button variant="gold" onClick={openAddModal}>
            + Tambah Jenjang
          </Button>
        }
      />

      {/* 3. Kartu Metrik Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Total Tingkat Jenjang</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.total} Jenjang</h4>
            <span className="text-[11px] text-emerald-700 font-medium">Kelas 1 s/d Kelas 9</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            🎓
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Jenjang SD</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.sdCount} Tingkat</h4>
            <span className="text-[11px] text-[#a86a00] font-semibold">Tingkat Kelas 1 s/d 6</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            🏫
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Jenjang SMP</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{stats.smpCount} Tingkat</h4>
            <span className="text-[11px] text-emerald-700 font-medium">Tingkat Kelas 7 s/d 9</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-xl font-bold shadow-2xs">
            🎒
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border border-white/70 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#7d7152]">Integrasi Jurnal & Rombel</p>
            <h4 className="text-2xl font-bold text-[#2d2410] mt-1">Aktif</h4>
            <span className="text-[11px] text-emerald-700 font-semibold">Rujukan Tingkatan</span>
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
          <div className="w-full md:w-96">
            <Input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Cari tingkat jenjang (1 s/d 9) atau penjelasan..."
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch("")}
                className="text-rose-600 hover:text-rose-700"
              >
                Reset Cari
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              title="Muat Ulang Data"
            >
              🔄 Refresh
            </Button>
          </div>
        </div>

        {/* Tabel HTML Murni Semantik: table, thead, tbody, tr, th, td */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="w-[8%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  No
                </th>
                <th className="w-[22%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Tingkat Jenjang (title)
                </th>
                <th className="w-[55%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                  Penjelasan Singkat Jenjang (desc)
                </th>
                <th className="w-[15%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {isLoading ? (
                // Shimmer Loading Skeleton Rows
                Array.from({ length: pageSize }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    <td className="px-4 py-3.5 text-center">
                      <div className="h-4 w-4 bg-amber-200/50 rounded-md mx-auto" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-5 w-20 bg-amber-200/50 rounded-md" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-72 bg-amber-200/40 rounded-md" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="h-7 w-20 bg-amber-200/40 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-rose-600 text-xs font-semibold">
                    Gagal mengambil data dari server: {(error as any)?.message || "Koneksi terputus"}
                  </td>
                </tr>
              ) : rawList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada data master jenjang ditemukan.
                  </td>
                </tr>
              ) : (
                rawList.map((row, idx) => {
                  const displayTitle = row.title || row.uraian || "";
                  const displayDesc = row.desc || row.keterangan || "-";
                  return (
                    <tr key={row.id} className="hover:bg-white/50 transition-colors duration-150">
                      {/* 1. Nomor Baris dengan listindex */}
                      <td className="px-4 py-3.5 text-xs align-middle text-center font-semibold text-[#a89b7b]">
                        {listindex(pageSize, page, idx)}
                      </td>

                      {/* 2. Tingkat Jenjang (title) */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ffd666]/30 text-[#855700] border border-[#ffd666]/60 font-mono shadow-2xs">
                          Tingkat {displayTitle}
                        </span>
                      </td>

                      {/* 3. Penjelasan Singkat (desc) */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle">
                        <p className="text-xs text-[#4a3f29] font-medium leading-relaxed">
                          {displayDesc}
                        </p>
                      </td>

                      {/* 4. Tombol Aksi (Detail, Edit, Hapus) */}
                      <td className="px-4 py-3.5 text-xs text-[#2d2410] align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailModal(row)}
                            title="Lihat Lembar Data Jenjang"
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
                            onClick={() => handleDelete(row.id, displayTitle)}
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
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
            total={List?.total ?? rawList.length}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </Card>

      {/* 5. Modal Formulir Tambah/Edit */}
      <FormJenjangModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

      {/* 6. Modal Detail Pratinjau */}
      <DetailJenjangModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
