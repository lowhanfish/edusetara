import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useAgamaOption, useTempatTinggalOption, useTransportasiOption, usePendidikanOption, usePekerjaanOption, usePenghasilanOption } from "../hooks/crud";

interface FormPpdbSmpModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPpdbSmpModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPpdbSmpModalProps) {
  const { options: agamaOptions, isLoading: agamaLoading } = useAgamaOption();
  const { options: tempattinggalOptions, isLoading: tempattinggalLoading } = useTempatTinggalOption();
  const { options: transportasiOptions, isLoading: transportasiLoading } = useTransportasiOption();
  const { options: pendidikanOptions, isLoading: pendidikanLoading } = usePendidikanOption();
  const { options: pekerjaanOptions, isLoading: pekerjaanLoading } = usePekerjaanOption();
  const { options: penghasilanOptions, isLoading: penghasilanLoading } = usePenghasilanOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah PPDB SMP"
          : "✎ Edit PPDB SMP"
      }
      description="Pendaftaran peserta didik baru jenjang SMP jalur zonasi, afirmasi, mutasi, dan prestasi."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-ppdb-smp" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan PPDB SMP"
              : "Perbarui PPDB SMP"}
          </Button>
        </>
      }
    >
      <form id="form-ppdb-smp" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Lengkap Calon Siswa <span className="text-rose-500">*</span>
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
            placeholder="Nama lengkap calon siswa"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Panggilan
          </label>
          <Input
            
            value={(formData as any).nm_panggilan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nm_panggilan: e.target.value,
              })
            }
            placeholder="Nama panggilan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Jenis Kelamin <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).jns_kelamin ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jns_kelamin: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih jenis kelamin --" },
              ...[{"value":"Laki-laki","label":"Laki-laki"},{"value":"Perempuan","label":"Perempuan"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NISN <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nisn || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nisn: e.target.value,
              })
            }
            placeholder="10 digit NISN"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NIK Calon Siswa <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).nik || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nik: e.target.value,
              })
            }
            placeholder="16 digit NIK"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tempat Lahir
          </label>
          <Input
            
            value={(formData as any).tmp_lahir || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tmp_lahir: e.target.value,
              })
            }
            placeholder="Tempat lahir"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tanggal Lahir
          </label>
          <Input
            type="date"
            
            value={(formData as any).tgl_lahir || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tgl_lahir: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Agama (Master PPDB)
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).agama;
              if (!cur) return "";
              const match = agamaOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.value || match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                agama: e.target.value,
              })
            }
            options={[
              { value: "", label: agamaLoading ? "Memuat opsi data master..." : "-- Pilih agama --" },
              ...agamaOptions.map((opt) => ({
                value: String(opt.value || opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Alamat Tempat Tinggal
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).alamat || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                alamat: e.target.value,
              })
            }
            placeholder="Alamat jalan / RT / RW"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            RT / RW
          </label>
          <Input
            
            value={(formData as any).rt_rw || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                rt_rw: e.target.value,
              })
            }
            placeholder="Contoh: 001/002"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Dusun / Lingkungan
          </label>
          <Input
            
            value={(formData as any).dusun || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                dusun: e.target.value,
              })
            }
            placeholder="Nama dusun"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kode Pos
          </label>
          <Input
            
            value={(formData as any).kode_pos || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kode_pos: e.target.value,
              })
            }
            placeholder="Kode pos"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Tempat Tinggal (Master PPDB)
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).tmp_tinggal;
              if (!cur) return "";
              const match = tempattinggalOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.value || match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                tmp_tinggal: e.target.value,
              })
            }
            options={[
              { value: "", label: tempattinggalLoading ? "Memuat opsi data master..." : "-- Pilih status tempat tinggal --" },
              ...tempattinggalOptions.map((opt) => ({
                value: String(opt.value || opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Moda Transportasi (Master PPDB)
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).moda_transportasi;
              if (!cur) return "";
              const match = transportasiOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.value || match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                moda_transportasi: e.target.value,
              })
            }
            options={[
              { value: "", label: transportasiLoading ? "Memuat opsi data master..." : "-- Pilih moda transportasi --" },
              ...transportasiOptions.map((opt) => ({
                value: String(opt.value || opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Ayah Kandung
          </label>
          <Input
            
            value={(formData as any).nama_ayah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_ayah: e.target.value,
              })
            }
            placeholder="Nama ayah"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NIK Ayah
          </label>
          <Input
            
            value={(formData as any).nik_ayah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nik_ayah: e.target.value,
              })
            }
            placeholder="NIK ayah"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Pendidikan Ayah (Master PPDB)
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).pendidikan_ayah;
              if (!cur) return "";
              const match = pendidikanOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.value || match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                pendidikan_ayah: e.target.value,
              })
            }
            options={[
              { value: "", label: pendidikanLoading ? "Memuat opsi data master..." : "-- Pilih pendidikan ayah --" },
              ...pendidikanOptions.map((opt) => ({
                value: String(opt.value || opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Pekerjaan Ayah (Master PPDB)
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).pekerjaan_ayah;
              if (!cur) return "";
              const match = pekerjaanOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.value || match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                pekerjaan_ayah: e.target.value,
              })
            }
            options={[
              { value: "", label: pekerjaanLoading ? "Memuat opsi data master..." : "-- Pilih pekerjaan ayah --" },
              ...pekerjaanOptions.map((opt) => ({
                value: String(opt.value || opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Penghasilan Ayah (Master PPDB)
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).penghasilan_ayah;
              if (!cur) return "";
              const match = penghasilanOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.value || match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                penghasilan_ayah: e.target.value,
              })
            }
            options={[
              { value: "", label: penghasilanLoading ? "Memuat opsi data master..." : "-- Pilih penghasilan ayah --" },
              ...penghasilanOptions.map((opt) => ({
                value: String(opt.value || opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Ibu Kandung
          </label>
          <Input
            
            value={(formData as any).nama_ibu || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_ibu: e.target.value,
              })
            }
            placeholder="Nama ibu"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            NIK Ibu
          </label>
          <Input
            
            value={(formData as any).nik_ibu || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nik_ibu: e.target.value,
              })
            }
            placeholder="NIK ibu"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Pendidikan Ibu (Master PPDB)
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).pendidikan_ibu;
              if (!cur) return "";
              const match = pendidikanOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.value || match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                pendidikan_ibu: e.target.value,
              })
            }
            options={[
              { value: "", label: pendidikanLoading ? "Memuat opsi data master..." : "-- Pilih pendidikan ibu --" },
              ...pendidikanOptions.map((opt) => ({
                value: String(opt.value || opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Pekerjaan Ibu (Master PPDB)
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).pekerjaan_ibu;
              if (!cur) return "";
              const match = pekerjaanOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.value || match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                pekerjaan_ibu: e.target.value,
              })
            }
            options={[
              { value: "", label: pekerjaanLoading ? "Memuat opsi data master..." : "-- Pilih pekerjaan ibu --" },
              ...pekerjaanOptions.map((opt) => ({
                value: String(opt.value || opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Penghasilan Ibu (Master PPDB)
          </label>
          <Select
            
            value={(() => {
              const cur = (formData as any).penghasilan_ibu;
              if (!cur) return "";
              const match = penghasilanOptions.find((o) => o.id === cur || o.value === cur);
              return match ? String(match.value || match.id) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                penghasilan_ibu: e.target.value,
              })
            }
            options={[
              { value: "", label: penghasilanLoading ? "Memuat opsi data master..." : "-- Pilih penghasilan ibu --" },
              ...penghasilanOptions.map((opt) => ({
                value: String(opt.value || opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Wali Murid
          </label>
          <Input
            
            value={(formData as any).nama_wali || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_wali: e.target.value,
              })
            }
            placeholder="Nama wali (jika ada)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Berkas Persyaratan (PDF/Gambar)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen persyaratan"
          />
        </div>
      </form>
    </Modal>
  );
}
