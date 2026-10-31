export interface SekolahRecord {
  id: string;
  unit_kerja_id: string;
  nama_sekolah: string;
  name: string;
  alamat?: string | null;
  address?: string | null;
  jenjang: "SD" | "SMP" | "TK" | "PAUD" | "SATAP" | "PKBM" | string;
  level: string;
  status_sekolah: "NEGERI" | "SWASTA" | string;
  status: string;
  npsn?: string | null;
  akreditasi?: string | null;
  kecamatan?: string | null;
  district?: string | null;
  desa_kelurahan?: string | null;
  village?: string | null;
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
  jenjang?: string;
  status_sekolah?: string;
  npsn?: string | null;
  akreditasi?: string | null;
  kecamatan?: string | null;
  desa_kelurahan?: string | null;
  is_active?: boolean;
}
