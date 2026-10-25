import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Gallery Kegiatan Kepala Sekolah | Admin Dikbud Konawe Selatan",
  description: "Manajemen Gallery Kegiatan Kepala Sekolah Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GalleryKegiatanKepalaSekolahPage() {
  return (
    <ContractCrudPage
      title="Gallery Kegiatan Kepala Sekolah"
      category="Gallery"
      description="Kelola dan konfigurasi data Gallery Kegiatan Kepala Sekolah secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "judul", "label": "Nama Kegiatan / Aksi (Kepala Sekolah)", "type": "text"},
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
