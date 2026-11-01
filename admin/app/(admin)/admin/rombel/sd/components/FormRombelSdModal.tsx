import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormRombelSdModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRombelSdModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRombelSdModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jenjang SD"
          : "✎ Edit Jenjang SD"
      }
      description="Pengelolaan rombongan belajar jenjang Sekolah Dasar (SD) se-Kabupaten Konawe Selatan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-rombel-sd" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Jenjang SD"
              : "Perbarui Jenjang SD"}
          </Button>
        </>
      }
    >
      <form id="form-rombel-sd" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Satuan Pendidikan SD <span className="text-rose-500">*</span>
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
            placeholder="Contoh: SDN 2 Buke"
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
            placeholder="Contoh: Kelas 4 Amanah"
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
            placeholder="Contoh: Kelas 4"
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
            Guru Kelas / Wali
          </label>
          <Input
            
            value={(formData as any).wali_kelas || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                wali_kelas: e.target.value,
              })
            }
            placeholder="Contoh: Ahmad Fauzi, S.Pd"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Peserta Didik <span className="text-rose-500">*</span>
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
            placeholder="Contoh: 28"
          />
        </div>
      </form>
    </Modal>
  );
}
