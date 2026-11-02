import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useJenjangOption } from "../hooks/crud";

interface FormUsulanPipPendukungModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormUsulanPipPendukungModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormUsulanPipPendukungModalProps) {
  const { options: jenjangOptions, isLoading: jenjangLoading } = useJenjangOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Data Pendukung PIP"
          : "✎ Edit Data Pendukung PIP"
      }
      description="Dokumentasi alokasi program bantuan PIP, SK, Berita Acara Rapat Penetapan Siswa Layak PIP."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-usulan-pip-pendukung" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Data Pendukung PIP"
              : "Perbarui Data Pendukung PIP"}
          </Button>
        </>
      }
    >
      <form id="form-usulan-pip-pendukung" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian SK / Berita Acara Penetapan PIP <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).uraian || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                uraian: e.target.value,
              })
            }
            placeholder="Contoh: SK Pemberian PIP SD Tahap I T.A 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenjang Pendidikan <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).jenjang_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenjang_id: e.target.value,
              })
            }
            options={[
              { value: "", label: jenjangLoading ? "Memuat opsi data master..." : "-- Pilih jenjang --" },
              ...jenjangOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Besaran Pagu Nominal Per Siswa (Rp) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).nominal ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nominal: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 450000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Penetapan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).tahun || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahun: e.target.value,
              })
            }
            placeholder="Contoh: 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Dokumen SK / Berita Acara (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah berkas SK PIP"
          />
        </div>
      </form>
    </Modal>
  );
}
