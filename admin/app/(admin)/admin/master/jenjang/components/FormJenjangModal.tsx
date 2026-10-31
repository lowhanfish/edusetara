import React from "react";
import { Button, Input, Modal, Select, Textarea } from "../../../../_components/ui";
import { JenjangRecord, KATEGORI_JENJANG_OPTIONS, STATUS_JENJANG_OPTIONS } from "../types";

interface FormJenjangModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<JenjangRecord>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<JenjangRecord>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormJenjangModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormJenjangModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Master Jenjang Pendidikan"
          : "✎ Edit Master Jenjang Pendidikan"
      }
      description="Lengkapi kode identitas, nama jenjang pendidikan, kategori kelembagaan, dan bidang pembina kedinasan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-jenjang" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Master Jenjang"
              : "Perbarui Jenjang"}
          </Button>
        </>
      }
    >
      <form id="form-master-jenjang" onSubmit={onSubmit} className="space-y-4">
        {/* Kode & Nama Jenjang */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Kode Jenjang <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              value={formData.id || ""}
              disabled={formMode === "edit"}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="Contoh: JJG-05"
            />
            <p className="text-[10px] text-[#9c8e6b] mt-1">
              {formMode === "edit" ? "Kode unik bersifat permanen" : "Kode unik jenjang"}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Nama Jenjang Pendidikan <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              value={formData.uraian || ""}
              onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
              placeholder="Contoh: SLB (Sekolah Luar Biasa)"
            />
          </div>
        </div>

        {/* Kategori & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Kategori Jalur Pendidikan
            </label>
            <Select
              value={formData.kategori || KATEGORI_JENJANG_OPTIONS[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kategori: e.target.value as JenjangRecord["kategori"],
                })
              }
            >
              {KATEGORI_JENJANG_OPTIONS.map((kat) => (
                <option key={kat} value={kat}>
                  Jalur {kat}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Status Operasional
            </label>
            <Select
              value={formData.status || STATUS_JENJANG_OPTIONS[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as JenjangRecord["status"],
                })
              }
            >
              {STATUS_JENJANG_OPTIONS.map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Bidang Pembina / Unit Kerja */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Bidang Pembina / Unit Kerja Dinas
          </label>
          <Input
            value={formData.unit_kerja || ""}
            onChange={(e) => setFormData({ ...formData, unit_kerja: e.target.value })}
            placeholder="Contoh: Bidang Pembinaan Sekolah Dasar / Dikdas"
          />
        </div>

        {/* Keterangan */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Keterangan & Rujukan Regulasi
          </label>
          <Textarea
            rows={3}
            value={formData.keterangan || ""}
            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
            placeholder="Keterangan cakupan jenjang, usia peserta didik, atau dasar hukum penetapan..."
          />
        </div>
      </form>
    </Modal>
  );
}
