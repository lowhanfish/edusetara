export interface CreateInterface {
  tahun: string | null;
  triwulan_id: string | null;
  jenis_id: string | null;
  kelas_id: string | null;
  jml_guru?: number | null;
  nominal?: number | null;
  file?: string | null;
  file_type?: string | null;
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

export type UsulanTunjanganGuruRecord = ResponseInterface;
