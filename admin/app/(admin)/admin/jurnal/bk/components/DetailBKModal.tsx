"use client";

import React from "react";
import { Badge, Button, Modal } from "../../../../_components/ui";
import { JurnalBKRecord } from "../types";

interface DetailBKModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: JurnalBKRecord | null;
}

export default function DetailBKModal({
  isOpen,
  onClose,
  record,
}: DetailBKModalProps) {
  if (!record) return null;

  const statusVariant =
    record.status === "Selesai / Teratasi"
      ? "success"
      : record.status === "Dalam Pemantauan"
      ? "warning"
      : "danger";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lembar Catatan Kasus & Konseling Siswa (BK)"
      description={`ID Kasus: ${record.id} • Konseli: ${record.nm_siswa} (${record.kelas_id})`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon="🖨️"
          >
            Cetak Lembar BK
          </Button>
          <Button variant="gold" onClick={onClose}>
            Tutup
          </Button>
        </div>
      }
    >
      <div className="space-y-5 text-sm">
        {/* Banner Siswa & Status */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7152]">
              Identitas Konseli
            </span>
            <p className="text-base font-bold text-[#2d2410]">{record.nm_siswa}</p>
            <p className="text-xs text-[#7d7152] font-medium mt-0.5">
              {record.kelas_id} • Tanggal Sesi:{" "}
              {new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(record.tgl))}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant} size="lg">
              {record.status}
            </Badge>
          </div>
        </div>

        {/* Layanan & Model Kegiatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1">
              🎯 Bidang Bimbingan
            </h5>
            <p className="text-xs font-semibold text-[#2d2410]">{record.jns_layanan_id}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1">
              👥 Model Kegiatan Layanan
            </h5>
            <p className="text-xs font-semibold text-[#2d2410]">{record.mdl_kegiatan_id}</p>
          </div>
        </div>

        {/* Materi / Topik Layanan */}
        <div className="p-4 rounded-xl bg-white/50 border border-white/80">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1">
            Topik / Materi Bimbingan
          </h5>
          <p className="text-sm font-semibold text-[#2d2410]">{record.materi_layanan}</p>
        </div>

        {/* Gejala Masalah & Solusi */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1.5 flex items-center gap-1.5">
              <span>⚠️</span> Gejala / Latar Belakang Masalah
            </h5>
            <p className="text-xs text-[#2d2410] leading-relaxed">{record.permasalahan}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/50 border border-white/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1.5 flex items-center gap-1.5">
              <span>🤝</span> Hasil Konseling & Komitmen Solusi
            </h5>
            <p className="text-xs text-[#2d2410] leading-relaxed">{record.hasil}</p>
          </div>
        </div>

        {/* Rencana Tindak Lanjut */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#7d7152] mb-1.5 flex items-center gap-1.5">
            <span>📋</span> Rencana Tindak Lanjut (RTL)
          </h5>
          <p className="text-xs text-[#2d2410] font-medium leading-relaxed">
            {record.rnc_tindak_lanjut}
          </p>
        </div>

        {/* Berkas & Guru Konselor */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/40 border border-white/60">
          <div>
            <span className="text-[11px] font-bold text-[#7d7152] uppercase block">
              Berkas / Dokumen Kasus
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
              Guru Bimbingan Konseling
            </span>
            <span className="text-xs font-semibold text-[#2d2410]">
              {record.created_by || "Guru BK Sekolah"}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
