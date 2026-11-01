import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormKuotaPpdbModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormKuotaPpdbModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormKuotaPpdbModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Kuota PPDB"
          : "✎ Edit Kuota PPDB"
      }
      description="Penetapan daya tampung dan alokasi persentase per jalur satuan pendidikan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-kuota-ppdb" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Kuota PPDB"
              : "Perbarui Kuota PPDB"}
          </Button>
        </>
      }
    >
      <form id="form-kuota-ppdb" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Satuan Pendidikan <span className="text-rose-500">*</span>
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
            placeholder="Contoh: SMPN 2 Konsel"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenjang <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).jenjang || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jenjang: e.target.value,
              })
            }
            placeholder="Contoh: SMP / SD / PAUD"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Total Daya Tampung (Siswa) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).total_kuota ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                total_kuota: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 128"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Alokasi Zonasi (Siswa) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).jalur_zonasi ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jalur_zonasi: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 64"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Alokasi Afirmasi (Siswa) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).jalur_afirmasi ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jalur_afirmasi: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Alokasi Prestasi (Siswa) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).jalur_prestasi ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jalur_prestasi: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 38"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Alokasi Mutasi Tugas (Siswa) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).jalur_mutasi ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jalur_mutasi: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 6"
          />
        </div>
      </form>
    </Modal>
  );
}
