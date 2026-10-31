"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
} from "../../../../_components/ui";

import { MenuRecord } from "./types";
import FormMenuModal from "./components/FormMenuModal";
import DetailMenuModal from "./components/DetailMenuModal";
import {
  useResponseListMaster,
  useDeleteMaster,
  useCreateMaster,
  useUpdateMaster,
} from "./hooks/crud";
import { listindex } from "@/utilities/pagination";

export default function MasterAuthMenuPage() {
  // Filter & Search State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce Search input
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
  const [selectedRecord, setSelectedRecord] = useState<MenuRecord | null>(null);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedRecord(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: MenuRecord) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (record: MenuRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleDelete = (record: MenuRecord) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: `Menu "${record.title}" beserta sub-menunya akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(record.id);
      }
    });
  };

  const handleFormSubmit = (formData: {
    title: string;
    icon: string;
    path: string;
    index: number;
    parent_id?: string | null;
    is_active: boolean;
  }) => {
    if (selectedRecord) {
      updateMutation.mutate(
        {
          id: selectedRecord.id,
          body: formData,
        },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setSelectedRecord(null);
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const totalItems = List?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const records = List?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Auth Menu"
        description="Kelola struktur hierarki menu navigasi dan sub-menu yang tampil pada sidemenu admin."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Data Master", href: "/admin/master" },
          { label: "Auth", href: "/admin/master/auth/menu" },
          { label: "Menu" },
        ]}
        action={
          <Button variant="primary" onClick={handleOpenCreate}>
            + Tambah Menu / Sub-menu
          </Button>
        }
      />

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900">
          <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">
            Total Menu Terdaftar
          </div>
          <div className="text-2xl font-bold text-teal-900 dark:text-teal-100 mt-1">
            {totalItems}
          </div>
          <div className="text-xs text-teal-600/80 mt-1">
            Menu dan sub-menu navigasi aktif di database
          </div>
        </Card>
        <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
            Menu Utama (Top Level)
          </div>
          <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
            {records.filter((r) => !r.parent_id).length}
          </div>
          <div className="text-xs text-emerald-600/80 mt-1">
            Menu induk pada halaman aktif
          </div>
        </Card>
        <Card className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">
            Sub-menu
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {records.filter((r) => Boolean(r.parent_id)).length}
          </div>
          <div className="text-xs text-purple-600/80 mt-1">
            Anak menu / modul spesifik pada halaman aktif
          </div>
        </Card>
      </div>

      <Card className="p-6">
        {/* Table Filter / Search bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-80">
            <Input
              type="text"
              placeholder="Cari judul menu atau path..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Tampilkan:</span>
            <select
              aria-label="Jumlah data per halaman"
              className="text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Menu</th>
                <th className="py-3 px-4">Path URL</th>
                <th className="py-3 px-4 text-center">Urutan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Induk (Parent)</th>
                <th className="py-3 px-4 text-center w-48">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Memuat data menu dari database...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-rose-500">
                    Terjadi kesalahan saat memuat data: {(error as any)?.message || "Gagal memuat"}
                    <div className="mt-2">
                      <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Coba Lagi
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data menu yang ditemukan.
                  </td>
                </tr>
              ) : (
                records.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-center font-medium">
                      {listindex(page, pageSize, index)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        {item.parent_id && <span className="text-slate-300">↳</span>}
                        <span>{item.title}</span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        ID: {item.id} • Icon: {item.icon}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-teal-600 dark:text-teal-400">
                        {item.path || "(Dropdown/Folder)"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-medium">
                      {item.index}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={item.is_active ? "primary" : "neutral"}>
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-500">
                      {item.parent_id || "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs py-1 px-2"
                          onClick={() => handleOpenDetail(item)}
                        >
                          Detail
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs py-1 px-2 text-amber-600 hover:bg-amber-50"
                          onClick={() => handleOpenEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs py-1 px-2 text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDelete(item)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            Menampilkan data{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {totalItems === 0 ? 0 : (page - 1) * pageSize + 1}
            </span>{" "}
            sampai{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {Math.min(page * pageSize, totalItems)}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {totalItems}
            </span>{" "}
            data
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p: number) => setPage(p)}
            />
          )}
        </div>
      </Card>

      {/* Modals */}
      <FormMenuModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRecord}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DetailMenuModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
