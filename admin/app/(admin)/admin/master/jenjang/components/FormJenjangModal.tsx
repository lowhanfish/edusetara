import React from "react";
import { Button, Input, Modal } from "../../../../_components/ui";
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
      description="Sesuai kontrak data master_jenjang (uraian, unit_kerja, nip)."
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
            Nama Jenjang Pendidikan (Uraian) <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={formData.uraian || ""}
            onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
            placeholder="Contoh: PAUD / TK, SD (Sekolah Dasar), SMP, PKBM"
          />
          <p className="text-[10px] text-[#9c8e6b] mt-1">
            Deskripsi lengkap jenjang pendidikan yang diakui Dinas Dikbud.
          </p>
        </div>

        {/* Bidang Pembina / Unit Kerja (unit_kerja) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Unit Kerja / Bidang Pembina
          </label>
          <Input
            value={formData.unit_kerja || ""}
            onChange={(e) => setFormData({ ...formData, unit_kerja: e.target.value })}
            placeholder="Contoh: Bidang Pembinaan Sekolah Dasar"
          />
        </div>

        {/* NIP Penanggung Jawab / Pembina (nip) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NIP Penanggung Jawab (Opsional)
          </label>
          <Input
            value={formData.nip || ""}
            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
            placeholder="Contoh: 198208102008011009"
          />
        </div>
      </form>
    </Modal>
  );
}
