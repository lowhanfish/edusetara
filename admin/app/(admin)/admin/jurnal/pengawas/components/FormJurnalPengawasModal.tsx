import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { usePendampinganOption, useTugasOption } from "../hooks/crud";

interface FormJurnalPengawasModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormJurnalPengawasModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormJurnalPengawasModalProps) {
  const { options: pendampinganOptions, isLoading: pendampinganLoading } = usePendampinganOption();
  const { options: tugasOptions, isLoading: tugasLoading } = useTugasOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jurnal Pengawas Sekolah"
          : "✎ Edit Jurnal Pengawas Sekolah"
      }
      description="Pelaporan pendampingan klinis, pengawasan manajerial, dan supervisi akademik sekolah binaan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-jurnal-pengawas" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Jurnal Pengawas Sekolah"
              : "Perbarui Jurnal Pengawas Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-jurnal-pengawas" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tanggal Kunjungan / Supervisi <span className="text-rose-500">*</span>
          </label>
          <Input
            type="date"
            required
            value={(formData as any).tgl || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tgl: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kepala Sekolah yang Disupervisi
          </label>
          <Input
            
            value={(formData as any).kepsek || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kepsek: e.target.value,
              })
            }
            placeholder="Nama Kepala Satuan Pendidikan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahapan Siklus Pendampingan (Master Pendampingan)
          </label>
          <Select
            
            value={(formData as any).pendampingan_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                pendampingan_id: e.target.value,
              })
            }
            options={[
              { value: "", label: pendampinganLoading ? "Memuat opsi data master..." : "-- Pilih tahapan pendampingan --" },
              ...pendampinganOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Fungsi Penugasan (Master Tugas)
          </label>
          <Select
            
            value={(formData as any).tugas_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tugas_id: e.target.value,
              })
            }
            options={[
              { value: "", label: tugasLoading ? "Memuat opsi data master..." : "-- Pilih peran penugasan --" },
              ...tugasOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Temuan Supervisi Akademik
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).temuan_akademik || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                temuan_akademik: e.target.value,
              })
            }
            placeholder="Catatan perangkat ajar & KBM guru..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Temuan Supervisi Manajerial
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).temuan_manajerial || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                temuan_manajerial: e.target.value,
              })
            }
            placeholder="Catatan administrasi sekolah..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Rencana Tindak Lanjut / Rekomendasi
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).tindak_lanjut || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tindak_lanjut: e.target.value,
              })
            }
            placeholder="Tindak lanjut..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Instrumen Supervisi / Laporan (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah instrumen pembinaan"
          />
        </div>
      </form>
    </Modal>
  );
}
