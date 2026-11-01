export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: {
    lead: string;
    paragraphs: string[];
    quote?: {
      text: string;
      author: string;
      role: string;
    };
    highlightsTitle?: string;
    highlights?: string[];
  };
  category: "Pendidikan" | "Kebudayaan" | "GTK & Guru" | "Sarana Prasarana" | "Prestasi Siswa";
  date: string;
  publishedAt: string;
  author: string;
  authorRole: string;
  readTime: string;
  image: string;
  imageCaption: string;
  tags: string[];
  featured?: boolean;
}

export interface BackendNewsItem {
  id: string;
  judul?: string;
  title?: string;
  slug?: string;
  kategori?: string;
  author?: string;
  deskripsi?: string;
  isi?: string;
  foto?: string;
  status?: string;
  featured?: boolean | string;
  created_at?: string;
}
