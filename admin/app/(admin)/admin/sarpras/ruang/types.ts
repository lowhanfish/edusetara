export interface CreateInterface {
  bangunan_id?: string | null;
  kelas_id?: string | null;
  nama: string | null;
  luas?: string | null;
  kondisi_id?: string | null;
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

export type SarprasRuangRecord = ResponseInterface;
