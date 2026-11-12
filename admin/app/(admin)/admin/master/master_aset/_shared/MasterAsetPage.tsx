"use client";

import { SkeletonTableRows } from "@/app/(admin)/_components/ui/skeleton";

import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button, Card, Input, PageHeader, Pagination, Select } from "@/app/(admin)/_components/ui";
import { listindex } from "@/utilities/pagination";
import {
  useCreateMasterAset,
  useDeleteMasterAset,
  useMasterAsetList,
  useUpdateMasterAset,
} from "./hooks";
import MasterAsetFormModal, { lookupLabelKey, type FormValues } from "./MasterAsetFormModal";
import MasterAsetDetailModal from "./MasterAsetDetailModal";
import type { MasterAsetConfig, MasterAsetRecord } from "./types";

const show = (value: unknown) =>
  value === null || value === undefined || value === "" ? "-" : String(value);

const emptyValues = (config: MasterAsetConfig): FormValues =>
  Object.fromEntries(config.fields.map((f) => [f.key, ""]));

export default function MasterAsetPage({ config }: { config: MasterAsetConfig }) {
  const { slug } = config;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { List, isLoading, isError, error, refetch } = useMasterAsetList(
    slug,
    page,
    pageSize,
    debouncedSearch,
    filters
  );
  const deleteMutation = useDeleteMasterAset(slug);
  const createMutation = useCreateMasterAset(slug);
  const updateMutation = useUpdateMasterAset(slug);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selected, setSelected] = useState<MasterAsetRecord | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>(() => emptyValues(config));

  const rows: MasterAsetRecord[] = useMemo(
    () => (Array.isArray(List?.data) ? List.data : []),
    [List]
  );
  const total = List?.total ?? rows.length;

  const openAdd = () => {
    setMode("add");
    setEditId(null);
    setValues(emptyValues(config));
    setIsFormOpen(true);
  };

  const openEdit = (record: MasterAsetRecord) => {
    setMode("edit");
    setEditId(record.id);
    const next: FormValues = Object.fromEntries(
      config.fields.map((f) => [f.key, record[f.key] == null ? "" : String(record[f.key])])
    );
    for (const f of config.fields) {
      if (f.lookup) next[lookupLabelKey(f.key)] = show(record[f.lookup.labelKey]);
    }
    setValues(next);
    setIsFormOpen(true);
  };

  const handleDelete = (record: MasterAsetRecord) => {
    Swal.fire({
      title: `Hapus ${config.singular}?`,
      text: `Apakah Anda yakin ingin menghapus "${show(record[config.titleKey])}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2410c",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus Data",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(record.id);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<MasterAsetRecord> = {};
    for (const field of config.fields) {
      const raw = (values[field.key] ?? "").trim();

      if (!raw) {
        if (field.required) {
          Swal.fire("Perhatian", `${field.label} wajib diisi.`, "warning");
          return;
        }
        payload[field.key] = null;
        continue;
      }

      if (field.type === "number") {
        const num = Number(raw);
        if (!Number.isFinite(num) || (field.min !== undefined && num < field.min) || (field.max !== undefined && num > field.max)) {
          const range =
            field.min !== undefined && field.max !== undefined ? ` (${field.min}–${field.max})` : "";
          Swal.fire("Perhatian", `${field.label} harus berupa angka yang valid${range}.`, "warning");
          return;
        }
        payload[field.key] = num;
        continue;
      }

      if (field.type === "text" && field.pattern && !field.pattern.test(raw)) {
        Swal.fire("Perhatian", field.patternMessage ?? `Format ${field.label} tidak sesuai.`, "warning");
        return;
      }

      payload[field.key] = raw;
    }

    const done = { onSuccess: () => setIsFormOpen(false) };
    if (mode === "add") {
      createMutation.mutate(payload, done);
    } else if (editId) {
      updateMutation.mutate({ body: payload, id: editId }, done);
    }
  };

  const filterEntries = config.filters ?? [];
  const colSpan = config.columns.length + 2;

  return (
    <div className="space-y-6">
      <PageHeader
        title={config.title}
        description={config.description}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading} className="hidden sm:inline-flex">
              🔄 Refresh
            </Button>
            <Button variant="gold" size="sm" onClick={openAdd}>
              + Tambah {config.singular}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Total Data</p>
              <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{isLoading ? "…" : total.toLocaleString("id-ID")}</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">Master Aset Terdaftar</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">{config.icon}</span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div>
            <p className="text-xs text-[#7d7152] font-medium">Sumber Acuan</p>
            <h4 className="text-sm font-bold text-amber-700 mt-1">SIMDA BMD</h4>
            <p className="text-[11px] text-[#7d7152] mt-0.5 font-mono">{config.simdaSource}</p>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div>
            <p className="text-xs text-[#7d7152] font-medium">Status API</p>
            <h4 className={`text-lg font-bold mt-1 ${isError ? "text-rose-700" : isLoading ? "text-[#7d7152]" : "text-emerald-700"}`}>
              {isError ? "Tidak terhubung" : isLoading ? "Memeriksa…" : "Terhubung"}
            </h4>
            <p className="text-[11px] text-[#7d7152] mt-0.5 font-mono truncate">
              /api/v1/admin/master/master_aset/{slug}
            </p>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border-white/80 bg-white/70 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#e2d9c8] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              type="text"
              placeholder={config.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs"
            />
          </div>

          {filterEntries.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {filterEntries.map((f) => (
                <div key={f.key} className="w-48">
                  <Select
                    aria-label={f.label}
                    value={filters[f.key] ?? ""}
                    onChange={(e) => {
                      setFilters((prev) => ({ ...prev, [f.key]: e.target.value }));
                      setPage(1);
                    }}
                    options={[{ value: "", label: f.allLabel }, ...f.options]}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e2d9c8] bg-[#fbf9f4]/80 text-[#7d7152] font-semibold">
                <th className="py-3 px-4 w-12 text-center">No</th>
                {config.columns.map((col) => (
                  <th key={col.key} className={`py-3 px-4 ${col.className ?? ""}`}>
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece5d8]">
              {isLoading ? (
                <SkeletonTableRows cols={colSpan} />
              ) : isError ? (
                <tr>
                  <td colSpan={colSpan} className="py-12 text-center text-rose-700">
                    <p className="font-semibold">Gagal memuat {config.title}</p>
                    <p className="text-[11px] mt-1 text-[#7d7152]">
                      {error?.message || "Terjadi kesalahan koneksi ke server."}
                    </p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                      Coba Lagi
                    </Button>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="py-12 text-center text-[#7d7152]">
                    <span className="text-3xl block mb-2">{config.icon}</span>
                    <p className="font-semibold text-sm text-[#2d2410]">Belum ada data {config.title}</p>
                    <p className="text-xs text-[#9c8e6b] mt-0.5">
                      {debouncedSearch
                        ? `Tidak ada data yang cocok dengan "${debouncedSearch}"`
                        : `Klik tombol '+ Tambah ${config.singular}' untuk menambahkan data baru.`}
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((item, index) => (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-[#7d7152]">
                      {listindex(pageSize, page, index)}
                    </td>
                    {config.columns.map((col) => (
                      <td key={col.key} className={`py-3 px-4 text-[#2d2410] ${col.className ?? ""}`}>
                        {col.render ? col.render(item) : show(item[col.key])}
                      </td>
                    ))}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button type="button" onClick={() => { setSelected(item); setIsDetailOpen(true); }} title="Lihat Detail" className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                          👁️
                        </button>
                        <button type="button" onClick={() => openEdit(item)} title="Ubah Data" className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors">
                          ✏️
                        </button>
                        <button type="button" onClick={() => handleDelete(item)} title="Hapus Data" className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#e2d9c8] bg-[#fbf9f4]/40">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </div>
      </Card>

      <MasterAsetFormModal
        config={config}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={mode}
        values={values}
        setValues={setValues}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <MasterAsetDetailModal
        config={config}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selected}
      />
    </div>
  );
}
