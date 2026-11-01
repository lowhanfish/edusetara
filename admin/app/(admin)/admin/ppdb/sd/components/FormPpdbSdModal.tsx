import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPpdbSdModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPpdbSdModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPpdbSdModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah PPDB SD"
          : "✎ Edit PPDB SD"
      }
      description="Sistem seleksi dan registrasi peserta didik baru jenjang Sekolah Dasar (SD)."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-ppdb-sd" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan PPDB SD"
              : "Perbarui PPDB SD"}
          </Button>
        </>
      }
    >
      <form id="form-ppdb-sd" onSubmit={onSubmit} className="space-y-4">
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
            placeholder="Contoh: Anisa Rahmawati"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NIK <span className="text-rose-500">*</span>
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
            placeholder="Contoh: 7405..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NISN (Jika Ada)
          </label>
          <Input
            
            value={(formData as any).nisn || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nisn: e.target.value,
              })
            }
            placeholder="Contoh: 0123456789"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            SD Negeri Pilihan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: SDN 1 Ranomeeto"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jalur Seleksi <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Zonasi / Afirmasi / Perpindahan Tugas"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Seleksi <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Diterima / Menunggu Pengumuman"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Pendaftaran (PDF)
          </label>
          <FileInput
            value={(formData as any).file_berkas || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_berkas: fileName,
              })
            }
            helperText="Unggah berkas KK / Akta"
          />
        </div>
      </form>
    </Modal>
  );
}
