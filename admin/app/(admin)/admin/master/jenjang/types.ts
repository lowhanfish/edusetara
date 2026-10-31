export interface CreateInterface {
  id?: string;
  uraian: string;
  nip?: string | null;
  unit_kerja?: string | null;
  keterangan?: string | null;
  kategori?: "Formal" | "Non-Formal" | "Informal";
  status?: "Aktif" | "Non-Aktif";
}

export interface ResponseInterface extends CreateInterface {
  id: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResponseListInterface {
  skip: number;
  limit: number;
  total: number;
  data: ResponseInterface[];
}

export type JenjangRecord = ResponseInterface;

export const KATEGORI_JENJANG_OPTIONS: NonNullable<JenjangRecord["kategori"]>[] = [
  "Formal",
  "Non-Formal",
  "Informal",
];

export const STATUS_JENJANG_OPTIONS: NonNullable<JenjangRecord["status"]>[] = [
  "Aktif",
  "Non-Aktif",
];
