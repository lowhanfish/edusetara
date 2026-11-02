import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormPiagamSertifikatModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPiagamSertifikatModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPiagamSertifikatModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Piagam & Sertifikat"
          : "✎ Edit Piagam & Sertifikat"
      }
      description="Pencatatan prestasi, penghargaan kejuaraan dan piagam sertifikat tingkat Guru, Siswa, dan Sekolah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-piagam-sertifikat" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Piagam & Sertifikat"
              : "Perbarui Piagam & Sertifikat"}
          </Button>
        </>
      }
    >
      <form id="form-piagam-sertifikat" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kategori Penerima Penghargaan <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).kategori ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kategori: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih kategori penerima --" },
              ...[{"value":"Siswa","label":"Peserta Didik (Siswa)"},{"value":"Guru","label":"Pendidik (Guru)"},{"value":"Sekolah","label":"Satuan Pendidikan (Sekolah)"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Penerima Penghargaan <span className="text-rose-500">*</span>
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
            placeholder="Nama penerima"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Ajang / Kompetisi <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).kegiatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kegiatan: e.target.value,
              })
            }
            placeholder="Contoh: Olimpiade Sains Nasional"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Capaian Juara / Penghargaan
          </label>
          <Input
            
            value={(formData as any).juara || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                juara: e.target.value,
              })
            }
            placeholder="Contoh: Juara 1 Medali Emas"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tingkat Kejuaraan
          </label>
          <Select
            
            value={(formData as any).tingkat ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tingkat: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih tingkat kejuaraan --" },
              ...[{"value":"Kecamatan","label":"Tingkat Kecamatan"},{"value":"Kabupaten","label":"Tingkat Kabupaten"},{"value":"Provinsi","label":"Tingkat Provinsi"},{"value":"Nasional","label":"Tingkat Nasional"},{"value":"Internasional","label":"Tingkat Internasional"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Prestasi
          </label>
          <Input
            
            value={(formData as any).tahun || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahun: e.target.value,
              })
            }
            placeholder="Contoh: 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Instansi / Lembaga Penyelenggara
          </label>
          <Input
            
            value={(formData as any).penyelenggara || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                penyelenggara: e.target.value,
              })
            }
            placeholder="Contoh: Balai Pengembangan Talenta Indonesia"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Pindaian Piagam / Sertifikat (PDF/Gambar)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah piagam penghargaan"
          />
        </div>
      </form>
    </Modal>
  );
}
