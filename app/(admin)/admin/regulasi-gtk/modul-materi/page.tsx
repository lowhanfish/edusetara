import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Modul dan Materi Pelatihan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Modul dan Materi Pelatihan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function ModulDanMateriPelatihanPage() {
  return (
    <ContractCrudPage
      title="Modul dan Materi Pelatihan"
      category="Regulasi dan Info GTK"
      description="Kelola dan konfigurasi data Modul dan Materi Pelatihan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "judul", "label": "Judul Modul / Materi", "type": "text"},
        {"name": "deskripsi", "label": "Ringkasan Silabus / Kompetensi", "type": "textarea"},
        {"name": "file", "label": "Lampiran Dokumen / Handout (PDF)", "type": "text", "placeholder": "modul.pdf"},
      ]}
      columns={["judul", "deskripsi", "file"]}
    />
  );
}
