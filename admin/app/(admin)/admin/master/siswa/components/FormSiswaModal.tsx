import React from "react";
import { Button, Input, Modal, Textarea } from "../../../../_components/ui";
import { ResponseInterface } from "../types";
import { useKelasOption, useAgamaOption } from "../hooks/crud";

interface FormSiswaModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormSiswaModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormSiswaModalProps) {
  const { options: kelasOptions } = useKelasOption();
  const { options: agamaOptions } = useAgamaOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Master Data Siswa"
          : "✎ Edit Data Siswa"
      }
      description="Sesuai dokumen Arsitektur Sistem: nama lengkap siswa, NISN, NIK, jenis kelamin, kelas, dan data domisili."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-master-siswa" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Data Siswa"
              : "Perbarui Data Siswa"}
          </Button>
        </>
      }
    >
      <form id="form-master-siswa" onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Nama Lengkap Siswa <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              value={formData.nama || ""}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Adhitama Elvan Syahreza"
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Jenis Kelamin <span className="text-rose-500">*</span>
            </label>
            <select
              required
              aria-label="Jenis Kelamin"
              value={formData.jns_kelamin || ""}
              onChange={(e) => setFormData({ ...formData, jns_kelamin: e.target.value })}
              className="w-full text-xs bg-white border border-[#d5cbba] rounded-lg px-3 py-2 text-[#2d2410] focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">-- Pilih Jenis Kelamin --</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* NISN */}
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              NISN (Nomor Induk Siswa Nasional) <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              value={formData.nisn || ""}
              onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
              placeholder="10 digit nomor NISN"
            />
          </div>

          {/* NIK */}
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              NIK (Nomor Induk Kependudukan) <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              value={formData.nik || ""}
              onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
              placeholder="16 digit nomor NIK siswa"
            />
          </div>

          {/* Tingkat Kelas */}
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Rombel / Tingkat Kelas
            </label>
            <select
              aria-label="Tingkat Kelas"
              value={formData.kelas_id || ""}
              onChange={(e) => setFormData({ ...formData, kelas_id: e.target.value })}
              className="w-full text-xs bg-white border border-[#d5cbba] rounded-lg px-3 py-2 text-[#2d2410] focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">-- Pilih Kelas --</option>
              {kelasOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.value}
                </option>
              ))}
            </select>
          </div>

          {/* Agama */}
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Agama
            </label>
            <select
              aria-label="Agama Siswa"
              value={formData.agama || ""}
              onChange={(e) => setFormData({ ...formData, agama: e.target.value })}
              className="w-full text-xs bg-white border border-[#d5cbba] rounded-lg px-3 py-2 text-[#2d2410] focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">-- Pilih Agama --</option>
              {agamaOptions.length > 0 ? (
                agamaOptions.map((opt) => (
                  <option key={opt.id} value={opt.value}>
                    {opt.value}
                  </option>
                ))
              ) : (
                <>
                  <option value="Islam">Islam</option>
                  <option value="Kristen Protestan">Kristen Protestan</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </>
              )}
            </select>
          </div>

          {/* Tempat Lahir */}
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Tempat Lahir
            </label>
            <Input
              value={formData.tmp_lahir || ""}
              onChange={(e) => setFormData({ ...formData, tmp_lahir: e.target.value })}
              placeholder="Contoh: Ranomeeto / Kendari"
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Tanggal Lahir <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              type="date"
              value={formData.tgl_lahir || ""}
              onChange={(e) => setFormData({ ...formData, tgl_lahir: e.target.value })}
            />
          </div>

          {/* Nama Ayah */}
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Nama Ayah Kandung
            </label>
            <Input
              value={formData.nama_ayah || ""}
              onChange={(e) => setFormData({ ...formData, nama_ayah: e.target.value })}
              placeholder="Nama lengkap ayah"
            />
          </div>

          {/* Nama Ibu */}
          <div>
            <label className="block text-xs font-semibold text-[#2d2410] mb-1">
              Nama Ibu Kandung
            </label>
            <Input
              value={formData.nama_ibu || ""}
              onChange={(e) => setFormData({ ...formData, nama_ibu: e.target.value })}
              placeholder="Nama lengkap ibu"
            />
          </div>
        </div>

        {/* Alamat Lengkap */}
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Alamat Tempat Tinggal <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={2}
            value={formData.alamat || ""}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            placeholder="Contoh: Jl. Poros Ranomeeto RT 02/01, Desa Ranomeeto, Kec. Ranomeeto"
          />
        </div>
      </form>
    </Modal>
  );
}
