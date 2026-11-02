import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
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
            Nama Lengkap Calon Siswa <span className="text-rose-500">*</span>
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
            placeholder="Nama calon siswa"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NIK Calon Siswa <span className="text-rose-500">*</span>
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
            placeholder="16 digit NIK"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Satuan PAUD / TK Tujuan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: TK Negeri 1 Palangga"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jalur Pendaftaran
          </label>
          <Select
            
            value={(formData as any).jalur ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jalur: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih jalur --" },
              ...[{"value":"Reguler","label":"Jalur Reguler"},{"value":"Afirmasi","label":"Jalur Afirmasi"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Pendaftaran
          </label>
          <Select
            
            value={(formData as any).status ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih status --" },
              ...[{"value":"Diverifikasi","label":"Diverifikasi"},{"value":"Diterima","label":"Diterima"},{"value":"Menunggu","label":"Menunggu"},{"value":"Ditolak","label":"Ditolak"}]
            ]}
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
            helperText="Unggah berkas pendaftaran"
          />
        </div>
      </form>
    </Modal>
  );
}
