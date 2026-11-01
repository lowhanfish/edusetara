import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormGalleryKegiatanGuruMgmpModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormGalleryKegiatanGuruMgmpModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormGalleryKegiatanGuruMgmpModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Gallery Kegiatan Guru MGMP"
          : "✎ Edit Gallery Kegiatan Guru MGMP"
      }
      description="Dokumentasi Musyawarah Guru Mata Pelajaran (MGMP) jenjang SMP se-Konawe Selatan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-gallery-kegiatan-guru-mgmp" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Gallery Kegiatan Guru MGMP"
              : "Perbarui Gallery Kegiatan Guru MGMP"}
          </Button>
        </>
      }
    >
      <form id="form-gallery-kegiatan-guru-mgmp" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Kegiatan MGMP <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).judul || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                judul: e.target.value,
              })
            }
            placeholder="Contoh: Pembuatan Media Interaktif IPA SMP"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Mata Pelajaran MGMP <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).mata_pelajaran || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                mata_pelajaran: e.target.value,
              })
            }
            placeholder="Contoh: IPA / Matematika / Bahasa Inggris"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Deskripsi
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).deskripsi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                deskripsi: e.target.value,
              })
            }
            placeholder="Uraian workshop atau diskusi materi ajar..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Foto Dokumentasi
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah foto kegiatan MGMP"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tautan YouTube
          </label>
          <Input
            
            value={(formData as any).link || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                link: e.target.value,
              })
            }
            placeholder="https://youtube.com/..."
          />
        </div>
      </form>
    </Modal>
  );
}
