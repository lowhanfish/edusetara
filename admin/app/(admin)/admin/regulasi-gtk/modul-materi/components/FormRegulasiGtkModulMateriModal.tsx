import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormRegulasiGtkModulMateriModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRegulasiGtkModulMateriModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRegulasiGtkModulMateriModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Modul dan Materi Pelatihan"
          : "✎ Edit Modul dan Materi Pelatihan"
      }
      description="Repository modul pelatihan, pedoman ajar, dan materi peningkatan kompetensi GTK."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-regulasi-gtk-modul-materi" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Modul dan Materi Pelatihan"
              : "Perbarui Modul dan Materi Pelatihan"}
          </Button>
        </>
      }
    >
      <form id="form-regulasi-gtk-modul-materi" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Judul Modul / Materi Pelatihan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Modul Ajar Diferensiasi Kurikulum Merdeka"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tema / Bidang Pelatihan
          </label>
          <Input
            
            value={(formData as any).tema || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tema: e.target.value,
              })
            }
            placeholder="Contoh: Pedagogik & Numerasi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tim Penyusun / Narasumber
          </label>
          <Input
            
            value={(formData as any).penyusun || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                penyusun: e.target.value,
              })
            }
            placeholder="Contoh: Tim Balai Guru Penggerak"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Terbit
          </label>
          <Input
            
            value={(formData as any).tahun || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahun: e.target.value,
              })
            }
            placeholder="2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Dokumen Modul (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah modul PDF"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tautan Materi / Video Penjelas
          </label>
          <Input
            
            value={(formData as any).link || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                link: e.target.value,
              })
            }
            placeholder="https://..."
          />
        </div>
      </form>
    </Modal>
  );
}
