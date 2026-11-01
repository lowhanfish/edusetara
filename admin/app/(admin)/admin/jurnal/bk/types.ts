export interface CreateInterface {
  sekolah: string | null;
  jenis_layanan: string | null;
  bidang_bimbingan: string | null;
  sasaran_siswa: string | null;
  permasalahan: string | null;
  layanan_diberikan: string | null;
  evaluasi?: string | null;
  tindak_lanjut?: string | null;
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

export type JurnalBkRecord = ResponseInterface;
