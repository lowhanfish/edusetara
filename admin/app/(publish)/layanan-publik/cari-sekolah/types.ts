export interface PublicSchool {
  id: string;
  name: string;
  npsn: string;
  level: "PAUD" | "TK" | "SD" | "SMP" | "SATAP" | "PKBM" | string;
  status: "NEGERI" | "SWASTA" | string;
  district: string;
  address?: string;
  principal?: string;
  accreditation?: string;
  studentsCount?: number;
  teachersCount?: number;
}
