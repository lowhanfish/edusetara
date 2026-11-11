import type { MasterAsetConfig, MasterAsetRecord } from "../_shared/types";

/** Tingkat kode barang menurut Permendagri 108/2016 (jumlah segmen "NN."). */
export const LEVEL_KODE_BARANG: Record<number, string> = {
  1: "Akun",
  2: "Kelompok",
  3: "Jenis",
  4: "Objek",
  5: "Rincian Objek",
  6: "Sub Rincian Objek",
  7: "Sub-sub Rincian Objek",
};

const levelOf = (record: MasterAsetRecord) => String(record.kode ?? "").split(".").length;

export const config: MasterAsetConfig = {
  slug: "kode-barang",
  title: "Master Kode Barang",
  singular: "Kode Barang",
  description:
    "Penggolongan dan kodefikasi Barang Milik Daerah (Permendagri 108/2016), dari akun sampai sub-sub rincian objek.",
  icon: "🏷️",
  simdaSource: "Ref_Rek5_108",
  searchPlaceholder: "Cari kode atau uraian barang...",
  titleKey: "uraian",
  columns: [
    {
      key: "kode",
      label: "Kode Barang",
      className: "w-56",
      render: (r) => <span className="font-mono font-semibold text-amber-800">{String(r.kode ?? "-")}</span>,
    },
    {
      key: "level",
      label: "Tingkat",
      className: "w-48",
      render: (r) => LEVEL_KODE_BARANG[levelOf(r)] ?? "-",
    },
    { key: "uraian", label: "Uraian Barang" },
  ],
  fields: [
    {
      key: "kode",
      label: "Kode Barang",
      type: "text",
      required: true,
      lockOnEdit: true,
      pattern: /^\d{2}(\.\d{2,3}){0,6}$/,
      patternMessage: "Format kode harus seperti 01.03.02.05.01.05.12 (1–7 segmen).",
      placeholder: "01.03.02.05.01.05.12",
      helper: "Segmen dipisah titik; jumlah segmen menentukan tingkat.",
    },
    { key: "uraian", label: "Uraian Barang", type: "text", required: true, placeholder: "Contoh: Alat Kantor Lainnya" },
    { key: "keterangan", label: "Keterangan", type: "textarea" },
  ],
  filters: [
    {
      key: "level",
      label: "Tingkat kode",
      allLabel: "Semua tingkat",
      options: Object.entries(LEVEL_KODE_BARANG).map(([level, label]) => ({
        value: level,
        label: `${level}. ${label}`,
      })),
    },
  ],
};
