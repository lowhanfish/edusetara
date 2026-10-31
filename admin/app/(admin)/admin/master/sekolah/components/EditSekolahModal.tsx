"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Select } from "../../../../_components/ui";
import { SekolahRecord, SekolahUpdatePayload } from "../types";

interface EditSekolahModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SekolahRecord | null;
  onSave: (id: string, payload: SekolahUpdatePayload) => void;
  isLoading?: boolean;
}

const KECAMATAN_OPTIONS = [
    "Andoolo", "Andoolo Barat", "Angata", "Baito", "Basala", "Benua", "Buke",
    "Kolono", "Kolono Timur", "Konda", "Laeya", "Lainea", "Lalembuu", "Landono",
    "Laonti", "Moramo", "Moramo Utara", "Mowila", "Palangga", "Palangga Selatan",
    "Ranomeeto", "Ranomeeto Barat", "Sabulakoa", "Tinanggea", "Wolasi"
];

export default function EditSekolahModal({
  isOpen,
  onClose,
  record,
  onSave,
  isLoading = false,
}: EditSekolahModalProps) {
  const [formData, setFormData] = useState<SekolahUpdatePayload>({
    jenjang: "SD",
    status_sekolah: "NEGERI",
    npsn: "",
    akreditasi: "",
    kecamatan: "",
    desa_kelurahan: "",
    is_active: true,
  });

  useEffect(() => {
    if (record) {
      setFormData({
        jenjang: record.jenjang || "SD",
        status_sekolah: record.status_sekolah || "NEGERI",
        npsn: record.npsn || "",
        akreditasi: record.akreditasi || "",
        kecamatan: record.kecamatan || "",
        desa_kelurahan: record.desa_kelurahan || "",
        is_active: record.is_active ?? true,
      });
    }
  }, [record]);

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(record.unit_kerja_id, {
      jenjang: formData.jenjang,
      status_sekolah: formData.status_sekolah,
      npsn: formData.npsn ? formData.npsn.trim() : null,
      akreditasi: formData.akreditasi ? formData.akreditasi.trim() : null,
      kecamatan: formData.kecamatan ? formData.kecamatan.trim() : null,
      desa_kelurahan: formData.desa_kelurahan ? formData.desa_kelurahan.trim() : null,
      is_active: formData.is_active,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Perbarui Metadata Satuan Pendidikan"
      description={`Ubah klasifikasi jenjang, NPSN, akreditasi, atau wilayah untuk ${record.nama_sekolah}. Identitas nama dan alamat tetap sinkron dengan SIMPEG.`}
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-edit-sekolah" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </>
      }
    >
      <form id="form-edit-sekolah" onSubmit={handleSubmit} className="space-y-4">
        {/* Banner Lembaga */}
        <div className="p-3 bg-amber-500/10 border border-amber-300/30 rounded-lg">
          <p className="text-xs font-bold text-[#2d2410]">{record.nama_sekolah}</p>
          <p className="text-[11px] text-[#7d7152]">ID SIMPEG: {record.unit_kerja_id}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nomor Pokok Sekolah Nasional (NPSN)"
            placeholder="8 Digit NPSN (misal: 40402064)"
            value={formData.npsn || ""}
            onChange={(e: any) => setFormData({ ...formData, npsn: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Peringkat Akreditasi BAN-S/M
            </label>
            <Select
              value={formData.akreditasi || ""}
              onChange={(e: any) => setFormData({ ...formData, akreditasi: e.target.value })}
            >
              <option value="">Belum Terakreditasi</option>
              <option value="A">A (Unggul)</option>
              <option value="B">B (Baik)</option>
              <option value="C">C (Cukup)</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Klasifikasi Jenjang Pendidikan
            </label>
            <Select
              value={formData.jenjang}
              onChange={(e: any) => setFormData({ ...formData, jenjang: e.target.value })}
            >
              <option value="PAUD">PAUD (Pendidikan Anak Usia Dini)</option>
              <option value="TK">TK (Taman Kanak-Kanak)</option>
              <option value="SD">SD (Sekolah Dasar)</option>
              <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
              <option value="SATAP">SATAP (Satu Atap SD & SMP)</option>
              <option value="PKBM">PKBM / SKB (Nonformal Kesetaraan)</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Status Kelembagaan
            </label>
            <Select
              value={formData.status_sekolah}
              onChange={(e: any) => setFormData({ ...formData, status_sekolah: e.target.value })}
            >
              <option value="NEGERI">Negeri (Pemerintah Daerah)</option>
              <option value="SWASTA">Swasta (Yayasan / Swasta)</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Kecamatan (Kab. Konawe Selatan)
            </label>
            <Select
              value={formData.kecamatan || ""}
              onChange={(e: any) => setFormData({ ...formData, kecamatan: e.target.value })}
            >
              <option value="">-- Pilih Kecamatan --</option>
              {KECAMATAN_OPTIONS.map((kec) => (
                <option key={kec} value={kec}>
                  {kec}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Desa / Kelurahan"
            placeholder="Contoh: Ranomeeto, Lalonggombu"
            value={formData.desa_kelurahan || ""}
            onChange={(e: any) => setFormData({ ...formData, desa_kelurahan: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
}
