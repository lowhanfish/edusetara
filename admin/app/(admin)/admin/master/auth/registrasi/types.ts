export type AsnRecord = {
  id: string;
  nip?: string | null;
  nama_lengkap: string;
  email?: string | null;
  satuan_pendidikan?: string | null;
  jabatan?: string | null;
  group_id?: string | null;
  group_title?: string | null;
  group_level?: number | null;
  created_at: string;
};

export type ResponseInterface = AsnRecord;

export type ResponseListInterface = {
  success: boolean;
  statusCode: number;
  message: string;
  total: number;
  data: AsnRecord[];
};
