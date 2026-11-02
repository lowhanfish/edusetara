export interface CreateInterface {
  tgl: string | null;
  tema: string | null;
  materi_pokok: string | null;
  pertemuan_ke?: number | null;
  model_pembelajaran?: string | null;
  metode_pembelajaran?: string | null;
  kegiatan?: string | null;
  penilaian?: string | null;
  siswa_hadir?: number | null;
  persentase?: number | null;
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

export type JurnalGuruKelasRecord = ResponseInterface;
