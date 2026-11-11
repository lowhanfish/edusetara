import type { MasterAsetConfig } from "../_shared/types";

export const config: MasterAsetConfig = {
  slug: "kondisi-barang",
  title: "Master Kondisi Barang",
  singular: "Kondisi Barang",
  description:
    "Status kondisi aset dalam inventarisasi: Baik, Kurang Baik, Rusak Berat, Hilang, Tidak Diketemukan, dan lainnya.",
  icon: "🩺",
  simdaSource: "Ref_Kondisi",
  searchPlaceholder: "Cari kondisi barang...",
  titleKey: "uraian",
  columns: [
    { key: "kode", label: "Kode", className: "w-24" },
    { key: "uraian", label: "Kondisi Barang" },
    { key: "keterangan", label: "Keterangan" },
  ],
  fields: [
    {
      key: "kode",
      label: "Kode Kondisi",
      type: "number",
      required: true,
      lockOnEdit: true,
      min: 1,
      max: 99,
      placeholder: "1",
    },
    { key: "uraian", label: "Uraian Kondisi", type: "text", required: true, placeholder: "Baik" },
    {
      key: "keterangan",
      label: "Keterangan",
      type: "textarea",
      placeholder: "Contoh: Barang berfungsi normal dan layak pakai.",
    },
  ],
};
