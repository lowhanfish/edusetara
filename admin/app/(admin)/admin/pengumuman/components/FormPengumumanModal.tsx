import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPengumumanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPengumumanModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPengumumanModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Manajemen Pengumuman"
          : "✎ Edit Manajemen Pengumuman"
      }
      description="Publikasi pengumuman dinas kepada guru, kepala sekolah, siswa, dan wali murid."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-publish-pengumuman" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Manajemen Pengumuman"
              : "Perbarui Manajemen Pengumuman"}
          </Button>
        </>
      }
    >
      <form id="form-publish-pengumuman" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Judul Pengumuman <span className="text-rose-500">*</span>
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
            placeholder="Judul pengumuman dinas..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Slug URL
          </label>
          <Input
            
            value={(formData as any).slug || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                slug: e.target.value,
              })
            }
            placeholder="judul-pengumuman"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian Isi Pengumuman <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).isi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                isi: e.target.value,
              })
            }
            placeholder="Detail pengumuman resmi..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tanggal Diterbitkan <span className="text-rose-500">*</span>
          </label>
          <Input
            type="date"
            required
            value={(formData as any).tanggal || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tanggal: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Publikasi <span className="text-rose-500">*</span>
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
            placeholder="Terbit / Arsip"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Lampiran PDF
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah berkas dokumen pengumuman (PDF)"
          />
        </div>
      </form>
    </Modal>
  );
}
