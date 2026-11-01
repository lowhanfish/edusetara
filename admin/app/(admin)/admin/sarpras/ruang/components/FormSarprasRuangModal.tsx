import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormSarprasRuangModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormSarprasRuangModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormSarprasRuangModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Ruang Sekolah"
          : "✎ Edit Ruang Sekolah"
      }
      description="Registrasi ruang belajar, laboratorium, perpustakaan, dan fasilitas penunjang sekolah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-sarpras-ruang" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Ruang Sekolah"
              : "Perbarui Ruang Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-sarpras-ruang" onSubmit={onSubmit} className="space-y-4">
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
            placeholder="Contoh: SDN 5 Andoolo"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Lokasi Gedung / Bangunan
          </label>
          <Input
            
            value={(formData as any).bangunan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                bangunan: e.target.value,
              })
            }
            placeholder="Contoh: Gedung Utama Blok B"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kode Ruang
          </label>
          <Input
            
            value={(formData as any).kode_ruang || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kode_ruang: e.target.value,
              })
            }
            placeholder="Contoh: R-01"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Ruang <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_ruang || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_ruang: e.target.value,
              })
            }
            placeholder="Contoh: Ruang Kelas 1A / Lab Komputer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Panjang (m)
          </label>
          <Input
            type="number"
            
            value={(formData as any).panjang ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                panjang: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 8"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Lebar (m)
          </label>
          <Input
            type="number"
            
            value={(formData as any).lebar ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                lebar: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 7"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kondisi Ruang <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Baik / Rusak Ringan"
          />
        </div>
      </form>
    </Modal>
  );
}
