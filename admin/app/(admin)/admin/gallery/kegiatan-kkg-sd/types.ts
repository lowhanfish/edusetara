export interface CreateInterface {
  judul: string | null;
  gugus?: string | null;
  materi?: string | null;
  deskripsi?: string | null;
  file?: string | null;
  link?: string | null;
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

export type KegiatanKkgSdRecord = ResponseInterface;
