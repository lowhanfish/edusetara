export interface CreateInterface {
  uraian: string | null;
  jenjang_id: string | null;
  nominal: number | null;
  tahun: string | null;
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

export type UsulanPipPendukungRecord = ResponseInterface;
