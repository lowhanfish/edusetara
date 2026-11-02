import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPublishStatistikModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPublishStatistikModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPublishStatistikModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Data & Indikator Statistik"
          : "✎ Edit Data & Indikator Statistik"
      }
      description="Indikator angka partisipasi murni, rasio murid-guru, dan statistik pendidikan daerah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-publish-statistik" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Data & Indikator Statistik"
              : "Perbarui Data & Indikator Statistik"}
          </Button>
        </>
      }
    >
      <form id="form-publish-statistik" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Indikator Statistik <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).indikator || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                indikator: e.target.value,
              })
            }
            placeholder="Contoh: Angka Partisipasi Murni (APM) SMP"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nilai Capaian <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nilai || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nilai: e.target.value,
              })
            }
            placeholder="Contoh: 94.85"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Satuan Pengukuran <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).satuan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                satuan: e.target.value,
              })
            }
            placeholder="Contoh: % / Jiwa / Ruang"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Data <span className="text-rose-500">*</span>
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
            Kategori Indikator
          </label>
          <Input
            
            value={(formData as any).kategori || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kategori: e.target.value,
              })
            }
            placeholder="Contoh: Akses Pendidikan / Kualitas Guru / Sarpras"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Keterangan Sumber Data
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).keterangan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                keterangan: e.target.value,
              })
            }
            placeholder="Sumber rujukan data (Dapodik / BPS Konsel)..."
          />
        </div>
      </form>
    </Modal>
  );
}
