import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Sekolah Penggerak | Admin Dikbud Konawe Selatan",
  description: "Manajemen Sekolah Penggerak Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function SekolahPenggerakPage() {
  return (
    <ContractCrudPage
      title="Sekolah Penggerak"
      category="Gallery"
      description="Kelola dan konfigurasi data Sekolah Penggerak secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "judul", "label": "Nama Kegiatan / Aksi (Sekolah Penggerak)", "type": "text"},
        {"name": "tujuan", "label": "Tujuan Pelaksanaan Kegiatan", "type": "textarea"},
        {"name": "proses", "label": "Tahapan / Proses Kegiatan", "type": "textarea"},
        {"name": "hasil", "label": "Capaian / Output Positif", "type": "textarea"},
        {"name": "link", "label": "Link YouTube (Opsional)", "type": "text", "placeholder": "https://youtube.com/watch?v=...", "required": false},
        {"name": "file", "label": "Foto Dokumentasi Kegiatan", "type": "text", "placeholder": "nama file foto .jpg/.png"},
      ]}
      columns={["judul", "tujuan", "hasil", "link"]}
    />
  );
}
