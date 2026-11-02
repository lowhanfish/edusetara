import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useDataPendukungOption, useSiswaOption } from "../hooks/crud";

interface FormUsulanPipPenerimaModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormUsulanPipPenerimaModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormUsulanPipPenerimaModalProps) {
  const { options: datapendukungOptions, isLoading: datapendukungLoading } = useDataPendukungOption();
  const { options: siswaOptions, isLoading: siswaLoading } = useSiswaOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Data Penerima PIP"
          : "✎ Edit Data Penerima PIP"
      }
      description="Penetapan peserta didik aktif yang berhak menerima penyaluran dana bantuan PIP."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-usulan-pip-penerima" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Data Penerima PIP"
              : "Perbarui Data Penerima PIP"}
          </Button>
        </>
      }
    >
      <form id="form-usulan-pip-penerima" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Data Pendukung PIP <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(() => {
              const cur = (formData as any).pendukung_id;
              if (!cur) return "";
              const match = datapendukungOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                pendukung_id: e.target.value,
              })
            }
            options={[
              { value: "", label: datapendukungLoading ? "Memuat opsi data master..." : "-- Pilih dokumen rujukan SK PIP --" },
              ...datapendukungOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Peserta Didik (Master Siswa) <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(() => {
              const cur = (formData as any).siswa_id;
              if (!cur) return "";
              const match = siswaOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                siswa_id: e.target.value,
              })
            }
            options={[
              { value: "", label: siswaLoading ? "Memuat opsi data master..." : "-- Pilih siswa penerima PIP --" },
              ...siswaOptions.map((opt) => ({
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
