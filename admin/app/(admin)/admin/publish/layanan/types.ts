export interface CreateInterface {
  nama_layanan: string | null;
  deskripsi: string | null;
  syarat: string | null;
  prosedur?: string | null;
  penanggung_jawab?: string | null;
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

export type PublishLayananRecord = ResponseInterface;
