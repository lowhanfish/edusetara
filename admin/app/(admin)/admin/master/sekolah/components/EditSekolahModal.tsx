"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Select } from "../../../../_components/ui";
import { SekolahRecord, SekolahUpdatePayload } from "../types";
import SimdaIdentity from "./SimdaIdentity";
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
  const [simdaUpb, setSimdaUpb] = useState<SekolahRecord["simda_upb"]>(null);
  const [simdaChanged, setSimdaChanged] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setSimdaUpb(record?.simda_upb ?? null);
      setSimdaChanged(false);
    }
  }, [record, isOpen]);

  const { kecamatanList, isLoading: isKecLoading } = useKecamatanList();

  const [formData, setFormData] = useState<SekolahUpdatePayload>({
    nama_sekolah: "",
    bentuk_pendidikan: "SD",
    jenjang: "SD",
    status_sekolah: "NEGERI",
    npsn: "",
    akreditasi: "",
    kecamatan_id: null,
    kecamatan: "",
    desa_kelurahan_id: null,
    desa_kelurahan: "",
    alamat_jalan: "",
    latitude: null,
    longitude: null,
    simpeg_unit_kerja_id: "",
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
        nama_sekolah: record.nama_sekolah || "",
        bentuk_pendidikan: record.bentuk_pendidikan || record.jenjang || "SD",
        jenjang: record.bentuk_pendidikan || record.jenjang || "SD",
        status_sekolah: record.status_sekolah || "NEGERI",
        npsn: record.npsn || "",
        akreditasi: record.akreditasi || "",
        kecamatan_id: matchedKecId,
        kecamatan: record.kecamatan || "",
        desa_kelurahan_id: record.desa_kelurahan_id || null,
        desa_kelurahan: record.desa_kelurahan || "",
        alamat_jalan: record.alamat_jalan || record.alamat || "",
        latitude: record.latitude ?? null,
        longitude: record.longitude ?? null,
        simpeg_unit_kerja_id: record.simpeg_unit_kerja_id || "",
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
    onSave(record.id || record.npsn, {
      ...(simdaChanged ? { simda_upb_id: simdaUpb?.id ?? null } : {}),
      nama_sekolah: formData.nama_sekolah?.trim(),
      bentuk_pendidikan: formData.bentuk_pendidikan || formData.jenjang,
      jenjang: formData.bentuk_pendidikan || formData.jenjang,
      status_sekolah: formData.status_sekolah,
      npsn: formData.npsn ? formData.npsn.trim() : null,
      akreditasi: formData.akreditasi ? formData.akreditasi.trim() : null,
      kecamatan_id: formData.kecamatan_id,
      kecamatan: formData.kecamatan ? formData.kecamatan.trim() : null,
      desa_kelurahan_id: formData.desa_kelurahan_id,
      desa_kelurahan: formData.desa_kelurahan ? formData.desa_kelurahan.trim() : null,
      alamat_jalan: formData.alamat_jalan ? formData.alamat_jalan.trim() : null,
      latitude: formData.latitude !== null && !isNaN(Number(formData.latitude)) ? Number(formData.latitude) : null,
      longitude: formData.longitude !== null && !isNaN(Number(formData.longitude)) ? Number(formData.longitude) : null,
      simpeg_unit_kerja_id: formData.simpeg_unit_kerja_id ? formData.simpeg_unit_kerja_id.trim() : null,
      is_active: formData.is_active,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Perbarui Data Satuan Pendidikan"
      description={`Ubah klasifikasi jenjang, NPSN, akreditasi, wilayah resmi, koordinat GPS, atau tautan SIMPEG untuk ${record.nama_sekolah}.`}
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
        <div className="p-3 bg-amber-500/10 border border-amber-300/30 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#2d2410]">{record.nama_sekolah}</p>
            <p className="text-[11px] text-[#7d7152]">
              NPSN: <span className="font-mono font-bold text-[#2d2410]">{record.npsn}</span>
              {record.simpeg_unit_kerja_id ? ` • ID SIMPEG: ${record.simpeg_unit_kerja_id}` : " • Data Mandiri Dapodik"}
            </p>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-200/60 text-amber-900">
            {record.bentuk_pendidikan || record.jenjang}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nomor Pokok Sekolah Nasional (NPSN)"
            placeholder="8 Karakter NPSN (misal: 40402064)"
            value={formData.npsn || ""}
            onChange={(e: any) => setFormData({ ...formData, npsn: e.target.value })}
            required
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
              <option value="Tidak Terakreditasi">Tidak Terakreditasi</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1.5">
              Bentuk Pendidikan / Jenjang
            </label>
            <Select
              value={formData.bentuk_pendidikan || formData.jenjang}
              onChange={(e: any) => setFormData({ ...formData, bentuk_pendidikan: e.target.value, jenjang: e.target.value })}
            >
              <option value="SD">SD (Sekolah Dasar)</option>
              <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
              <option value="TK">TK (Taman Kanak-Kanak)</option>
              <option value="KB">KB (Kelompok Bermain)</option>
              <option value="PAUD">PAUD</option>
              <option value="PKBM">PKBM (Pusat Kegiatan Belajar Masyarakat)</option>
              <option value="SKB">SKB (Sanggar Kegiatan Belajar)</option>
              <option value="MI">MI (Madrasah Ibtidaiyah)</option>
              <option value="MTS">MTs (Madrasah Tsanawiyah)</option>
              <option value="MA">MA (Madrasah Aliyah)</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
              <option value="SLB">SLB</option>
              <option value="SATAP">SATAP (Satu Atap)</option>
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
              <option value="NEGERI">Negeri (Pemerintah)</option>
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
                Nama asal: <span className="font-semibold">{formData.desa_kelurahan}</span>
              </p>
            )}
          </div>
        </div>

        <SimdaIdentity schoolId={record.id} value={simdaUpb} editable disabled={isLoading}
          onChange={(unit) => { setSimdaUpb(unit); setSimdaChanged(true); }} />

        <Input
          label="Alamat Jalan / Lokasi"
          placeholder="Nama jalan, nomor, atau patokan lokasi"
          value={formData.alamat_jalan || ""}
          onChange={(e: any) => setFormData({ ...formData, alamat_jalan: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Latitude (Lintang)"
            placeholder="Contoh: -4.1140"
            value={formData.latitude !== null && formData.latitude !== undefined ? String(formData.latitude) : ""}
            onChange={(e: any) => setFormData({ ...formData, latitude: e.target.value ? Number(e.target.value) : null })}
          />
          <Input
            label="Longitude (Bujur)"
            placeholder="Contoh: 122.2080"
            value={formData.longitude !== null && formData.longitude !== undefined ? String(formData.longitude) : ""}
            onChange={(e: any) => setFormData({ ...formData, longitude: e.target.value ? Number(e.target.value) : null })}
          />
          <div>
            <Input
              label="ID Unit Kerja SIMPEG"
              placeholder="Kosongkan jika belum dipetakan"
              value={formData.simpeg_unit_kerja_id || ""}
              onChange={(e: any) => setFormData({ ...formData, simpeg_unit_kerja_id: e.target.value })}
            />
            {formData.simpeg_unit_kerja_nama && (
              <p className="mt-1 text-[11px] text-sky-800 font-medium truncate" title={formData.simpeg_unit_kerja_nama}>
                🏛️ {formData.simpeg_unit_kerja_nama}
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
