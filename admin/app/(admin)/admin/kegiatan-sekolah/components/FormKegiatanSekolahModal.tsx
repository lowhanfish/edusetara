import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormKegiatanSekolahModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormKegiatanSekolahModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormKegiatanSekolahModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Kegiatan Sekolah"
          : "✎ Edit Kegiatan Sekolah"
      }
      description="Dokumentasi dan pelaporan aktivitas belajar, ekstrakurikuler, workshop, dan hari besar sekolah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-kegiatan-sekolah" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Kegiatan Sekolah"
              : "Perbarui Kegiatan Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-kegiatan-sekolah" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama / Tajuk Kegiatan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_kegiatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_kegiatan: e.target.value,
              })
            }
            placeholder="Contoh: Upacara Hardiknas & Pentas Seni"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Deskripsi Lengkap Kegiatan <span className="text-rose-500">*</span>
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
            placeholder="Uraian jalannya kegiatan..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tanggal Pelaksanaan <span className="text-rose-500">*</span>
          </label>
          <Input
            type="date"
            required
            value={(formData as any).tgl_kegiatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tgl_kegiatan: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Foto Banner / Dokumentasi
          </label>
          <FileInput
            value={(formData as any).foto || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                foto: fileName,
              })
            }
            helperText="Unggah foto kegiatan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tautan Video YouTube Kegiatan
          </label>
          <Input
            
            value={(formData as any).link_youtube || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                link_youtube: e.target.value,
              })
            }
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      </form>
    </Modal>
  );
}
