import React from "react";
import { Button, Input, Modal, FileInput, RichTextEditor } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface FormPublishProfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormPublishProfilModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormPublishProfilModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Profil & Standar Layanan"
          : "✎ Edit Profil & Standar Layanan"
      }
      description="Struktur organisasi, maklumat pelayanan, dan standar integritas Dinas Pendidikan."
      maxWidth="3xl"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-publish-profil" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Profil & Standar Layanan"
              : "Perbarui Profil & Standar Layanan"}
          </Button>
        </>
      }
    >
      <form id="form-publish-profil" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Judul Bagian Profil <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).judul || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                judul: e.target.value,
              })
            }
            placeholder="Contoh: Maklumat Pelayanan Publik"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Kategori <span className="text-rose-500">*</span>
          </label>
          <Input
            required
            value={(formData as any).kategori || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kategori: e.target.value,
              })
            }
            placeholder="Contoh: Maklumat / Struktur Organisasi / Sejarah"
          />
        </div>

        <div>
          <RichTextEditor
            label="Uraian Lengkap Profil"
            required
            value={(formData as any).konten || ""}
            onChange={(html) =>
              setFormData({
                ...formData,
                konten: html,
              })
            }
            placeholder="Tuliskan naskah visi-misi, sejarah, atau maklumat pelayanan secara lengkap..."
            minHeight={240}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Bagan Struktur / Berkas SK (PDF/Gambar)
          </label>
          <FileInput
            module="profil"
            value={(formData as any).file || ""}
            onChange={(fileUrl, file) =>
              setFormData({
                ...formData,
                file: file || fileUrl,
              })
            }
            helperText="Unggah dokumen bagan struktur atau berkas SK resmi (PDF/PNG/JPG)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Nomor Urut Tampil
          </label>
          <Input
            type="number"
            
            value={(formData as any).urutan ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                urutan: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Contoh: 1"
          />
        </div>
      </form>
    </Modal>
  );
}
