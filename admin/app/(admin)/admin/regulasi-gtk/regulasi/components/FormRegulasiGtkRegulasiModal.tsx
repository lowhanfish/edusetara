import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormRegulasiGtkRegulasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRegulasiGtkRegulasiModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRegulasiGtkRegulasiModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Regulasi GTK"
          : "✎ Edit Regulasi GTK"
      }
      description="Himpunan produk hukum, Perbup, dan SK Kadis terkait Guru dan Tenaga Kependidikan."
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
              ? "Simpan Regulasi GTK"
              : "Perbarui Regulasi GTK"}
          </Button>
        </>
      }
    >
      <form id="form-regulasi-gtk-regulasi" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nomor Dokumen Regulasi / Surat Keputusan <span className="text-rose-500">*</span>
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
            Tentang / Pokok Regulasi <span className="text-rose-500">*</span>
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
            placeholder="Uraian isi ketentuan regulasi..."
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
            placeholder="2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenis Produk Hukum
          </label>
          <Input
            
            value={(formData as any).jenis || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenis: e.target.value,
              })
            }
            placeholder="Contoh: Peraturan Bupati / Keputusan Kadis"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Salinan Dokumen Regulasi (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen regulasi PDF"
          />
        </div>
      </form>
    </Modal>
  );
}
