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
      description="Kelola nama jenjang pendidikan (uraian) dan keterangan sesuai basis data master_jenjang."
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
        {/* Nama Jenjang Pendidikan (uraian) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian Jenjang Pendidikan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={formData.uraian || ""}
            onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
            placeholder="Contoh: PAUD / TK, SD, SMP, PKBM"
          />
          <p className="text-[10px] text-[#9c8e6b] mt-1">
            Label deskriptor jenjang pendidikan (field uraian).
          </p>
        </div>

        {/* Keterangan (keterangan) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Keterangan
          </label>
          <Textarea
            rows={3}
            value={formData.keterangan || ""}
            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
            placeholder="Tambahkan catatan atau keterangan jenjang bila diperlukan..."
          />
        </div>
      </form>
    </Modal>
  );
}
