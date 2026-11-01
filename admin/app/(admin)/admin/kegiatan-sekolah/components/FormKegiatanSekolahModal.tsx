import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormKegiatanSekolahModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormKegiatanSekolahModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormKegiatanSekolahModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Kegiatan Sekolah"
          : "✎ Edit Kegiatan Sekolah"
      }
      description="Agenda, pameran karya, dan aktivitas akademik maupun ekstrakurikuler sekolah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-kegiatan-sekolah" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Kegiatan Sekolah"
              : "Perbarui Kegiatan Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-kegiatan-sekolah" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Judul Kegiatan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Gelar Karya P5 Kearifan Lokal"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian Pelaksanaan <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).deskripsi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                deskripsi: e.target.value,
              })
            }
            placeholder="Deskripsi jalannya aktivitas kegiatan..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tanggal Kegiatan <span className="text-rose-500">*</span>
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
            Tahun
          </label>
          <Input
            type="number"
            
            value={(formData as any).tahun ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahun: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Dokumentasi Foto / Laporan
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah berkas foto atau dokumen (PDF)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tautan YouTube / Berita
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
