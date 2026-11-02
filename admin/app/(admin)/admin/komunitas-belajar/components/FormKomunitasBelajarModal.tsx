import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormKomunitasBelajarModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormKomunitasBelajarModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormKomunitasBelajarModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Komunitas Belajar"
          : "✎ Edit Komunitas Belajar"
      }
      description="Pengelolaan aktivitas kelompok belajar guru dan tenaga kependidikan intra dan antar satuan pendidikan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-komunitas-belajar" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Komunitas Belajar"
              : "Perbarui Komunitas Belajar"}
          </Button>
        </>
      }
    >
      <form id="form-komunitas-belajar" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Komunitas Belajar <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Kombel Berbagi Praktik Baik"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Siklus / Jenis Kegiatan <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).jns_kegiatan ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jns_kegiatan: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih siklus kegiatan --" },
              ...[{"value":"0","label":"Siklus Refleksi Awal"},{"value":"1","label":"Siklus Perencanaan"},{"value":"2","label":"Siklus Implementasi"},{"value":"3","label":"Siklus Evaluasi"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tanggal Pelaksanaan <span className="text-rose-500">*</span>
          </label>
          <Input
            type="date"
            required
            value={(formData as any).tgl_kegiatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tgl_kegiatan: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Guru / Penanggung Jawab
          </label>
          <Input
            
            value={(formData as any).nama_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_id: e.target.value,
              })
            }
            placeholder="Nama guru penggerak / penanggung jawab"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jabatan dalam Kombel
          </label>
          <Select
            
            value={(formData as any).jabatan ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jabatan: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih jabatan --" },
              ...[{"value":"Ketua","label":"Ketua"},{"value":"Wakil","label":"Wakil"},{"value":"Sekretaris","label":"Sekretaris"},{"value":"Koordinator","label":"Koordinator"},{"value":"Anggota","label":"Anggota"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Dokumen Berita Acara / SK Kombel (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen pendukung"
          />
        </div>
      </form>
    </Modal>
  );
}
