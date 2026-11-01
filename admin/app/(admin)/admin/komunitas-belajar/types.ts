export interface CreateInterface {
  nama_kombel: string | null;
  ketua: string | null;
  jenjang?: string | null;
  jumlah_anggota: number | null;
  kegiatan_utama?: string | null;
  file_sk?: string | null;
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

export type KomunitasBelajarRecord = ResponseInterface;
