export interface CreateInterface {
  nama_guru: string | null;
  nuptk: string | null;
  sekolah: string | null;
  jenis_tunjangan: string | null;
  tahun: number | null;
  semester?: string | null;
  status?: string | null;
  file?: string | null;
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

export type UsulanTunjanganGuruRecord = ResponseInterface;
