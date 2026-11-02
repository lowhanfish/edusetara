import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormRegulasiGtkPengumumanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRegulasiGtkPengumumanModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRegulasiGtkPengumumanModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Pengumuman GTK"
          : "✎ Edit Pengumuman GTK"
      }
      description="Publikasi pengumuman kedinasan khusus Guru dan Tenaga Kependidikan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-regulasi-gtk-pengumuman" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Pengumuman GTK"
              : "Perbarui Pengumuman GTK"}
          </Button>
        </>
      }
    >
      <form id="form-regulasi-gtk-pengumuman" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Judul Pengumuman GTK <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Jadwal Pemberkasan TPG Triwulan I"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Isi Ringkas Pengumuman <span className="text-rose-500">*</span>
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
            placeholder="Uraian pengumuman..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tanggal Pengumuman <span className="text-rose-500">*</span>
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
            Sasaran Penerima Pengumuman
          </label>
          <Input
            
            value={(formData as any).target || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                target: e.target.value,
              })
            }
            placeholder="Contoh: Seluruh Guru Penerima TPG"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Lampiran Surat Edaran / Pengumuman (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen surat edaran"
          />
        </div>
      </form>
    </Modal>
  );
}
