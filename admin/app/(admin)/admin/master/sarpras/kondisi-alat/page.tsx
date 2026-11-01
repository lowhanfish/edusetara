"use client";

import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
} from "../../../../_components/ui";

import { ResponseInterface, KondisiAlatRecord } from "./types";
import FormKondisiAlatModal from "./components/FormKondisiAlatModal";
import DetailKondisiAlatModal from "./components/DetailKondisiAlatModal";
import {
  useResponseListMaster,
  useDeleteMaster,
  useCreateMaster,
  useUpdateMaster,
} from "./hooks/crud";
import { listindex } from "@/utilities/pagination";

export default function MasterKondisiAlatPage() {
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
  const [selectedRecord, setSelectedRecord] = useState<KondisiAlatRecord | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  const initialForm: Partial<ResponseInterface> = {
    title: "",
    desc: "",
  };

  const [formData, setFormData] = useState<Partial<ResponseInterface>>(initialForm);

  const emptyForm = () => {
    setFormData(initialForm);
  };

  const rawList: KondisiAlatRecord[] = useMemo(() => {
    if (!List?.data || !Array.isArray(List.data)) return [];
    return List.data;
  }, [List]);

  const totalItems = List?.total ?? rawList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const handleOpenAdd = () => {
    setFormMode("add");
    emptyForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: KondisiAlatRecord) => {
    setFormMode("edit");
    setFormData({
      id: record.id,
      title: record.title || record.uraian || "",
      desc: record.desc || record.keterangan || "",
      uraian: record.title || record.uraian || "",
      keterangan: record.desc || record.keterangan || "",
    });
    setIsFormOpen(true);
  };

  const handleOpenDetail = (record: KondisiAlatRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleDelete = (record: KondisiAlatRecord) => {
    Swal.fire({
      title: "Hapus Master Kondisi Alat / Aset?",
      text: `Apakah Anda yakin ingin menghapus "${record.title || record.uraian}"?`,
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

    if (!formData.title?.trim() && !formData.uraian?.trim()) {
      Swal.fire("Perhatian", "Nama data (title) wajib diisi.", "warning");
      return;
    }

    const payload: Partial<ResponseInterface> = {
      title: formData.title?.trim(),
      desc: formData.desc?.trim() || null,
      uraian: formData.title?.trim(),
      keterangan: formData.desc?.trim() || null,
    };

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
        title="Master Kondisi Alat / Aset"
        description="Pengelolaan status kelaikan operasional untuk peralatan TIK, perangkat elektronik, dan mebel kelas."
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
              + Tambah Kondisi Alat / Aset
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
              <p className="text-[11px] text-emerald-700 mt-0.5">Master Terdaftar</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              🔧
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Kategori</p>
              <h4 className="text-lg font-bold text-amber-700 mt-1 truncate max-w-[140px]">Master Sarpras</h4>
              <p className="text-[11px] text-[#7d7152] mt-0.5">Sikola Pindara</p>
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
              <h4 className="text-2xl font-bold text-emerald-700 mt-1">Terhubung</h4>
              <p className="text-[11px] text-emerald-600 mt-0.5">FastAPI & MySQL</p>
            </div>
            <span className="text-3xl p-3 bg-emerald-50 rounded-2xl border border-emerald-200/50">
              ⚡
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Standar Data</p>
              <h4 className="text-2xl font-bold text-[#2d2410] mt-1">Arsitektur</h4>
              <p className="text-[11px] text-blue-700 mt-0.5">title & desc</p>
            </div>
            <span className="text-3xl p-3 bg-blue-50 rounded-2xl border border-blue-200/50">
              📋
            </span>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border-white/80 bg-white/70 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#e2d9c8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              type="text"
              placeholder="Cari data kondisi alat / aset / keterangan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7d7152]">Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              aria-label="Jumlah data per halaman"
              className="text-xs bg-white border border-[#d5cbba] rounded-lg px-2 py-1.5 text-[#2d2410] focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value={5}>5 baris</option>
              <option value={10}>10 baris</option>
              <option value={20}>20 baris</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e2d9c8] bg-[#fbf9f4]/80 text-[#7d7152] font-semibold">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Kondisi Alat / Aset (title)</th>
                <th className="py-3 px-4">Penjelasan Singkat (desc)</th>
                <th className="py-3 px-4 w-32">Waktu Catat</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece5d8]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#7d7152]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat data dari server...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-rose-700">
                    <p className="font-semibold">Gagal memuat data master kondisi alat / aset</p>
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
                  <td colSpan={5} className="py-12 text-center text-[#7d7152]">
                    <span className="text-3xl block mb-2">🔧</span>
                    <p className="font-semibold text-sm text-[#2d2410]">
                      Belum ada data Master Kondisi Alat / Aset
                    </p>
                    <p className="text-xs text-[#9c8e6b] mt-0.5">
                      {debouncedSearch
                        ? `Tidak ada data yang cocok dengan "${debouncedSearch}"`
                        : "Klik tombol '+ Tambah Kondisi Alat / Aset' untuk menambahkan data baru."}
                    </p>
                  </td>
                </tr>
              ) : (
                rawList.map((item, index) => {
                  const no = listindex(page, pageSize, index);
                  const displayTitle = item.title || item.uraian || "-";
                  const displayDesc = item.desc || item.keterangan || "-";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-medium text-[#7d7152]">
                        {no}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#2d2410] flex items-center gap-2">
                          <span>{displayTitle}</span>
                          <Badge variant="gold" className="text-[10px] px-1.5 py-0.2">
                            {item.id}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#5e5133] max-w-md">
                        <span className="line-clamp-2">{displayDesc}</span>
                      </td>
                      <td className="py-3 px-4 text-[#7d7152] text-[11px]">
                        {item.created_at
                          ? new Intl.DateTimeFormat("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(item.created_at))
                          : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            title="Lihat Detail"
                            className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            👁️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Ubah Data"
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            title="Hapus Data"
                            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
                          >
                            🗑️
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

        <div className="p-4 border-t border-[#e2d9c8] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fbf9f4]/40">
          <span className="text-xs text-[#7d7152]">
            Menampilkan{" "}
            <strong className="text-[#2d2410]">
              {rawList.length > 0 ? (page - 1) * pageSize + 1 : 0}
            </strong>{" "}
            sampai{" "}
            <strong className="text-[#2d2410]">
              {Math.min(page * pageSize, totalItems)}
            </strong>{" "}
            dari <strong className="text-[#2d2410]">{totalItems}</strong> data
          </span>

          {totalPages > 1 && (
            <Pagination page={page} pageSize={pageSize} total={totalItems} onPageChange={(p) => setPage(p)} onPageSizeChange={(s) => setPageSize(s)} />
          )}
        </div>
      </Card>

      <FormKondisiAlatModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DetailKondisiAlatModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
