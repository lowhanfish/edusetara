import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormTugasFungsiModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormTugasFungsiModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormTugasFungsiModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Tugas dan Fungsi"
          : "✎ Edit Tugas dan Fungsi"
      }
      description="Pengelolaan Tugas Pokok dan Fungsi (Tupoksi) Dinas Pendidikan dan Kebudayaan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-profile-tugas-fungsi" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Tugas dan Fungsi"
              : "Perbarui Tugas dan Fungsi"}
          </Button>
        </>
      }
    >
      <form id="form-profile-tugas-fungsi" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tugas Pokok <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).tugas || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tugas: e.target.value,
              })
            }
            placeholder="Uraian tugas pokok instansi..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Rincian Fungsi <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).fungsi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                fungsi: e.target.value,
              })
            }
            placeholder="Uraian rincian fungsi instansi..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Lampiran Perbup/SK (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah berkas tupoksi (PDF)"
          />
        </div>
      </form>
    </Modal>
  );
}
