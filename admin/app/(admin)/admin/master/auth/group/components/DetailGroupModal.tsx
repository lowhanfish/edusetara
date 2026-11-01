"use client";

import React from "react";
import { Badge, Button, Modal } from "../../../../../_components/ui";
import { GroupRecord } from "../types";

interface DetailGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: GroupRecord | null;
}

export default function DetailGroupModal({
  isOpen,
  onClose,
  record,
}: DetailGroupModalProps) {
  if (!record) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Role Group">
      <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
        <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block mb-1">ID Role</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              {record.id}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Level Akses</span>
            <Badge variant={record.level === 1 ? "gold" : "neutral"}>
              {record.level === 1 ? "Level 1 (Dinas/Semua)" : "Level 2 (Satuan Pendidikan)"}
            </Badge>
          </div>
          <div className="col-span-2">
            <span className="text-xs text-slate-400 block mb-1">Nama Role</span>
            <span className="text-base font-semibold text-slate-900 dark:text-white">
              {record.title}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Jumlah Anggota ASN</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {record.member_count ?? 0} ASN terdaftar
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Dibuat Oleh</span>
            <span className="text-slate-700 dark:text-slate-300">
              {record.created_by || "System Administrator"}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-xs text-slate-400 block mb-1">Waktu Dibuat</span>
            <span className="text-xs font-mono text-slate-500">
              {record.created_at ? new Date(record.created_at).toLocaleString("id-ID") : "-"}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
