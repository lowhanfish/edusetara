"use client";

import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "./ui";

export interface CrudField {
  /** Nama field sesuai Contract API */
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "file" | "date";
  required?: boolean;
  placeholder?: string;
  helperText?: string;
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
 * Halaman CRUD generik berdasarkan Contract API.
 * Field generate-otomatis (id, nip, unit_kerja, created_at, created_by)
 * tidak diinput user, hanya ditampilkan setelah disimpan.
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

  const filtered = rows.filter((r) =>
    shownFields.some((f) => labelOf(f, r[f.name] ?? "").toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        badge={<Badge variant="info">{category}</Badge>}
        action={
          <Button variant="gold" onClick={openCreate}>
            + {addLabel ?? `Tambah ${title}`}
          </Button>
        }
      />

      <Card>
        <div className="p-4 border-b border-slate-100">
          <Input
            placeholder={`Cari ${title.toLowerCase()}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              {shownFields.map((f) => (
                <TableHead key={f.name}>{f.label}</TableHead>
              ))}
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={shownFields.length + 2}>
                  <div className="py-8 text-center text-slate-500">Belum ada data.</div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell>{i + 1}</TableCell>
                  {shownFields.map((f) => (
                    <TableCell key={f.name}>{labelOf(f, r[f.name] ?? "") || "-"}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(r.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
            if (f.type === "select") {
              return (
                <Select
                  key={f.name}
                  {...common}
                  options={[{ value: "", label: "-- Pilih --" }, ...(f.options ?? [])]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                />
              );
            }
            return (
              <Input
                key={f.name}
                {...common}
                type={f.type === "number" || f.type === "date" ? f.type : "text"}
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
