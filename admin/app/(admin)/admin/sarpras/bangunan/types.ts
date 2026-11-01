export interface CreateInterface {
  sekolah: string | null;
  nama_bangunan: string | null;
  panjang?: number | null;
  lebar?: number | null;
  luas_tapak?: number | null;
  jumlah_lantai?: number | null;
  kepemilikan?: string | null;
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

export type SarprasBangunanRecord = ResponseInterface;
