import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useSiswaOption, useKelasOption, useJenisLayananOption, useKegiatanLayananOption } from "../hooks/crud";

interface FormJurnalBkModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormJurnalBkModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormJurnalBkModalProps) {
  const { options: siswaOptions, isLoading: siswaLoading } = useSiswaOption();
  const { options: kelasOptions, isLoading: kelasLoading } = useKelasOption();
  const { options: jenislayananOptions, isLoading: jenislayananLoading } = useJenisLayananOption();
  const { options: kegiatanlayananOptions, isLoading: kegiatanlayananLoading } = useKegiatanLayananOption();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Jurnal Bimbingan Konseling (BK)"
          : "✎ Edit Jurnal Bimbingan Konseling (BK)"
      }
      description="Pendokumentasian layanan bimbingan konseling peserta didik: bimbingan pribadi, sosial, belajar, dan karir."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-jurnal-bk" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Jurnal Bimbingan Konseling (BK)"
              : "Perbarui Jurnal Bimbingan Konseling (BK)"}
          </Button>
        </>
      }
    >
      <form id="form-jurnal-bk" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tanggal Pelaksanaan Layanan BK <span className="text-rose-500">*</span>
          </label>
          <Input
            type="date"
            required
            value={(formData as any).tgl || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tgl: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nama Peserta Didik (Master Siswa) <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).nm_siswa || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nm_siswa: e.target.value,
              })
            }
            options={[
              { value: "", label: siswaLoading ? "Memuat opsi data master..." : "-- Pilih siswa konseling --" },
              ...siswaOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tingkat / Kelas Siswa (Master Kelas)
          </label>
          <Select
            
            value={(formData as any).kelas_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kelas_id: e.target.value,
              })
            }
            options={[
              { value: "", label: kelasLoading ? "Memuat opsi data master..." : "-- Pilih kelas --" },
              ...kelasOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Bidang Layanan BK (Master BK Jenis Layanan)
          </label>
          <Select
            
            value={(formData as any).jns_layanan_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                jns_layanan_id: e.target.value,
              })
            }
            options={[
              { value: "", label: jenislayananLoading ? "Memuat opsi data master..." : "-- Pilih bidang layanan --" },
              ...jenislayananOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Format / Kegiatan Layanan (Master BK Kegiatan Layanan)
          </label>
          <Select
            
            value={(formData as any).mdl_kegiatan_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                mdl_kegiatan_id: e.target.value,
              })
            }
            options={[
              { value: "", label: kegiatanlayananLoading ? "Memuat opsi data master..." : "-- Pilih format kegiatan --" },
              ...kegiatanlayananOptions.map((opt) => ({
                value: String(opt.id),
                label: opt.value,
              })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Topik / Materi Layanan
          </label>
          <Input
            
            value={(formData as any).materi_layanan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                materi_layanan: e.target.value,
              })
            }
            placeholder="Contoh: Bimbingan Disiplin & Motivasi Belajar"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Gejala / Masalah yang Dihadapi
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).permasalahan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                permasalahan: e.target.value,
              })
            }
            placeholder="Uraian problematika..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Hasil Konseling yang Dicapai
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).hasil || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                hasil: e.target.value,
              })
            }
            placeholder="Hasil kesepakatan konseling..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Rencana Tindak Lanjut Penanganan
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).rnc_tindak_lanjut || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                rnc_tindak_lanjut: e.target.value,
              })
            }
            placeholder="Rencana pemantauan..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Dokumen Lembar Komitmen / Bukti (PDF/Foto)
          </label>
          <FileInput
            value={(formData as any).file || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                file: fileName,
              })
            }
            helperText="Unggah dokumen konseling"
          />
        </div>
      </form>
    </Modal>
  );
}
