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
  JENIS_PENDAMPINGAN_OPTIONS,
  JurnalPengawasRecord,
  SEKOLAH_BINAAN_OPTIONS,
  STATUS_PENGAWAS_OPTIONS,
  TUGAS_PENGAWAS_OPTIONS,
} from "../types";

interface FormPengawasModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<JurnalPengawasRecord>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<JurnalPengawasRecord>>>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FormPengawasModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
}: FormPengawasModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formMode === "add" ? "Tambah Catatan Pengawas Pembina" : "Ubah Catatan Pengawas"}
      description="Pencatatan kunjungan supervisi akademik, evaluasi manajerial satuan pendidikan binaan, dan rekomendasi tindak lanjut."
      maxWidth="xl"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-pengawas-modal">
            {formMode === "add" ? "Simpan Supervisi" : "Simpan Perubahan"}
          </Button>
        </>
      }
    >
      <form id="form-pengawas-modal" onSubmit={onSubmit} className="space-y-4">
        {/* 2 Kolom: Sekolah Binaan & Kepala Sekolah Didampingi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Sekolah Binaan Dikunjungi <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.unit_kerja || SEKOLAH_BINAAN_OPTIONS[0]}
              onChange={(e) => setFormData({ ...formData, unit_kerja: e.target.value })}
            >
              {SEKOLAH_BINAAN_OPTIONS.map((sch) => (
                <option key={sch} value={sch}>
                  {sch}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Kepala Sekolah Didampingi <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.kepsek || ""}
              onChange={(e) => setFormData({ ...formData, kepsek: e.target.value })}
              placeholder="Nama Kepala Sekolah beserta gelar"
              required
            />
          </div>
        </div>

        {/* 2 Kolom: Jenis Pendampingan & Tugas Pengawasan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Jenis Pendampingan <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.pendampingan_id || JENIS_PENDAMPINGAN_OPTIONS[0]}
              onChange={(e) => setFormData({ ...formData, pendampingan_id: e.target.value })}
            >
              {JENIS_PENDAMPINGAN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Tugas Kepengawasan <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.tugas_id || TUGAS_PENGAWAS_OPTIONS[0]}
              onChange={(e) => setFormData({ ...formData, tugas_id: e.target.value })}
            >
              {TUGAS_PENGAWAS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* 2 Kolom: Temuan Akademik & Temuan Manajerial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Temuan Aspek Akademik / PBM <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={3}
              value={formData.temuan_akademik || ""}
              onChange={(e) => setFormData({ ...formData, temuan_akademik: e.target.value })}
              placeholder="Catatan hasil observasi proses belajar mengajar guru di kelas..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Temuan Aspek Manajerial / Sarpras <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={3}
              value={formData.temuan_manajerial || ""}
              onChange={(e) => setFormData({ ...formData, temuan_manajerial: e.target.value })}
              placeholder="Catatan administrasi kurikulum, ARKAS, fasilitas, dsb..."
              required
            />
          </div>
        </div>

        {/* Arahan Rekomendasi / Tindak Lanjut */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
            Arahan Rekomendasi & Rencana Tindak Lanjut <span className="text-red-500">*</span>
          </label>
          <Textarea
            rows={2}
            value={formData.tindak_lanjut || ""}
            onChange={(e) => setFormData({ ...formData, tindak_lanjut: e.target.value })}
            placeholder="Instruksi perbaikan bagi kepala sekolah dan guru binaan..."
            required
          />
        </div>

        {/* 2 Kolom: Tanggal & Status Supervisi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <DateInput
              label="Tanggal Kunjungan Supervisi"
              value={formData.tgl || new Date().toISOString().split("T")[0]}
              onChange={(val) => setFormData({ ...formData, tgl: val })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Status Supervisi <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.status || STATUS_PENGAWAS_OPTIONS[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as JurnalPengawasRecord["status"],
                })
              }
            >
              {STATUS_PENGAWAS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* FileInput untuk instrumen pengawasan */}
        <div>
          <FileInput
            label="Lembar Instrumen Supervisi / Foto Pendampingan"
            accept=".pdf,image/*"
            value={formData.file || ""}
            onChange={(val) => setFormData({ ...formData, file: val })}
            helperText="Unggah scan instrumen bertanda tangan atau dokumentasi visitasi (Maks. 10MB)"
          />
        </div>
      </form>
    </Modal>
  );
}
