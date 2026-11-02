import React from "react";
import { Button, Modal } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useAgamaOption, useTempatTinggalOption, useTransportasiOption, usePendidikanOption, usePekerjaanOption, usePenghasilanOption } from "../hooks/crud";

interface DetailPpdbSmpModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ResponseInterface | null;
}

export default function DetailPpdbSmpModal({
  isOpen,
  onClose,
  record,
}: DetailPpdbSmpModalProps) {
  const { options: agamaOptions } = useAgamaOption();
  const { options: tempattinggalOptions } = useTempatTinggalOption();
  const { options: transportasiOptions } = useTransportasiOption();
  const { options: pendidikanOptions } = usePendidikanOption();
  const { options: pekerjaanOptions } = usePekerjaanOption();
  const { options: penghasilanOptions } = usePenghasilanOption();
  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title="Lembar Data PPDB SMP"
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
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Nama Lengkap Calon Siswa</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nama ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Nama Panggilan</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nm_panggilan ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Jenis Kelamin</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).jns_kelamin ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">NISN</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nisn ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">NIK Calon Siswa</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nik ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Tempat Lahir</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).tmp_lahir ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Tanggal Lahir</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).tgl_lahir ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Agama (Master PPDB)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).agama;
                if (!val) return "-";
                const match = agamaOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Alamat Tempat Tinggal</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).alamat ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">RT / RW</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).rt_rw ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Dusun / Lingkungan</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).dusun ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Kode Pos</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).kode_pos ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Status Tempat Tinggal (Master PPDB)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).tmp_tinggal;
                if (!val) return "-";
                const match = tempattinggalOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Moda Transportasi (Master PPDB)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).moda_transportasi;
                if (!val) return "-";
                const match = transportasiOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Nama Ayah Kandung</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nama_ayah ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">NIK Ayah</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nik_ayah ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Pendidikan Ayah (Master PPDB)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).pendidikan_ayah;
                if (!val) return "-";
                const match = pendidikanOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Pekerjaan Ayah (Master PPDB)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).pekerjaan_ayah;
                if (!val) return "-";
                const match = pekerjaanOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Penghasilan Ayah (Master PPDB)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).penghasilan_ayah;
                if (!val) return "-";
                const match = penghasilanOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Nama Ibu Kandung</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nama_ibu ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">NIK Ibu</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nik_ibu ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Pendidikan Ibu (Master PPDB)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).pendidikan_ibu;
                if (!val) return "-";
                const match = pendidikanOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Pekerjaan Ibu (Master PPDB)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).pekerjaan_ibu;
                if (!val) return "-";
                const match = pekerjaanOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Penghasilan Ibu (Master PPDB)</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(() => {
                const val = (record as any).penghasilan_ibu;
                if (!val) return "-";
                const match = penghasilanOptions.find((o) => o.id === String(val) || o.value === String(val));
                return match ? match.value : String(val);
              })()}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Nama Wali Murid</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).nama_wali ?? "-")}
            </span>
          </div>
          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">Berkas Persyaratan (PDF/Gambar)</span>
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
