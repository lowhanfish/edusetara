"use client";

import React from "react";
import { Badge, Button, Modal } from "../../../../../_components/ui";
import { AsnRecord } from "../types";

interface DetailRegistrasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AsnRecord | null;
}

export default function DetailRegistrasiModal({
  isOpen,
  onClose,
  record,
}: DetailRegistrasiModalProps) {
  if (!record) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail ASN & Hak Akses">
      <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
        <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="col-span-2">
            <span className="text-xs text-slate-400 block mb-1">Nama Lengkap ASN</span>
            <span className="text-base font-semibold text-slate-900 dark:text-white">
              {record.nama_lengkap}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">NIP (Nomor Induk Pegawai)</span>
            <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
              {record.nip || "-"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Email SIMPEG/Akun</span>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
              {record.email || "-"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Satuan Pendidikan / Unit Kerja</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {record.satuan_pendidikan || "-"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Jabatan</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {record.jabatan || "-"}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-xs text-slate-400 block mb-1">Role Group Terpasang</span>
            {record.group_title ? (
              <div className="flex items-center gap-2">
                <Badge variant={record.group_level === 1 ? "gold" : "neutral"}>
                  {record.group_level === 1 ? "Level 1 (Dinas/Semua)" : "Level 2 (Satuan Pendidikan)"}
                </Badge>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {record.group_title}
                </span>
              </div>
            ) : (
              <Badge variant="neutral">Belum Memiliki Role (Akses Terbatas)</Badge>
            )}
          </div>
          <div className="col-span-2">
            <span className="text-xs text-slate-400 block mb-1">Waktu Terdaftar</span>
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
