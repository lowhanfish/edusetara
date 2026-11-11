import type { MasterAsetConfig } from "../_shared/types";

const TAHUN = Array.from({ length: 8 }, (_, i) => String(2019 + i));

const rupiah = (value: unknown) =>
  value == null || value === "" ? "-" : `Rp${Number(value).toLocaleString("id-ID")}`;

export const config: MasterAsetConfig = {
  slug: "nilai-minimum-kapitalisasi",
  title: "Master Nilai Minimum Kapitalisasi",
  singular: "Nilai Minimum Kapitalisasi",
  description:
    "Batas nilai perolehan terendah agar barang dicatat sebagai aset tetap (kebijakan akuntansi), per tahun dan kelompok barang. Di bawah batas ini barang dicatat ekstrakomptabel.",
  icon: "💰",
  simdaSource: "Ta_KA",
  searchPlaceholder: "Cari kode atau uraian barang...",
  titleKey: "kode_barang",
  columns: [
    { key: "tahun_berlaku", label: "Tahun", className: "w-20" },
    {
      key: "kode_barang",
      label: "Kode Barang",
      className: "w-44",
      render: (r) => <span className="font-mono font-semibold text-amber-800">{String(r.kode_barang ?? "-")}</span>,
    },
    { key: "uraian_barang", label: "Uraian Barang" },
    {
      key: "nilai_minimum_satuan",
      label: "Minimum per Satuan",
      className: "w-44 text-right",
      render: (r) => rupiah(r.nilai_minimum_satuan),
    },
    {
      key: "nilai_minimum_total",
      label: "Minimum Total",
      className: "w-40 text-right",
      render: (r) => rupiah(r.nilai_minimum_total),
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
      placeholder: "2025",
    },
    {
      key: "kode_barang",
      label: "Kode Barang",
      type: "text",
      required: true,
      lockOnEdit: true,
      pattern: /^\d{2}(\.\d{2}){2,5}$/,
      patternMessage: "Kode harus 3–6 segmen, contoh 01.03.02.05.01.",
      placeholder: "01.03.02.05.01",
      helper: "SIMDA memakai rincian objek (5 segmen). Uraian diisi otomatis dari Master Kode Barang.",
    },
    {
      key: "nilai_minimum_satuan",
      label: "Nilai Minimum per Satuan (Rp)",
      type: "number",
      required: true,
      min: 0,
      max: 999999999999,
      placeholder: "1000000",
      helper: "Isi 0 bila semua nilai dikapitalisasi.",
    },
    {
      key: "nilai_minimum_total",
      label: "Nilai Minimum Total (Rp)",
      type: "number",
      required: true,
      min: 0,
      max: 999999999999,
      placeholder: "0",
    },
    {
      key: "dasar_hukum",
      label: "Dasar Hukum",
      type: "text",
      placeholder: "Perbup Konawe Selatan tentang Kebijakan Akuntansi",
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
