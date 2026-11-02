export interface CreateInterface {
  nama_guru?: string | null;
  nuptk?: string | null;
  sekolah?: string | null;
  jenis_tunjangan?: string | null;
  status_verifikasi: string | null;
  catatan?: string | null;
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

export type VerifikasiTunjanganGuruRecord = ResponseInterface;
