import { ContractCrudPage } from "../../_components/contract-crud-page";

export const metadata = {
  title: "Kegiatan Sekolah | Admin Dikbud Konawe Selatan",
  description: "Manajemen Kegiatan Sekolah Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KegiatanSekolahPage() {
  return (
    <ContractCrudPage
      title="Kegiatan Sekolah"
      category="Kegiatan Sekolah"
      description="Kelola dan konfigurasi data Kegiatan Sekolah secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "judul", "label": "Judul Kegiatan", "type": "text"},
        {"name": "deskripsi", "label": "Deskripsi", "type": "textarea"},
        {"name": "tanggal", "label": "Tanggal", "type": "date"},
        {"name": "tahun", "label": "Tahun", "type": "number"},
        {"name": "file", "label": "Berkas Dokumen / Foto", "type": "file", "accept": ".pdf,image/*", "placeholder": "Unggah berkas dokumen atau foto"},
        {"name": "link", "label": "Link YouTube", "type": "text", "placeholder": "https://youtube.com/...", "required": false},
      ]}
      columns={["judul", "tanggal", "tahun", "link"]}
    />
  );
}
