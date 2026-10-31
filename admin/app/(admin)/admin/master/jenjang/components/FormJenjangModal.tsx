import React from "react";
import { Button, Input, Modal, Textarea } from "../../../../_components/ui";
import { ResponseInterface } from "../types";

interface FormJenjangModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormJenjangModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormJenjangModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Master Jenjang Pendidikan"
          : "✎ Edit Master Jenjang Pendidikan"
      }
      description="Sesuai dokumen Arsitektur Sistem: nama jenjang (title) dan penjelasan singkat jenjang (desc)."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-jenjang" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Jenjang"
              : "Perbarui Jenjang"}
          </Button>
        </>
      }
    >
      <form id="form-master-jenjang" onSubmit={onSubmit} className="space-y-4">
        {/* Nama Jenjang (title) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Jenjang (title) <span className="text-rose-500">*</span>
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
            placeholder="Contoh: 1, 6, 7, 9 (Tingkat Jenjang Pendidikan)"
          />
          <p className="text-[10px] text-[#9c8e6b] mt-1">
            Tingkatan jenjang pendidikan dasar hingga menengah pertama (misal: 1 s/d 9).
          </p>
        </div>

        {/* Penjelasan Singkat Jenjang (desc) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Penjelasan Singkat Jenjang (desc)
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
            placeholder="Contoh: Tingkatan jenjang awal kelas 1 pada jenjang Sekolah Dasar (SD)."
          />
        </div>
      </form>
    </Modal>
  );
}
