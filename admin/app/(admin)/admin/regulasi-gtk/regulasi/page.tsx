import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Regulasi",
  description: "Manajemen Regulasi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function RegulasiPage() {
  return (
    <ContractCrudPage
      title="Regulasi"
      category="Regulasi dan Info GTK"
      description="Kelola dan konfigurasi data Regulasi secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "judul", "label": "Nama / Nomor Peraturan Resmi", "type": "text"},
        {"name": "deskripsi", "label": "Konsideran / Tentang Regulasi", "type": "richtext"},
        {"name": "tahun", "label": "Tahun Penetapan", "type": "number"},
        {"name": "file", "label": "Salinan Lembaran Hukum (PDF)", "type": "file", "accept": ".pdf", "placeholder": "Unggah salinan lembaran hukum PDF"},
      ]}
      columns={["judul", "tahun", "deskripsi", "file"]}
    />
  );
}
