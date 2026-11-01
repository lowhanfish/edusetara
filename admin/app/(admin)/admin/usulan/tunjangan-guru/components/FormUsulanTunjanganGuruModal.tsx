import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Usulan Tunjangan Guru"
          : "✎ Edit Usulan Tunjangan Guru"
      }
      description="Pengajuan dan rekap usulan tunjangan profesi, khusus, dan tamsil guru."
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
            placeholder="Contoh: Rahmawati, S.Pd., Gr."
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
            placeholder="Contoh: 1234567890123456"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Satuan Pendidikan Induk <span className="text-rose-500">*</span>
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
            placeholder="Contoh: SMPN 4 Konsel"
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
            placeholder="Contoh: TPG (Profesi) / Tunjangan Khusus 3T"
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
            Semester
          </label>
          <Input
            
            value={(formData as any).semester || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                semester: e.target.value,
              })
            }
            placeholder="Contoh: Semester Ganjil / Genap"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Usulan
          </label>
          <Input
            
            value={(formData as any).status || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            placeholder="Contoh: Diajukan / Terverifikasi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Pendukung (PDF)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah berkas Info GTK / SKTP"
          />
        </div>
      </form>
    </Modal>
  );
}
