import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormPpdbSmpModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPpdbSmpModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPpdbSmpModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah PPDB SMP"
          : "✎ Edit PPDB SMP"
      }
      description="Pendaftaran peserta didik baru jenjang SMP jalur zonasi, afirmasi, mutasi, dan prestasi."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-ppdb-smp" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan PPDB SMP"
              : "Perbarui PPDB SMP"}
          </Button>
        </>
      }
    >
      <form id="form-ppdb-smp" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Calon Siswa <span className="text-rose-500">*</span>
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
            placeholder="10 digit NISN"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Asal Sekolah Dasar
          </label>
          <Input
            
            value={(formData as any).asal_sekolah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                asal_sekolah: e.target.value,
              })
            }
            placeholder="Nama SD asal"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            SMP Negeri Tujuan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: SMPN 22 Konawe Selatan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jalur Pendaftaran PPDB <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).jalur ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jalur: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih jalur --" },
              ...[{"value":"Zonasi","label":"Jalur Zonasi"},{"value":"Afirmasi","label":"Jalur Afirmasi"},{"value":"Prestasi","label":"Jalur Prestasi Akademik/Non-Akademik"},{"value":"Mutasi","label":"Jalur Perpindahan Tugas Orang Tua"}]
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
            Berkas Lampiran Nilai / Sertifikat (PDF)
          </label>
          <FileInput
            value={(formData as any).file_berkas || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_berkas: fileName,
              })
            }
            helperText="Unggah dokumen lampiran"
          />
        </div>
      </form>
    </Modal>
  );
}
