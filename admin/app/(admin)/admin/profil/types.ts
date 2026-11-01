export interface CreateInterface {
  judul: string | null;
  kategori: string | null;
  konten: string | null;
  file?: string | null;
  urutan?: number | null;
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

export type PublishProfilRecord = ResponseInterface;
