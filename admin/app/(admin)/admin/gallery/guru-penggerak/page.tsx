import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Gallery Program Guru Penggerak",
  description: "Manajemen Gallery Program Guru Penggerak Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GalleryProgramGuruPenggerakPage() {
  return (
    <ContractCrudPage
      title="Gallery Program Guru Penggerak"
      category="Gallery"
      description="Kelola dan konfigurasi data Gallery Program Guru Penggerak secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "judul", "label": "Nama Kegiatan / Aksi (Guru Penggerak)", "type": "text"},
        {"name": "tujuan", "label": "Tujuan Pelaksanaan Kegiatan", "type": "textarea"},
        {"name": "proses", "label": "Tahapan / Proses Kegiatan", "type": "textarea"},
        {"name": "hasil", "label": "Capaian / Output Positif", "type": "textarea"},
        {"name": "link", "label": "Link YouTube (Opsional)", "type": "text", "placeholder": "https://youtube.com/watch?v=...", "required": false},
        {"name": "file", "label": "Foto Dokumentasi Kegiatan", "type": "file", "accept": "image/*", "placeholder": "Unggah foto dokumentasi kegiatan"},
      ]}
      columns={["judul", "tujuan", "hasil", "link"]}
    />
  );
}
