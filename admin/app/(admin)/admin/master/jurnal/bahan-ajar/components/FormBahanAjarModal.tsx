import React from "react";
import { Button, Input, Modal, Textarea } from "../../../../../_components/ui";
import { ResponseInterface } from "../types";

interface FormBahanAjarModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormBahanAjarModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormBahanAjarModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Master Bahan Ajar"
          : "✎ Edit Master Bahan Ajar"
      }
      description="Sesuai dokumen Arsitektur Sistem: nama data (title) dan penjelasan singkat (desc)."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-jurnal-bahan-ajar" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Bahan Ajar"
              : "Perbarui Bahan Ajar"}
          </Button>
        </>
      }
    >
      <form id="form-master-jurnal-bahan-ajar" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Metode / Bahan Ajar (title) <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Ceramah/Teori, Diskusi, Praktek, Tugas"
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
            placeholder="Contoh: Metode penyampaian konsep dan prinsip pembelajaran secara terstruktur melalui penjelasan langsung di depan kelas."
          />
        </div>
      </form>
    </Modal>
  );
}
