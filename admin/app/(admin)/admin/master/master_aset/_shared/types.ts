import type { ReactNode } from "react";

/** Satu baris data master aset. `id` dibuat backend; field lain mengikuti config tiap halaman. */
export interface MasterAsetRecord {
  id: string;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export interface MasterAsetListResponse {
  skip: number;
  limit: number;
  total: number;
  data: MasterAsetRecord[];
}

export interface SelectChoice {
  value: string;
  label: string;
}

export type FieldType = "text" | "number" | "textarea" | "select" | "lookup";

/** Hasil pencarian untuk field "lookup" (mis. memilih sekolah dari Master Sekolah). */
export interface LookupChoice {
  value: string;
  label: string;
  description?: string;
}

export interface LookupDef {
  /** Path endpoint pencarian (setelah host API); menerima query `search`. */
  path: string;
  /** Mengubah satu baris respons endpoint menjadi pilihan. */
  toChoice: (item: Record<string, unknown>) => LookupChoice;
  /** Field pada baris data yang berisi label pilihan tersimpan (diisi backend). */
  labelKey: string;
}

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  /** Hanya untuk type "number". */
  min?: number;
  max?: number;
  /** Validasi format untuk type "text". */
  pattern?: RegExp;
  patternMessage?: string;
  /** Pilihan tetap untuk type "select". */
  options?: SelectChoice[];
  /** Slug master lain; pilihan diambil dari endpoint `option` master tersebut. */
  optionSource?: string;
  /** Sumber pencarian untuk type "lookup". */
  lookup?: LookupDef;
  /** Kunci yang tidak boleh diubah setelah data dibuat (kode bisnis). */
  lockOnEdit?: boolean;
  /** Lebar kolom form: 2 = penuh. */
  span?: 1 | 2;
}

export interface ColumnDef {
  key: string;
  label: string;
  className?: string;
  render?: (record: MasterAsetRecord) => ReactNode;
}

/** Filter dropdown di atas tabel; nilainya dikirim sebagai query param `key`. */
export interface FilterDef {
  key: string;
  label: string;
  allLabel: string;
  options: SelectChoice[];
}

export interface MasterAsetConfig {
  /** Segmen terakhir URL halaman dan endpoint API (kebab-case). */
  slug: string;
  title: string;
  /** Nama tunggal untuk tombol dan dialog, mis. "Kondisi Barang". */
  singular: string;
  description: string;
  icon: string;
  /** Sumber data di SIMDA, ditampilkan sebagai catatan di halaman. */
  simdaSource: string;
  searchPlaceholder: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  filters?: FilterDef[];
  /** Field tambahan dari respons backend yang hanya ditampilkan di dialog detail. */
  detailExtras?: ColumnDef[];
  /** Field yang dipakai sebagai judul di dialog hapus dan detail. */
  titleKey: string;
}
