import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Pendidikan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Pendidikan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PendidikanPage() {
  return (
    <ContractCrudPage
      title="Pendidikan"
      category="Data Master"
      description="Kelola dan konfigurasi data Pendidikan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Tingkat Pendidikan", "type": "text"},
        {"name": "desc", "label": "Deskripsi", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
