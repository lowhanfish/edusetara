"use client";

import React from "react";
import { Badge, Button, Modal } from "../../../../_components/ui";
import { JurnalKepalaSekolahRecord } from "../types";

interface DetailKepsekModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: JurnalKepalaSekolahRecord | null;
}

export default function DetailKepsekModal({
  isOpen,
  onClose,
  record,
}: DetailKepsekModalProps) {
  if (!record) return null;

  const statusVariant =
    record.status === "Terealisasi"
      ? "success"
      : record.status === "Dalam Proses"
      ? "warning"
      : "danger";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lembar Catatan Jurnal Kepala Sekolah"
      description={`ID Agenda: ${record.id} • Satuan Pendidikan: ${record.sekolah}`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon="🖨️"
          >
            Cetak Lembar Jurnal
          </Button>
          <Button variant="gold" onClick={onClose}>
            Tutup
          </Button>
        </div>
      }
    >
      <div className="space-y-5 text-sm">
        {/* Header Ringkasan Agenda */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7152]">
              Tanggal Agenda
            </span>
            <p className="text-base font-bold text-[#2d2410]">
              {new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(record.tgl))}
            </p>
            <p className="text-xs text-[#7d7152] font-medium mt-0.5">{record.sekolah}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant} size="lg">
              {record.status}
            </Badge>
          </div>
        </div>

        {/* Uraian Agenda */}
        <div className="p-4 rounded-xl bg-white/50 border border-white/80">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1.5">
            Uraian Tugas / Agenda
          </h5>
          <p className="text-sm font-semibold text-[#2d2410] leading-relaxed">
            {record.uraian}
          </p>
        </div>

        {/* 2 Kolom: Target & Realisasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1.5">
              🎯 Target Capaian Sasaran
            </h5>
            <p className="text-xs text-[#2d2410] leading-relaxed">{record.target}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1.5">
              ✅ Hasil / Output Terealisasi
            </h5>
            <p className="text-xs text-[#2d2410] leading-relaxed">{record.hasil}</p>
          </div>
        </div>

        {/* Pihak Terlibat & Catatan Tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1">
              👥 Stakeholder / Keterlibatan
            </h5>
            <p className="text-xs font-medium text-[#2d2410]">{record.keterlibatan}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1">
              📌 Dokumen / Bukti Fisik
            </h5>
            {record.file ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/70 text-[#2d2410] border border-white/80 shadow-2xs">
                📄 {record.file}
              </span>
            ) : (
              <span className="text-xs text-[#a89b7b]">Tidak ada berkas terlampir</span>
            )}
          </div>
        </div>

        {/* Catatan Arahan Manajerial */}
        {record.keterangan && (
          <div className="p-4 rounded-xl bg-white/40 border border-white/60">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1">
              📝 Catatan & Arahan Tindak Lanjut
            </h5>
            <p className="text-xs text-[#5e5133] leading-relaxed italic">
              &ldquo;{record.keterangan}&rdquo;
            </p>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-white/60 flex items-center justify-between text-[11px] text-[#7d7152]">
          <span>Penanggung Jawab: {record.created_by || "Kepala Sekolah"}</span>
          <span>
            Dicatat:{" "}
            {record.created_at
              ? new Date(record.created_at).toLocaleDateString("id-ID")
              : record.tgl}
          </span>
        </div>
      </div>
    </Modal>
  );
}
