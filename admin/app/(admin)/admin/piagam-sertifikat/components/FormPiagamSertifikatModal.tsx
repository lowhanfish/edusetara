import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPiagamSertifikatModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPiagamSertifikatModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPiagamSertifikatModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Piagam Sertifikat"
          : "✎ Edit Piagam Sertifikat"
      }
      description="Pencatatan dan arsip digital piagam penghargaan, bimtek, pelatihan, dan sertifikat kompetensi."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-piagam-sertifikat" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Piagam Sertifikat"
              : "Perbarui Piagam Sertifikat"}
          </Button>
        </>
      }
    >
      <form id="form-piagam-sertifikat" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Pelatihan / Bimtek / Lomba <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).kegiatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kegiatan: e.target.value,
              })
            }
            placeholder="Contoh: Bimtek Kurikulum Merdeka Berkelanjutan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Lembaga / Instansi Penyelenggara <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).penyelenggara || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                penyelenggara: e.target.value,
              })
            }
            placeholder="Contoh: Balai Guru Penggerak Sultra"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Perolehan <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
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
            Lokasi Pelaksanaan
          </label>
          <Input
            
            value={(formData as any).tempat_pelaksana || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tempat_pelaksana: e.target.value,
              })
            }
            placeholder="Contoh: Hotel Claro Kendari"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Peran / Predikat <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).sebagai || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sebagai: e.target.value,
              })
            }
            placeholder="Contoh: Peserta / Narasumber / Juara 1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Digital Sertifikat (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen PDF sertifikat"
          />
        </div>
      </form>
    </Modal>
  );
}
