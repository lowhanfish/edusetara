export interface CreateInterface {
  tgl: string | null;
  kepsek?: string | null;
  pendampingan_id?: string | null;
  tugas_id?: string | null;
  temuan_akademik?: string | null;
  temuan_manajerial?: string | null;
  tindak_lanjut?: string | null;
  file?: string | null;
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

export type JurnalPengawasRecord = ResponseInterface;
