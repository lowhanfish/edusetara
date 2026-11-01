export interface CreateInterface {
  sekolah: string | null;
  tema: string | null;
  materi_pokok: string | null;
  pertemuan_ke: number | null;
  model_pembelajaran?: string | null;
  metode_pembelajaran?: string | null;
  teknik_penilaian?: string | null;
  kendala?: string | null;
  solusi?: string | null;
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

export type JurnalGuruKelasRecord = ResponseInterface;
