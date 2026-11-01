export interface CreateInterface {
  sekolah: string | null;
  nama_alat: string | null;
  kode_alat?: string | null;
  spesifikasi?: string | null;
  jumlah: number | null;
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

export type SarprasPeralatanRecord = ResponseInterface;
