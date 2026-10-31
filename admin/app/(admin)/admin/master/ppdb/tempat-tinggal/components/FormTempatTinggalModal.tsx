import React from "react";
import { Button, Input, Modal, Textarea } from "../../../../../_components/ui";
import { ResponseInterface } from "../types";

interface FormTempatTinggalModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormTempatTinggalModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormTempatTinggalModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Master Tempat Tinggal"
          : "✎ Edit Master Tempat Tinggal"
      }
      description="Sesuai dokumen Arsitektur Sistem: nama data (title) dan penjelasan singkat (desc)."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-ppdb-tempat-tinggal" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Tempat Tinggal"
              : "Perbarui Tempat Tinggal"}
          </Button>
        </>
      }
    >
      <form id="form-master-ppdb-tempat-tinggal" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Tempat Tinggal (title) <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Bersama Orang Tua, Wali, Kos, Asrama"
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
            placeholder="Contoh: Calon peserta didik berdomisili tetap di rumah bersama orang tua kandung."
          />
        </div>
      </form>
    </Modal>
  );
}
