import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useBangunanOption, useKelasOption, useKondisiOption } from "../hooks/crud";

interface FormSarprasRuangModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormSarprasRuangModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormSarprasRuangModalProps) {
  const { options: bangunanOptions, isLoading: bangunanLoading } = useBangunanOption();
  const { options: kelasOptions, isLoading: kelasLoading } = useKelasOption();
  const { options: kondisiOptions, isLoading: kondisiLoading } = useKondisiOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Ruang Sekolah"
          : "✎ Edit Ruang Sekolah"
      }
      description="Pemetaan unit ruangan spesifik yang berada di dalam bangunan sekolah."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-sarpras-ruang" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Ruang Sekolah"
              : "Perbarui Ruang Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-sarpras-ruang" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Unit Bangunan / Gedung
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).bangunan_id;
              if (!cur) return "";
              const match = bangunanOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                bangunan_id: e.target.value,
              })
            }
            options={[
              { value: "", label: bangunanLoading ? "Memuat opsi data master..." : "-- Pilih gedung/bangunan --" },
              ...bangunanOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tingkat / Kelas Rujukan
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).kelas_id;
              if (!cur) return "";
              const match = kelasOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                kelas_id: e.target.value,
              })
            }
            options={[
              { value: "", label: kelasLoading ? "Memuat opsi data master..." : "-- Pilih kelas --" },
              ...kelasOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Ruangan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nama || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama: e.target.value,
              })
            }
            placeholder="Contoh: Ruangan Kelas 1A / Lab Komputer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Luas Ruangan (m²)
          </label>
          <Input
            
            value={(formData as any).luas || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                luas: e.target.value,
              })
            }
            placeholder="Contoh: 56 m²"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kondisi Ruangan
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).kondisi_id;
              if (!cur) return "";
              const match = kondisiOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                kondisi_id: e.target.value,
              })
            }
            options={[
              { value: "", label: kondisiLoading ? "Memuat opsi data master..." : "-- Pilih kondisi ruangan --" },
              ...kondisiOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
