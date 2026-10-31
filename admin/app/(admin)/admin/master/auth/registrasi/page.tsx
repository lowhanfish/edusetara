"use client";

import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
} from "../../../../_components/ui";

import { AsnRecord } from "./types";
import FormRegistrasiModal from "./components/FormRegistrasiModal";
import DetailRegistrasiModal from "./components/DetailRegistrasiModal";
import {
  useResponseListMaster,
  useUpdateMaster,
  useGroupOption,
} from "./hooks/crud";
import { listindex } from "@/utilities/pagination";

export default function MasterAuthRegistrasiPage() {
  // Filter & Search State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [groupIdFilter, setGroupIdFilter] = useState("all");

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Group options for filter dropdown
  const { List: groupOptions } = useGroupOption();

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
    debouncedSearch,
    groupIdFilter
  );
  const updateMutation = useUpdateMaster();

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AsnRecord | null>(null);

  // Handlers
  const handleOpenAssignRole = (record: AsnRecord) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (record: AsnRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleFormSubmit = (formData: { group_id: string | null }) => {
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
    }
  };

  const totalItems = List?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const records = List?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Auth Registrasi ASN"
        description="Kelola akun ASN terdaftar dari SIMPEG dan tetapkan role group hak akses sistem per pegawai."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Data Master", href: "/admin/master" },
          { label: "Auth", href: "/admin/master/auth/registrasi" },
          { label: "Registrasi ASN" },
        ]}
      />

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900">
          <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">
            Total ASN Terdaftar
          </div>
          <div className="text-2xl font-bold text-teal-900 dark:text-teal-100 mt-1">
            {totalItems}
          </div>
          <div className="text-xs text-teal-600/80 mt-1">
            Pegawai ASN terdaftar di sistem
          </div>
        </Card>
        <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
            Memiliki Role Akses
          </div>
          <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
            {records.filter((r) => Boolean(r.group_id)).length}
          </div>
          <div className="text-xs text-emerald-600/80 mt-1">
            ASN dengan grup hak akses aktif
          </div>
        </Card>
        <Card className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
            Belum Ditetapkan Role
          </div>
          <div className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">
            {records.filter((r) => !r.group_id).length}
          </div>
          <div className="text-xs text-amber-600/80 mt-1">
            ASN tanpa hak akses modul
          </div>
        </Card>
      </div>

      <Card className="p-6">
        {/* Table Filter / Search bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-80">
            <Input
              type="text"
              placeholder="Cari nama ASN, NIP, instansi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Role:</span>
              <select
                aria-label="Filter berdasarkan Role Group"
                className="text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2"
                value={groupIdFilter}
                onChange={(e) => {
                  setGroupIdFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Semua Role</option>
                <option value="unassigned">Belum Memiliki Role</option>
                {groupOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.value}
                  </option>
                ))}
              </select>
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
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Lengkap & NIP</th>
                <th className="py-3 px-4">Satuan Pendidikan</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Role Group Terpasang</th>
                <th className="py-3 px-4 text-center w-48">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Memuat data ASN dari database...
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
                    Tidak ada data ASN yang ditemukan.
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
                        {item.nama_lengkap}
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        NIP: {item.nip || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {item.satuan_pendidikan || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600 dark:text-slate-400 text-xs">
                        {item.jabatan || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.group_title ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant={item.group_level === 1 ? "primary" : "neutral"}>
                            {item.group_level === 1 ? "Level 1" : "Level 2"}
                          </Badge>
                          <span className="font-semibold text-slate-900 dark:text-white text-xs">
                            {item.group_title}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="neutral">Belum Ada Role</Badge>
                      )}
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
                          className="text-xs py-1 px-2 border-teal-300 text-teal-700 dark:text-teal-300 hover:bg-teal-50"
                          onClick={() => handleOpenAssignRole(item)}
                        >
                          Atur Role
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
      <FormRegistrasiModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        record={selectedRecord}
        isLoading={updateMutation.isPending}
      />

      <DetailRegistrasiModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
