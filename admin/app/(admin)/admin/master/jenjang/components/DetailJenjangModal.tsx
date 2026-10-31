import React from "react";
import { Badge, Button, Modal } from "../../../../_components/ui";
import { JenjangRecord } from "../types";

interface DetailJenjangModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: JenjangRecord | null;
}

export default function DetailJenjangModal({
  isOpen,
  onClose,
  record,
}: DetailJenjangModalProps) {
  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title="Lembar Data Master Jenjang Pendidikan"
      description={`Kode Referensi Sistem: ${record?.id ?? ""} • Dinas Pendidikan & Kebudayaan Konawe Selatan`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#7d7152]">
            Pencatat: {record?.created_by || "Administrator SIMPEG"}
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
          {/* Box Identitas */}
          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-[#ffd666]/30 text-[#855700] border border-[#ffd666]/50">
                Kode: {record.id}
              </span>
              <Badge variant={record.status === "Aktif" ? "success" : "neutral"} size="sm">
                {record.status || "Aktif"}
              </Badge>
            </div>

            <div className="pt-1">
              <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                Nama Jenjang Pendidikan
              </span>
              <h3 className="font-extrabold text-[#2d2410] text-base mt-0.5">
                {record.uraian}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/60">
              <div>
                <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                  Jalur Pendidikan
                </span>
                <span className="font-bold text-[#2d2410] text-xs">
                  Jalur {record.kategori || "Formal"}
                </span>
              </div>
              <div>
                <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                  Unit Kerja / Bidang Pembina
                </span>
                <span className="font-semibold text-[#2d2410] text-xs">
                  {record.unit_kerja || "Dinas Pendidikan & Kebudayaan"}
                </span>
              </div>
            </div>
          </div>

          {/* Keterangan Deskripsi */}
          <div className="p-4 rounded-2xl border border-white/80 bg-white/40 space-y-1.5">
            <span className="text-amber-800 block text-[10px] uppercase font-bold">
              Keterangan & Lingkup Penyelenggaraan
            </span>
            <p className="text-[#5e5133] leading-relaxed text-xs">
              {record.keterangan ||
                "Tidak ada keterangan tambahan yang dicatat untuk jenjang pendidikan ini."}
            </p>
          </div>

          {/* Jejak Audit Sistem */}
          <div className="p-3 rounded-xl bg-white/30 border border-white/50 text-[11px] text-[#7d7152] flex items-center justify-between">
            <span>
              Terdaftar sejak:{" "}
              <strong className="text-[#2d2410]">
                {record.created_at
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(record.created_at))
                  : "31 Oktober 2026"}
              </strong>
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              Sinkron Dapodik & PPDB
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
