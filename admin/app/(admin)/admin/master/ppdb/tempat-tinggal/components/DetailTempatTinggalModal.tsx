import React from "react";
import { Button, Modal } from "../../../../../_components/ui";
import { ResponseInterface } from "../types";

interface DetailTempatTinggalModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ResponseInterface | null;
}

export default function DetailTempatTinggalModal({
  isOpen,
  onClose,
  record,
}: DetailTempatTinggalModalProps) {
  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title="Lembar Data Master Tempat Tinggal"
      description="Sesuai dokumen spesifikasi Arsitektur Sistem EduSetara"
      maxWidth="md"
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
          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-3">
            <div>
              <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                Nama / Nilai (title)
              </span>
              <h3 className="font-extrabold text-[#2d2410] text-xl mt-0.5">
                {record.title || record.uraian}
              </h3>
            </div>

            <div className="pt-2 border-t border-white/60">
              <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                Penjelasan Singkat (desc)
              </span>
              <p className="text-[#5e5133] mt-1 leading-relaxed">
                {record.desc || record.keterangan || "-"}
              </p>
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
            <span className="text-[10px] text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 truncate max-w-[120px]">
              ID: {record.id}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
