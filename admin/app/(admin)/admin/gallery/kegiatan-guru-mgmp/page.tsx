import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Gallery Kegiatan Guru MGMP | Admin Dikbud Konawe Selatan",
  description: "Manajemen Gallery Kegiatan Guru MGMP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GalleryKegiatanGuruMGMPPage() {
  return (
    <ContractCrudPage
      title="Gallery Kegiatan Guru MGMP"
      category="Gallery"
      description="Kelola dan konfigurasi data Gallery Kegiatan Guru MGMP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "judul", "label": "Nama Kegiatan / Aksi (Guru MGMP)", "type": "text"},
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
