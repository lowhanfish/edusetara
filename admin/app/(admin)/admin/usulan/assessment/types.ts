export interface CreateInterface {
  sekolah: string | null;
  tahun: number | null;
  jenis_asesmen: string | null;
  jumlah_peserta: number | null;
  status?: string | null;
  dokumen?: string | null;
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

export type UsulanAssessmentRecord = ResponseInterface;
