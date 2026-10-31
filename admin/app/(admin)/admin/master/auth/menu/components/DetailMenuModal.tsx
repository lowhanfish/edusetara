"use client";

import React from "react";
import { Badge, Button, Modal } from "../../../../../_components/ui";
import { MenuRecord } from "../types";

interface DetailMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MenuRecord | null;
}

export default function DetailMenuModal({
  isOpen,
  onClose,
  record,
}: DetailMenuModalProps) {
  if (!record) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Menu Navigasi">
      <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
        <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block mb-1">ID Menu</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              {record.id}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Status Menu</span>
            <Badge variant={record.is_active ? "primary" : "neutral"}>
              {record.is_active ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>
          <div className="col-span-2">
            <span className="text-xs text-slate-400 block mb-1">Nama Menu</span>
            <span className="text-base font-semibold text-slate-900 dark:text-white">
              {record.title}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Icon Lucide</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {record.icon || "-"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Urutan Index</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {record.index}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-xs text-slate-400 block mb-1">Route URL Path</span>
            <span className="font-mono text-xs text-teal-600 dark:text-teal-400 break-all">
              {record.path || "(Hanya grup dropdown)"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Parent Menu ID</span>
            <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
              {record.parent_id || "(Top-level root)"}
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
