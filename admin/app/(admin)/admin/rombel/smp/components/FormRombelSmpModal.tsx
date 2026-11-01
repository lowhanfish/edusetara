import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormRombelSmpModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRombelSmpModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRombelSmpModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jenjang SMP"
          : "✎ Edit Jenjang SMP"
      }
      description="Pengelolaan rombongan belajar jenjang Sekolah Menengah Pertama (SMP)."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-rombel-smp" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Jenjang SMP"
              : "Perbarui Jenjang SMP"}
          </Button>
        </>
      }
    >
      <form id="form-rombel-smp" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama SMP <span className="text-rose-500">*</span>
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
            placeholder="Contoh: SMPN 1 Ranomeeto"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Rombel <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_rombel || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_rombel: e.target.value,
              })
            }
            placeholder="Contoh: Kelas VII-A"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tingkat Kelas <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).tingkat || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tingkat: e.target.value,
              })
            }
            placeholder="Contoh: Kelas VII"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kurikulum
          </label>
          <Input
            
            value={(formData as any).kurikulum || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kurikulum: e.target.value,
              })
            }
            placeholder="Contoh: Kurikulum Merdeka"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Wali Kelas
          </label>
          <Input
            
            value={(formData as any).wali_kelas || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                wali_kelas: e.target.value,
              })
            }
            placeholder="Contoh: Sitti Rahma, M.Pd"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Siswa <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).jumlah_siswa ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jumlah_siswa: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 32"
          />
        </div>
      </form>
    </Modal>
  );
}
