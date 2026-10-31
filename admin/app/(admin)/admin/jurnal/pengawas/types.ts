export interface JurnalPengawasRecord {
  id: string;
  unit_kerja: string;
  kepsek: string;
  pendampingan_id: string;
  temuan_akademik: string;
  temuan_manajerial: string;
  tindak_lanjut: string;
  tugas_id: string;
  tgl: string;
  file: string;
  status: "Selesai Disupervisi" | "Perlu Tindak Lanjut" | "Monitoring Lanjutan";
  created_at?: string;
  created_by?: string;
}

export const SEKOLAH_BINAAN_OPTIONS = [
  "SD Negeri 1 Ranomeeto",
  "SMP Negeri 22 Konsel",
  "SD Negeri 2 Buke",
  "SD Negeri 3 Andoolo",
  "SMP Negeri 1 Kolono",
  "SMP Negeri 2 Laeya",
];

export const JENIS_PENDAMPINGAN_OPTIONS = [
  "Pendampingan Perencanaan Kerja (RKT/RKAS)",
  "Pendampingan Program Pembelajaran Berdiferensiasi",
  "Supervisi Implementasi KOSP & P5",
  "Monitoring Asesmen Nasional Berbasis Komputer (ANBK)",
  "Evaluasi Tata Kelola Administrasi & Keuangan Sekolah",
];

export const TUGAS_PENGAWAS_OPTIONS = [
  "Supervisi Akademik Pembelajaran",
  "Supervisi Manajerial Kepala Sekolah",
  "Monitoring Standar Pelayanan Minimal (SPM)",
  "Pembinaan Evaluasi Diri Sekolah (EDS)",
];

export const STATUS_PENGAWAS_OPTIONS: JurnalPengawasRecord["status"][] = [
  "Selesai Disupervisi",
  "Perlu Tindak Lanjut",
  "Monitoring Lanjutan",
];
