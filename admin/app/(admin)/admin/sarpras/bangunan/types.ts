export interface CreateInterface {
  nama: string | null;
  luas?: string | null;
  kepemilikan_id?: string | null;
  tahun?: string | null;
  persentase?: number | null;
  kondisi_id?: string | null;
  jns_bantuan_id?: string | null;
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

export type SarprasBangunanRecord = ResponseInterface;
