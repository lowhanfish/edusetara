export interface CreateInterface {
  sekolah: string | null;
  tahap: string | null;
  tahun: number | null;
  nominal_disetujui: number | null;
  status_verifikasi: string | null;
  catatan_verifikator?: string | null;
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

export type VerifikasiRekonsiliasiBospRecord = ResponseInterface;
