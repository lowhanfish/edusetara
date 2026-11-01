import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPublishKebudayaanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPublishKebudayaanModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPublishKebudayaanModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Warisan & Seni Kebudayaan"
          : "✎ Edit Warisan & Seni Kebudayaan"
      }
      description="Data cagar budaya, warisan takbenda, sanggar seni, dan kalender agenda budaya daerah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-publish-kebudayaan" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Warisan & Seni Kebudayaan"
              : "Perbarui Warisan & Seni Kebudayaan"}
          </Button>
        </>
      }
    >
      <form id="form-publish-kebudayaan" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Objek / Warisan Budaya <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama: e.target.value,
              })
            }
            placeholder="Contoh: Tarian Lulo Tolaki / Situs Benteng Kuno"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Klasifikasi Budaya <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).kategori || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kategori: e.target.value,
              })
            }
            placeholder="Contoh: Cagar Budaya / Warisan Takbenda (WBTb) / Sanggar Seni"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Lokasi / Kecamatan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).lokasi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                lokasi: e.target.value,
              })
            }
            placeholder="Contoh: Kecamatan Andoolo"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian Sejarah & Deskripsi <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).deskripsi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                deskripsi: e.target.value,
              })
            }
            placeholder="Penjelasan nilai historis dan pelestarian..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Foto Dokumentasi
          </label>
          <FileInput
            value={(formData as any).foto || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                foto: fileName,
              })
            }
            helperText="Unggah foto cagar budaya / sanggar"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Registrasi <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).status || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            placeholder="Terverifikasi / Dalam Kajian"
          />
        </div>
      </form>
    </Modal>
  );
}
