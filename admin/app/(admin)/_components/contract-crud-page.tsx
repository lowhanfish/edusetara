"use client";

import React, { useMemo, useState } from "react";
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
}

type Row = Record<string, string>;

/**
 * Halaman CRUD generik berstandar EduSetara Frosted Glassmorphism.
 * Terintegrasi penuh dengan Pagination, DateInput, FileInput, Modal, dan semantic table.
 */
export function ContractCrudPage({
  title,
  category,
  description,
  addLabel,
  fields,
  columns,
  initialData = [],
}: ContractCrudPageProps) {
  const emptyForm = Object.fromEntries(fields.map((f) => [f.name, ""])) as Row;
  const [rows, setRows] = useState<Row[]>(initialData);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Row>(emptyForm);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const shownFields = fields.filter((f) => !columns || columns.includes(f.name));

  const labelOf = (f: CrudField, value: string) =>
    f.type === "select" ? f.options?.find((o) => o.value === value)?.label ?? value : value;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setRows(rows.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
    } else {
      setRows([
        {
          ...form,
          id: `${Date.now()}`,
          created_at: new Date().toISOString().slice(0, 10),
          created_by: "admin",
        },
        ...rows,
      ]);
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setRows(rows.filter((r) => r.id !== id));
    }
  };

  const filtered = useMemo(() => {
    return rows.filter((r) =>
      shownFields.some((f) => labelOf(f, r[f.name] ?? "").toLowerCase().includes(query.toLowerCase()))
    );
  }, [rows, shownFields, query]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

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
          <div className="w-full sm:w-80">
            <Input
              placeholder={`Cari ${title.toLowerCase()}...`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

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

        {/* Tabel Semantik Murni HTML */}
        <div className="w-full overflow-x-auto">
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={shownFields.length + 2} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Belum ada data {title.toLowerCase()} ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((r, i) => (
                  <tr key={r.id} className="hover:bg-white/50 transition-colors duration-150">
                    <td className="px-4 py-3.5 text-xs align-middle text-center font-semibold text-[#a89b7b]">
                      {(page - 1) * pageSize + i + 1}
                    </td>
                    {shownFields.map((f) => {
                      const isFileField = f.type === "file" || f.name === "file";
                      const val = r[f.name];
                      if (isFileField) {
                        if (!val) return <td key={f.name} className="px-4 py-3.5 text-xs text-[#a89b7b]">-</td>;
                        const isPdf = /\.pdf$/i.test(val);
                        const isImg = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(val);
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
                              <span className="truncate max-w-[140px]">{val}</span>
                            </span>
                          </td>
                        );
                      }
                      if (f.type === "richtext") {
                        const plainText = (val ?? "").replace(/<[^>]*>/g, "").trim();
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
                          <span className="font-medium">{labelOf(f, r[f.name] ?? "") || "-"}</span>
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
            total={filtered.length}
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
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-crud">
              Simpan
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
                    {(f.options ?? []).map((opt) => (
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
