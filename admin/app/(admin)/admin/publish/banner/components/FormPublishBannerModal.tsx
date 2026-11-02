import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPublishBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPublishBannerModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPublishBannerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Banner & Slider Beranda"
          : "✎ Edit Banner & Slider Beranda"
      }
      description="Pengaturan slide spanduk utama, tajuk sorotan, dan tautan aksi beranda website."
      maxWidth="3xl"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-publish-banner" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Banner & Slider Beranda"
              : "Perbarui Banner & Slider Beranda"}
          </Button>
        </>
      }
    >
      <form id="form-publish-banner" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Judul Utama Banner <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).title || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            placeholder="Contoh: Transformasi Digital Pendidikan Konawe Selatan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Subjudul / Slogan
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).subtitle || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                subtitle: e.target.value,
              })
            }
            placeholder="Contoh: Terwujudnya layanan pendidikan berkualitas dan merata bagi seluruh generasi."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Label Badge
          </label>
          <Input
            
            value={(formData as any).badge_text || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                badge_text: e.target.value,
              })
            }
            placeholder="Contoh: Portal Resmi Dikbud Konsel"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Label Tombol Utama
          </label>
          <Input
            
            value={(formData as any).primary_button_label || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                primary_button_label: e.target.value,
              })
            }
            placeholder="Contoh: Jelajahi Layanan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tautan Tombol Utama
          </label>
          <Input
            
            value={(formData as any).primary_button_link || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                primary_button_link: e.target.value,
              })
            }
            placeholder="Contoh: /layanan-publik"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Gambar Latar Banner (1920x1080)
          </label>
          <FileInput
            module="banner"
            value={(formData as any).image || ""}
            onChange={(fileUrl, file) =>
              setFormData({
                ...formData,
                image: file || fileUrl,
              })
            }
            helperText="Unggah berkas foto banner resolusi tinggi (JPG/PNG/WEBP)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Urutan Slide
          </label>
          <Input
            type="number"
            
            value={(formData as any).order ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                order: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Tampil <span className="text-rose-500">*</span>
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
            placeholder="Aktif / Nonaktif"
          />
        </div>
      </form>
    </Modal>
  );
}
