export interface CreateInterface {
  judul: string | null;
  slug?: string | null;
  kategori: string | null;
  author?: string | null;
  deskripsi: string | null;
  isi: string | null;
  foto?: string | null;
  status: string | null;
  featured?: string | null;
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

export type BeritaRecord = ResponseInterface;
