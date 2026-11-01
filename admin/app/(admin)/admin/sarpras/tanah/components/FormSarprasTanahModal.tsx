import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormSarprasTanahModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormSarprasTanahModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormSarprasTanahModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Tanah Sekolah"
          : "✎ Edit Tanah Sekolah"
      }
      description="Pangkalan data kepemilikan dan legalitas lahan tanah seluruh satuan pendidikan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-sarpras-tanah" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Tanah Sekolah"
              : "Perbarui Tanah Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-sarpras-tanah" onSubmit={onSubmit} className="space-y-4">
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
            placeholder="Contoh: SDN 1 Ranomeeto"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenis / Peruntukan Lahan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).jenis || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenis: e.target.value,
              })
            }
            placeholder="Contoh: Bangunan Sekolah & Lapangan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Luas Tanah (m²) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).luas ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                luas: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 5000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Luas Lahan Tersedia (m²)
          </label>
          <Input
            type="number"
            
            value={(formData as any).luas_lahan_tersedia ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                luas_lahan_tersedia: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 1500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Kepemilikan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).kepemilikan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kepemilikan: e.target.value,
              })
            }
            placeholder="Contoh: Milik Pemerintah Daerah / Hibah"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Bukti Kepemilikan
          </label>
          <Input
            
            value={(formData as any).bukti_kepemilikan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                bukti_kepemilikan: e.target.value,
              })
            }
            placeholder="Contoh: Sertifikat Hak Pakai / Akta Hibah"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nomor Sertifikat
          </label>
          <Input
            
            value={(formData as any).nomor_sertifikat || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nomor_sertifikat: e.target.value,
              })
            }
            placeholder="Contoh: No. 21.05.01..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Alamat / Lokasi Lahan
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).alamat || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                alamat: e.target.value,
              })
            }
            placeholder="Alamat lengkap tanah sekolah..."
          />
        </div>
      </form>
    </Modal>
  );
}
