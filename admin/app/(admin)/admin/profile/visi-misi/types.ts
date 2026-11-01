export interface CreateInterface {
  visi: string | null;
  misi: string | null;
  tujuan?: string | null;
  sasaran?: string | null;
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

export type VisiMisiRecord = ResponseInterface;
