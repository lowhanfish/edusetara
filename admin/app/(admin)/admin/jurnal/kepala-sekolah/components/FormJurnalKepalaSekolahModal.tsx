import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
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
      description="Agenda supervisi manajerial, pembinaan guru, dan tata kelola satuan pendidikan."
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
            placeholder="Contoh: SDN 1 Ranomeeto"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Aktivitas / Kegiatan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_kegiatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_kegiatan: e.target.value,
              })
            }
            placeholder="Contoh: Supervisi Akademik Guru Kelas 5"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Sasaran Supervisi
          </label>
          <Input
            
            value={(formData as any).sasaran || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sasaran: e.target.value,
              })
            }
            placeholder="Contoh: Guru Kelas 5A dan 5B"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tujuan Supervisi <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).tujuan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tujuan: e.target.value,
              })
            }
            placeholder="Tujuan peningkatan kompetensi pedagogik..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Keterlibatan Pihak
          </label>
          <Input
            
            value={(formData as any).keterlibatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                keterlibatan: e.target.value,
              })
            }
            placeholder="Contoh: Komite Sekolah, Tim Kurikulum"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Hasil Temuan & Catatan
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
            placeholder="Catatan hasil pemantauan di kelas..."
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
            placeholder="Bimbingan teknis penyusunan modul..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Pelaksanaan <span className="text-rose-500">*</span>
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
            placeholder="Selesai / Terjadwal"
          />
        </div>
      </form>
    </Modal>
  );
}
