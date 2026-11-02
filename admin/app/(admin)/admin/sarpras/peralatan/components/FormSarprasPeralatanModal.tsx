import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useRuangOption, useKondisiOption, useSumberDanaOption } from "../hooks/crud";

interface FormSarprasPeralatanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormSarprasPeralatanModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormSarprasPeralatanModalProps) {
  const { options: ruangOptions, isLoading: ruangLoading } = useRuangOption();
  const { options: kondisiOptions, isLoading: kondisiLoading } = useKondisiOption();
  const { options: sumberdanaOptions, isLoading: sumberdanaLoading } = useSumberDanaOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Peralatan / Aset"
          : "✎ Edit Peralatan / Aset"
      }
      description="Inventarisasi perangkat TIK, alat elektronik, dan furnitur penunjang di masing-masing ruangan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-sarpras-peralatan" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Peralatan / Aset"
              : "Perbarui Peralatan / Aset"}
          </Button>
        </>
      }
    >
      <form id="form-sarpras-peralatan" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Lokasi Ruangan Penempatan
          </label>
          <Select
            
            value={(formData as any).ruang_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ruang_id: e.target.value,
              })
            }
            options={[
              { value: "", label: ruangLoading ? "Memuat opsi data master..." : "-- Pilih ruangan penempatan --" },
              ...ruangOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Peralatan / Aset <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama: e.target.value,
              })
            }
            placeholder="Contoh: Komputer Asus / Printer Epson L300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Unit Peralatan <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).jml_alat ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jml_alat: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kondisi Peralatan
          </label>
          <Select
            
            value={(formData as any).kondisi_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kondisi_id: e.target.value,
              })
            }
            options={[
              { value: "", label: kondisiLoading ? "Memuat opsi data master..." : "-- Pilih kondisi peralatan --" },
              ...kondisiOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Pengadaan / Perolehan
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
            Sumber Dana
          </label>
          <Select
            
            value={(formData as any).sumber_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sumber_id: e.target.value,
              })
            }
            options={[
              { value: "", label: sumberdanaLoading ? "Memuat opsi data master..." : "-- Pilih sumber dana --" },
              ...sumberdanaOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
