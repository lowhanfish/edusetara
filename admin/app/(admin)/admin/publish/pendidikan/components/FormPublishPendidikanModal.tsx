import React from "react";
import { Button, Input, Modal, FileInput, RichTextEditor } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPublishPendidikanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPublishPendidikanModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPublishPendidikanModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Informasi & Artikel Pendidikan"
          : "✎ Edit Informasi & Artikel Pendidikan"
      }
      description="Katalog konten literasi, kurikulum, dan informasi program pendidikan."
      maxWidth="3xl"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-publish-pendidikan" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Informasi & Artikel Pendidikan"
              : "Perbarui Informasi & Artikel Pendidikan"}
          </Button>
        </>
      }
    >
      <form id="form-publish-pendidikan" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Judul Artikel / Informasi <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Optimalisasi Asesmen Formatif Guru Kelas"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kategori Info <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).kategori || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kategori: e.target.value,
              })
            }
            placeholder="Contoh: Kurikulum Merdeka / Literasi / Numerasi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Penulis
          </label>
          <Input
            
            value={(formData as any).penulis || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                penulis: e.target.value,
              })
            }
            placeholder="Contoh: Bidang Pembinaan Dikdas"
          />
        </div>

        <div>
          <RichTextEditor
            label="Uraian Konten Edukasi"
            required
            value={(formData as any).konten || ""}
            onChange={(html) =>
              setFormData({
                ...formData,
                konten: html,
              })
            }
            placeholder="Tulis materi artikel edukasi, silabus, atau pedoman secara terstruktur..."
            minHeight={240}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Foto / Poster Edukasi
          </label>
          <FileInput
            module="pendidikan"
            value={(formData as any).file || ""}
            onChange={(fileUrl, file) =>
              setFormData({
                ...formData,
                file: file || fileUrl,
              })
            }
            helperText="Unggah gambar atau poster pendukung materi (JPG/PNG/WEBP)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Publikasi <span className="text-rose-500">*</span>
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
            placeholder="Terbit / Draft"
          />
        </div>
      </form>
    </Modal>
  );
}
