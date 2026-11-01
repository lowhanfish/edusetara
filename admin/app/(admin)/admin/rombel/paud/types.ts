export interface CreateInterface {
  sekolah: string | null;
  nama_rombel: string | null;
  tingkat?: string | null;
  kurikulum?: string | null;
  wali_kelas?: string | null;
  jumlah_siswa: number | null;
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

export type RombelPaudRecord = ResponseInterface;
