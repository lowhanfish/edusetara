import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormVerifikasiRekonsiliasiBospModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormVerifikasiRekonsiliasiBospModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormVerifikasiRekonsiliasiBospModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Verifikasi Usulan Rekonsiliasi Dana BOSP"
          : "✎ Edit Verifikasi Usulan Rekonsiliasi Dana BOSP"
      }
      description="Verifikasi dokumen pertanggungjawaban (SPJ) dana BOSP satuan pendidikan oleh dinas."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-verifikasi-rekonsiliasi-bosp" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Verifikasi Usulan Rekonsiliasi Dana BOSP"
              : "Perbarui Verifikasi Usulan Rekonsiliasi Dana BOSP"}
          </Button>
        </>
      }
    >
      <form id="form-verifikasi-rekonsiliasi-bosp" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Satuan Pendidikan
          </label>
          <Input
            
            value={(formData as any).sekolah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sekolah: e.target.value,
              })
            }
            placeholder="Sekolah pengusul"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Semester / Tahap
          </label>
          <Input
            
            value={(formData as any).tahap || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahap: e.target.value,
              })
            }
            placeholder="Semester I / Semester II"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Anggaran
          </label>
          <Input
            
            value={(formData as any).tahun || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahun: e.target.value,
              })
            }
            placeholder="2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nominal Dana Disetujui (Rp)
          </label>
          <Input
            type="number"
            
            value={(formData as any).nominal_disetujui ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nominal_disetujui: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Nominal disetujui"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Verifikasi Tim Dinas <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).status_verifikasi ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status_verifikasi: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih status verifikasi --" },
              ...[{"value":"Sedang Diproses Verifikasi","label":"Sedang Diproses Verifikasi"},{"value":"Cek Benar","label":"Tahap Cek Benar (Kesesuaian Angka)"},{"value":"Cek Lengkap","label":"Tahap Cek Lengkap (26 Berkas Valid)"},{"value":"Disetujui","label":"Disetujui (Bebas Rekonsiliasi)"},{"value":"Perbaikan","label":"Perlu Koreksi Berkas SPJ"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Catatan Hasil Koreksi Verifikator
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).catatan_verifikator || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                catatan_verifikator: e.target.value,
              })
            }
            placeholder="Catatan koreksi SPJ..."
          />
        </div>
      </form>
    </Modal>
  );
}
