import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPublishKontakModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPublishKontakModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPublishKontakModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Pesan & Kontak Masuk"
          : "✎ Edit Pesan & Kontak Masuk"
      }
      description="Pengelolaan aspirasi masyarakat, saran publik, dan pengaduan layanan terpadu."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-publish-kontak" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Pesan & Kontak Masuk"
              : "Perbarui Pesan & Kontak Masuk"}
          </Button>
        </>
      }
    >
      <form id="form-publish-kontak" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Pengirim <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama: e.target.value,
              })
            }
            placeholder="Contoh: Hendra Kusuma"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Alamat Email
          </label>
          <Input
            
            value={(formData as any).email || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            placeholder="Contoh: hendra@gmail.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nomor WhatsApp / HP
          </label>
          <Input
            
            value={(formData as any).telepon || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                telepon: e.target.value,
              })
            }
            placeholder="Contoh: 081234567890"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Subjek Pesan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).subjek || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                subjek: e.target.value,
              })
            }
            placeholder="Contoh: Permohonan Informasi Beasiswa PIP"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian Isi Pesan <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).pesan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                pesan: e.target.value,
              })
            }
            placeholder="Uraian aspirasi atau pengaduan warga..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Tindak Lanjut <span className="text-rose-500">*</span>
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
            placeholder="Baru / Ditindaklanjuti / Selesai"
          />
        </div>
      </form>
    </Modal>
  );
}
