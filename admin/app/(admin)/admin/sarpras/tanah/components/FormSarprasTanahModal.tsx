import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormSarprasTanahModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormSarprasTanahModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormSarprasTanahModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Tanah Sekolah"
          : "✎ Edit Tanah Sekolah"
      }
      description="Pangkalan data kepemilikan dan legalitas bidang lahan tanah satuan pendidikan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-sarpras-tanah" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Tanah Sekolah"
              : "Perbarui Tanah Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-sarpras-tanah" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Luas Tanah Sekolah <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).title || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            placeholder="Contoh: 3.300 m² atau 1,19 ha"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Bukti Kepemilikan / Sertifikat Tanah (PDF/Gambar)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah bukti kepemilikan/sertifikat tanah"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tipe Berkas (pdf/jpg/png)
          </label>
          <Input
            
            value={(formData as any).file_type || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                file_type: e.target.value,
              })
            }
            placeholder="pdf / jpg / png"
          />
        </div>
      </form>
    </Modal>
  );
}
