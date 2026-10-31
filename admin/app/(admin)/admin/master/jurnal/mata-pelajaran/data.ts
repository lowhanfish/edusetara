import { MataPelajaranRecord } from "./types";

export const DUMMY_MATA_PELAJARAN: MataPelajaranRecord[] = [
  {
    id: "MP-01",
    kelas_id: "KLS-01",
    title: "1 - Guru Kelas SD",
    desc: "Mata pelajaran pengajaran umum wali kelas untuk tingkat 1 sekolah dasar.",
    uraian: "1 - Guru Kelas SD",
    keterangan: "Mata pelajaran pengajaran umum wali kelas untuk tingkat 1 sekolah dasar.",
    kelas: { id: "KLS-01", title: "Kelas I (Satu)" },
    created_at: "2026-10-31T07:30:00Z",
    created_by: "Administrator",
  },
  {
    id: "MP-02",
    kelas_id: "KLS-01",
    title: "1 - Tematik SD",
    desc: "Pembelajaran tematik terpadu kurikulum dasar untuk siswa tingkat 1 sekolah dasar.",
    uraian: "1 - Tematik SD",
    keterangan: "Pembelajaran tematik terpadu kurikulum dasar untuk siswa tingkat 1 sekolah dasar.",
    kelas: { id: "KLS-01", title: "Kelas I (Satu)" },
    created_at: "2026-10-31T07:30:00Z",
    created_by: "Administrator",
  },
  {
    id: "MP-03",
    kelas_id: "KLS-07",
    title: "7 - Matematika SMP",
    desc: "Mata pelajaran penalaran logika dan numerasi umum untuk tingkatan kelas 7.",
    uraian: "7 - Matematika SMP",
    keterangan: "Mata pelajaran penalaran logika dan numerasi umum untuk tingkatan kelas 7.",
    kelas: { id: "KLS-07", title: "Kelas VII (Tujuh)" },
    created_at: "2026-10-31T07:30:00Z",
    created_by: "Administrator",
  },
];
