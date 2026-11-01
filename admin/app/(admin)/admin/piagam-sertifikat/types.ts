export interface CreateInterface {
  kegiatan: string | null;
  penyelenggara: string | null;
  tahun: number | null;
  tempat_pelaksana?: string | null;
  sebagai: string | null;
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

export type PiagamSertifikatRecord = ResponseInterface;
