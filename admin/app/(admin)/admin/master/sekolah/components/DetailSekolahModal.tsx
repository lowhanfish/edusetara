"use client";

import React from "react";
import Link from "next/link";
import { Badge, Button, Modal } from "../../../../_components/ui";
import SimdaIdentity from "./SimdaIdentity";
import { SekolahRecord } from "../types";

interface DetailSekolahModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SekolahRecord | null;
  onEditClick?: (record: SekolahRecord) => void;
}

export default function DetailSekolahModal({
  isOpen,
  onClose,
  record,
  onEditClick,
}: DetailSekolahModalProps) {
  if (!record) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lembar Data Profil Satuan Pendidikan"
      description="Rincian identitas resmi satuan pendidikan dalam Data Master Mandiri EduSetara (Dapodik Kemendikdasmen)."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {record.url && (
              <a
                href={record.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-600 hover:underline inline-flex items-center gap-1 font-medium"
              >
                Cek Profil Kemendikdasmen ↗
              </a>
            )}
            {record.latitude && record.longitude && (
              <a
                href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 hover:underline inline-flex items-center gap-1 font-medium"
              >
                Buka Peta Google Maps 📍
              </a>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/admin/inventaris-aset?sekolah_id=${encodeURIComponent(record.id)}`} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100">Lihat inventaris</Link>
            <Button variant="outline" size="sm" onClick={onClose}>
              Tutup
            </Button>
            {onEditClick && (
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  onClose();
                  onEditClick(record);
                }}
              >
                ✏️ Edit Profil
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Banner Ringkasan Lembaga */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-300/30 flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                NPSN: {record.npsn}
              </span>
              {record.simpeg_unit_kerja_id ? (
                <span
                  className="text-[11px] font-medium text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300/40 flex items-center gap-1"
                  title={`Kode Unit Kerja: ${record.simpeg_unit_kerja_id}`}
                >
                  🏛️ {record.simpeg_unit_kerja_nama || record.simpeg_unit_kerja_id}
                </span>
              ) : (
                <span className="text-[10px] text-[#7d7152] bg-white/60 px-2 py-0.5 rounded border border-white">
                  Belum Ditautkan SIMPEG
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[#2d2410] mt-1.5">{record.nama_sekolah}</h3>
            <p className="text-xs text-[#7d7152] mt-0.5">
              {record.alamat_jalan || record.alamat || "Alamat belum tercatat"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge variant={record.status_sekolah === "NEGERI" ? "success" : "neutral"} size="sm">
              {record.status_sekolah}
            </Badge>
            <Badge variant="gold" size="sm">
              {record.bentuk_pendidikan || record.jenjang}
            </Badge>
          </div>
        </div>

        {/* Integrasi Kepegawaian SIMPEG BKPSDM */}
        <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-300/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
              🏛️ Integrasi Kepegawaian SIMPEG BKPSDM
            </span>
            {record.simpeg_unit_kerja_id ? (
              <Badge variant="success" size="sm">
                ✓ Terhubung SIMPEG
              </Badge>
            ) : (
              <Badge variant="neutral" size="sm">
                Belum Terhubung
              </Badge>
            )}
          </div>
          {record.simpeg_unit_kerja_id ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] font-medium text-[#7d7152] block">Nama Unit Kerja (SIMPEG):</span>
                <span className="font-bold text-sm text-[#2d2410] block">
                  {record.simpeg_unit_kerja_nama || record.nama_sekolah}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-medium text-[#7d7152] block">Kode / ID Unit Kerja:</span>
                <span className="font-mono font-bold text-sky-900 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded text-xs inline-block">
                  {record.simpeg_unit_kerja_id}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-[#7d7152]">
              Satuan pendidikan ini belum terpetakan dengan unit kerja kepegawaian ASN/PNS di SIMPEG BKPSDM (sekolah mandiri / swasta / Kemenag).
            </p>
          )}
        </div>

        <SimdaIdentity schoolId={record.id} value={record.simda_upb} />

        {/* Grid Parameter Pendidikan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-white/40 border border-white/80 space-y-1">
            <span className="text-[#7d7152] font-medium block">Nomor Pokok Sekolah Nasional (NPSN)</span>
            <span className="font-mono font-bold text-sm text-[#2d2410] block">
              {record.npsn}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-white/40 border border-white/80 space-y-1">
            <span className="text-[#7d7152] font-medium block">Peringkat Akreditasi BAN-S/M</span>
            <span className="font-bold text-sm text-[#2d2410] block">
              {record.akreditasi ? `Peringkat ${record.akreditasi}` : "Belum Terakreditasi"}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-white/40 border border-white/80 space-y-1">
            <span className="text-[#7d7152] font-medium block">Kecamatan (Kab. Konawe Selatan)</span>
            <span className="font-semibold text-sm text-[#2d2410] block">
              {record.kecamatan || "-"}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-white/40 border border-white/80 space-y-1">
            <span className="text-[#7d7152] font-medium block">Desa / Kelurahan</span>
            <span className="font-semibold text-sm text-[#2d2410] block">
              {record.desa_kelurahan || "-"}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-white/40 border border-white/80 space-y-1">
            <span className="text-[#7d7152] font-medium block">Koordinat Geografis (GPS)</span>
            <span className="font-mono text-xs text-[#2d2410] block">
              {record.latitude && record.longitude
                ? `${record.latitude}, ${record.longitude}`
                : "Belum tercatat"}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-white/40 border border-white/80 space-y-1">
            <span className="text-[#7d7152] font-medium block">Kode Pos / Dusun</span>
            <span className="font-semibold text-sm text-[#2d2410] block">
              {record.kode_pos || record.dusun || "-"}
            </span>
          </div>
        </div>

        {/* Informasi Sistem & Audit */}
        <div className="p-3 rounded-lg bg-white/20 border border-white/60 text-[11px] text-[#7d7152] space-y-1">
          <div className="flex items-center justify-between">
            <span>Status Layanan EduSetara:</span>
            <span className="font-semibold text-emerald-700">
              {record.is_active ? "Aktif (Menerima Layanan/PPDB)" : "Nonaktif"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Pembaruan Terakhir:</span>
            <span>{record.updated_at ? new Date(record.updated_at).toLocaleString("id-ID") : "-"}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
