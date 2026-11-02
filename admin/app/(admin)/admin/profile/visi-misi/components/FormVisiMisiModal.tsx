import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";


interface FormVisiMisiModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormVisiMisiModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: FormVisiMisiModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah Visi dan Misi"
          : "✎ Edit Visi dan Misi"
      }
      description="Pengelolaan Visi, Misi, Tujuan, dan Sasaran Strategis Dinas Pendidikan dan Kebudayaan."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-profile-visi-misi" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan Visi dan Misi"
              : "Perbarui Visi dan Misi"}
          </Button>
        </>
      }
    >
      <form id="form-profile-visi-misi" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Visi Pembangunan Pendidikan <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).visi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                visi: e.target.value,
              })
            }
            placeholder="Rumusan visi pembangunan pendidikan..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Misi Pembangunan Pendidikan <span className="text-rose-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={(formData as any).misi || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                misi: e.target.value,
              })
            }
            placeholder="Rumusan butir-butir misi..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Tujuan Strategis
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).tujuan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tujuan: e.target.value,
              })
            }
            placeholder="Tujuan strategis penyelenggaraan pendidikan..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            Sasaran Program
          </label>
          <Textarea
            
            rows={3}
            value={(formData as any).sasaran || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sasaran: e.target.value,
              })
            }
            placeholder="Sasaran capaian program..."
          />
        </div>
      </form>
    </Modal>
  );
}
