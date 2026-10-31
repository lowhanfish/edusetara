import React from "react";
import {
  Badge,
  Button,
  DateInput,
  FileInput,
  Input,
  Modal,
  Select,
  Textarea,
} from "../../../../_components/ui";
import {
  JurnalGuruKelasRecord,
  MODEL_OPTIONS,
  METODE_OPTIONS,
  PENILAIAN_OPTIONS,
} from "../types";

interface FormJurnalModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<JurnalGuruKelasRecord>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<JurnalGuruKelasRecord>>>;
  onSubmit: (e: React.FormEvent) => void;
  handlePresenceChange: (
    field: "siswa_hadir" | "siswa_izin" | "siswa_sakit" | "siswa_alpa",
    value: number
  ) => void;
}

export default function FormJurnalModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  handlePresenceChange,
}: FormJurnalModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jurnal Pembelajaran Guru Kelas"
          : "✎ Edit Jurnal Pembelajaran"
      }
      description="Lengkapi rekaman sintaks kegiatan mengajar, kehadiran siswa, dan dokumentasi KBM."
      maxWidth="2xl"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-jurnal-guru-kelas">
            {formMode === "add" ? "Simpan Jurnal KBM" : "Perbarui Jurnal"}
          </Button>
        </>
      }
    >
      <form id="form-jurnal-guru-kelas" onSubmit={onSubmit} className="space-y-5">
        {/* Bagian 1: Identitas & Waktu Pembelajaran */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#2d2410] uppercase tracking-wider">
            1. Identitas Pembelajaran Tematik
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1">
                Satuan Pendidikan <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                value={formData.sekolah || ""}
                onChange={(e) => setFormData({ ...formData, sekolah: e.target.value })}
                placeholder="Contoh: SDN 2 BUKE"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1">
                Tema Pembelajaran <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                value={formData.tema || ""}
                onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                placeholder="Contoh: Tema 1: Diriku"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1">
                Materi Pokok / Subtema <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                value={formData.materi_pokok || ""}
                onChange={(e) => setFormData({ ...formData, materi_pokok: e.target.value })}
                placeholder="Contoh: Aku dan Teman Baru"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#2d2410] mb-1">Pertemuan</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.pertemuan_ke || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, pertemuan_ke: Number(e.target.value) || 1 })
                  }
                />
              </div>
              <DateInput
                label="Tanggal KBM"
                required
                value={formData.tgl || ""}
                onChange={(val) => setFormData({ ...formData, tgl: val })}
              />
            </div>
          </div>
        </div>

        {/* Bagian 2: Pedagogi & Strategi */}
        <div className="space-y-3 pt-3 border-t border-white/60">
          <h4 className="text-xs font-bold text-[#2d2410] uppercase tracking-wider">
            2. Strategi & Model Pembelajaran
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1">Model Pembelajaran</label>
              <Select
                value={formData.model_pembelajaran || MODEL_OPTIONS[0]}
                onChange={(e) => setFormData({ ...formData, model_pembelajaran: e.target.value })}
              >
                {MODEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1">Metode</label>
              <Select
                value={formData.metode_pembelajaran || METODE_OPTIONS[0]}
                onChange={(e) => setFormData({ ...formData, metode_pembelajaran: e.target.value })}
              >
                {METODE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1">Bentuk Asesmen</label>
              <Select
                value={formData.penilaian || PENILAIAN_OPTIONS[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    penilaian: e.target.value as JurnalGuruKelasRecord["penilaian"],
                  })
                }
              >
                {PENILAIAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Bagian 3: Sintaks Kegiatan Belajar */}
        <div className="space-y-3 pt-3 border-t border-white/60">
          <h4 className="text-xs font-bold text-[#2d2410] uppercase tracking-wider">
            3. Sintaks Kegiatan & Refleksi KBM
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1">
                Uraian Tahapan Kegiatan Belajar Mengajar
              </label>
              <Textarea
                rows={3}
                value={formData.kegiatan || ""}
                onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
                placeholder="Langkah pembuka, inti pembelajaran, dan penutup..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2d2410] mb-1">
                Catatan Refleksi / Kendala
              </label>
              <Textarea
                rows={2}
                value={formData.keterangan || ""}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Catatan hasil belajar, kendala siswa, atau refleksi guru..."
              />
            </div>
          </div>
        </div>

        {/* Bagian 4: Presensi Siswa */}
        <div className="space-y-3 pt-3 border-t border-white/60">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#2d2410] uppercase tracking-wider">
              4. Presensi Kehadiran Siswa
            </h4>
            <Badge variant="gold">
              Kehadiran: {formData.persentase || 0}%
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/60 p-4 rounded-2xl border border-white/80">
            <div>
              <label className="block text-[11px] font-semibold text-emerald-800 mb-1">Hadir (Orang)</label>
              <Input
                type="number"
                min={0}
                value={formData.siswa_hadir ?? 0}
                onChange={(e) => handlePresenceChange("siswa_hadir", Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-sky-800 mb-1">Izin (Orang)</label>
              <Input
                type="number"
                min={0}
                value={formData.siswa_izin ?? 0}
                onChange={(e) => handlePresenceChange("siswa_izin", Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-amber-800 mb-1">Sakit (Orang)</label>
              <Input
                type="number"
                min={0}
                value={formData.siswa_sakit ?? 0}
                onChange={(e) => handlePresenceChange("siswa_sakit", Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-rose-800 mb-1">Alpa (Orang)</label>
              <Input
                type="number"
                min={0}
                value={formData.siswa_alpa ?? 0}
                onChange={(e) => handlePresenceChange("siswa_alpa", Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Bagian 5: Dokumentasi Foto */}
        <div className="pt-3 border-t border-white/60">
          <FileInput
            label="Berkas Dokumentasi Foto KBM"
            accept="image/*,.pdf"
            value={formData.file || ""}
            onChange={(fileName) => setFormData({ ...formData, file: fileName })}
            helperText="Pilih atau seret foto bukti kegiatan KBM (JPG, PNG, atau PDF)."
          />
        </div>
      </form>
    </Modal>
  );
}
