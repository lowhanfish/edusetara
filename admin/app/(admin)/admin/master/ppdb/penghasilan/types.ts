export interface CreateInterface {
  title: string;
  desc?: string | null;
  uraian?: string;
  keterangan?: string | null;
}

export interface ResponseInterface extends CreateInterface {
  id: string;
  title: string;
  desc?: string | null;
  uraian?: string;
  keterangan?: string | null;
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

export type PenghasilanRecord = ResponseInterface;
