"use client";

import React from "react";
import { Button, Modal } from "@/app/(admin)/_components/ui";
import type { MasterAsetConfig, MasterAsetRecord } from "./types";

interface Props {
  config: MasterAsetConfig;
  isOpen: boolean;
  onClose: () => void;
  record: MasterAsetRecord | null;
}

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "-";

const show = (value: unknown) =>
  value === null || value === undefined || value === "" ? "-" : String(value);

export default function MasterAsetDetailModal({ config, isOpen, onClose, record }: Props) {
  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title={`Lembar Data ${config.singular}`}
      description="Master Aset mengikuti struktur SIMDA BMD"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#7d7152]">
            Pencatat: {record?.created_by || "Administrator"}
          </span>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      }
    >
      {record && (
        <div className="space-y-4 text-xs text-[#2d2410]">
          <div className="p-4 rounded-2xl bg-white/60 border border-white/80">
            <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
              {config.singular}
            </span>
            <h3 className="font-extrabold text-xl mt-0.5">{show(record[config.titleKey])}</h3>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.columns.map((col) => (
              <div key={col.key} className="p-3 rounded-xl bg-white/50 border border-white/70">
                <dt className="text-[#9c8e6b] text-[10px] uppercase font-semibold">{col.label}</dt>
                <dd className="mt-0.5 font-medium text-[#2d2410] break-words">
                  {col.render ? col.render(record) : show(record[col.key])}
                </dd>
              </div>
            ))}
            {(config.detailExtras ?? []).map((col) => (
              <div key={col.key} className="p-3 rounded-xl bg-white/50 border border-white/70">
                <dt className="text-[#9c8e6b] text-[10px] uppercase font-semibold">{col.label}</dt>
                <dd className="mt-0.5 font-medium text-[#2d2410] break-words">
                  {col.render ? col.render(record) : show(record[col.key])}
                </dd>
              </div>
            ))}
            {config.fields
              .filter((f) => f.type !== "lookup")
              .filter((f) => !config.columns.some((c) => c.key === f.key))
              .filter((f) => !(config.detailExtras ?? []).some((c) => c.key === f.key))
              .map((f) => (
                <div key={f.key} className="p-3 rounded-xl bg-white/50 border border-white/70 sm:col-span-2">
                  <dt className="text-[#9c8e6b] text-[10px] uppercase font-semibold">{f.label}</dt>
                  <dd className="mt-0.5 text-[#5e5133] leading-relaxed">{show(record[f.key])}</dd>
                </div>
              ))}
          </dl>

          <div className="p-3 rounded-xl bg-white/30 border border-white/50 text-[11px] text-[#7d7152] flex items-center justify-between gap-2">
            <span>
              Waktu Pencatatan: <strong className="text-[#2d2410]">{formatDate(record.created_at)}</strong>
            </span>
            <span className="text-[10px] text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 truncate max-w-[140px]">
              ID: {record.id}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
