export interface CreateInterface {
  nama: string | null;
  nm_panggilan?: string | null;
  jns_kelamin: string | null;
  nisn: string | null;
  nik: string | null;
  tmp_lahir?: string | null;
  tgl_lahir?: string | null;
  agama?: string | null;
  alamat?: string | null;
  rt_rw?: string | null;
  dusun?: string | null;
  kode_pos?: string | null;
  tmp_tinggal?: string | null;
  moda_transportasi?: string | null;
  nama_ayah?: string | null;
  nik_ayah?: string | null;
  pendidikan_ayah?: string | null;
  pekerjaan_ayah?: string | null;
  penghasilan_ayah?: string | null;
  nama_ibu?: string | null;
  nik_ibu?: string | null;
  pendidikan_ibu?: string | null;
  pekerjaan_ibu?: string | null;
  penghasilan_ibu?: string | null;
  nama_wali?: string | null;
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

export type PpdbSmpRecord = ResponseInterface;
