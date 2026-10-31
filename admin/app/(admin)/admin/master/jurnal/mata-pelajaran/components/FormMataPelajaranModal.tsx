import React from "react";
import { Button, Input, Modal, Textarea } from "../../../../../_components/ui";
import { ResponseInterface } from "../types";
import { useKelasOption } from "../hooks/crud";

interface FormMataPelajaranModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormMataPelajaranModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormMataPelajaranModalProps) {
  const { options: kelasOptions, isLoading: isKelasLoading } = useKelasOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Master Mata Pelajaran"
          : "✎ Edit Master Mata Pelajaran"
      }
      description="Sesuai dokumen Arsitektur Sistem: pilih tingkat kelas (kelas_id), nama mata pelajaran (title), dan keterangan (desc)."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-mata-pelajaran" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Mata Pelajaran"
              : "Perbarui Mata Pelajaran"}
          </Button>
        </>
      }
    >
      <form id="form-master-mata-pelajaran" onSubmit={onSubmit} className="space-y-4">
        {/* Tingkat Kelas (kelas_id) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tingkat Kelas (kelas_id) <span className="text-rose-500">*</span>
          </label>
          <select
            required
            aria-label="Pilih Tingkat Kelas"
            value={formData.kelas_id || ""}
            onChange={(e) => setFormData({ ...formData, kelas_id: e.target.value })}
            className="w-full text-xs bg-white border border-[#d5cbba] rounded-lg px-3 py-2 text-[#2d2410] focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">-- Pilih Tingkat Kelas --</option>
            {kelasOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.value}
              </option>
            ))}
          </select>
          {isKelasLoading && (
            <p className="text-[10px] text-[#9c8e6b] mt-1">Memuat daftar kelas...</p>
          )}
        </div>

        {/* Nama Mata Pelajaran (title) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Mata Pelajaran (title) <span className="text-rose-500">*</span>
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
            placeholder="Contoh: 1 - Guru Kelas SD, 7 - Matematika SMP"
          />
        </div>

        {/* Keterangan Mata Pelajaran (desc) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Keterangan Mata Pelajaran (desc)
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
            placeholder="Contoh: Mata pelajaran kurikulum dasar untuk tingkat kelas aktif."
          />
        </div>
      </form>
    </Modal>
  );
}
