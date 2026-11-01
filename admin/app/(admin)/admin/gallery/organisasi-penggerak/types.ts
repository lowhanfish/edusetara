export interface CreateInterface {
  judul: string | null;
  nama_organisasi: string | null;
  kegiatan?: string | null;
  deskripsi?: string | null;
  file?: string | null;
  link?: string | null;
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

export type GalleryOrganisasiPenggerakRecord = ResponseInterface;
