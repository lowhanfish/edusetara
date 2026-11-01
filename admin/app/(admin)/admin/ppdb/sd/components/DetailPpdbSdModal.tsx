import React from "react";
import { Button, Modal } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface DetailPpdbSdModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ResponseInterface | null;
}

export default function DetailPpdbSdModal({
  isOpen,
  onClose,
  record,
}: DetailPpdbSdModalProps) {
  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title="Lembar Data PPDB SD"
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
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Nama Calon Siswa</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nama_siswa ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">NIK</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nik ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">NISN (Jika Ada)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nisn ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">SD Negeri Pilihan</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).sekolah_tujuan ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Jalur Seleksi</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).jalur ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Status Seleksi</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).status ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Berkas Pendaftaran (PDF)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).file_berkas ?? "-")}
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
