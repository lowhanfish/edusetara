import React from "react";
import { Button, Modal } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface DetailPublishKebudayaanModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ResponseInterface | null;
}

export default function DetailPublishKebudayaanModal({
  isOpen,
  onClose,
  record,
}: DetailPublishKebudayaanModalProps) {
  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title="Lembar Data Warisan & Seni Kebudayaan"
      description="Sesuai dokumen spesifikasi Arsitektur Sistem EduSetara"
      maxWidth="3xl"
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
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Nama Objek / Warisan Budaya</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nama ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Klasifikasi Budaya</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).kategori ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Lokasi / Kecamatan</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).lokasi ?? "-")}
            </span>
          </div>
          <div className="py-3 border-b border-[#e2d9c8]/60 flex flex-col gap-2">
            <span className="text-[#7d7152] font-semibold">Uraian Sejarah & Deskripsi</span>
            <div className="p-4 rounded-xl bg-white/80 border border-amber-200/50 text-[#2d2410] text-sm prose prose-sm max-w-none leading-relaxed">
              {(record as any).deskripsi ? (
                <div dangerouslySetInnerHTML={{ __html: String((record as any).deskripsi) }} />
              ) : (
                <span className="text-stone-400 italic">Tidak ada deskripsi.</span>
              )}
            </div>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Foto Dokumentasi</span>
            <div className="sm:w-2/3">
              {(record as any).foto ? (
                <div className="space-y-1.5">
                  <img
                    src={(record as any).foto.startsWith("http") ? (record as any).foto : `http://127.0.0.1:8000${(record as any).foto}`}
                    alt="Dokumentasi Budaya"
                    className="max-h-48 rounded-xl object-cover border border-[#e2d9c8]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <p className="text-[10px] text-[#7d7152] break-all">{(record as any).foto}</p>
                </div>
              ) : (
                <span className="text-stone-400">-</span>
              )}
            </div>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Status Registrasi</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).status ?? "-")}
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
