import React from "react";
import { Button, Input, Modal, Textarea } from "../../../../../_components/ui";
import { ResponseInterface } from "../types";

interface FormTriwulanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormTriwulanModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormTriwulanModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Master Triwulan Usulan"
          : "✎ Edit Master Triwulan Usulan"
      }
      description="Sesuai dokumen Arsitektur Sistem: nama periodisasi (title) dan penjelasan singkat (desc)."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-triwulan" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Triwulan"
              : "Perbarui Triwulan"}
          </Button>
        </>
      }
    >
      <form id="form-master-triwulan" onSubmit={onSubmit} className="space-y-4">
        {/* Nama Periodisasi (title) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Periodisasi (title) <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Triwulan I (Januari - Maret)"
          />
          <p className="text-[10px] text-[#9c8e6b] mt-1">
            Jadwal periodisasi pencairan tunjangan per 3 bulan sekali.
          </p>
        </div>

        {/* Penjelasan Singkat (desc) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Penjelasan Singkat Periodisasi (desc)
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
            placeholder="Contoh: Periode pembayaran untuk bulan Januari, Februari, dan Maret. Pencairan dimulai sekitar bulan Maret."
          />
        </div>
      </form>
    </Modal>
  );
}
