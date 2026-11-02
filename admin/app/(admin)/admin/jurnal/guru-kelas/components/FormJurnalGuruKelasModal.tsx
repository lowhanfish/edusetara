import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useModelPembelajaranOption } from "../hooks/crud";

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
  const { options: modelpembelajaranOptions, isLoading: modelpembelajaranLoading } = useModelPembelajaranOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jurnal Guru Kelas"
          : "✎ Edit Jurnal Guru Kelas"
      }
      description="Dokumentasi pelaksanaan KBM guru kelas, tema ajar, model pembelajaran, dan evaluasi harian."
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
            Tanggal Pelaksanaan KBM <span className="text-rose-500">*</span>
          </label>
          <Input
            type="date"
            required
            value={(formData as any).tgl || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tgl: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tema / Bahan Ajar <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Indahnya Kebersamaan"
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
            placeholder="Contoh: Keberagaman Suku Bangsa"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Pertemuan Ke-
          </label>
          <Input
            type="number"
            
            value={(formData as any).pertemuan_ke ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                pertemuan_ke: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Model Pembelajaran (Master Model)
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).model_pembelajaran;
              if (!cur) return "";
              const match = modelpembelajaranOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.value || match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                model_pembelajaran: e.target.value,
              })
            }
            options={[
              { value: "", label: modelpembelajaranLoading ? "Memuat opsi data master..." : "-- Pilih model pembelajaran --" },
              ...modelpembelajaranOptions.map((opt) => ({
                value: String(opt.value || opt.id),
                label: opt.value,
              })),
            ]}
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
            placeholder="Contoh: Diskusi, Demonstrasi, Tanya Jawab"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Uraian Ringkas Aktivitas KBM
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).kegiatan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kegiatan: e.target.value,
              })
            }
            placeholder="Ringkasan kegiatan mengajar..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Teknik Penilaian Pembelajaran
          </label>
          <Input
            
            value={(formData as any).penilaian || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                penilaian: e.target.value,
              })
            }
            placeholder="Contoh: Penilaian Sikap & Kuis Formatif"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jumlah Siswa Hadir
          </label>
          <Input
            type="number"
            
            value={(formData as any).siswa_hadir ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                siswa_hadir: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 28"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Persentase Kehadiran (%)
          </label>
          <Input
            type="number"
            
            value={(formData as any).persentase ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                persentase: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Dokumentasi / Foto KBM
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah foto KBM"
          />
        </div>
      </form>
    </Modal>
  );
}
