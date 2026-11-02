import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormVerifikasiTunjanganGuruModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormVerifikasiTunjanganGuruModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormVerifikasiTunjanganGuruModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Verifikasi Tunjangan Guru"
          : "✎ Edit Verifikasi Tunjangan Guru"
      }
      description="Pemeriksaan dan validasi berkas pengajuan tunjangan guru dari satuan pendidikan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-verifikasi-tunjangan-guru" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Verifikasi Tunjangan Guru"
              : "Perbarui Verifikasi Tunjangan Guru"}
          </Button>
        </>
      }
    >
      <form id="form-verifikasi-tunjangan-guru" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Guru Pengusul
          </label>
          <Input
            
            value={(formData as any).nama_guru || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_guru: e.target.value,
              })
            }
            placeholder="Nama guru"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NUPTK
          </label>
          <Input
            
            value={(formData as any).nuptk || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nuptk: e.target.value,
              })
            }
            placeholder="Nomor NUPTK"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Satuan Pendidikan
          </label>
          <Input
            
            value={(formData as any).sekolah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sekolah: e.target.value,
              })
            }
            placeholder="Sekolah"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenis Tunjangan
          </label>
          <Input
            
            value={(formData as any).jenis_tunjangan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenis_tunjangan: e.target.value,
              })
            }
            placeholder="TPG / Tamsil / TKG"
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
              ...[{"value":"Menunggu","label":"Menunggu Verifikasi"},{"value":"Disetujui","label":"Disetujui / Terbit SKTP"},{"value":"Perbaikan","label":"Perlu Perbaikan Berkas"},{"value":"Ditolak","label":"Ditolak"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Catatan Verifikator Dinas
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).catatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                catatan: e.target.value,
              })
            }
            placeholder="Catatan hasil verifikasi..."
          />
        </div>
      </form>
    </Modal>
  );
}
