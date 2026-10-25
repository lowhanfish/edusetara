import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Pekerjaan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Pekerjaan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PekerjaanPage() {
  return (
    <ContractCrudPage
      title="Pekerjaan"
      category="Data Master"
      description="Kelola dan konfigurasi data Pekerjaan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Klasifikasi Pekerjaan", "type": "text"},
        {"name": "desc", "label": "Deskripsi", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
