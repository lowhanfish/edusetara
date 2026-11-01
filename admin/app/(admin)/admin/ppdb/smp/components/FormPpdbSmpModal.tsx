import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
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
      description="Penerimaan peserta didik baru jenjang Sekolah Menengah Pertama (SMP) 4 jalur."
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
            placeholder="Contoh: Fadhil Muhammad"
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
            placeholder="Contoh: 0098765432"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Asal Satuan Pendidikan SD <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).asal_sekolah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                asal_sekolah: e.target.value,
              })
            }
            placeholder="Contoh: SDN 2 Buke"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            SMP Pilihan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: SMPN 1 Ranomeeto"
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
            placeholder="Contoh: Zonasi / Prestasi / Afirmasi / Mutasi"
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
            placeholder="Contoh: Diterima / Cadangan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Rapor & Piagam (PDF)
          </label>
          <FileInput
            value={(formData as any).file_berkas || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_berkas: fileName,
              })
            }
            helperText="Unggah gabungan berkas pendaftaran (PDF)"
          />
        </div>
      </form>
    </Modal>
  );
}
