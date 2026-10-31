export interface CreateInterface {
  nama: string;
  nisn: string;
  nik: string;
  jns_kelamin: string;
  kelas_id?: string | null;
  tmp_lahir?: string | null;
  tgl_lahir: string;
  agama?: string | null;
  alamat: string;
  nama_ayah?: string | null;
  nama_ibu?: string | null;
  nama_wali?: string | null;
  file?: string | null;
}

export interface ResponseInterface extends CreateInterface {
  id: string;
  nip?: string | null;
  unit_kerja?: string | null;
  unit_kerja_id?: string | null;
  kelas_uraian?: string | null;
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

export type SiswaRecord = ResponseInterface;
