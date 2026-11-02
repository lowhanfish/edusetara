export interface CreateInterface {
  nama_kegiatan: string | null;
  deskripsi: string | null;
  tgl_kegiatan: string | null;
  foto?: string | null;
  link_youtube?: string | null;
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

export type KegiatanSekolahRecord = ResponseInterface;
