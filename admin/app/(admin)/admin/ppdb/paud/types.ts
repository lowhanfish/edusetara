export interface CreateInterface {
  nama_siswa: string | null;
  nik: string | null;
  sekolah_tujuan: string | null;
  jalur?: string | null;
  status?: string | null;
  file_berkas?: string | null;
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

export type PpdbPaudRecord = ResponseInterface;
