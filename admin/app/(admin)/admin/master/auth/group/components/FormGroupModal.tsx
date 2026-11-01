"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Select } from "../../../../../_components/ui";
import { GroupRecord } from "../types";

interface FormGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; level: number }) => void;
  initialData?: GroupRecord | null;
  isLoading?: boolean;
}

export default function FormGroupModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: FormGroupModalProps) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("1");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setLevel(String(initialData.level || 1));
    } else {
      setTitle("");
      setLevel("1");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Nama Role Group wajib diisi";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      level: parseInt(level, 10),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Ubah Role Group" : "Tambah Role Group Baru"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Nama Role Group <span className="text-rose-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Admin Bidang Dinas, Kepala Sekolah, Operator"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-xs text-rose-500 mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Level Akses <span className="text-rose-500">*</span>
          </label>
          <Select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            disabled={isLoading}
          >
            <option value="1">Level 1 - Semua Satuan Pendidikan (Dinas)</option>
            <option value="2">Level 2 - Satuan Pendidikan (Sekolah)</option>
          </Select>
          <p className="text-xs text-slate-500 mt-1">
            Level 1 memiliki cakupan wilayah seluruh Dinas Pendidikan. Level 2 terbatas pada sekolah yang terafiliasi.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" variant="gold" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Group"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
