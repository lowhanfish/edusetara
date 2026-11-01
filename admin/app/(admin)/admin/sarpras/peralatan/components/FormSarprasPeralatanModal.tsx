import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormSarprasPeralatanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormSarprasPeralatanModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormSarprasPeralatanModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Peralatan / Aset"
          : "✎ Edit Peralatan / Aset"
      }
      description="Inventarisasi peralatan TIK, perabot kelas, laboratorium, dan sarana multimedia."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-sarpras-peralatan" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Peralatan / Aset"
              : "Perbarui Peralatan / Aset"}
          </Button>
        </>
      }
    >
      <form id="form-sarpras-peralatan" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Satuan Pendidikan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).sekolah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sekolah: e.target.value,
              })
            }
            placeholder="Contoh: SMPN 1 Kolono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Peralatan / Aset <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_alat || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_alat: e.target.value,
              })
            }
            placeholder="Contoh: Chromebook DAK / Proyektor"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kode Barang / NUP
          </label>
          <Input
            
            value={(formData as any).kode_alat || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kode_alat: e.target.value,
              })
            }
            placeholder="Contoh: TIK-2026-001"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Spesifikasi / Merk
          </label>
          <Input
            
            value={(formData as any).spesifikasi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                spesifikasi: e.target.value,
              })
            }
            placeholder="Contoh: Core i3 / RAM 8GB / Asus"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Unit <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).jumlah ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jumlah: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 15"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kondisi <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).kondisi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kondisi: e.target.value,
              })
            }
            placeholder="Contoh: Baik / Rusak Ringan / Rusak Berat"
          />
        </div>
      </form>
    </Modal>
  );
}
