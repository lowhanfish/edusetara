export interface CreateInterface {
  nama: string | null;
  email?: string | null;
  telepon?: string | null;
  subjek: string | null;
  pesan: string | null;
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

export type PublishKontakRecord = ResponseInterface;
