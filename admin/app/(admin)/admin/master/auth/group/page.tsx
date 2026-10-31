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

import { GroupRecord } from "./types";
import FormGroupModal from "./components/FormGroupModal";
import DetailGroupModal from "./components/DetailGroupModal";
import PermissionMatrixModal from "./components/PermissionMatrixModal";
import {
  useResponseListMaster,
  useDeleteMaster,
  useCreateMaster,
  useUpdateMaster,
} from "./hooks/crud";
import { listindex } from "@/utilities/pagination";

export default function MasterAuthGroupPage() {
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
  const [isPermOpen, setIsPermOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<GroupRecord | null>(null);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedRecord(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: GroupRecord) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (record: GroupRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleOpenPermissions = (record: GroupRecord) => {
    setSelectedRecord(record);
    setIsPermOpen(true);
  };

  const handleDelete = (record: GroupRecord) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: `Role Group "${record.title}" akan dihapus secara permanen beserta matriks hak aksesnya.`,
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

  const handleFormSubmit = (formData: { title: string; level: number }) => {
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
        title="Master Auth Group (Role & Hak Akses)"
        description="Kelola daftar role group pengguna dan konfigurasi matriks hak akses CRUD menu sistem."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Data Master", href: "/admin/master" },
          { label: "Auth", href: "/admin/master/auth/group" },
          { label: "Group" },
        ]}
        action={
          <Button variant="primary" onClick={handleOpenCreate}>
            + Tambah Role Group
          </Button>
        }
      />

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900">
          <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">
            Total Role Group
          </div>
          <div className="text-2xl font-bold text-teal-900 dark:text-teal-100 mt-1">
            {totalItems}
          </div>
          <div className="text-xs text-teal-600/80 mt-1">
            Grup hak akses aktif di database
          </div>
        </Card>
        <Card className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
            Level 1 (Dinas / Semua)
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {records.filter((r) => r.level === 1).length}
          </div>
          <div className="text-xs text-blue-600/80 mt-1">
            Akses tingkat pimpinan / dinas kabupaten
          </div>
        </Card>
        <Card className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900">
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
            Level 2 (Satuan Pendidikan)
          </div>
          <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">
            {records.filter((r) => r.level === 2).length}
          </div>
          <div className="text-xs text-indigo-600/80 mt-1">
            Akses lingkup sekolah / instansi unit kerja
          </div>
        </Card>
      </div>

      <Card className="p-6">
        {/* Table Filter / Search bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-80">
            <Input
              type="text"
              placeholder="Cari nama role group..."
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
                <th className="py-3 px-4">Nama Role Group</th>
                <th className="py-3 px-4">Level Akses</th>
                <th className="py-3 px-4 text-center">Anggota ASN</th>
                <th className="py-3 px-4">Audit Info</th>
                <th className="py-3 px-4 text-center w-64">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Memuat data role group dari database...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-rose-500">
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
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada data role group yang ditemukan.
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
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        ID: {item.id}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={item.level === 1 ? "primary" : "neutral"}>
                        {item.level === 1 ? "Level 1 (Dinas/Semua)" : "Level 2 (Satuan Pendidikan)"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.member_count ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      <div>Oleh: {item.created_by || "System"}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs py-1 px-2 border-teal-300 text-teal-700 dark:text-teal-300 hover:bg-teal-50"
                          onClick={() => handleOpenPermissions(item)}
                        >
                          Hak Akses
                        </Button>
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
      <FormGroupModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRecord}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DetailGroupModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />

      <PermissionMatrixModal
        isOpen={isPermOpen}
        onClose={() => setIsPermOpen(false)}
        group={selectedRecord}
      />
    </div>
  );
}
