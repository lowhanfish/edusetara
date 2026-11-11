import type { MasterAsetConfig } from "../_shared/types";

export const config: MasterAsetConfig = {
  slug: "status-pemilik",
  title: "Master Status Pemilik",
  singular: "Status Pemilik",
  description:
    "Pihak pemilik barang dalam register KIB: Pemerintah Pusat, Provinsi, Kabupaten/Kota, atau non pemerintah.",
  icon: "🏛️",
  simdaSource: "Ref_Pemilik",
  searchPlaceholder: "Cari status pemilik...",
  titleKey: "nama",
  columns: [
    { key: "kode", label: "Kode", className: "w-24" },
    { key: "nama", label: "Pemilik Barang" },
    { key: "keterangan", label: "Keterangan" },
  ],
  fields: [
    {
      key: "kode",
      label: "Kode Pemilik",
      type: "number",
      required: true,
      lockOnEdit: true,
      min: 0,
      max: 99,
      placeholder: "12",
      helper: "Kode 0 dipakai untuk Pemerintah Pusat.",
    },
    { key: "nama", label: "Nama Pemilik", type: "text", required: true, placeholder: "Pemerintah Kabupaten/Kota" },
    { key: "keterangan", label: "Keterangan", type: "textarea" },
  ],
};
