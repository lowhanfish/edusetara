"use client";

import React from "react";
import {
  Button,
  DateInput,
  FileInput,
  Input,
  Modal,
  Select,
  Textarea,
} from "../../../../_components/ui";
import {
  JurnalKepalaSekolahRecord,
  KETERLIBATAN_OPTIONS,
  STATUS_KEPSEK_OPTIONS,
} from "../types";

interface FormKepsekModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<JurnalKepalaSekolahRecord>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<JurnalKepalaSekolahRecord>>>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FormKepsekModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
}: FormKepsekModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formMode === "add" ? "Tambah Jurnal Kepala Sekolah" : "Ubah Jurnal Kepala Sekolah"}
      description="Pencatatan agenda kepemimpinan manajerial, supervisi guru/tendik, pengelolaan anggaran, dan koordinasi stakeholder."
      maxWidth="xl"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-kepsek-modal">
            {formMode === "add" ? "Simpan Jurnal" : "Simpan Perubahan"}
          </Button>
        </>
      }
    >
      <form id="form-kepsek-modal" onSubmit={onSubmit} className="space-y-4">
        {/* Satuan Pendidikan (Readonly display context) */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
            Satuan Pendidikan / Unit Kerja
          </label>
          <Input
            value={formData.sekolah || "SMP Negeri 1 Andoolo"}
            onChange={(e) => setFormData({ ...formData, sekolah: e.target.value })}
            placeholder="Contoh: SMP Negeri 1 Andoolo"
            required
          />
        </div>

        {/* Uraian Agenda / Tugas Manajerial */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
            Uraian Tugas / Agenda Kepemimpinan <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.uraian || ""}
            onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
            placeholder="Contoh: Supervisi Akademik & Observasi Pembelajaran Modul Kurikulum Merdeka"
            required
          />
        </div>

        {/* 2 Kolom: Target Capaian & Hasil Terealisasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Target Capaian Sasaran <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={3}
              value={formData.target || ""}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              placeholder="Jelaskan sasaran indikator atau target yang ingin dicapai..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Hasil / Output Terealisasi <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={3}
              value={formData.hasil || ""}
              onChange={(e) => setFormData({ ...formData, hasil: e.target.value })}
              placeholder="Rincian hasil konkret, temuan lapangan, atau kesepakatan rapat..."
              required
            />
          </div>
        </div>

        {/* 3 Kolom: Tanggal Pelaksanaan, Keterlibatan Stakeholder, Status Realisasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div>
            <DateInput
              label="Tanggal Pelaksanaan"
              value={formData.tgl || new Date().toISOString().split("T")[0]}
              onChange={(val) => setFormData({ ...formData, tgl: val })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Pihak Terlibat / Stakeholder <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.keterlibatan || KETERLIBATAN_OPTIONS[0]}
              onChange={(e) => setFormData({ ...formData, keterlibatan: e.target.value })}
            >
              {KETERLIBATAN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Status Realisasi <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.status || STATUS_KEPSEK_OPTIONS[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as JurnalKepalaSekolahRecord["status"],
                })
              }
            >
              {STATUS_KEPSEK_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Catatan Arahan Manajerial */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
            Catatan Arahan & Tindak Lanjut Manajerial
          </label>
          <Textarea
            rows={2}
            value={formData.keterangan || ""}
            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
            placeholder="Tambahkan catatan khusus, nomor surat dinas, atau arahan strategis..."
          />
        </div>

        {/* Unggah Dokumen Pendukung / Notula (FileInput) */}
        <div>
          <FileInput
            label="Dokumen Notula / Bukti Fisik / Foto Kegiatan"
            accept=".pdf,image/*"
            value={formData.file || ""}
            onChange={(val) => setFormData({ ...formData, file: val })}
            helperText="Format didukung: PDF, PNG, JPG (Maks. 10MB)"
          />
        </div>
      </form>
    </Modal>
  );
}
