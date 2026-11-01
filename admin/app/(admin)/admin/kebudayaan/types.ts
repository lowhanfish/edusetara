export interface CreateInterface {
  nama: string | null;
  kategori: string | null;
  lokasi: string | null;
  deskripsi: string | null;
  foto?: string | null;
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

export type PublishKebudayaanRecord = ResponseInterface;
