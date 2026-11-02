export interface CreateInterface {
  nomor_regulasi: string | null;
  tentang: string | null;
  tahun: string | null;
  jenis?: string | null;
  file?: string | null;
}

export interface ResponseInterface extends CreateInterface {
  id: string;
  unit_kerja?: string | null;
  nip?: string | null;
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

export type RegulasiGtkRegulasiRecord = ResponseInterface;
