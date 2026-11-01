import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
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
      description="Pemeriksaan berkas kelayakan jam mengajar, keaktifan dapodik, dan SKTP guru."
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
            Nama Lengkap Guru <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama_guru || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_guru: e.target.value,
              })
            }
            placeholder="Contoh: Sunardi, S.Pd"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NUPTK <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nuptk || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nuptk: e.target.value,
              })
            }
            placeholder="Contoh: 8765432109876543"
          />
        </div>

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
            placeholder="Contoh: SMPN 3 Ranomeeto"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenis Tunjangan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).jenis_tunjangan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenis_tunjangan: e.target.value,
              })
            }
            placeholder="Contoh: TPG / Tunjangan Daerah Khusus"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Verifikasi <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).status_verifikasi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status_verifikasi: e.target.value,
              })
            }
            placeholder="Contoh: Disetujui / Perlu Perbaikan Berkas / Ditolak"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Catatan Verifikator
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
            placeholder="Catatan hasil verifikasi berkas..."
          />
        </div>
      </form>
    </Modal>
  );
}
