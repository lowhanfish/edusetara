import type { MasterAsetConfig } from "../_shared/types";

export const config: MasterAsetConfig = {
  slug: "alasan-penghapusan",
  title: "Master Alasan Penghapusan",
  singular: "Alasan Penghapusan",
  description:
    "Alasan penghapusan barang dari daftar inventaris: Rusak Berat, Hilang/kekurangan perbendaharaan, Bencana Alam, dan lainnya.",
  icon: "🗑️",
  simdaSource: "Ref_Alasan",
  searchPlaceholder: "Cari alasan penghapusan...",
  titleKey: "uraian",
  columns: [
    { key: "kode", label: "Kode", className: "w-24" },
    { key: "uraian", label: "Alasan Penghapusan" },
    { key: "keterangan", label: "Keterangan" },
  ],
  fields: [
    {
      key: "kode",
      label: "Kode Alasan",
      type: "number",
      required: true,
      lockOnEdit: true,
      min: 1,
      max: 255,
      placeholder: "1",
      helper: "Mengikuti Kd_Alasan SIMDA (1–6 dan 101–105).",
    },
    { key: "uraian", label: "Uraian Alasan", type: "text", required: true, placeholder: "Rusak Berat" },
    {
      key: "keterangan",
      label: "Keterangan",
      type: "textarea",
      placeholder: "Contoh: Dipakai pada usulan penghapusan barang rusak berat.",
    },
  ],
};
