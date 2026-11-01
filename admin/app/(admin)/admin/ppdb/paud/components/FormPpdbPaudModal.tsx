import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPpdbPaudModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPpdbPaudModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPpdbPaudModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah PPDB PAUD"
          : "✎ Edit PPDB PAUD"
      }
      description="Pendaftaran peserta didik baru jenjang PAUD dan Taman Kanak-Kanak."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-ppdb-paud" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan PPDB PAUD"
              : "Perbarui PPDB PAUD"}
          </Button>
        </>
      }
    >
      <form id="form-ppdb-paud" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Calon Murid <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Muhammad Farhan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NIK Calon Murid <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nik || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nik: e.target.value,
              })
            }
            placeholder="Contoh: 740501..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Satuan PAUD Pilihan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).sekolah_tujuan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sekolah_tujuan: e.target.value,
              })
            }
            placeholder="Contoh: TK Negeri Pembina Konsel"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jalur Pendaftaran <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).jalur || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jalur: e.target.value,
              })
            }
            placeholder="Contoh: Domisili / Afirmasi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Verifikasi <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Diterima / Diproses"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Akta / KK (PDF/Gambar)
          </label>
          <FileInput
            value={(formData as any).file_berkas || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_berkas: fileName,
              })
            }
            helperText="Unggah dokumen KK dan akta kelahiran"
          />
        </div>
      </form>
    </Modal>
  );
}
