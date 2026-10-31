"use client";

import React from "react";
import { Badge, Button, Modal } from "../../../../_components/ui";
import { JurnalPengawasRecord } from "../types";

interface DetailPengawasModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: JurnalPengawasRecord | null;
}

export default function DetailPengawasModal({
  isOpen,
  onClose,
  record,
}: DetailPengawasModalProps) {
  if (!record) return null;

  const statusVariant =
    record.status === "Selesai Disupervisi"
      ? "success"
      : record.status === "Perlu Tindak Lanjut"
      ? "warning"
      : "danger";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lembar Hasil Kunjungan Pengawas Pembina"
      description={`Nomor Register: ${record.id} • Satuan Pendidikan: ${record.unit_kerja}`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon="🖨️"
          >
            Cetak Laporan Supervisi
          </Button>
          <Button variant="gold" onClick={onClose}>
            Tutup
          </Button>
        </div>
      }
    >
      <div className="space-y-5 text-sm">
        {/* Banner Status & Identitas Sekolah */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7152]">
              Satuan Pendidikan Binaan
            </span>
            <p className="text-base font-bold text-[#2d2410]">{record.unit_kerja}</p>
            <p className="text-xs text-[#7d7152] font-medium mt-0.5">
              Kepala Sekolah: {record.kepsek}
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-1">
            <Badge variant={statusVariant} size="lg">
              {record.status}
            </Badge>
            <span className="text-xs text-[#7d7152]">
              {new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(record.tgl))}
            </span>
          </div>
        </div>

        {/* Jenis Pendampingan & Tugas Pengawasan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1">
              🎯 Bidang Pendampingan
            </h5>
            <p className="text-xs font-semibold text-[#2d2410]">{record.pendampingan_id}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1">
              📋 Tugas Kepengawasan
            </h5>
            <p className="text-xs font-semibold text-[#2d2410]">{record.tugas_id}</p>
          </div>
        </div>

        {/* Temuan Akademik & Temuan Manajerial */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1.5 flex items-center gap-1.5">
              <span>📚</span> Temuan Aspek Akademik / PBM
            </h5>
            <p className="text-xs text-[#2d2410] leading-relaxed">{record.temuan_akademik}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1.5 flex items-center gap-1.5">
              <span>🏛️</span> Temuan Aspek Manajerial & Sarana
            </h5>
            <p className="text-xs text-[#2d2410] leading-relaxed">{record.temuan_manajerial}</p>
          </div>
        </div>

        {/* Rekomendasi & Tindak Lanjut */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1.5 flex items-center gap-1.5">
            <span>💡</span> Rekomendasi & Rencana Tindak Lanjut
          </h5>
          <p className="text-xs text-[#2d2410] font-medium leading-relaxed">
            {record.tindak_lanjut}
          </p>
        </div>

        {/* Berkas Instrumen & Tanda Pengawas */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/40 border border-white/60">
          <div>
            <span className="text-[11px] font-bold text-[#7d7152] uppercase block">
              Dokumen Terlampir
            </span>
            {record.file ? (
              <span className="text-xs font-semibold text-[#2d2410] inline-flex items-center gap-1 mt-0.5">
                📄 {record.file}
              </span>
            ) : (
              <span className="text-xs text-[#a89b7b]">Tidak ada berkas terlampir</span>
            )}
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-[#7d7152] uppercase block">
              Pengawas Pembina
            </span>
            <span className="text-xs font-semibold text-[#2d2410]">
              {record.created_by || "Pengawas Pembina Dikbud Konsel"}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
