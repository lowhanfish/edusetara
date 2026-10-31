export interface JurnalGuruKelasRecord {
  id: string;
  sekolah: string;
  tema: string;
  materi_pokok: string;
  pertemuan_ke: number;
  tgl: string;
  model_pembelajaran: string;
  metode_pembelajaran: string;
  kegiatan: string;
  penilaian: "Penilaian Sikap" | "Penilaian Pengetahuan" | "Penilaian Keterampilan";
  siswa_hadir: number;
  siswa_izin: number;
  siswa_sakit: number;
  siswa_alpa: number;
  persentase: number;
  keterangan: string;
  file: string;
  created_at?: string;
  created_by?: string;
}

export const MODEL_OPTIONS = [
  "Problem Based Learning",
  "Project Based Learning",
  "Discovery Learning",
  "Inkuiri Terbimbing",
];

export const METODE_OPTIONS = [
  "Ceramah & Tanya Jawab",
  "Diskusi & Penugasan",
  "Demonstrasi & Praktik",
  "Observasi Lingkungan & Diskusi",
];

export const PENILAIAN_OPTIONS: JurnalGuruKelasRecord["penilaian"][] = [
  "Penilaian Sikap",
  "Penilaian Pengetahuan",
  "Penilaian Keterampilan",
];
