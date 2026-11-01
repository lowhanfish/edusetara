import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormJurnalBkModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormJurnalBkModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormJurnalBkModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jurnal BK (Bimbingan Konseling)"
          : "✎ Edit Jurnal BK (Bimbingan Konseling)"
      }
      description="Dokumentasi konseling individual, bimbingan kelompok, dan layanan konseling sekolah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-jurnal-bk" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Jurnal BK (Bimbingan Konseling)"
              : "Perbarui Jurnal BK (Bimbingan Konseling)"}
          </Button>
        </>
      }
    >
      <form id="form-jurnal-bk" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Satuan Pendidikan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).sekolah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sekolah: e.target.value,
              })
            }
            placeholder="Contoh: SMPN 1 Ranomeeto"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenis Layanan BK <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).jenis_layanan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenis_layanan: e.target.value,
              })
            }
            placeholder="Contoh: Konseling Individual / Bimbingan Klasikal"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Bidang Bimbingan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).bidang_bimbingan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                bidang_bimbingan: e.target.value,
              })
            }
            placeholder="Contoh: Pribadi / Sosial / Belajar / Karier"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Siswa / Kelompok Siswa <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).sasaran_siswa || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sasaran_siswa: e.target.value,
              })
            }
            placeholder="Contoh: Siswa Kelas VIII-C"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian Kebutuhan / Masalah <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).permasalahan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                permasalahan: e.target.value,
              })
            }
            placeholder="Kebutuhan motivasi belajar dan manajemen waktu..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Layanan yang Diberikan <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).layanan_diberikan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                layanan_diberikan: e.target.value,
              })
            }
            placeholder="Teknik restrukturisasi kognitif dan pembinaan..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Evaluasi Capaian
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).evaluasi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                evaluasi: e.target.value,
              })
            }
            placeholder="Perkembangan perilaku positif konseli..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Rencana Tindak Lanjut
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).tindak_lanjut || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tindak_lanjut: e.target.value,
              })
            }
            placeholder="Sesi konseling tindak lanjut..."
          />
        </div>
      </form>
    </Modal>
  );
}
