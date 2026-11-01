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

import { ResponseInterface, PublishStatistikRecord } from "./types";
import FormPublishStatistikModal from "./components/FormPublishStatistikModal";
import DetailPublishStatistikModal from "./components/DetailPublishStatistikModal";
import {
  useResponseListMaster,
  useDeleteMaster,
  useCreateMaster,
  useUpdateMaster,
} from "./hooks/crud";
import { listindex } from "@/utilities/pagination";

export default function PublishStatistikPage() {
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
  const [selectedRecord, setSelectedRecord] = useState<PublishStatistikRecord | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  const initialForm: Partial<ResponseInterface> = {
    indikator: "",
    nilai: "",
    satuan: "",
    tahun: null,
    kategori: "",
    keterangan: "",
  };

  const [formData, setFormData] = useState<Partial<ResponseInterface>>(initialForm);

  const emptyForm = () => {
    setFormData(initialForm);
  };

  const rawList: PublishStatistikRecord[] = useMemo(() => {
    if (!List?.data || !Array.isArray(List.data)) return [];
    return List.data;
  }, [List]);

  const totalItems = List?.total ?? rawList.length;

  const handleOpenAdd = () => {
    setFormMode("add");
    emptyForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: PublishStatistikRecord) => {
    setFormMode("edit");
    setFormData({
      id: record.id,
      indikator: (record as any).indikator ?? "",
      nilai: (record as any).nilai ?? "",
      satuan: (record as any).satuan ?? "",
      tahun: (record as any).tahun ?? "",
      kategori: (record as any).kategori ?? "",
      keterangan: (record as any).keterangan ?? "",
    });
    setIsFormOpen(true);
  };

  const handleOpenDetail = (record: PublishStatistikRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleDelete = (record: PublishStatistikRecord) => {
    const displayName =
      (record as any).judul ||
      (record as any).title ||
      (record as any).nama ||
      (record as any).sekolah ||
      (record as any).nama_kombel ||
      (record as any).kegiatan ||
      (record as any).indikator ||
      (record as any).isi ||
      "data ini";

    Swal.fire({
      title: "Hapus Data & Indikator Statistik?",
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

    const payload: Partial<ResponseInterface> = { ...formData };

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
        title="Data & Indikator Statistik"
        description="Indikator angka partisipasi murni, rasio murid-guru, dan statistik pendidikan daerah."
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
              + Tambah Data & Indikator Statistik
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
              📈
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Kategori</p>
              <h4 className="text-lg font-bold text-amber-700 mt-1 truncate max-w-[140px]">Publish</h4>
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
              <h4 className="text-2xl font-bold text-[#2d2410] mt-1">Modular</h4>
              <p className="text-[11px] text-blue-700 mt-0.5">master pattern</p>
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
              placeholder="Cari data data & indikator statistik..."
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
                <th className="py-3 px-4">Indikator</th>
                <th className="py-3 px-4">Nilai</th>
                <th className="py-3 px-4">Satuan</th>
                <th className="py-3 px-4">Tahun</th>
                <th className="py-3 px-4">Kategori</th>
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
                    <p className="font-semibold">Gagal memuat data data & indikator statistik</p>
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
                    <span className="text-3xl block mb-2">📈</span>
                    <p className="font-semibold text-sm text-[#2d2410]">
                      Belum ada data Data & Indikator Statistik
                    </p>
                    <p className="text-xs text-[#9c8e6b] mt-0.5">
                      {debouncedSearch
                        ? `Tidak ada data yang cocok dengan "${debouncedSearch}"`
                        : "Klik tombol '+ Tambah Data & Indikator Statistik' untuk menambahkan data baru."}
                    </p>
                  </td>
                </tr>
              ) : (
                rawList.map((item, index) => {
                  const no = listindex(pageSize, page, index);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/40 transition-colors duration-150"
                    >
                      <td className="py-3 px-4 text-center text-[#7d7152] font-mono">
                        {no}
                      </td>
                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {String((item as any).indikator ?? "-")}
                    </td>
                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {String((item as any).nilai ?? "-")}
                    </td>
                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {String((item as any).satuan ?? "-")}
                    </td>
                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {String((item as any).tahun ?? "-")}
                    </td>
                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {String((item as any).kategori ?? "-")}
                    </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            title="Detail Lembar Data"
                            className="p-1 rounded-lg hover:bg-amber-100 text-[#7d7152] hover:text-[#2d2410] transition-colors"
                          >
                            👁️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Data"
                            className="p-1 rounded-lg hover:bg-amber-100 text-amber-700 hover:text-amber-900 transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            title="Hapus Data"
                            className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 hover:text-rose-800 transition-colors"
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

        <div className="p-4 border-t border-[#e2d9c8] bg-white/40">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => setPageSize(s)}
          />
        </div>
      </Card>

      <FormPublishStatistikModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DetailPublishStatistikModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
