import React from "react";
import { Button, Input, Modal, Textarea } from "../../../../_components/ui";
import { ResponseInterface } from "../types";

interface FormBkKegiatanLayananModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormBkKegiatanLayananModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormBkKegiatanLayananModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Master BK Kegiatan Layanan"
          : "✎ Edit Master BK Kegiatan Layanan"
      }
      description="Sesuai dokumen Arsitektur Sistem: nama data (title) dan penjelasan singkat (desc)."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-bk-kegiatan-layanan" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan BK Kegiatan Layanan"
              : "Perbarui BK Kegiatan Layanan"}
          </Button>
        </>
      }
    >
      <form id="form-master-bk-kegiatan-layanan" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Bentuk Kegiatan Layanan BK (title) <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={formData.title || formData.uraian || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
                uraian: e.target.value,
              })
            }
            placeholder="Contoh: Konseling Individu, Konseling Kelompok, Home Visit, Alih Tangan Kasus"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Penjelasan Singkat (desc)
          </label>
          <Textarea
            rows={3}
            value={formData.desc || formData.keterangan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                desc: e.target.value,
                keterangan: e.target.value,
              })
            }
            placeholder="Contoh: Kunjungan langsung guru BK ke tempat tinggal siswa guna koordinasi dengan orang tua."
          />
        </div>
      </form>
    </Modal>
  );
}
