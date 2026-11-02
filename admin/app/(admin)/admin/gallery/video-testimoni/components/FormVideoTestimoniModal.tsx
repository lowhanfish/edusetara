import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormVideoTestimoniModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormVideoTestimoniModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormVideoTestimoniModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Video Testimoni"
          : "✎ Edit Video Testimoni"
      }
      description="Unggahan video testimoni, apresiasi, dan ulasan dampak program dari stakeholder pendidikan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-gallery-video-testimoni" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Video Testimoni"
              : "Perbarui Video Testimoni"}
          </Button>
        </>
      }
    >
      <form id="form-gallery-video-testimoni" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tajuk Testimoni / Pernyataan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).judul || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                judul: e.target.value,
              })
            }
            placeholder="Contoh: Testimoni Bupati Konawe Selatan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Tokoh / Narasumber <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).narasumber || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                narasumber: e.target.value,
              })
            }
            placeholder="Nama lengkap narasumber"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Peran / Jabatan Pemangku Kepentingan
          </label>
          <Input
            
            value={(formData as any).peran || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                peran: e.target.value,
              })
            }
            placeholder="Contoh: Kepala Daerah / Kepala Sekolah / Guru"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tautan Video YouTube (Wajib) <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).link_video || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                link_video: e.target.value,
              })
            }
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Ringkasan Ulasan / Kutipan Dampak
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
            placeholder="Kutipan pernyataan positif..."
          />
        </div>
      </form>
    </Modal>
  );
}
