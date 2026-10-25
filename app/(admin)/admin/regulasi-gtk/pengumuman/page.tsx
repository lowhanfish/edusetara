import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Pengumuman GTK | Admin Dikbud Konawe Selatan",
  description: "Manajemen Pengumuman GTK Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PengumumanGTKPage() {
  return (
    <ContractCrudPage
      title="Pengumuman GTK"
      category="Regulasi dan Info GTK"
      description="Kelola dan konfigurasi data Pengumuman GTK secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "judul", "label": "Judul Pengumuman GTK", "type": "text"},
        {"name": "deskripsi", "label": "Uraian Lengkap Surat Edaran", "type": "textarea"},
        {"name": "file", "label": "Lampiran Surat Edaran (PDF)", "type": "file", "accept": ".pdf", "placeholder": "Unggah surat edaran PDF"},
      ]}
      columns={["judul", "deskripsi", "file"]}
    />
  );
}
