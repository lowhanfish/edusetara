import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormRombelPaudModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRombelPaudModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRombelPaudModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jenjang PAUD"
          : "✎ Edit Jenjang PAUD"
      }
      description="Pengelolaan rombongan belajar dan kelompok usia jenjang PAUD/TK se-Konawe Selatan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-rombel-paud" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Jenjang PAUD"
              : "Perbarui Jenjang PAUD"}
          </Button>
        </>
      }
    >
      <form id="form-rombel-paud" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Satuan PAUD / TK <span className="text-rose-500">*</span>
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
            placeholder="Contoh: TK Pembina Andoolo"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Rombongan Belajar <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Kelompok A Bintang Kecil"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tingkat / Usia
          </label>
          <Input
            
            value={(formData as any).tingkat || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tingkat: e.target.value,
              })
            }
            placeholder="Contoh: Usia 4-5 Tahun"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kurikulum Operasional
          </label>
          <Input
            
            value={(formData as any).kurikulum || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kurikulum: e.target.value,
              })
            }
            placeholder="Contoh: Kurikulum Merdeka PAUD"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Guru Pendamping / Wali
          </label>
          <Input
            
            value={(formData as any).wali_kelas || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                wali_kelas: e.target.value,
              })
            }
            placeholder="Contoh: Hj. Nurlela, S.Pd"
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
            placeholder="Contoh: 18"
          />
        </div>
      </form>
    </Modal>
  );
}
