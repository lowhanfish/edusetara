import type { MasterAsetConfig } from "../_shared/types";

export const config: MasterAsetConfig = {
  slug: "metode-penyusutan",
  title: "Master Metode Penyusutan",
  singular: "Metode Penyusutan",
  description:
    "Metode alokasi nilai aset tetap selama masa manfaat. Aplikasi manual Dinas memakai Garis Lurus.",
  icon: "📉",
  simdaSource: "Ref_Metode",
  searchPlaceholder: "Cari nama metode...",
  titleKey: "nama",
  columns: [
    { key: "kode", label: "Kode", className: "w-24" },
    { key: "nama", label: "Metode Penyusutan" },
    { key: "keterangan", label: "Keterangan" },
  ],
  fields: [
    {
      key: "kode",
      label: "Kode Metode",
      type: "number",
      required: true,
      lockOnEdit: true,
      min: 1,
      max: 99,
      placeholder: "1",
    },
    { key: "nama", label: "Nama Metode", type: "text", required: true, placeholder: "Garis Lurus" },
    {
      key: "keterangan",
      label: "Keterangan",
      type: "textarea",
      placeholder: "Contoh: Beban penyusutan sama setiap bulan sepanjang masa manfaat.",
    },
  ],
};
