export interface CreateInterface {
  judul: string | null;
  kategori: string | null;
  penulis?: string | null;
  konten: string | null;
  file?: string | null;
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

export type PublishPendidikanRecord = ResponseInterface;
