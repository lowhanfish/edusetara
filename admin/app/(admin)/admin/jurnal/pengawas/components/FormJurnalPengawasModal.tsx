import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormJurnalPengawasModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormJurnalPengawasModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormJurnalPengawasModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jurnal Pengawas Satdik"
          : "✎ Edit Jurnal Pengawas Satdik"
      }
      description="Catatan supervisi akademik, evaluasi kurikulum, dan bimbingan manajerial sekolah binaan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-jurnal-pengawas" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Jurnal Pengawas Satdik"
              : "Perbarui Jurnal Pengawas Satdik"}
          </Button>
        </>
      }
    >
      <form id="form-jurnal-pengawas" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Sekolah Binaan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).sekolah_binaan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sekolah_binaan: e.target.value,
              })
            }
            placeholder="Contoh: SMPN 2 Kolono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Fokus Pendampingan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).fokus_supervisi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                fokus_supervisi: e.target.value,
              })
            }
            placeholder="Contoh: Implementasi Rapor Pendidikan & KSP"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Metode Pendampingan
          </label>
          <Input
            
            value={(formData as any).pendekatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                pendekatan: e.target.value,
              })
            }
            placeholder="Contoh: Coaching / Mentoring / Focus Group"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian Temuan Fakta <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).temuan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                temuan: e.target.value,
              })
            }
            placeholder="Hasil evaluasi capaian literasi dan numerasi..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Rekomendasi Pembenahan <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).rekomendasi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                rekomendasi: e.target.value,
              })
            }
            placeholder="Rekomendasi tindak lanjut bagi kepala sekolah..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Supervisi <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).status || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            placeholder="Selesai / Menunggu Monitoring Ulang"
          />
        </div>
      </form>
    </Modal>
  );
}
