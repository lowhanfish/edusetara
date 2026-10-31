"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Select } from "../../../../_components/ui";
import { SekolahRecord, SekolahUpdatePayload } from "../types";
import { useKecamatanList, useDesaKelurahanList } from "../hooks/crud";

interface EditSekolahModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SekolahRecord | null;
  onSave: (id: string, payload: SekolahUpdatePayload) => void;
  isLoading?: boolean;
}

export default function EditSekolahModal({
  isOpen,
  onClose,
  record,
  onSave,
  isLoading = false,
}: EditSekolahModalProps) {
  const { kecamatanList, isLoading: isKecLoading } = useKecamatanList();

  const [formData, setFormData] = useState<SekolahUpdatePayload>({
    jenjang: "SD",
    status_sekolah: "NEGERI",
    npsn: "",
    akreditasi: "",
    kecamatan_id: null,
    kecamatan: "",
    desa_kelurahan_id: null,
    desa_kelurahan: "",
    is_active: true,
  });

  const { desaList, isLoading: isDesaLoading } = useDesaKelurahanList(formData.kecamatan_id);

  // Sync form data with incoming record
  useEffect(() => {
    if (record) {
      let matchedKecId = record.kecamatan_id || null;
      if (!matchedKecId && record.kecamatan && kecamatanList.length > 0) {
        const found = kecamatanList.find(
          (k) => k.nama.toUpperCase() === record.kecamatan?.toUpperCase()
        );
        if (found) matchedKecId = found.id;
      }

      setFormData({
        jenjang: record.jenjang || "SD",
        status_sekolah: record.status_sekolah || "NEGERI",
        npsn: record.npsn || "",
        akreditasi: record.akreditasi || "",
        kecamatan_id: matchedKecId,
        kecamatan: record.kecamatan || "",
        desa_kelurahan_id: record.desa_kelurahan_id || null,
        desa_kelurahan: record.desa_kelurahan || "",
        is_active: record.is_active ?? true,
      });
    }
  }, [record, kecamatanList]);

  // If desa_kelurahan_id is null but text exists, attempt auto-match once desaList is loaded
  useEffect(() => {
    if (formData.desa_kelurahan && !formData.desa_kelurahan_id && desaList.length > 0) {
      const match = desaList.find(
        (d) => d.nama.toUpperCase() === formData.desa_kelurahan?.toUpperCase()
      );
      if (match) {
        setFormData((prev) => ({
          ...prev,
          desa_kelurahan_id: match.id,
          desa_kelurahan: match.label,
        }));
      }
    }
  }, [desaList, formData.desa_kelurahan, formData.desa_kelurahan_id]);

  if (!record) return null;

  const handleKecamatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value ? Number(e.target.value) : null;
    const selectedKec = kecamatanList.find((k) => k.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      kecamatan_id: selectedId,
      kecamatan: selectedKec ? selectedKec.label : null,
      desa_kelurahan_id: null,
      desa_kelurahan: null,
    }));
  };

  const handleDesaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value ? Number(e.target.value) : null;
    const selectedDes = desaList.find((d) => d.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      desa_kelurahan_id: selectedId,
      desa_kelurahan: selectedDes ? selectedDes.label : null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(record.unit_kerja_id, {
      jenjang: formData.jenjang,
      status_sekolah: formData.status_sekolah,
      npsn: formData.npsn ? formData.npsn.trim() : null,
      akreditasi: formData.akreditasi ? formData.akreditasi.trim() : null,
      kecamatan_id: formData.kecamatan_id,
      kecamatan: formData.kecamatan ? formData.kecamatan.trim() : null,
      desa_kelurahan_id: formData.desa_kelurahan_id,
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
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5 flex items-center justify-between">
              <span>Kecamatan (Kab. Konawe Selatan)</span>
              {isKecLoading && <span className="text-[10px] text-amber-600 font-normal">Memuat...</span>}
            </label>
            <Select
              value={formData.kecamatan_id ? String(formData.kecamatan_id) : ""}
              onChange={handleKecamatanChange}
              disabled={isKecLoading}
            >
              <option value="">-- Pilih Kecamatan --</option>
              {kecamatanList.map((kec) => (
                <option key={kec.id} value={String(kec.id)}>
                  {kec.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5 flex items-center justify-between">
              <span>Desa / Kelurahan</span>
              {isDesaLoading && <span className="text-[10px] text-amber-600 font-normal">Memuat desa...</span>}
            </label>
            <Select
              value={formData.desa_kelurahan_id ? String(formData.desa_kelurahan_id) : ""}
              onChange={handleDesaChange}
              disabled={!formData.kecamatan_id || isDesaLoading}
            >
              <option value="">
                {!formData.kecamatan_id
                  ? "-- Pilih Kecamatan Terlebih Dahulu --"
                  : isDesaLoading
                  ? "-- Memuat Desa/Kelurahan... --"
                  : "-- Pilih Desa / Kelurahan --"}
              </option>
              {desaList.map((desa) => (
                <option key={desa.id} value={String(desa.id)}>
                  {desa.label}
                </option>
              ))}
            </Select>
            {formData.desa_kelurahan && !formData.desa_kelurahan_id && (
              <p className="mt-1 text-[11px] text-amber-700">
                Data lama: <span className="font-semibold">{formData.desa_kelurahan}</span> (silakan pilih opsi resmi E-Gov)
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
