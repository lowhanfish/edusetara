import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormKegiatanKkgSdModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormKegiatanKkgSdModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormKegiatanKkgSdModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Kegiatan KKG SD"
          : "✎ Edit Kegiatan KKG SD"
      }
      description="Dokumentasi forum Kelompok Kerja Guru Sekolah Dasar (KKG SD) tingkat gugus/kecamatan."
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
              ? "Simpan Kegiatan KKG SD"
              : "Perbarui Kegiatan KKG SD"}
          </Button>
        </>
      }
    >
      <form id="form-gallery-kegiatan-kkg-sd" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Agenda / Topik KKG SD <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Bedah CP dan Penyusunan ATP Fase C"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Gugus / Kecamatan
          </label>
          <Input
            
            value={(formData as any).gugus || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                gugus: e.target.value,
              })
            }
            placeholder="Contoh: Gugus I Buke"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Materi Pembahasan Bersama
          </label>
          <Input
            
            value={(formData as any).materi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                materi: e.target.value,
              })
            }
            placeholder="Contoh: Modul Ajar Matematika"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Deskripsi Pelaksanaan
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
            placeholder="Uraian diskusi & hasil rekomendasi..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Foto Dokumentasi KKG
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah foto KKG"
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
      </form>
    </Modal>
  );
}
