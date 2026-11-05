import React from "react";
import { Button, Input, Modal, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (event: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function FormUsulanRekonsiliasiBospModal({ isOpen, onClose, formMode, formData, setFormData, onSubmit, isLoading = false }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={() => { if (!isLoading) onClose(); }}
      title={formMode === "add" ? "Tambah Usulan Rekonsiliasi BOSP" : "Edit Usulan Rekonsiliasi BOSP"}
      description="Tentukan sekolah dan periode usulan. Rincian dokumen ditambahkan setelah usulan disimpan."
      maxWidth="md"
      footer={<>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>Batal</Button>
        <Button variant="gold" type="submit" form="form-usulan-bosp" disabled={isLoading}>{isLoading ? "Menyimpan..." : "Simpan Usulan"}</Button>
      </>}
    >
      <form id="form-usulan-bosp" onSubmit={onSubmit}>
        <fieldset disabled={isLoading} className="space-y-4">
          <label className="block text-xs font-semibold space-y-1">
            <span>Satuan Pendidikan *</span>
            <Input required maxLength={255} value={formData.sekolah || ""} placeholder="Nama satuan pendidikan"
              onChange={(event) => setFormData((previous) => ({ ...previous, sekolah: event.target.value }))} />
          </label>
          <label className="block text-xs font-semibold space-y-1">
            <span>Tahun Anggaran *</span>
            <Input required type="number" min={2000} max={2100} value={formData.tahun || ""} placeholder="Contoh: 2026"
              onChange={(event) => setFormData((previous) => ({ ...previous, tahun: event.target.value }))} />
          </label>
          <label className="block text-xs font-semibold space-y-1">
            <span>Semester *</span>
            <Select required value={formData.tahap || ""}
              onChange={(event) => setFormData((previous) => ({ ...previous, tahap: event.target.value }))}
              options={[
                { value: "", label: "Pilih semester" },
                { value: "Semester I (Januari - Juni)", label: "Semester I (Januari - Juni)" },
                { value: "Semester II (Juli - Desember)", label: "Semester II (Juli - Desember)" },
                ...(formData.tahap && !["Semester I (Januari - Juni)", "Semester II (Juli - Desember)"].includes(formData.tahap)
                  ? [{ value: formData.tahap, label: formData.tahap }] : []),
              ]} />
          </label>
        </fieldset>
      </form>
    </Modal>
  );
}
