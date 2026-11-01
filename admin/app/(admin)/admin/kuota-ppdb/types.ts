export interface CreateInterface {
  sekolah: string | null;
  jenjang: string | null;
  total_kuota: number | null;
  jalur_zonasi: number | null;
  jalur_afirmasi: number | null;
  jalur_prestasi: number | null;
  jalur_mutasi: number | null;
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

export type KuotaPpdbRecord = ResponseInterface;
