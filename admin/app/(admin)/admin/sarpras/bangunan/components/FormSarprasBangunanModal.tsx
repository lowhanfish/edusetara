import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useKepemilikanOption, useKondisiOption, useJenisBantuanOption, useSumberDanaOption } from "../hooks/crud";

interface FormSarprasBangunanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormSarprasBangunanModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormSarprasBangunanModalProps) {
  const { options: kepemilikanOptions, isLoading: kepemilikanLoading } = useKepemilikanOption();
  const { options: kondisiOptions, isLoading: kondisiLoading } = useKondisiOption();
  const { options: jenisbantuanOptions, isLoading: jenisbantuanLoading } = useJenisBantuanOption();
  const { options: sumberdanaOptions, isLoading: sumberdanaLoading } = useSumberDanaOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Bangunan Sekolah"
          : "✎ Edit Bangunan Sekolah"
      }
      description="Pendataan fisik gedung, luasan tapak, kelaikan bangunan, dan status hak kepemilikan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-sarpras-bangunan" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Bangunan Sekolah"
              : "Perbarui Bangunan Sekolah"}
          </Button>
        </>
      }
    >
      <form id="form-sarpras-bangunan" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Unit Gedung / Bangunan Sekolah <span className="text-rose-500">*</span>
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
            placeholder="Contoh: Gedung Kelas 1 / RKB UNIT 1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Luas Tapak Bangunan (m²)
          </label>
          <Input
            
            value={(formData as any).luas || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                luas: e.target.value,
              })
            }
            placeholder="Contoh: 800 m²"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Kepemilikan
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).kepemilikan_id;
              if (!cur) return "";
              const match = kepemilikanOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                kepemilikan_id: e.target.value,
              })
            }
            options={[
              { value: "", label: kepemilikanLoading ? "Memuat opsi data master..." : "-- Pilih status kepemilikan --" },
              ...kepemilikanOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Bangunan
          </label>
          <Input
            
            value={(formData as any).tahun || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahun: e.target.value,
              })
            }
            placeholder="Contoh: 2020"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Persentase Kerusakan Bangunan (%)
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
            placeholder="Contoh: 0"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kondisi Bangunan
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
              { value: "", label: kondisiLoading ? "Memuat opsi data master..." : "-- Pilih kondisi bangunan --" },
              ...kondisiOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenis Bantuan
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).jns_bantuan_id;
              if (!cur) return "";
              const match = jenisbantuanOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                jns_bantuan_id: e.target.value,
              })
            }
            options={[
              { value: "", label: jenisbantuanLoading ? "Memuat opsi data master..." : "-- Pilih jenis bantuan --" },
              ...jenisbantuanOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Sumber Dana
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).sumber_id;
              if (!cur) return "";
              const match = sumberdanaOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                sumber_id: e.target.value,
              })
            }
            options={[
              { value: "", label: sumberdanaLoading ? "Memuat opsi data master..." : "-- Pilih sumber dana --" },
              ...sumberdanaOptions.map((opt) => ({
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
