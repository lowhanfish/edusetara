import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Agama | Admin Dikbud Konawe Selatan",
  description: "Manajemen Agama Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function AgamaPage() {
  return (
    <ContractCrudPage
      title="Agama"
      category="Data Master"
      description="Kelola dan konfigurasi data Agama secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Nama Agama", "type": "text"},
        {"name": "desc", "label": "Deskripsi", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
