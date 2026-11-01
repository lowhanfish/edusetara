import React from "react";
import { Button, Modal, Badge } from "../../../../_components/ui";
import { ResponseInterface } from "../types";

interface DetailSiswaModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ResponseInterface | null;
}

export default function DetailSiswaModal({
  isOpen,
  onClose,
  record,
}: DetailSiswaModalProps) {
  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title="Lembar Biodata Peserta Didik (Siswa)"
      description="Pangkalan data profil peserta didik resmi Dinas Pendidikan dan Kebudayaan Konawe Selatan"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#7d7152]">
            Satuan Pendidikan: {record?.unit_kerja || "Satuan Pendidikan Konawe Selatan"}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
            <Button variant="gold" onClick={() => window.print()}>
              🖨 Cetak Biodata
            </Button>
          </div>
        </div>
      }
    >
      {record && (
        <div className="space-y-4 text-xs text-[#2d2410]">
          {/* Header Card Siswa */}
          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
                Nama Lengkap Peserta Didik
              </span>
              <h3 className="font-extrabold text-[#2d2410] text-xl mt-0.5">
                {record.nama}
              </h3>
              <p className="text-xs text-[#7d7152] mt-0.5">
                NISN: <strong className="text-[#2d2410] font-mono">{record.nisn}</strong> • NIK:{" "}
                <span className="font-mono">{record.nik}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="gold">
                {record.kelas_uraian || record.kelas_id || "Kelas Terdaftar"}
              </Badge>
              <Badge variant="neutral" className="bg-white">
                {record.jns_kelamin}
              </Badge>
            </div>
          </div>

          {/* Rincian Identitas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white/40 border border-white/60 space-y-2">
              <h4 className="font-bold text-[#2d2410] text-xs border-b border-white/60 pb-1">
                Data Kelahiran & Keyakinan
              </h4>
              <div className="flex justify-between">
                <span className="text-[#7d7152]">Tempat Lahir:</span>
                <span className="font-medium text-[#2d2410]">{record.tmp_lahir || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7d7152]">Tanggal Lahir:</span>
                <span className="font-medium text-[#2d2410]">
                  {record.tgl_lahir
                    ? new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(record.tgl_lahir))
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7d7152]">Agama:</span>
                <span className="font-medium text-[#2d2410]">{record.agama || "-"}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/40 border border-white/60 space-y-2">
              <h4 className="font-bold text-[#2d2410] text-xs border-b border-white/60 pb-1">
                Data Orang Tua / Wali
              </h4>
              <div className="flex justify-between">
                <span className="text-[#7d7152]">Nama Ayah:</span>
                <span className="font-medium text-[#2d2410]">{record.nama_ayah || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7d7152]">Nama Ibu:</span>
                <span className="font-medium text-[#2d2410]">{record.nama_ibu || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7d7152]">Nama Wali:</span>
                <span className="font-medium text-[#2d2410]">{record.nama_wali || "-"}</span>
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div className="p-3.5 rounded-xl bg-white/40 border border-white/60">
            <span className="text-[#9c8e6b] block text-[10px] uppercase font-semibold">
              Alamat Domisili
            </span>
            <p className="text-[#5e5133] mt-1 leading-relaxed">{record.alamat || "-"}</p>
          </div>

          {/* Audit Footer */}
          <div className="p-3 rounded-xl bg-white/30 border border-white/50 text-[11px] text-[#7d7152] flex items-center justify-between">
            <span>
              Waktu Entri:{" "}
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
