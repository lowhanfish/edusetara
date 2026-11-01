import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormGalleryVideoTestimoniModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormGalleryVideoTestimoniModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormGalleryVideoTestimoniModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Video Testimoni"
          : "✎ Edit Video Testimoni"
      }
      description="Koleksi video testimoni guru, siswa, orang tua, dan tokoh masyarakat Konawe Selatan."
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
            Judul Video Testimoni <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Dampak Positif Bantuan Chromebook Bagi Siswa Pelosok"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Narasumber <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Aisyah Putri (Siswa Berprestasi)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status / Peran <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).peran || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                peran: e.target.value,
              })
            }
            placeholder="Contoh: Siswa SMPN 1 Kolono / Orang Tua Wali"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tautan Video (YouTube / Drive) <span className="text-rose-500">*</span>
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
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kutipan / Ringkasan Testimoni
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
            placeholder="Kutipan kalimat kunci narasumber..."
          />
        </div>
      </form>
    </Modal>
  );
}
