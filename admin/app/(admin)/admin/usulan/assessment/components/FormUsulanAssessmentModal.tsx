import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
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
      description="Pendataan kesiapan dan usulan Asesmen Nasional Berbasis Komputer (ANBK) satuan pendidikan."
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
            Nama Satuan Pendidikan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).sekolah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sekolah: e.target.value,
              })
            }
            placeholder="Contoh: SDN 8 Moramo"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Pelaksanaan <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).tahun ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahun: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Moda & Jenis Asesmen <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).jenis_asesmen || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenis_asesmen: e.target.value,
              })
            }
            placeholder="Contoh: ANBK Mandiri Online / Menumpang"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Peserta Didik <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).jumlah_peserta ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jumlah_peserta: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 30"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Kesiapan
          </label>
          <Input
            
            value={(formData as any).status || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            placeholder="Contoh: Siap Mandiri / Perlu Tambahan Server"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas SPTJM / Berita Acara
          </label>
          <FileInput
            value={(formData as any).dokumen || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                dokumen: fileName,
              })
            }
            helperText="Unggah berkas kesiapan (PDF)"
          />
        </div>
      </form>
    </Modal>
  );
}
