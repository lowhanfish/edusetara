import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormUsulanAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormUsulanAssessmentModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormUsulanAssessmentModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Usulan Data Assessment"
          : "✎ Edit Usulan Data Assessment"
      }
      description="Status moda pelaksanaan sekolah, jumlah siswa peserta asesmen/ANBK, dan rincian gender."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-usulan-assessment" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Usulan Data Assessment"
              : "Perbarui Usulan Data Assessment"}
          </Button>
        </>
      }
    >
      <form id="form-usulan-assessment" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Pelaksanaan Sekolah <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).status_sekolah_id ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status_sekolah_id: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih status moda pelaksanaan --" },
              ...[{"value":"0","label":"Mandiri / Negeri"},{"value":"1","label":"Menumpang / Swasta"},{"value":"2","label":"Satuan Pendidikan Kerjasama (SPK)"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Total Peserta Siswa <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).jml_siswa ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jml_siswa: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 30"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Peserta Laki-laki
          </label>
          <Input
            type="number"
            
            value={(formData as any).jml_laki ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jml_laki: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 15"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Peserta Perempuan
          </label>
          <Input
            type="number"
            
            value={(formData as any).jml_perempuan ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jml_perempuan: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 15"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Peserta Kurikulum 2013
          </label>
          <Input
            
            value={(formData as any).kurikulum_k13 || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kurikulum_k13: e.target.value,
              })
            }
            placeholder="Contoh: 0"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Peserta Kurikulum Merdeka
          </label>
          <Input
            
            value={(formData as any).kurikulum_kurmer || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kurikulum_kurmer: e.target.value,
              })
            }
            placeholder="Contoh: 30"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Dokumen Bukti Kesiapan Asesmen (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen pendukung asesmen"
          />
        </div>
      </form>
    </Modal>
  );
}
