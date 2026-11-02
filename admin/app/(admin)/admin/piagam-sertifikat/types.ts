export interface CreateInterface {
  kategori: string | null;
  nama: string | null;
  kegiatan: string | null;
  juara?: string | null;
  tingkat?: string | null;
  tahun?: string | null;
  penyelenggara?: string | null;
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

export type PiagamSertifikatRecord = ResponseInterface;
