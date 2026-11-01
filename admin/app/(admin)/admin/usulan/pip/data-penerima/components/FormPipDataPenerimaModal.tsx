import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPipDataPenerimaModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPipDataPenerimaModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPipDataPenerimaModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Data Penerima"
          : "✎ Edit Data Penerima"
      }
      description="Daftar penerima alokasi dana bantuan Program Indonesia Pintar (PIP)."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-usulan-pip-data-penerima" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Data Penerima"
              : "Perbarui Data Penerima"}
          </Button>
        </>
      }
    >
      <form id="form-usulan-pip-data-penerima" onSubmit={onSubmit} className="space-y-4">
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
            placeholder="Contoh: SMPN 5 Konsel"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Siswa Penerima <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_siswa || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_siswa: e.target.value,
              })
            }
            placeholder="Contoh: Dewi Lestari"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NISN <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nisn || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nisn: e.target.value,
              })
            }
            placeholder="Contoh: 0081234567"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Penyaluran <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).tahun ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahun: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahap Penyaluran <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).tahap || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahap: e.target.value,
              })
            }
            placeholder="Contoh: Tahap 1 / Tahap 2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nominal Bantuan (Rp) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).nominal ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nominal: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 750000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Penyaluran <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).status_penyaluran || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status_penyaluran: e.target.value,
              })
            }
            placeholder="Contoh: Sudah Dicairkan / Siap Aktivasi"
          />
        </div>
      </form>
    </Modal>
  );
}
