export interface ProfileSection {
  id: string;
  judul: string;
  konten: string;
  kategori?: string;
  file?: string;
  urutan?: number;
}

export interface ContactMessagePayload {
  nama: string;
  email?: string;
  telepon?: string;
  subjek: string;
  pesan: string;
}
