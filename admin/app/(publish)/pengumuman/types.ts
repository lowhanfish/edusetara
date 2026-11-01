export interface AnnouncementItem {
  id: string;
  number: string;
  day: string;
  month: string;
  year: string;
  category: "Akademik & ANBK" | "Kepegawaian / PPPK" | "Pendataan & Dapodik" | "Kebudayaan & Event";
  title: string;
  summary: string;
  attachmentName: string;
  attachmentSize: string;
  important?: boolean;
  tone: "sapphire" | "emerald" | "amber" | "ruby" | "purple";
  targetAudience: string;
  deadline: string;
  signatory: string;
  keyPoints: string[];
}

export interface BackendAnnouncementItem {
  id: string;
  judul?: string;
  isi?: string;
  slug?: string;
  file?: string;
  tanggal?: string;
  status?: string;
  created_at?: string;
}
