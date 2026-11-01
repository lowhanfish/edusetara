import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPipDataPendukungModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPipDataPendukungModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPipDataPendukungModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Data Pendukung"
          : "✎ Edit Data Pendukung"
      }
      description="Arsip berkas SKTM, DTKS, dan dokumen pendukung usulan Program Indonesia Pintar."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-usulan-pip-data-pendukung" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Data Pendukung"
              : "Perbarui Data Pendukung"}
          </Button>
        </>
      }
    >
      <form id="form-usulan-pip-data-pendukung" onSubmit={onSubmit} className="space-y-4">
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
            placeholder="Contoh: SDN 3 Konda"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Siswa <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Muhammad Rezki"
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
            Nama / Jenis Dokumen <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).dokumen || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                dokumen: e.target.value,
              })
            }
            placeholder="Contoh: Kartu KIP / SKTM Desa"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Scan (PDF / Image)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah scan berkas dokumen"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Keterangan
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).keterangan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                keterangan: e.target.value,
              })
            }
            placeholder="Keterangan tambahan kelayakan..."
          />
        </div>
      </form>
    </Modal>
  );
}
