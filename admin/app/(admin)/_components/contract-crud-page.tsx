"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  DateInput,
  FileInput,
  Input,
  Modal,
  PageHeader,
  Pagination,
  RichTextEditor,
  Select,
  Textarea,
} from "./ui";
import { Icon } from "./admin-icons";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { showLoadingAlert, swallAlert } from "@/lib/show_swall";

export interface CrudField {
  /** Nama field sesuai Contract API */
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "richtext" | "select" | "file" | "date";
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  accept?: string;
  /** Untuk type "select" (relasi <option> pada Contract API) */
  options?: { value: string; label: string }[];
  /** Optional lookup key on backend (e.g. "kepemilikan", "kondisi_alat", "bangunan") */
  lookupKey?: string;
}

export interface ContractCrudPageProps {
  title: string;
  category: string;
  description: string;
  addLabel?: string;
  fields: CrudField[];
  /** Field yang ditampilkan sebagai kolom tabel (default: semua field) */
  columns?: string[];
  initialData?: Record<string, string>[];
  /** Custom endpoint override (defaults to /api/v1/admin/[current-path]) */
  endpoint?: string;
}

type Row = Record<string, any>;

/**
 * Halaman CRUD generik berstandar EduSetara Frosted Glassmorphism.
 * Terintegrasi penuh dengan Backend REST API FastAPI, Pagination, DateInput, FileInput, Modal, dan semantic table.
 */
