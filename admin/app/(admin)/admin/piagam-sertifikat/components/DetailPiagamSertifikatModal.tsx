import React from "react";
import { Button, Modal } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface DetailPiagamSertifikatModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ResponseInterface | null;
}

export default function DetailPiagamSertifikatModal({
  isOpen,
  onClose,
  record,
}: DetailPiagamSertifikatModalProps) {

  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title="Lembar Data Piagam & Sertifikat"
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
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Kategori Penerima Penghargaan</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).kategori ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Nama Penerima Penghargaan</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nama ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Nama Ajang / Kompetisi</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).kegiatan ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Capaian Juara / Penghargaan</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).juara ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Tingkat Kejuaraan</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).tingkat ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Tahun Prestasi</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).tahun ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Instansi / Lembaga Penyelenggara</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).penyelenggara ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Pindaian Piagam / Sertifikat (PDF/Gambar)</span>
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
