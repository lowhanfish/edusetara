export interface CreateInterface {
  sekolah: string | null;
  nama_siswa: string | null;
  nisn: string | null;
  tahun: number | null;
  tahap: string | null;
  nominal: number | null;
  status_penyaluran: string | null;
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

export type PipDataPenerimaRecord = ResponseInterface;
