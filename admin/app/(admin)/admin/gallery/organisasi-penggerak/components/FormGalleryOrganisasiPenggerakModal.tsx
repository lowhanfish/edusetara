import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormGalleryOrganisasiPenggerakModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormGalleryOrganisasiPenggerakModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormGalleryOrganisasiPenggerakModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Gallery Program Organisasi Penggerak"
          : "✎ Edit Gallery Program Organisasi Penggerak"
      }
      description="Dokumentasi kolaborasi program Ormas/NGO mitra Kemendikbud di Konsel."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-gallery-organisasi-penggerak" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Gallery Program Organisasi Penggerak"
              : "Perbarui Gallery Program Organisasi Penggerak"}
          </Button>
        </>
      }
    >
      <form id="form-gallery-organisasi-penggerak" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Kegiatan Kemitraan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Pelatihan Literasi Numerasi Kelas Awal"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Organisasi Penggerak <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_organisasi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_organisasi: e.target.value,
              })
            }
            placeholder="Contoh: Yayasan Literasi Anak Nusantara"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Fokus Kegiatan
          </label>
          <Input
            
            value={(formData as any).kegiatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kegiatan: e.target.value,
              })
            }
            placeholder="Contoh: Peningkatan Kemampuan Membaca Dasar"
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
            placeholder="Uraian kegiatan kemitraan..."
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
            helperText="Unggah foto dokumentasi"
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
