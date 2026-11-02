export interface CreateInterface {
  ruang_id?: string | null;
  nama: string | null;
  jml_alat: number | null;
  kondisi_id?: string | null;
  tahun?: number | null;
  sumber_id?: string | null;
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

export type SarprasPeralatanRecord = ResponseInterface;
