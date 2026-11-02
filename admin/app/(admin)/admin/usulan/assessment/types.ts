export interface CreateInterface {
  status_sekolah_id: string | null;
  jml_siswa: number | null;
  jml_laki?: number | null;
  jml_perempuan?: number | null;
  kurikulum_k13?: string | null;
  kurikulum_kurmer?: string | null;
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

export type UsulanAssessmentRecord = ResponseInterface;
