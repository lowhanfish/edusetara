import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormSekolahPenggerakModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormSekolahPenggerakModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormSekolahPenggerakModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Sekolah Penggerak"
          : "✎ Edit Sekolah Penggerak"
      }
      description="Dokumentasi publikasi program dan kegiatan Program Sekolah Penggerak."
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
            Tajuk / Nama Kegiatan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Lokakarya Komite Pembelajaran"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tujuan Pelaksanaan
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).tujuan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tujuan: e.target.value,
              })
            }
            placeholder="Tujuan kegiatan..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahapan / Proses Kegiatan
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).proses || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                proses: e.target.value,
              })
            }
            placeholder="Rangkaian proses pelaksanaan..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Hasil Capaian Transformasi
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).hasil || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                hasil: e.target.value,
              })
            }
            placeholder="Output dan hasil capaian..."
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
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Foto / Dokumentasi Kegiatan
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah foto kegiatan"
          />
        </div>
      </form>
    </Modal>
  );
}
