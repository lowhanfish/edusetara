import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPublishLayananModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPublishLayananModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPublishLayananModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Katalog Layanan Publik"
          : "✎ Edit Katalog Layanan Publik"
      }
      description="Standar operasional prosedur (SOP) dan persyaratan pelayanan administrasi dinas."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-publish-layanan" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Katalog Layanan Publik"
              : "Perbarui Katalog Layanan Publik"}
          </Button>
        </>
      }
    >
      <form id="form-publish-layanan" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Layanan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_layanan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_layanan: e.target.value,
              })
            }
            placeholder="Contoh: Legalisir Ijazah / Mutasi Siswa / Rekomendasi Izin Operasional"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Deskripsi Singkat Layanan <span className="text-rose-500">*</span>
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
            placeholder="Penjelasan umum mengenai layanan..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Persyaratan Berkas <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).syarat || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                syarat: e.target.value,
              })
            }
            placeholder="Daftar syarat kelengkapan dokumen..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Alur & Estimasi Waktu
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).prosedur || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                prosedur: e.target.value,
              })
            }
            placeholder="Contoh: 1 Hari Kerja - Tanpa Biaya (Gratis)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Seksi / Bidang Pelaksana
          </label>
          <Input
            
            value={(formData as any).penanggung_jawab || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                penanggung_jawab: e.target.value,
              })
            }
            placeholder="Contoh: Subbag Umum & Kepegawaian"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Layanan <span className="text-rose-500">*</span>
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
            placeholder="Aktif / Pemeliharaan"
          />
        </div>
      </form>
    </Modal>
  );
}
