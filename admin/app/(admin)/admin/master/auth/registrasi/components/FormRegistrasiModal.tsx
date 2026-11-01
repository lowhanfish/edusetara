"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, Select } from "../../../../../_components/ui";
import { AsnRecord } from "../types";
import { useGroupOption } from "../hooks/crud";

interface FormRegistrasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { group_id: string | null }) => void;
  record: AsnRecord | null;
  isLoading?: boolean;
}

export default function FormRegistrasiModal({
  isOpen,
  onClose,
  onSubmit,
  record,
  isLoading,
}: FormRegistrasiModalProps) {
  const { List: groupOptions } = useGroupOption();
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    if (record) {
      setGroupId(record.group_id || "");
    } else {
      setGroupId("");
    }
  }, [record, isOpen]);

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      group_id: groupId ? groupId : null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Role & Hak Akses ASN"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ASN Info Summary */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Nama Lengkap:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {record.nama_lengkap}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">NIP:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {record.nip || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Satuan Pendidikan:</span>
            <span className="text-slate-700 dark:text-slate-300">
              {record.satuan_pendidikan || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Jabatan:</span>
            <span className="text-slate-700 dark:text-slate-300">
              {record.jabatan || "-"}
            </span>
          </div>
        </div>

        {/* Role Group Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Pilih Role Group Akses <span className="text-rose-500">*</span>
          </label>
          <Select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            disabled={isLoading}
          >
            <option value="">-- Tidak Ada Role (Akses Dinonaktifkan) --</option>
            {groupOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.value}
              </option>
            ))}
          </Select>
          <p className="text-xs text-slate-500 mt-1">
            Menentukan modul menu dan kewenangan CRUD (Create, Read, Update, Delete) yang dapat diakses oleh ASN ini.
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
            {isLoading ? "Menyimpan..." : "Simpan Hak Akses"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
