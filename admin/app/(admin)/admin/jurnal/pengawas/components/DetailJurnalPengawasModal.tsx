import React from "react";
import { Button, Modal } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { usePendampinganOption, useTugasOption } from "../hooks/crud";

interface DetailJurnalPengawasModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ResponseInterface | null;
}

export default function DetailJurnalPengawasModal({
  isOpen,
  onClose,
  record,
}: DetailJurnalPengawasModalProps) {
  const { options: pendampinganOptions } = usePendampinganOption();
  const { options: tugasOptions } = useTugasOption();
  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title="Lembar Data Jurnal Pengawas Sekolah"
      description="Sesuai dokumen spesifikasi Arsitektur Sistem EduSetara"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#7d7152]">
            Pencatat: {record?.created_by || "Administrator"}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
            <Button variant="gold" onClick={() => window.print()}>
              🖨 Cetak Berkas
            </Button>
          </div>
        </div>
      }
    >
      {record && (
        <div className="space-y-4 text-xs text-[#2d2410]">
          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-1">
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Tanggal Kunjungan / Supervisi</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).tgl ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Kepala Sekolah yang Disupervisi</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).kepsek ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Tahapan Siklus Pendampingan (Master Pendampingan)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).pendampingan_id;
                if (!val) return "-";
                const match = pendampinganOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Fungsi Penugasan (Master Tugas)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).tugas_id;
                if (!val) return "-";
                const match = tugasOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Temuan Supervisi Akademik</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).temuan_akademik ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Temuan Supervisi Manajerial</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).temuan_manajerial ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Rencana Tindak Lanjut / Rekomendasi</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).tindak_lanjut ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Instrumen Supervisi / Laporan (PDF)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(record as any).file ? (
                <a
                  href={String((record as any).file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 underline hover:text-amber-900 inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  📄 Lihat / Unduh Berkas
                </a>
              ) : (
                "-"
              )}
            </span>
          </div>
          </div>

          <div className="p-3 rounded-xl bg-white/30 border border-white/50 text-[11px] text-[#7d7152] flex items-center justify-between">
            <span>
              Waktu Pencatatan:{" "}
              <strong className="text-[#2d2410]">
                {record.created_at
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(record.created_at))
                  : "-"}
              </strong>
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
