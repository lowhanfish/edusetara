export interface CreateInterface {
  sekolah: string | null;
  bangunan?: string | null;
  kode_ruang?: string | null;
  nama_ruang: string | null;
  panjang?: number | null;
  lebar?: number | null;
  kondisi: string | null;
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

export type SarprasRuangRecord = ResponseInterface;
