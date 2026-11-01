import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormGalleryKegiatanKkgSdModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormGalleryKegiatanKkgSdModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormGalleryKegiatanKkgSdModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Gallery Kegiatan KKG SD"
          : "✎ Edit Gallery Kegiatan KKG SD"
      }
      description="Dokumentasi aktivitas Kelompok Kerja Guru (KKG) jenjang Sekolah Dasar se-Konsel."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-gallery-kegiatan-kkg-sd" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Gallery Kegiatan KKG SD"
              : "Perbarui Gallery Kegiatan KKG SD"}
          </Button>
        </>
      }
    >
      <form id="form-gallery-kegiatan-kkg-sd" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Kegiatan KKG <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Penyusunan Modul Ajar Berdiferensiasi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Gugus / Wilayah KKG <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).gugus || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                gugus: e.target.value,
              })
            }
            placeholder="Contoh: Gugus 2 Ranomeeto"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Materi / Topik Pelatihan
          </label>
          <Input
            
            value={(formData as any).materi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                materi: e.target.value,
              })
            }
            placeholder="Contoh: Asesmen Diagnostik Awal"
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
            placeholder="Uraian jalannya pertemuan KKG..."
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
            helperText="Unggah foto kegiatan KKG"
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
