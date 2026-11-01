import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormBeritaModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormBeritaModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormBeritaModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Manajemen Berita"
          : "✎ Edit Manajemen Berita"
      }
      description="Kelola publikasi warta, liputan kegiatan, dan dokumentasi pendidikan & kebudayaan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-publish-berita" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Manajemen Berita"
              : "Perbarui Manajemen Berita"}
          </Button>
        </>
      }
    >
      <form id="form-publish-berita" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Judul Berita <span className="text-rose-500">*</span>
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
            placeholder="Judul berita aktual dan informatif..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Slug URL
          </label>
          <Input
            
            value={(formData as any).slug || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                slug: e.target.value,
              })
            }
            placeholder="judul-berita-anda"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kategori Berita <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Pendidikan / Kebudayaan / Prestasi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Penulis / Redaksi
          </label>
          <Input
            
            value={(formData as any).author || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                author: e.target.value,
              })
            }
            placeholder="Contoh: Tim Humas Dikbud"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Ringkasan Singkat (Excerpt) <span className="text-rose-500">*</span>
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
            placeholder="Ringkasan 1-2 kalimat untuk beranda..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Isi Lengkap Berita <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).isi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                isi: e.target.value,
              })
            }
            placeholder="Isi naskah berita lengkap..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Foto Sampul Utama
          </label>
          <FileInput
            value={(formData as any).foto || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                foto: fileName,
              })
            }
            helperText="Unggah foto berita (JPG/PNG)"
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

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berita Utama (Featured)
          </label>
          <Input
            
            value={(formData as any).featured || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                featured: e.target.value,
              })
            }
            placeholder="Ya / Tidak"
          />
        </div>
      </form>
    </Modal>
  );
}
