export interface CreateInterface {
  nama: string | null;
  tgkt_pendidikan?: string | null;
  wali_kelas?: string | null;
  jns_rombel?: string | null;
  ruang_kelas?: string | null;
  kurikulum?: string | null;
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

export type RombelSdRecord = ResponseInterface;