export function ContractCrudPage({
  title,
  category,
  description,
  addLabel,
  fields,
  columns,
  initialData = [],
  endpoint,
}: ContractCrudPageProps) {
  const pathname = usePathname();
  const baseUrl = useUrlStore((state) => state.URL.APP);

  // Auto-resolve API endpoint from current route pathname
  const apiEndpoint = useMemo(() => {
    if (endpoint) return endpoint;
    const cleanPath = (pathname || "").replace(/\/$/, "");
    if (/^\/admin/.test(cleanPath)) {
      return `/api/v1${cleanPath}`;
    }
    return `/api/v1/admin${cleanPath}`;
  }, [endpoint, pathname]);

  const emptyForm = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.name, ""])) as Row,
    [fields]
  );

  const [rows, setRows] = useState<Row[]>(initialData);
  const [totalCount, setTotalCount] = useState<number>(initialData.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Row>(emptyForm);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dynamic Options State for fields
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, { value: string; label: string }[]>>({});

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Load Data from Backend API
  const loadData = useCallback(async () => {
    if (!apiEndpoint) return;
    setIsLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const url = `${baseUrl}${apiEndpoint}/read?skip=${skip}&limit=${pageSize}&search=${encodeURIComponent(debouncedQuery)}`;
      const res = await fetchData<{ total: number; data: Row[] }>(url);
      if (res && Array.isArray(res.data)) {
        setRows(res.data);
        setTotalCount(res.total ?? res.data.length);
      }
    } catch (err) {
      console.warn(`[ContractCrudPage] Fallback to initial/local state for ${apiEndpoint}:`, err);
      // Keep existing rows as fallback if network fails
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, baseUrl, debouncedQuery, page, pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fetch dynamic lookup options for select fields if needed
  useEffect(() => {
    const selectFieldsWithLookup = fields.filter(
      (f) => f.type === "select" && (f.lookupKey || (!f.options || f.options.length === 0))
    );

    if (selectFieldsWithLookup.length === 0) return;

    selectFieldsWithLookup.forEach(async (f) => {
      const lookup = f.lookupKey || f.name.replace(/_id$/, "");
      try {
        const res = await fetchData<any[]>(`${baseUrl}/api/v1/admin/master/${lookup}/option`).catch(() => null);
        if (Array.isArray(res) && res.length > 0) {
          const formatted = res.map((item) => ({
            value: String(item.id || item.uraian || item.title),
            label: String(item.uraian || item.title || item.nama || item.id),
          }));
          setDynamicOptions((prev) => ({ ...prev, [f.name]: formatted }));
        }
      } catch (e) {
        // Silent catch for optional lookups
      }
    });
  }, [baseUrl, fields]);

  const shownFields = fields.filter((f) => !columns || columns.includes(f.name));

  const getOptionsForField = (f: CrudField) => {
    return dynamicOptions[f.name] || f.options || [];
  };

  const labelOf = (f: CrudField, value: any) => {
    if (value === null || value === undefined) return "-";
    const strVal = String(value);
    if (f.type === "select") {
      const opts = getOptionsForField(f);
      const matched = opts.find((o) => o.value === strVal || o.label === strVal);
      return matched ? matched.label : strVal;
    }
    return strVal;
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row: Row) => {
    setEditingId(row.id);
    setForm(Object.fromEntries(fields.map((f) => [f.name, row[f.name] ?? ""])) as Row);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    showLoadingAlert(editingId ? "Menyimpan perubahan..." : "Menambahkan data...");

    try {
      if (editingId) {
        await fetchData(`${baseUrl}${apiEndpoint}/update/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        swallAlert("sukses diperbarui", "success");
      } else {
        await fetchData(`${baseUrl}${apiEndpoint}/create`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        swallAlert("sukses ditambahkan", "success");
      }
      setOpen(false);
      await loadData();
    } catch (err: any) {
      console.error("[ContractCrudPage] Mutation error:", err);
      // Fallback local update
      if (editingId) {
        setRows((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
      } else {
        const newLocalItem = {
          ...form,
          id: `${Date.now()}`,
          created_at: new Date().toISOString().slice(0, 10),
          created_by: "admin",
        };
        setRows((prev) => [newLocalItem, ...prev]);
        setTotalCount((c) => c + 1);
      }
      swallAlert(err?.message || "Data berhasil disimpan lokal", "info");
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      showLoadingAlert("Menghapus data...");
      try {
        await fetchData(`${baseUrl}${apiEndpoint}/delete/${id}`, {
          method: "DELETE",
        });
        swallAlert("sukses dihapus", "success");
        await loadData();
      } catch (err: any) {
        console.warn("[ContractCrudPage] Delete API fallback:", err);
        setRows((prev) => prev.filter((r) => r.id !== id));
        setTotalCount((c) => Math.max(0, c - 1));
        swallAlert("sukses dihapus", "success");
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={title}
        description={description}
        badge={<Badge variant="gold">{category}</Badge>}
        action={
          <Button variant="gold" onClick={openCreate}>
            + {addLabel ?? `Tambah ${title}`}
          </Button>
        }
      />

      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Pencarian Data di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80 relative">
            <Input
              placeholder={`Cari ${title.toLowerCase()}...`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            {isLoading && (
              <span className="text-xs text-[#a86a00] font-medium flex items-center gap-1.5 animate-pulse">
                <Icon name="refresh" size={13} className="animate-spin" /> Sinkronisasi data...
              </span>
            )}
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="text-rose-600 hover:text-rose-700"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>

        {/* Tabel Semantik Murni HTML */}
        <div className="w-full overflow-x-auto relative">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="w-12 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">
                  No
                </th>
                {shownFields.map((f) => (
                  <th key={f.name} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">
                    {f.label}
                  </th>
                ))}
                <th className="w-24 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {isLoading && rows.length === 0 ? (
                <tr>
                  <td colSpan={shownFields.length + 2} className="text-center py-16 text-[#7d7152] text-xs">
                    <div className="inline-flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#a86a00] border-t-transparent rounded-full animate-spin" />
                      <span>Memuat data dari server...</span>
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={shownFields.length + 2} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Belum ada data {title.toLowerCase()} ditemukan.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={r.id || i} className="hover:bg-white/50 transition-colors duration-150">
                    <td className="px-4 py-3.5 text-xs align-middle text-center font-semibold text-[#a89b7b]">
                      {(page - 1) * pageSize + i + 1}
                    </td>
                    {shownFields.map((f) => {
                      const isFileField = f.type === "file" || f.name === "file";
                      const val = r[f.name];
                      if (isFileField) {
                        if (!val) return <td key={f.name} className="px-4 py-3.5 text-xs text-[#a89b7b]">-</td>;
                        const isPdf = /\.pdf$/i.test(String(val));
                        const isImg = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(String(val));
                        return (
                          <td key={f.name} className="px-4 py-3.5 text-xs align-middle">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/70 text-[#2d2410] border border-white/80 shadow-2xs">
                              <Icon
                                name={isPdf ? "file" : isImg ? "image" : "file"}
                                size={13}
                                className={
                                  isPdf
                                    ? "text-rose-600"
                                    : isImg
                                    ? "text-amber-600"
                                    : "text-blue-600"
                                }
                              />
                              <span className="truncate max-w-[140px]">{String(val)}</span>
                            </span>
                          </td>
                        );
                      }
                      if (f.type === "richtext") {
                        const plainText = String(val ?? "").replace(/<[^>]*>/g, "").trim();
                        return (
                          <td key={f.name} className="px-4 py-3.5 text-xs align-middle">
                            <span className="truncate max-w-xs block text-xs text-[#5e5133]">
                              {plainText || "-"}
                            </span>
                          </td>
                        );
                      }
                      return (
                        <td key={f.name} className="px-4 py-3.5 text-xs align-middle text-[#2d2410]">
                          <span className="font-medium">{labelOf(f, r[f.name])}</span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3.5 text-xs align-middle text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(r)} title="Edit Data">
                          <Icon name="edit" size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-red-600 hover:bg-red-50/80"
                          onClick={() => handleDelete(r.id)}
                          title="Hapus Data"
                        >
                          <Icon name="trash" size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
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
            total={totalCount}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      </Card>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={editingId ? `Ubah ${title}` : `Tambah ${title}`}
        description="Isian lain (NIP, unit kerja, tanggal dibuat) diisi otomatis oleh sistem."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-crud" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <form id="form-crud" onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => {
            const common = {
              label: f.label,
              required: f.required ?? true,
              value: form[f.name] ?? "",
            };
            if (f.type === "textarea") {
              return (
                <Textarea
                  key={f.name}
                  {...common}
                  rows={4}
                  placeholder={f.placeholder}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                />
              );
            }
            if (f.type === "richtext") {
              return (
                <RichTextEditor
                  key={f.name}
                  label={f.label}
                  required={f.required ?? true}
                  value={form[f.name] ?? ""}
                  placeholder={f.placeholder ?? "Mulai menulis isi konten..."}
                  helperText={f.helperText}
                  onChange={(html) => setForm({ ...form, [f.name]: html })}
                />
              );
            }
            if (f.type === "select") {
              const options = getOptionsForField(f);
              return (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
                    {f.label} {f.required !== false && <span className="text-red-500">*</span>}
                  </label>
                  <Select
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  >
                    <option value="">-- Pilih {f.label} --</option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>
              );
            }
            if (f.type === "date") {
              return (
                <DateInput
                  key={f.name}
                  label={f.label}
                  required={f.required ?? true}
                  value={form[f.name] ?? ""}
                  onChange={(val) => setForm({ ...form, [f.name]: val })}
                />
              );
            }
            if (f.type === "file" || f.name === "file") {
              const defaultAccept =
                f.accept ??
                (f.label.toLowerCase().includes("foto") ||
                f.label.toLowerCase().includes("gambar") ||
                f.label.toLowerCase().includes("pasfoto")
                  ? "image/*"
                  : f.label.toLowerCase().includes("video")
                  ? "video/*"
                  : f.label.toLowerCase().includes("excel") || f.label.toLowerCase().includes(".xlsx")
                  ? ".xlsx,.xls,.csv"
                  : ".pdf,image/*");
              return (
                <FileInput
                  key={f.name}
                  label={f.label}
                  required={f.required ?? true}
                  accept={defaultAccept}
                  value={form[f.name] ?? ""}
                  placeholder={f.placeholder ?? "Pilih berkas..."}
                  helperText={f.helperText}
                  onChange={(fileName) =>
                    setForm({ ...form, [f.name]: fileName })
                  }
                />
              );
            }
            return (
              <Input
                key={f.name}
                {...common}
                type={f.type === "number" ? "number" : "text"}
                placeholder={f.placeholder}
                helperText={f.helperText}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              />
            );
          })}
        </form>
      </Modal>
    </div>
  );
}
