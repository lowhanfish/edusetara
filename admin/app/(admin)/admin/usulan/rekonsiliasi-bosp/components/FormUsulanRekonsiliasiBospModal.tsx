import React, { useState } from "react";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { Button, Input, Modal, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
import { useKategoriSpjOption } from "../hooks/crud";

interface FormUsulanRekonsiliasiBospModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormUsulanRekonsiliasiBospModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormUsulanRekonsiliasiBospModalProps) {
  const { options: kategorispjOptions, isLoading: kategorispjLoading, isError: kategoriError } = useKategoriSpjOption();

  const baseUrl = useUrlStore((state) => state.URL.APP);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const uploadDocument = async (kategori: { id: string; value: string }, file?: File) => {
    setUploadError("");
    let path = "";
    if (file) {
      setUploading(true);
      try {
        const body = new FormData();
        body.append("file", file);
        const result = await fetchData<{ file_url: string }>(`${baseUrl}/api/v1/admin/usulan/rekonsiliasi-bosp/upload`, { method: "POST", body });
        path = result.file_url;
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Gagal mengunggah berkas");
        return;
      } finally {
        setUploading(false);
      }
    }
    setFormData((previous) => ({
      ...previous,
      dokumen_spj: [
        ...(previous.dokumen_spj ?? []).filter((item) => item.kategori_id !== kategori.id),
        { kategori_id: kategori.id, nama: kategori.value, file: path },
      ],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Usulan Rekonsiliasi Dana BOSP"
          : "✎ Edit Usulan Rekonsiliasi Dana BOSP"
      }
      description="Pengajuan pertanggungjawaban (SPJ) keuangan dan aset BOSP ke Dinas Pendidikan dan Kebudayaan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading || uploading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-usulan-rekonsiliasi-bosp" disabled={isLoading || uploading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Usulan Rekonsiliasi Dana BOSP"
              : "Perbarui Usulan Rekonsiliasi Dana BOSP"}
          </Button>
        </>
      }
    >
      <form id="form-usulan-rekonsiliasi-bosp" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Satuan Pendidikan <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).sekolah || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sekolah: e.target.value,
              })
            }
            placeholder="Contoh: SDN 4 Ranomeeto"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tahun Anggaran <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).tahun || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahun: e.target.value,
              })
            }
            placeholder="Contoh: 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Semester / Tahap <span className="text-rose-500">*</span>
          </label>
          <Select
            required
            value={(formData as any).tahap ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tahap: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih semester --" },
              ...[{"value":"Semester I (Januari - Juni)","label":"Semester I (Januari - Juni)"},{"value":"Semester II (Juli - Desember)","label":"Semester II (Juli - Desember)"}]
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nominal Penyerapan Dana BOSP (Rp)
          </label>
          <Input
            type="number"
            
            value={(formData as any).nominal_dana ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nominal_dana: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 50000000"
          />
        </div>

        <fieldset disabled={uploading} className="space-y-4">
          <legend className="text-xs font-semibold">Dokumen SPJ BOSP</legend>
          {kategorispjLoading && <p className="text-xs">Memuat kategori dokumen...</p>}
          {kategoriError && <p role="alert" className="text-xs text-rose-600">Gagal memuat master kategori. Silakan coba kembali.</p>}
          {!kategorispjLoading && !kategoriError && kategorispjOptions.length === 0 && (
            <p className="text-xs">Belum ada kategori dokumen. Tambahkan melalui Master Kategori.</p>
          )}
          {kategorispjOptions.map((kategori) => (
            <FileInput
              key={kategori.id}
              label={kategori.value}
              value={formData.dokumen_spj?.find((item) => item.kategori_id === kategori.id)?.file || ""}
              onChange={(_, file) => void uploadDocument(kategori, file)}
              helperText={`Unggah ${kategori.value}`}
            />
          ))}
          {uploading && <p className="text-xs">Mengunggah berkas...</p>}
          {uploadError && <p role="alert" className="text-xs text-rose-600">{uploadError}</p>}
        </fieldset>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Status Usulan
          </label>
          <Select
            
            value={(formData as any).status ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- Pilih status usulan --" },
              ...[{"value":"Sedang Diproses Verifikasi","label":"Sedang Diproses Verifikasi"},{"value":"Cek Benar","label":"Cek Benar"},{"value":"Cek Lengkap","label":"Cek Lengkap"},{"value":"Disetujui","label":"Disetujui"}]
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
