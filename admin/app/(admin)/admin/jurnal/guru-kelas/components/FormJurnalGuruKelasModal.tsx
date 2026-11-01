import React from "react";
import { Button, Input, Modal, Textarea, FileInput } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormJurnalGuruKelasModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormJurnalGuruKelasModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormJurnalGuruKelasModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jurnal Guru Kelas"
          : "✎ Edit Jurnal Guru Kelas"
      }
      description="Pencatatan harian aktivitas belajar mengajar, capaian materi, dan refleksi pedagogik guru kelas."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-jurnal-guru-kelas" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Jurnal Guru Kelas"
              : "Perbarui Jurnal Guru Kelas"}
          </Button>
        </>
      }
    >
      <form id="form-jurnal-guru-kelas" onSubmit={onSubmit} className="space-y-4">
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
            placeholder="Contoh: SDN 2 Buke"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tema / Muatan Pelajaran <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).tema || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tema: e.target.value,
              })
            }
            placeholder="Contoh: Siklus Air dan Peristiwa Alam"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Materi Pokok Pembelajaran <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).materi_pokok || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                materi_pokok: e.target.value,
              })
            }
            placeholder="Contoh: Evaporasi, Kondensasi, dan Presipitasi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Pertemuan Ke- <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            required
            value={(formData as any).pertemuan_ke ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                pertemuan_ke: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 4"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Model Pembelajaran
          </label>
          <Input
            
            value={(formData as any).model_pembelajaran || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                model_pembelajaran: e.target.value,
              })
            }
            placeholder="Contoh: Problem Based Learning (PBL)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Metode Pembelajaran
          </label>
          <Input
            
            value={(formData as any).metode_pembelajaran || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                metode_pembelajaran: e.target.value,
              })
            }
            placeholder="Contoh: Eksperimen Sederhana & Diskusi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Teknik Penilaian
          </label>
          <Input
            
            value={(formData as any).teknik_penilaian || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                teknik_penilaian: e.target.value,
              })
            }
            placeholder="Contoh: Rubrik Observasi Sikap & Lembar Formatif"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Catatan Refleksi / Kendala
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).kendala || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kendala: e.target.value,
              })
            }
            placeholder="Kendala pemahaman siswa di kelas..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Solusi / Tindak Lanjut
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).solusi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                solusi: e.target.value,
              })
            }
            placeholder="Pendampingan remedial atau media tambahan..."
          />
        </div>
      </form>
    </Modal>
  );
}
