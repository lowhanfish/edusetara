import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormRegulasiPengumumanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRegulasiPengumumanModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRegulasiPengumumanModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Pengumuman GTK"
          : "✎ Edit Pengumuman GTK"
      }
      description="Pengumuman resmi seleksi PPG, uji kompetensi, dan pembagian sertifikat pendidik."
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
            placeholder="Contoh: Jadwal Uji Kompetensi Kenaikan Jabatan Fungsional Guru"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Isi Ringkasan Pengumuman <span className="text-rose-500">*</span>
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
            placeholder="Uraian isi pengumuman GTK..."
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
            Sasaran Guru / Tendik
          </label>
          <Input
            
            value={(formData as any).target || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                target: e.target.value,
              })
            }
            placeholder="Contoh: Guru Jenjang SD dan SMP se-Konsel"
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
            helperText="Unggah dokumen surat edaran (PDF)"
          />
        </div>
      </form>
    </Modal>
  );
}
