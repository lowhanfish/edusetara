export interface CreateInterface {
  tgl: string | null;
  nm_siswa: string | null;
  kelas_id?: string | null;
  jns_layanan_id?: string | null;
  mdl_kegiatan_id?: string | null;
  materi_layanan?: string | null;
  permasalahan?: string | null;
  hasil?: string | null;
  rnc_tindak_lanjut?: string | null;
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

export type JurnalBkRecord = ResponseInterface;
