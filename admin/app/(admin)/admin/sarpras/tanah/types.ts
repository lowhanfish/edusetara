export interface CreateInterface {
  sekolah: string | null;
  jenis: string | null;
  luas: number | null;
  luas_lahan_tersedia?: number | null;
  kepemilikan: string | null;
  bukti_kepemilikan?: string | null;
  nomor_sertifikat?: string | null;
  alamat?: string | null;
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

export type SarprasTanahRecord = ResponseInterface;
