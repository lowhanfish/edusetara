import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormRegulasiModulMateriModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRegulasiModulMateriModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRegulasiModulMateriModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Modul dan Materi Pelatihan"
          : "✎ Edit Modul dan Materi Pelatihan"
      }
      description="Repositori bahan ajar, modul pelatihan bimtek, dan instrumen Kurikulum Merdeka."
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
            Judul Modul / Bahan Ajar <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Panduan Asesmen dan Pembelajaran KSP Konsel"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tema / Bidang Studi <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).tema || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tema: e.target.value,
              })
            }
            placeholder="Contoh: Kurikulum Merdeka / Literasi Numerasi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Penyusun / Tim Pengembang
          </label>
          <Input
            
            value={(formData as any).penyusun || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                penyusun: e.target.value,
              })
            }
            placeholder="Contoh: Tim Pengembang Kurikulum Dikbud Konsel"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Terbit
          </label>
          <Input
            type="number"
            
            value={(formData as any).tahun ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahun: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Modul PDF
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah berkas modul digital (PDF)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tautan Sumber Drive
          </label>
          <Input
            
            value={(formData as any).link || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                link: e.target.value,
              })
            }
            placeholder="https://drive.google.com/..."
          />
        </div>
      </form>
    </Modal>
  );
}
