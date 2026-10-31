import React from "react";
import { Button, Input, Modal, Textarea } from "../../../../_components/ui";
import { ResponseInterface } from "../types";

interface FormModelPembelajaranModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormModelPembelajaranModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormModelPembelajaranModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Master Model Pembelajaran"
          : "✎ Edit Master Model Pembelajaran"
      }
      description="Sesuai dokumen Arsitektur Sistem: nama data (title) dan penjelasan singkat (desc)."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-model-pembelajaran" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Model Pembelajaran"
              : "Perbarui Model Pembelajaran"}
          </Button>
        </>
      }
    >
      <form id="form-master-model-pembelajaran" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Model Pembelajaran (title) <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={formData.title || formData.uraian || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
                uraian: e.target.value,
              })
            }
            placeholder="Contoh: Problem Based Learning (PBL), Project Based Learning (PjBL), Discovery Learning, Inquiry"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Penjelasan Singkat (desc)
          </label>
          <Textarea
            rows={3}
            value={formData.desc || formData.keterangan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                desc: e.target.value,
                keterangan: e.target.value,
              })
            }
            placeholder="Contoh: Model pembelajaran berbasis pemecahan masalah kontekstual yang mengasah daya nalar kritis siswa."
          />
        </div>
      </form>
    </Modal>
  );
}
