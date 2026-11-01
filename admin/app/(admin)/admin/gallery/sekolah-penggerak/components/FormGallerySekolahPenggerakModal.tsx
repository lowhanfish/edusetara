import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormGallerySekolahPenggerakModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormGallerySekolahPenggerakModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormGallerySekolahPenggerakModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Sekolah Penggerak"
          : "✎ Edit Sekolah Penggerak"
      }
      description="Galeri dokumentasi program Sekolah Penggerak jenjang PAUD, SD, dan SMP."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-gallery-sekolah-penggerak" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Sekolah Penggerak"
              : "Perbarui Sekolah Penggerak"}
          </Button>
        </>
      }
    >
      <form id="form-gallery-sekolah-penggerak" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Judul Dokumentasi <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Lokakarya Komite Pembelajaran Sekolah Penggerak"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Deskripsi <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).deskripsi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                deskripsi: e.target.value,
              })
            }
            placeholder="Uraian kegiatan sekolah penggerak..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Angkatan Program
          </label>
          <Input
            
            value={(formData as any).angkatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                angkatan: e.target.value,
              })
            }
            placeholder="Contoh: Angkatan 1 / 2 / 3"
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
            helperText="Unggah berkas foto kegiatan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tautan Video YouTube
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
