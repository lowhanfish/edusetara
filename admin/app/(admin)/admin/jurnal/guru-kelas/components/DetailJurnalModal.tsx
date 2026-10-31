import React from "react";
import { Button, Modal } from "../../../../_components/ui";
import { JurnalGuruKelasRecord } from "../types";

interface DetailJurnalModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: JurnalGuruKelasRecord | null;
}

export default function DetailJurnalModal({
  isOpen,
  onClose,
  record,
}: DetailJurnalModalProps) {
  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title="Lembar Catatan Jurnal Guru Kelas"
      description={`ID Dokumen: ${record?.id ?? ""} • Pertemuan ke-${record?.pertemuan_ke ?? ""}`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#7d7152]">
            Pencatat: {record?.created_by || "Guru Kelas"}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
            <Button variant="gold" onClick={() => window.print()}>
              🖨 Cetak Jurnal
            </Button>
          </div>
        </div>
      }
    >
      {record && (
        <div className="space-y-4 text-xs text-[#2d2410]">
          {/* Box Identitas */}
          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-[#7d7152]">
              <div>
                <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                  Satuan Pendidikan
                </span>
                <span className="font-bold text-[#2d2410] text-sm">{record.sekolah}</span>
              </div>
              <div>
                <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                  Tanggal Pelaksanaan
                </span>
                <span className="font-semibold text-[#2d2410]">
                  {new Intl.DateTimeFormat("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(record.tgl))}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/60">
              <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                Tema & Subtema Pembelajaran
              </span>
              <span className="font-bold text-[#2d2410] text-sm">{record.tema}</span>
              <p className="text-[#7d7152] mt-0.5">{record.materi_pokok}</p>
            </div>
          </div>

          {/* Pedagogi */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl border border-white/80 bg-white/50">
              <span className="text-amber-800 block text-[10px] uppercase font-bold">
                Model Pembelajaran
              </span>
              <span className="font-semibold text-[#2d2410] text-[11px]">
                {record.model_pembelajaran}
              </span>
            </div>
            <div className="p-3 rounded-2xl border border-white/80 bg-white/50">
              <span className="text-[#7d7152] block text-[10px] uppercase font-bold">Metode</span>
              <span className="font-semibold text-[#2d2410] text-[11px]">
                {record.metode_pembelajaran}
              </span>
            </div>
            <div className="p-3 rounded-2xl border border-white/80 bg-white/50">
              <span className="text-[#7d7152] block text-[10px] uppercase font-bold">
                Bentuk Asesmen
              </span>
              <span className="font-semibold text-[#2d2410] text-[11px]">
                {record.penilaian}
              </span>
            </div>
          </div>

          {/* Uraian Sintaks KBM */}
          <div>
            <h5 className="font-bold text-[#2d2410] text-xs mb-1.5 flex items-center gap-1.5">
              <span>📌</span>
              <span>Uraian Sintaks & Kegiatan Belajar Mengajar:</span>
            </h5>
            <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80 leading-relaxed text-[#2d2410]">
              {record.kegiatan}
            </div>
          </div>

          {/* Presensi Siswa */}
          <div>
            <h5 className="font-bold text-[#2d2410] text-xs mb-1.5 flex items-center gap-1.5">
              <span>📊</span>
              <span>Rekapitulasi Presensi Kehadiran Siswa:</span>
            </h5>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-300/40">
                <span className="block text-[10px] text-emerald-800 font-semibold">Hadir</span>
                <span className="text-base font-bold text-emerald-900">{record.siswa_hadir}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-500/15 border border-sky-300/40">
                <span className="block text-[10px] text-sky-800 font-semibold">Izin</span>
                <span className="text-base font-bold text-sky-900">{record.siswa_izin}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-400/20 border border-amber-300/40">
                <span className="block text-[10px] text-amber-800 font-semibold">Sakit</span>
                <span className="text-base font-bold text-amber-900">{record.siswa_sakit}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-500/15 border border-rose-300/40">
                <span className="block text-[10px] text-rose-800 font-semibold">Alpa</span>
                <span className="text-base font-bold text-rose-900">{record.siswa_alpa}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#2d2410] text-white">
                <span className="block text-[10px] text-amber-200 font-semibold">Persentase</span>
                <span className="text-base font-bold text-[#ffd666]">{record.persentase}%</span>
              </div>
            </div>
          </div>

          {/* Catatan Refleksi */}
          {record.keterangan && (
            <div>
              <h5 className="font-bold text-[#2d2410] text-xs mb-1 flex items-center gap-1.5">
                <span>💡</span>
                <span>Catatan Refleksi KBM:</span>
              </h5>
              <div className="p-3 rounded-2xl bg-amber-400/15 border border-amber-300/40 text-[#2d2410] italic">
                "{record.keterangan}"
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
