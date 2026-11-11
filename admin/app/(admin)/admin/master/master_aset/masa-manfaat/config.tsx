import type { MasterAsetConfig } from "../_shared/types";

const TAHUN = Array.from({ length: 8 }, (_, i) => String(2019 + i));

export const config: MasterAsetConfig = {
  slug: "masa-manfaat",
  title: "Master Masa Manfaat",
  singular: "Masa Manfaat",
  description:
    "Umur ekonomis aset tetap per sub rincian objek dan metode penyusutan (Permendagri 1/2019), dipakai menghitung penyusutan tiap tahun.",
  icon: "⏳",
  simdaSource: "Ref_Penyusutan",
  searchPlaceholder: "Cari kode atau uraian barang...",
  titleKey: "kode_barang",
  columns: [
    { key: "tahun_berlaku", label: "Tahun", className: "w-20" },
    {
      key: "kode_barang",
      label: "Kode Barang",
      className: "w-48",
      render: (r) => <span className="font-mono font-semibold text-amber-800">{String(r.kode_barang ?? "-")}</span>,
    },
    { key: "uraian_barang", label: "Uraian Barang" },
    { key: "metode_nama", label: "Metode", className: "w-44" },
    {
      key: "umur_tahun",
      label: "Masa Manfaat",
      className: "w-32",
      render: (r) => (r.umur_tahun == null ? "-" : `${r.umur_tahun} tahun`),
    },
  ],
  fields: [
    {
      key: "tahun_berlaku",
      label: "Tahun Berlaku",
      type: "number",
      required: true,
      min: 2000,
      max: 2100,
      placeholder: "2023",
      helper: "Tabel masa manfaat dibuat per tahun anggaran.",
    },
    {
      key: "kode_barang",
      label: "Kode Barang (sub rincian objek)",
      type: "text",
      required: true,
      lockOnEdit: true,
      pattern: /^\d{2}(\.\d{2}){5}$/,
      patternMessage: "Kode harus 6 segmen, contoh 01.03.02.05.01.05.",
      placeholder: "01.03.02.05.01.05",
      helper: "Uraian barang diisi otomatis dari Master Kode Barang.",
    },
    {
      key: "metode_id",
      label: "Metode Penyusutan",
      type: "select",
      required: true,
      optionSource: "metode-penyusutan",
    },
    {
      key: "umur_tahun",
      label: "Masa Manfaat (tahun)",
      type: "number",
      required: true,
      min: 1,
      max: 100,
      placeholder: "4",
    },
    {
      key: "dasar_hukum",
      label: "Dasar Hukum",
      type: "text",
      placeholder: "Permendagri 1/2019 atau Perbup Konawe Selatan",
      span: 2,
    },
  ],
  filters: [
    {
      key: "tahun_berlaku",
      label: "Tahun berlaku",
      allLabel: "Semua tahun",
      options: TAHUN.map((t) => ({ value: t, label: `Tahun ${t}` })),
    },
  ],
};
