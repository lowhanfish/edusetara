import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormJurnalKepalaSekolahModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormJurnalKepalaSekolahModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormJurnalKepalaSekolahModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jurnal Kepala Sekolah"
          : "✎ Edit Jurnal Kepala Sekolah"
      }
      description="Pencatatan aktivitas manajerial, supervisi internal guru, dan pembinaan komite sekolah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-jurnal-kepala-sekolah" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Jurnal Kepala Sekolah"
              : "Perbarui Jurnal Kepala Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-jurnal-kepala-sekolah" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tanggal Kegiatan <span className="text-rose-500">*</span>
          </label>
          <Input
            type="date"
            required
            value={(formData as any).tgl || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tgl: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tajuk / Uraian Kegiatan Kepemimpinan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Rapat Evaluasi RKT dan RKAS"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Target Peningkatan Tata Kelola
          </label>
          <Input
            
            value={(formData as any).target || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                target: e.target.value,
              })
            }
            placeholder="Contoh: Kepatuhan 100% pelaporan ARKAS"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Hasil / Capaian Kegiatan
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).hasil || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                hasil: e.target.value,
              })
            }
            placeholder="Hasil evaluasi..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Pihak yang Terlibat
          </label>
          <Input
            
            value={(formData as any).keterlibatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                keterlibatan: e.target.value,
              })
            }
            placeholder="Contoh: Seluruh Dewan Guru dan Komite"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Catatan Tambahan / Rekomendasi
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
            placeholder="Catatan..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Dokumen / Berita Acara (PDF/Gambar)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen pendukung"
          />
        </div>
      </form>
    </Modal>
  );
}
