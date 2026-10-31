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
  BIDANG_LAYANAN_BK,
  JurnalBKRecord,
  KELAS_BK_OPTIONS,
  MODEL_KEGIATAN_BK,
  STATUS_BK_OPTIONS,
} from "../types";

interface FormBKModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<JurnalBKRecord>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<JurnalBKRecord>>>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FormBKModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
}: FormBKModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formMode === "add" ? "Tambah Catatan Konseling BK" : "Ubah Catatan BK"}
      description="Pencatatan layanan konseling individual, bimbingan kelompok, home visit, serta pemantauan perkembangan konseli."
      maxWidth="xl"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-bk-modal">
            {formMode === "add" ? "Simpan Catatan BK" : "Simpan Perubahan"}
          </Button>
        </>
      }
    >
      <form id="form-bk-modal" onSubmit={onSubmit} className="space-y-4">
        {/* 2 Kolom: Nama Siswa Konseli & Kelas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Nama Siswa Konseli / Sasaran <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.nm_siswa || ""}
              onChange={(e) => setFormData({ ...formData, nm_siswa: e.target.value })}
              placeholder="Contoh: Ahmad Rizky Pratama"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Rombel / Kelas <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.kelas_id || KELAS_BK_OPTIONS[0]}
              onChange={(e) => setFormData({ ...formData, kelas_id: e.target.value })}
            >
              {KELAS_BK_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* 2 Kolom: Model Kegiatan & Bidang Layanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Model Kegiatan Layanan <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.mdl_kegiatan_id || MODEL_KEGIATAN_BK[0]}
              onChange={(e) => setFormData({ ...formData, mdl_kegiatan_id: e.target.value })}
            >
              {MODEL_KEGIATAN_BK.map((mdl) => (
                <option key={mdl} value={mdl}>
                  {mdl}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Bidang Bimbingan <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.jns_layanan_id || BIDANG_LAYANAN_BK[0]}
              onChange={(e) => setFormData({ ...formData, jns_layanan_id: e.target.value })}
            >
              {BIDANG_LAYANAN_BK.map((bdg) => (
                <option key={bdg} value={bdg}>
                  {bdg}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Topik / Materi Layanan */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
            Materi / Topik Layanan <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.materi_layanan || ""}
            onChange={(e) => setFormData({ ...formData, materi_layanan: e.target.value })}
            placeholder="Contoh: Eksplorasi Minat Bakat dan Pemilihan Jurusan SMA/SMK"
            required
          />
        </div>

        {/* 2 Kolom: Latar Belakang Masalah & Hasil / Kesepakatan Solusi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Gejala / Latar Belakang Masalah <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={3}
              value={formData.permasalahan || ""}
              onChange={(e) => setFormData({ ...formData, permasalahan: e.target.value })}
              placeholder="Deskripsi singkat situasi atau keluhan konseli..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Hasil Konseling & Kesepakatan Solusi <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={3}
              value={formData.hasil || ""}
              onChange={(e) => setFormData({ ...formData, hasil: e.target.value })}
              placeholder="Komitmen tindakan yang disepakati siswa bersama konselor..."
              required
            />
          </div>
        </div>

        {/* Rencana Tindak Lanjut */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
            Rencana Tindak Lanjut (RTL) <span className="text-red-500">*</span>
          </label>
          <Textarea
            rows={2}
            value={formData.rnc_tindak_lanjut || ""}
            onChange={(e) => setFormData({ ...formData, rnc_tindak_lanjut: e.target.value })}
            placeholder="Rencana sesi evaluasi lanjutan, kolaborasi dengan orang tua atau wali kelas..."
            required
          />
        </div>

        {/* 2 Kolom: Tanggal & Status Kasus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <DateInput
              label="Tanggal Sesi Konseling"
              value={formData.tgl || new Date().toISOString().split("T")[0]}
              onChange={(val) => setFormData({ ...formData, tgl: val })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Status Penanganan <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.status || STATUS_BK_OPTIONS[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as JurnalBKRecord["status"],
                })
              }
            >
              {STATUS_BK_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Catatan Tambahan Perkembangan */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
            Catatan Tambahan & Observasi Perilaku
          </label>
          <Input
            value={formData.keterangan || ""}
            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
            placeholder="Karakteristik respon siswa, catatan khusus guru BK..."
          />
        </div>

        {/* FileInput untuk instrumen konseling */}
        <div>
          <FileInput
            label="Lembar Asesmen / Kontrak Perilaku / Foto Sesi"
            accept=".pdf,image/*"
            value={formData.file || ""}
            onChange={(val) => setFormData({ ...formData, file: val })}
            helperText="Unggah scan lembar konseling, surat komitmen, atau foto sesi (Maks. 10MB)"
          />
        </div>
      </form>
    </Modal>
  );
}
