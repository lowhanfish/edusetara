import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormKegiatanPengawasModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormKegiatanPengawasModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormKegiatanPengawasModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Kegiatan Pengawas Satdik"
          : "✎ Edit Kegiatan Pengawas Satdik"
      }
      description="Dokumentasi forum pembinaan, rakor korwas, dan workshop kepengawasan satuan pendidikan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-gallery-kegiatan-pengawas" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Kegiatan Pengawas Satdik"
              : "Perbarui Kegiatan Pengawas Satdik"}
          </Button>
        </>
      }
    >
      <form id="form-gallery-kegiatan-pengawas" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tema Pembinaan / Rakor Pengawas <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Rakor Kelompok Kerja Pengawas Sekolah"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Pengawas Satuan Pendidikan
          </label>
          <Input
            
            value={(formData as any).nama_pengawas || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_pengawas: e.target.value,
              })
            }
            placeholder="Nama koordinator pengawas"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Wilayah Satuan Pendidikan Binaan
          </label>
          <Input
            
            value={(formData as any).wilayah_binaan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                wilayah_binaan: e.target.value,
              })
            }
            placeholder="Contoh: Korwas Palangga"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian Diseminasi Kebijakan & Hasil Supervisi
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
            placeholder="Hasil evaluasi..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Dokumentasi Foto Rakor / Kunjungan
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah foto kepengawasan"
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
