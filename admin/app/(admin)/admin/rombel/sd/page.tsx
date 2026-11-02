"use client";

import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
} from "@/app/(admin)/_components/ui";

import { ResponseInterface, RombelSdRecord } from "./types";
import FormRombelSdModal from "./components/FormRombelSdModal";
import DetailRombelSdModal from "./components/DetailRombelSdModal";
import {
  useResponseListMaster,
  useDeleteMaster,
  useCreateMaster,
  useUpdateMaster,
  useJenjangOption,
  useRuangOption,
} from "./hooks/crud";
import { listindex } from "@/utilities/pagination";

export default function RombelSdPage() {
  const { options: jenjangOptions } = useJenjangOption();
  const { options: ruangOptions } = useRuangOption();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { List, isLoading, isError, error, refetch } = useResponseListMaster(
    page,
    pageSize,
    debouncedSearch
  );
  const deleteMutation = useDeleteMaster();
  const createMutation = useCreateMaster();
  const updateMutation = useUpdateMaster();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RombelSdRecord | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  const initialForm: Partial<ResponseInterface> = {
    nama: "",
    tgkt_pendidikan: "",
    wali_kelas: "",
    jns_rombel: "",
    ruang_kelas: "",
    kurikulum: "",
  };

  const [formData, setFormData] = useState<Partial<ResponseInterface>>(initialForm);

  const emptyForm = () => {
    setFormData(initialForm);
  };

  const rawList: RombelSdRecord[] = useMemo(() => {
    if (!List?.data || !Array.isArray(List.data)) return [];
    return List.data;
  }, [List]);

  const totalItems = List?.total ?? rawList.length;

  const handleOpenAdd = () => {
    setFormMode("add");
    emptyForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: RombelSdRecord) => {
    setFormMode("edit");
    setFormData({
      id: record.id,
      nama: (record as any).nama ?? "",
      tgkt_pendidikan: (record as any).tgkt_pendidikan ?? "",
      wali_kelas: (record as any).wali_kelas ?? "",
      jns_rombel: (record as any).jns_rombel ?? "",
      ruang_kelas: (record as any).ruang_kelas ?? "",
      kurikulum: (record as any).kurikulum ?? "",
    });
    setIsFormOpen(true);
  };

  const handleOpenDetail = (record: RombelSdRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleDelete = (record: RombelSdRecord) => {
    const displayName =
      (record as any).judul ||
      (record as any).title ||
      (record as any).nama ||
      (record as any).sekolah ||
      (record as any).nama_kombel ||
      (record as any).kegiatan ||
      (record as any).uraian ||
      (record as any).isi ||
      "data ini";

    Swal.fire({
      title: "Hapus Rombel Jenjang SD?",
      text: `Apakah Anda yakin ingin menghapus "${displayName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2410c",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus Data",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(record.id);
      }
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const hasFile = Object.values(formData).some(
      (v) => typeof File !== "undefined" && v instanceof File
    );

    let payload: any;
    if (hasFile) {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          fd.append(k, v instanceof File ? v : String(v));
        }
      });
      payload = fd;
    } else {
      payload = { ...formData };
    }

    if (formMode === "add") {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
          emptyForm();
        },
      });
    } else {
      if (!formData.id) return;
      updateMutation.mutate(
        { body: payload, id: formData.id },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            emptyForm();
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rombel Jenjang SD"
        description="Pengelolaan rombongan belajar tingkat sekolah dasar."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="hidden sm:inline-flex"
            >
              🔄 Refresh
            </Button>
            <Button variant="gold" size="sm" onClick={handleOpenAdd}>
              + Tambah Rombel Jenjang SD
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Total Data</p>
              <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{totalItems}</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">Operasional Terdaftar</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              🎒
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Kategori</p>
              <h4 className="text-lg font-bold text-amber-700 mt-1 truncate max-w-[140px]">{"Rombel"}</h4>
              <p className="text-[11px] text-[#7d7152] mt-0.5">EduSetara</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              📁
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Status API</p>
              <h4 className="text-sm font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Terhubung
              </h4>
              <p className="text-[10px] text-[#7d7152] mt-0.5 font-mono truncate max-w-[140px]">/api/v1/admin/rombel/sd</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              ⚡
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Otoritas Akses</p>
              <h4 className="text-sm font-semibold text-[#2d2410] mt-1">Operator & Admin</h4>
              <p className="text-[11px] text-[#7d7152] mt-0.5">Role ASN & Dinas</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              🔐
            </span>
          </div>
        </Card>
      </div>

      <Card className="p-6 rounded-3xl bg-white/80 border-white/80 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7d7152]">
              🔍
            </span>
            <Input
              type="text"
              placeholder="Cari Rombel Jenjang SD..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7d7152]">Baris per hal:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="text-xs bg-white border border-[#e2d9c8] rounded-xl px-2 py-1.5 text-[#2d2410] outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#e2d9c8]/80">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#e2d9c8] bg-[#fbf9f4]/80 text-[#7d7152] font-semibold">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Rombel</th>
                <th className="py-3 px-4">Tingkat Pendidikan</th>
                <th className="py-3 px-4">Ruang Kelas</th>
                <th className="py-3 px-4">Wali Kelas</th>
                <th className="py-3 px-4">Satuan Pendidikan</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece5d8]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7d7152]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat data dari server...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-rose-700">
                    <p className="font-semibold">Gagal memuat data Rombel Jenjang SD</p>
                    <p className="text-[11px] mt-1 text-[#7d7152]">
                      {error?.message || "Terjadi kesalahan koneksi ke server."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => refetch()}
                    >
                      Coba Lagi
                    </Button>
                  </td>
                </tr>
              ) : rawList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7d7152]">
                    <span className="text-3xl block mb-2">🎒</span>
                    <p className="font-semibold text-sm text-[#2d2410]">
                      Belum ada data Rombel Jenjang SD
                    </p>
                    <p className="text-[11px] mt-0.5">
                      Klik tombol "+ Tambah Rombel Jenjang SD" untuk membuat data pertama.
                    </p>
                  </td>
                </tr>
              ) : (
                rawList.map((item, index) => {
                  const no = listindex(pageSize, page, index);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/50 transition-colors duration-150"
                    >
                      <td className="py-3 px-4 text-center text-[#7d7152] font-mono">
                        {no}
                      </td>
                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {String((item as any).nama ?? "-")}
                    </td>
                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {(() => {
                        const val = (item as any).tgkt_pendidikan;
                        if (!val) return "-";
                        const match = jenjangOptions.find((o) => o.id === String(val) || o.value === String(val));
                        return match ? match.value : String(val);
                      })()}
                    </td>
                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {(() => {
                        const val = (item as any).ruang_kelas;
                        if (!val) return "-";
                        const match = ruangOptions.find((o) => o.id === String(val) || o.value === String(val));
                        return match ? match.value : String(val);
                      })()}
                    </td>
                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {String((item as any).wali_kelas ?? "-")}
                    </td>
                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {String((item as any).unit_kerja ?? "-")}
                    </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            title="Detail"
                            className="p-1.5 rounded-lg border border-[#e2d9c8] hover:bg-amber-100/60 text-[#7d7152] transition-colors"
                          >
                            👁️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit"
                            className="p-1.5 rounded-lg border border-[#e2d9c8] hover:bg-amber-100/60 text-[#7d7152] transition-colors"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            title="Hapus"
                            className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-2">
          <Pagination
            currentPage={page}
            totalCount={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </Card>

      <FormRombelSdModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DetailRombelSdModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
