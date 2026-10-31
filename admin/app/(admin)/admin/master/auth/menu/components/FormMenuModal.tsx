"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Select } from "../../../../../_components/ui";
import { MenuRecord } from "../types";
import { useResponseOption } from "../hooks/crud";

interface FormMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    icon: string;
    path: string;
    index: number;
    parent_id?: string | null;
    is_active: boolean;
  }) => void;
  initialData?: MenuRecord | null;
  isLoading?: boolean;
}

export default function FormMenuModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: FormMenuModalProps) {
  const { List: parentOptions } = useResponseOption();

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("Folder");
  const [path, setPath] = useState("");
  const [index, setIndex] = useState("1");
  const [parentId, setParentId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setIcon(initialData.icon || "Folder");
      setPath(initialData.path || "");
      setIndex(String(initialData.index || 1));
      setParentId(initialData.parent_id || "");
      setIsActive(initialData.is_active ?? true);
    } else {
      setTitle("");
      setIcon("Folder");
      setPath("");
      setIndex("1");
      setParentId("");
      setIsActive(true);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Nama Menu / Sub-menu wajib diisi";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      icon: icon.trim() || "Folder",
      path: path.trim(),
      index: parseInt(index, 10) || 1,
      parent_id: parentId ? parentId : null,
      is_active: isActive,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Ubah Menu" : "Tambah Menu / Sub-menu Baru"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Menu Induk (Parent)
          </label>
          <Select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            disabled={isLoading}
          >
            <option value="">-- Menu Utama (Top Level) --</option>
            {parentOptions
              .filter((opt) => !initialData || opt.id !== initialData.id)
              .map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.value}
                </option>
              ))}
          </Select>
          <p className="text-xs text-slate-500 mt-1">
            Pilih menu induk jika item ini merupakan sub-menu dari menu lain.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Nama Menu / Sub-menu <span className="text-rose-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Master Siswa, Verifikasi Piagam"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-xs text-rose-500 mt-1">{errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Icon Lucide
            </label>
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Contoh: Users, BookOpen, Settings"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Urutan Index
            </label>
            <Input
              type="number"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              placeholder="1"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Route URL Path
          </label>
          <Input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="Contoh: /admin/master/siswa (kosongkan jika hanya grup folder)"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="is_active_toggle"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
          />
          <label
            htmlFor="is_active_toggle"
            className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
          >
            Aktifkan menu di navigasi sidebar
          </label>
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
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Menu"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
