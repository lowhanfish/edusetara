import React from "react";
import { Button, Input, Modal, Textarea } from "../../../../../_components/ui";
import { ResponseInterface } from "../types";

interface FormKelasJurnalModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormKelasJurnalModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormKelasJurnalModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Master Kelas"
          : "✎ Edit Master Kelas"
      }
      description="Sesuai dokumen Arsitektur Sistem: nama data (title) dan penjelasan singkat (desc)."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-jurnal-kelas" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Kelas"
              : "Perbarui Kelas"}
          </Button>
        </>
      }
    >
      <form id="form-master-jurnal-kelas" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama / Tingkat Kelas (title) <span className="text-rose-500">*</span>
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
            placeholder="Contoh: 1, 7, 7A, 8B"
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
            placeholder="Contoh: Rombongan belajar tingkat dasar kelas 1 untuk jenjang pendidikan dasar."
          />
        </div>
      </form>
    </Modal>
  );
}
