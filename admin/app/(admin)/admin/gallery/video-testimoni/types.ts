export interface CreateInterface {
  judul: string | null;
  narasumber: string | null;
  peran: string | null;
  link_video: string | null;
  keterangan?: string | null;
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

export type GalleryVideoTestimoniRecord = ResponseInterface;
