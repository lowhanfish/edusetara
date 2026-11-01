import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormVerifikasiRekonsiliasiBospModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormVerifikasiRekonsiliasiBospModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormVerifikasiRekonsiliasiBospModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Verifikasi Usulan Rekonsiliasi Dana BOSP"
          : "✎ Edit Verifikasi Usulan Rekonsiliasi Dana BOSP"
      }
      description="Validasi kepatuhan pembukuan, faktur belanja, dan setoran pajak dana BOSP sekolah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-verifikasi-rekonsiliasi-bosp" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Verifikasi Usulan Rekonsiliasi Dana BOSP"
              : "Perbarui Verifikasi Usulan Rekonsiliasi Dana BOSP"}
          </Button>
        </>
      }
    >
      <form id="form-verifikasi-rekonsiliasi-bosp" onSubmit={onSubmit} className="space-y-4">
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
            Tahap BOSP <span className="text-rose-500">*</span>
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
            Tahun Anggaran <span className="text-rose-500">*</span>
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
            Nominal Disetujui (Rp) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).nominal_disetujui ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nominal_disetujui: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 95000000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Rekonsiliasi <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).status_verifikasi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status_verifikasi: e.target.value,
              })
            }
            placeholder="Contoh: Rekonsiliasi Selesai / Siap BA / Belum Lengkap"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Catatan Tim Verifikasi BOSP
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).catatan_verifikator || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                catatan_verifikator: e.target.value,
              })
            }
            placeholder="Catatan kesesuaian berkas pajak dan BKU..."
          />
        </div>
      </form>
    </Modal>
  );
}
