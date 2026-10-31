export interface SekolahRecord {
  id: string;
  npsn: string;
  nama_sekolah: string;
  name: string;
  bentuk_pendidikan: string;
  jenjang: "SD" | "SMP" | "TK" | "PAUD" | "SATAP" | "PKBM" | string;
  level: string;
  status_sekolah: "NEGERI" | "SWASTA" | string;
  status: string;
  akreditasi?: string | null;
  kecamatan_id?: number | null;
  kecamatan?: string | null;
  district?: string | null;
  desa_kelurahan_id?: number | null;
  desa_kelurahan?: string | null;
  village?: string | null;
  alamat_jalan?: string | null;
  alamat?: string | null;
  address?: string | null;
  dusun?: string | null;
  kode_pos?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  simpeg_unit_kerja_id?: string | null;
  simpeg_unit_kerja_nama?: string | null;
  unit_kerja_id?: string | null;
  is_active: boolean;
  url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SekolahListResponse {
  total: number;
  skip: number;
  limit: number;
  data: SekolahRecord[];
}

export interface SekolahUpdatePayload {
  nama_sekolah?: string;
  bentuk_pendidikan?: string;
  jenjang?: string;
  status_sekolah?: string;
  npsn?: string | null;
  akreditasi?: string | null;
  kecamatan_id?: number | null;
  kecamatan?: string | null;
  desa_kelurahan_id?: number | null;
  desa_kelurahan?: string | null;
  alamat_jalan?: string | null;
  dusun?: string | null;
  kode_pos?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  simpeg_unit_kerja_id?: string | null;
  simpeg_unit_kerja_nama?: string | null;
  is_active?: boolean;
}

export interface KecamatanOption {
  id: number;
  kode?: string | null;
  nama: string;
  label: string;
}

export interface DesaKelurahanOption {
  id: number;
  kecamatan_id: number;
  kode?: string | null;
  nama: string;
  label: string;
}
