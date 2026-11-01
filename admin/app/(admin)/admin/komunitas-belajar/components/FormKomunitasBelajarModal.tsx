import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormKomunitasBelajarModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormKomunitasBelajarModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormKomunitasBelajarModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Komunitas Belajar"
          : "✎ Edit Komunitas Belajar"
      }
      description="Pendataan Komunitas Belajar (Kombel) dalam sekolah maupun antarsekolah di PMM."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-komunitas-belajar" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Komunitas Belajar"
              : "Perbarui Komunitas Belajar"}
          </Button>
        </>
      }
    >
      <form id="form-komunitas-belajar" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Komunitas Belajar <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_kombel || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_kombel: e.target.value,
              })
            }
            placeholder="Contoh: Kombel Berbagi Praktik Baik Konsel"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Ketua / Penggerak Kombel <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).ketua || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ketua: e.target.value,
              })
            }
            placeholder="Contoh: Drs. Wahyudin, M.Pd"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenjang / Lingkup
          </label>
          <Input
            
            value={(formData as any).jenjang || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenjang: e.target.value,
              })
            }
            placeholder="Contoh: SD / SMP / Antar Sekolah"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Anggota Guru <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).jumlah_anggota ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jumlah_anggota: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 35"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Fokus & Kegiatan Utama
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).kegiatan_utama || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kegiatan_utama: e.target.value,
              })
            }
            placeholder="Uraian topik diskusi dan praktik baik..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas SK Komunitas Belajar (PDF)
          </label>
          <FileInput
            value={(formData as any).file_sk || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_sk: fileName,
              })
            }
            helperText="Unggah SK pengesahan kombel"
          />
        </div>
      </form>
    </Modal>
  );
}
