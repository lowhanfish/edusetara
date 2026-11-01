import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormRegulasiGtkModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRegulasiGtkModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRegulasiGtkModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Regulasi"
          : "✎ Edit Regulasi"
      }
      description="Dokumen hukum Perbup, Permendikbudristek, dan Keputusan Kepala Dinas."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-regulasi-gtk-regulasi" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Regulasi"
              : "Perbarui Regulasi"}
          </Button>
        </>
      }
    >
      <form id="form-regulasi-gtk-regulasi" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nomor & Tahun Regulasi <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nomor_regulasi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nomor_regulasi: e.target.value,
              })
            }
            placeholder="Contoh: Perbup No. 14 Tahun 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Perihal / Tentang <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).tentang || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tentang: e.target.value,
              })
            }
            placeholder="Contoh: Tata Cara Penyaluran Tambahan Penghasilan Guru ASN Daerah"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun <span className="text-rose-500">*</span>
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
            Tingkat Regulasi
          </label>
          <Input
            
            value={(formData as any).jenis || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenis: e.target.value,
              })
            }
            placeholder="Contoh: Peraturan Bupati / Surat Edaran Kadis"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Lembaran Hukum (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen PDF regulasi"
          />
        </div>
      </form>
    </Modal>
  );
}
