import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Video Testimoni | Admin Dikbud Konawe Selatan",
  description: "Manajemen Video Testimoni Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function VideoTestimoniPage() {
  return (
    <ContractCrudPage
      title="Video Testimoni"
      category="Gallery"
      description="Kelola dan konfigurasi data Video Testimoni secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "judul", "label": "Judul / Narasi Video Testimoni", "type": "text"},
        {"name": "file", "label": "Berkas Video (MP4 / WebM)", "type": "text", "placeholder": "nama file video .mp4 / url"},
      ]}
      columns={["judul", "file"]}
    />
  );
}
