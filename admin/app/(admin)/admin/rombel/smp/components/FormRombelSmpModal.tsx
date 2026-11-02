import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useJenjangOption, useRuangOption } from "../hooks/crud";

interface FormRombelSmpModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormRombelSmpModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormRombelSmpModalProps) {
  const { options: jenjangOptions, isLoading: jenjangLoading } = useJenjangOption();
  const { options: ruangOptions, isLoading: ruangLoading } = useRuangOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Rombel Jenjang SMP"
          : "✎ Edit Rombel Jenjang SMP"
      }
      description="Pengelolaan rombongan belajar tingkat sekolah menengah pertama."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-rombel-smp" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Rombel Jenjang SMP"
              : "Perbarui Rombel Jenjang SMP"}
          </Button>
        </>
      }
    >
      <form id="form-rombel-smp" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Rombel SMP <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Kelas VII A"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tingkat Pendidikan / Jenjang
          </label>
          <Select
            
            value={(formData as any).tgkt_pendidikan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tgkt_pendidikan: e.target.value,
              })
            }
            options={[
              { value: "", label: jenjangLoading ? "Memuat opsi data master..." : "-- Pilih jenjang pendidikan --" },
              ...jenjangOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Wali Kelas
          </label>
          <Input
            
            value={(formData as any).wali_kelas || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                wali_kelas: e.target.value,
              })
            }
            placeholder="Nama wali kelas"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenis Rombel
          </label>
          <Select
            
            value={(formData as any).jns_rombel ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jns_rombel: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih jenis rombel --" },
              ...[{"value":"0","label":"Kelas Reguler"},{"value":"1","label":"Kelas Jauh/Kecil"},{"value":"2","label":"Kelas Terbuka"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Ruang Kelas (Sarpras Ruang)
          </label>
          <Select
            
            value={(formData as any).ruang_kelas || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ruang_kelas: e.target.value,
              })
            }
            options={[
              { value: "", label: ruangLoading ? "Memuat opsi data master..." : "-- Pilih ruang belajar --" },
              ...ruangOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kurikulum
          </label>
          <Select
            
            value={(formData as any).kurikulum ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kurikulum: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih kurikulum --" },
              ...[{"value":"Kurikulum Merdeka","label":"Kurikulum Merdeka"},{"value":"Kurikulum 2013","label":"Kurikulum 2013"}]
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
