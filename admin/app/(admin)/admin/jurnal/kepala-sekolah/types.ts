export interface CreateInterface {
  sekolah: string | null;
  nama_kegiatan: string | null;
  sasaran?: string | null;
  tujuan: string | null;
  keterlibatan?: string | null;
  hasil?: string | null;
  tindak_lanjut?: string | null;
  status: string | null;
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

export type JurnalKepalaSekolahRecord = ResponseInterface;
