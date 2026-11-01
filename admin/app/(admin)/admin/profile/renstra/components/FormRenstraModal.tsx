import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormRenstraModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRenstraModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRenstraModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Renstra (Rencana Strategis)"
          : "✎ Edit Renstra (Rencana Strategis)"
      }
      description="Pengelolaan Rencana Strategis (Renstra) Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-profile-renstra" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Renstra (Rencana Strategis)"
              : "Perbarui Renstra (Rencana Strategis)"}
          </Button>
        </>
      }
    >
      <form id="form-profile-renstra" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian / Ringkasan Renstra <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).isi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                isi: e.target.value,
              })
            }
            placeholder="Masukkan uraian lengkap dokumen rencana strategis dinas..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Dokumen Renstra (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen PDF Renstra"
          />
        </div>
      </form>
    </Modal>
  );
}
