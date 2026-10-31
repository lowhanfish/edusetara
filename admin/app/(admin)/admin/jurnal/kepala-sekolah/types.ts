export interface JurnalKepalaSekolahRecord {
  id: string;
  sekolah: string;
  uraian: string;
  target: string;
  hasil: string;
  keterlibatan: string;
  tgl: string;
  keterangan: string;
  file: string;
  status: "Terealisasi" | "Dalam Proses" | "Evaluasi";
  created_at?: string;
  created_by?: string;
}

export const KETERLIBATAN_OPTIONS = [
  "Dewan Guru & Tenaga Kependidikan",
  "Komite Sekolah & Orang Tua Murid",
  "Pengawas Pembina Dikbud Konsel",
  "Dinas Pendidikan & Kebudayaan Konsel",
  "Masyarakat & Tokoh Adat Setempat",
];

export const STATUS_KEPSEK_OPTIONS: JurnalKepalaSekolahRecord["status"][] = [
  "Terealisasi",
  "Dalam Proses",
  "Evaluasi",
];
