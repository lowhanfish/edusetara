export interface CreateInterface {
  sekolah: string | null;
  tahap: string | null;
  tahun: number | null;
  nominal_dana: number | null;
  kategori_spj?: string | null;
  file_bku?: string | null;
  file_rekening?: string | null;
  file_sptjm?: string | null;
  status?: string | null;
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

export type UsulanRekonsiliasiBospRecord = ResponseInterface;
