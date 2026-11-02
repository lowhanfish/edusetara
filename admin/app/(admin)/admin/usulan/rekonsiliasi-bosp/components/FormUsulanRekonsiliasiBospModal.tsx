import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useKategoriSpjOption } from "../hooks/crud";

interface FormUsulanRekonsiliasiBospModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormUsulanRekonsiliasiBospModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormUsulanRekonsiliasiBospModalProps) {
  const { options: kategorispjOptions, isLoading: kategorispjLoading } = useKategoriSpjOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Usulan Rekonsiliasi Dana BOSP"
          : "✎ Edit Usulan Rekonsiliasi Dana BOSP"
      }
      description="Pengajuan pertanggungjawaban (SPJ) keuangan dan aset BOSP ke Dinas Pendidikan dan Kebudayaan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-usulan-rekonsiliasi-bosp" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Usulan Rekonsiliasi Dana BOSP"
              : "Perbarui Usulan Rekonsiliasi Dana BOSP"}
          </Button>
        </>
      }
    >
      <form id="form-usulan-rekonsiliasi-bosp" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Satuan Pendidikan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).sekolah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sekolah: e.target.value,
              })
            }
            placeholder="Contoh: SDN 4 Ranomeeto"
          />
        </div>

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
            Semester / Tahap <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).tahap ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahap: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih semester --" },
              ...[{"value":"Semester I (Januari - Juni)","label":"Semester I (Januari - Juni)"},{"value":"Semester II (Juli - Desember)","label":"Semester II (Juli - Desember)"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nominal Penyerapan Dana BOSP (Rp)
          </label>
          <Input
            type="number"
            
            value={(formData as any).nominal_dana ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nominal_dana: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 50000000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kategori Dokumen SPJ (Master Kategori)
          </label>
          <Select
            
            value={(formData as any).kategori_spj || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kategori_spj: e.target.value,
              })
            }
            options={[
              { value: "", label: kategorispjLoading ? "Memuat opsi data master..." : "-- Pilih kategori SPJ BOSP --" },
              ...kategorispjOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Buku Kas Umum / BKU (PDF)
          </label>
          <FileInput
            value={(formData as any).file_bku || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_bku: fileName,
              })
            }
            helperText="Unggah berkas BKU"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Rekening Koran Bank Sultra (PDF)
          </label>
          <FileInput
            value={(formData as any).file_rekening || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_rekening: fileName,
              })
            }
            helperText="Unggah rekening koran"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            SPTJM BOSP Bermaterai (PDF)
          </label>
          <FileInput
            value={(formData as any).file_sptjm || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_sptjm: fileName,
              })
            }
            helperText="Unggah SPTJM"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Usulan
          </label>
          <Select
            
            value={(formData as any).status ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih status usulan --" },
              ...[{"value":"Sedang Diproses Verifikasi","label":"Sedang Diproses Verifikasi"},{"value":"Cek Benar","label":"Cek Benar"},{"value":"Cek Lengkap","label":"Cek Lengkap"},{"value":"Disetujui","label":"Disetujui"}]
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
