export interface JurnalBKRecord {
  id: string;
  nm_siswa: string;
  kelas_id: string;
  tgl: string;
  materi_layanan: string;
  permasalahan: string;
  mdl_kegiatan_id: string;
  jns_layanan_id: string;
  hasil: string;
  rnc_tindak_lanjut: string;
  keterangan: string;
  file: string;
  status: "Selesai / Teratasi" | "Dalam Pemantauan" | "Alih Tangan Kasus";
  created_at?: string;
  created_by?: string;
}

export const KELAS_BK_OPTIONS = [
  "Kelas VII-A (Fase D)",
  "Kelas VII-B (Fase D)",
  "Kelas VIII-A (Fase D)",
  "Kelas VIII-B (Fase D)",
  "Kelas IX-A (Fase D)",
  "Kelas IX-B (Fase D)",
];

export const MODEL_KEGIATAN_BK = [
  "Konseling Individu",
  "Bimbingan Kelompok",
  "Bimbingan Klasikal",
  "Home Visit / Kunjungan Rumah",
  "Konferensi Kasus (Case Conference)",
];

export const BIDANG_LAYANAN_BK = [
  "Layanan Pribadi",
  "Layanan Sosial",
  "Layanan Belajar",
  "Layanan Karir",
];

export const STATUS_BK_OPTIONS: JurnalBKRecord["status"][] = [
  "Selesai / Teratasi",
  "Dalam Pemantauan",
  "Alih Tangan Kasus",
];
