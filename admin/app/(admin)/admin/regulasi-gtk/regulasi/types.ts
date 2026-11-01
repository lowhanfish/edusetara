export interface CreateInterface {
  nomor_regulasi: string | null;
  tentang: string | null;
  tahun: number | null;
  jenis?: string | null;
  file?: string | null;
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

export type RegulasiGtkRecord = ResponseInterface;
