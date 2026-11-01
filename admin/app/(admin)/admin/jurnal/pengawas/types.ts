export interface CreateInterface {
  sekolah_binaan: string | null;
  fokus_supervisi: string | null;
  pendekatan?: string | null;
  temuan: string | null;
  rekomendasi: string | null;
  status: string | null;
}

export interface ResponseInterface extends CreateInterface {
  id: string;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ResponseListInterface {
  skip: number;
  limit: number;
  total: number;
  data: ResponseInterface[];
}

export type JurnalPengawasRecord = ResponseInterface;
