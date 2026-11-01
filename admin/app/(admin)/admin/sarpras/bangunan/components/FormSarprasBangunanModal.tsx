import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormSarprasBangunanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormSarprasBangunanModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormSarprasBangunanModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Bangunan Sekolah"
          : "✎ Edit Bangunan Sekolah"
      }
      description="Pendataan gedung, konstruksi fisik, dan kelaikan bangunan satuan pendidikan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-sarpras-bangunan" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Bangunan Sekolah"
              : "Perbarui Bangunan Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-sarpras-bangunan" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Satuan Pendidikan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: SMPN 2 Konsel"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Gedung / Bangunan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_bangunan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_bangunan: e.target.value,
              })
            }
            placeholder="Contoh: Gedung Kelas Utama A"
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
            placeholder="Contoh: 30"
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
            placeholder="Contoh: 9"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Luas Tapak (m²)
          </label>
          <Input
            type="number"
            
            value={(formData as any).luas_tapak ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                luas_tapak: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 270"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Lantai
          </label>
          <Input
            type="number"
            
            value={(formData as any).jumlah_lantai ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jumlah_lantai: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Kepemilikan
          </label>
          <Input
            
            value={(formData as any).kepemilikan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kepemilikan: e.target.value,
              })
            }
            placeholder="Contoh: Milik Sendiri"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kondisi Bangunan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Baik / Rusak Sedang / Rusak Berat"
          />
        </div>
      </form>
    </Modal>
  );
}
