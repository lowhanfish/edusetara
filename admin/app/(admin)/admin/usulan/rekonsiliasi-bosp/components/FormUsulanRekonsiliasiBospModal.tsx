import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Usulan Rekonsiliasi Dana BOSP"
          : "✎ Edit Usulan Rekonsiliasi Dana BOSP"
      }
      description="Pengajuan berkas LPJ / SPJ dana BOSP reguler dan kinerja satuan pendidikan."
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
            placeholder="Contoh: SDN 1 Kolono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahap BOSP <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).tahap || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahap: e.target.value,
              })
            }
            placeholder="Contoh: Tahap 1 / Tahap 2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Anggaran <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
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
            Nominal Usulan LPJ (Rp) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).nominal_dana ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nominal_dana: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 85000000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kategori Berkas SPJ
          </label>
          <Input
            
            value={(formData as any).kategori_spj || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kategori_spj: e.target.value,
              })
            }
            placeholder="Contoh: BKU, Buku Bank, Pajak, SPTJM"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas BKU (PDF)
          </label>
          <FileInput
            value={(formData as any).file_bku || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_bku: fileName,
              })
            }
            helperText="Unggah scan BKU bertanda tangan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Rekening Koran BOSP
          </label>
          <FileInput
            value={(formData as any).file_rekening || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_rekening: fileName,
              })
            }
            helperText="Unggah rekening koran bank"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas SPTJM Bermaterai
          </label>
          <FileInput
            value={(formData as any).file_sptjm || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file_sptjm: fileName,
              })
            }
            helperText="Unggah SPTJM bermaterai"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Verifikasi
          </label>
          <Input
            
            value={(formData as any).status || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            placeholder="Contoh: Menunggu Verifikasi"
          />
        </div>
      </form>
    </Modal>
  );
}
