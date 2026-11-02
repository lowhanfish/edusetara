import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useTriwulanOption, useJenisPenerimaOption, useKelasPenerimaOption } from "../hooks/crud";

interface FormUsulanTunjanganGuruModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormUsulanTunjanganGuruModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormUsulanTunjanganGuruModalProps) {
  const { options: triwulanOptions, isLoading: triwulanLoading } = useTriwulanOption();
  const { options: jenispenerimaOptions, isLoading: jenispenerimaLoading } = useJenisPenerimaOption();
  const { options: kelaspenerimaOptions, isLoading: kelaspenerimaLoading } = useKelasPenerimaOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Usulan Tunjangan Guru"
          : "✎ Edit Usulan Tunjangan Guru"
      }
      description="Permohonan aneka tunjangan pendidik (TPG, Tamsil, TKG) ke Dinas Pendidikan dan Kebudayaan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-usulan-tunjangan-guru" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Usulan Tunjangan Guru"
              : "Perbarui Usulan Tunjangan Guru"}
          </Button>
        </>
      }
    >
      <form id="form-usulan-tunjangan-guru" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Anggaran <span className="text-rose-500">*</span>
          </label>
          <Input
            required
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
            Periode Triwulan <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).triwulan_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                triwulan_id: e.target.value,
              })
            }
            options={[
              { value: "", label: triwulanLoading ? "Memuat opsi data master..." : "-- Pilih triwulan --" },
              ...triwulanOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenis Tunjangan (Penerima) <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).jenis_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenis_id: e.target.value,
              })
            }
            options={[
              { value: "", label: jenispenerimaLoading ? "Memuat opsi data master..." : "-- Pilih jenis tunjangan --" },
              ...jenispenerimaOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kelas / Kategori Penerima <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).kelas_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kelas_id: e.target.value,
              })
            }
            options={[
              { value: "", label: kelaspenerimaLoading ? "Memuat opsi data master..." : "-- Pilih kelas penerima --" },
              ...kelaspenerimaOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Guru Pengusul
          </label>
          <Input
            type="number"
            
            value={(formData as any).jml_guru ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jml_guru: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nominal Usulan (Rp)
          </label>
          <Input
            type="number"
            
            value={(formData as any).nominal ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nominal: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 12000000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Lampiran SKTP (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen SKTP"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tipe Berkas (pdf)
          </label>
          <Input
            
            value={(formData as any).file_type || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                file_type: e.target.value,
              })
            }
            placeholder="pdf"
          />
        </div>
      </form>
    </Modal>
  );
}
