import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormGalleryKegiatanKepalaSekolahModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormGalleryKegiatanKepalaSekolahModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormGalleryKegiatanKepalaSekolahModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Gallery Kegiatan Kepala Sekolah"
          : "✎ Edit Gallery Kegiatan Kepala Sekolah"
      }
      description="Dokumentasi program kerja, supervisi klinis, dan inovasi manajerial Kepala Sekolah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-gallery-kegiatan-kepala-sekolah" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Gallery Kegiatan Kepala Sekolah"
              : "Perbarui Gallery Kegiatan Kepala Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-gallery-kegiatan-kepala-sekolah" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Kegiatan / Aksi Nyata <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Bimtek Pemanfaatan Platform Rapor Pendidikan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tujuan Kegiatan <span className="text-rose-500">*</span>
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
            placeholder="Tujuan pelaksanaan kegiatan manajerial..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahapan / Proses
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).proses || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                proses: e.target.value,
              })
            }
            placeholder="Uraian proses dan keterlibatan guru..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Hasil / Capaian Positif
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
            placeholder="Output yang berhasil dicapai..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Foto Dokumentasi
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah foto kegiatan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tautan YouTube
          </label>
          <Input
            
            value={(formData as any).link || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                link: e.target.value,
              })
            }
            placeholder="https://youtube.com/..."
          />
        </div>
      </form>
    </Modal>
  );
}
