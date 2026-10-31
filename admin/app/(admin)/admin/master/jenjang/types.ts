export interface JenjangRecord {
  id: string;
  uraian: string;
  nip?: string | null;
  unit_kerja?: string | null;
  keterangan?: string | null;
  kategori?: "Formal" | "Non-Formal" | "Informal";
  status?: "Aktif" | "Non-Aktif";
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export const KATEGORI_JENJANG_OPTIONS: NonNullable<JenjangRecord["kategori"]>[] = [
  "Formal",
  "Non-Formal",
  "Informal",
];

export const STATUS_JENJANG_OPTIONS: NonNullable<JenjangRecord["status"]>[] = [
  "Aktif",
  "Non-Aktif",
];
